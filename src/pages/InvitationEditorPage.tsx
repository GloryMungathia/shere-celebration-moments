import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import InvitationPreview from '@/components/InvitationPreview';
import PhotoUploader from '@/components/PhotoUploader';
import Button from '@/components/ui/Button';
import FormField, { Input, TextArea, Select } from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import SharePanel from '@/components/SharePanel';
import Spinner from '@/components/ui/Spinner';
import { fetchInvitationById, createInvitation, updateInvitation, publishInvitation } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import {
  colorPresets,
  backgroundColorPresets,
  textColorPresets,
  getInvitationTemplate,
  getInvitationTemplates,
} from '@/data/templates';
import { getFontGroups, fontName } from '@/data/fonts';
import type { FontGroupOptions } from '@/data/fonts';
import { sortedPatterns } from '@/data/patterns';
import { occasionNameField, occasionTitleField, occasionLabels } from '@/data/occasions';
import type { InvitationTemplate, TemplateConfig, Occasion, Invitation, ItemStatus, InvitationExtras } from '@/types';

const EMPTY_FORM = {
  title: '',
  name: '',
  event_date: '',
  event_time: '',
  venue: '',
  address: '',
  message: '',
  photo_url: null as string | null,
};

type FormData = typeof EMPTY_FORM;

const EMPTY_EXTRAS = {
  intro: '',
  event_label: '',
  closing: '',
  signature: '',
  second_on: false,
  second_label: '',
  second_date: '',
  second_time: '',
  second_venue: '',
  second_address: '',
};

type ExtrasForm = typeof EMPTY_EXTRAS;

function extrasToForm(extras: InvitationExtras | null | undefined): ExtrasForm {
  const second = extras?.second_event;
  return {
    intro: extras?.intro ?? '',
    event_label: extras?.event_label ?? '',
    closing: extras?.closing ?? '',
    signature: extras?.signature ?? '',
    second_on: !!second,
    second_label: second?.label ?? '',
    second_date: second?.date ?? '',
    second_time: second?.time ?? '',
    second_venue: second?.venue ?? '',
    second_address: second?.address ?? '',
  };
}

function formToExtras(form: ExtrasForm): InvitationExtras {
  return {
    intro: form.intro,
    event_label: form.event_label,
    closing: form.closing,
    signature: form.signature,
    second_event: form.second_on
      ? {
          label: form.second_label,
          date: form.second_date || null,
          time: form.second_time,
          venue: form.second_venue,
          address: form.second_address,
        }
      : null,
  };
}

function FontSelect({ id, label, value, groups, onChange }: { id: string; label: string; value: string; groups: FontGroupOptions[]; onChange: (v: string) => void }) {
  const known = groups.some((g) => g.options.some((o) => o.value === value));
  const shown = value && !known ? [{ label: 'Current', options: [{ label: fontName(value), value }] }, ...groups] : groups;
  return (
    <FormField label={label} htmlFor={id}>
      <Select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: value }}>
        {shown.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                {f.label}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    </FormField>
  );
}

function ColorRow({ label, presets, value, onChange }: { label: string; presets: string[]; value: string | undefined; onChange: (v: string) => void }) {
  return (
    <FormField label={label}>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`${label} ${color}`}
            aria-pressed={value === color}
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${value === color ? 'border-stone-800 scale-110' : 'border-stone-200'}`}
            style={{ backgroundColor: color }}
          />
        ))}
        <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-stone-300 overflow-hidden cursor-pointer" title="Pick any color">
          <span className="sr-only">{`${label} custom`}</span>
          <input
            type="color"
            value={value && /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="absolute inset-1 rounded-full" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }} />
        </label>
      </div>
    </FormField>
  );
}

const draftKey = (templateId: string) => `shere_invitation_draft_${templateId}`;

function readDraft(templateId: string): { form: FormData; customization: Partial<TemplateConfig>; extras?: ExtrasForm } | null {
  try {
    const raw = sessionStorage.getItem(draftKey(templateId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(templateId: string, form: FormData, customization: Partial<TemplateConfig>, extras: ExtrasForm) {
  try {
    sessionStorage.setItem(draftKey(templateId), JSON.stringify({ form, customization, extras }));
  } catch {
    try {
      sessionStorage.setItem(draftKey(templateId), JSON.stringify({ form: { ...form, photo_url: null }, customization, extras }));
    } catch {
      return;
    }
  }
}

function clearDraft(templateId: string) {
  try {
    sessionStorage.removeItem(draftKey(templateId));
  } catch {
    return;
  }
}

export default function InvitationEditorPage() {
  const { templateId = '' } = useParams<{ templateId: string }>();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [template, setTemplate] = useState<InvitationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [invitationId, setInvitationId] = useState<string | null>(editId);
  const [status, setStatus] = useState<ItemStatus>('draft');
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [customization, setCustomization] = useState<Partial<TemplateConfig>>({});
  const [extras, setExtras] = useState<ExtrasForm>(EMPTY_EXTRAS);

  useEffect(() => {
    if (authLoading) return;
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      if (editId) {
        if (!user) {
          navigate('/login', { replace: true, state: { from: location.pathname + location.search } });
          return;
        }
        try {
          const inv = await fetchInvitationById(editId);
          if (!active) return;
          const tpl = getInvitationTemplate(inv.template_id) ?? getInvitationTemplates(inv.occasion)[0] ?? null;
          setTemplate(tpl);
          setInvitationId(inv.id);
          setStatus(inv.status);
          setFormData({
            title: inv.title ?? '',
            name: inv.name ?? '',
            event_date: inv.event_date ?? '',
            event_time: inv.event_time ?? '',
            venue: inv.venue ?? '',
            address: inv.address ?? '',
            message: inv.message ?? '',
            photo_url: inv.photo_url,
          });
          setCustomization({ ...(tpl?.config ?? {}), ...inv.customization });
          setExtras(extrasToForm(inv.extras));
        } catch (err) {
          if (active) setError(err instanceof Error ? err.message : 'Failed to load this invitation.');
        } finally {
          if (active) setLoading(false);
        }
        return;
      }

      const tpl = getInvitationTemplate(templateId);
      if (!tpl) {
        setError('Template not found.');
        setLoading(false);
        return;
      }
      setTemplate(tpl);
      const draft = readDraft(templateId);
      setFormData(draft?.form ?? EMPTY_FORM);
      setCustomization(draft?.customization ?? tpl.config);
      setExtras(draft?.extras ?? extrasToForm(tpl.starter));
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [templateId, editId, user, authLoading, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (!editId && template && !invitationId) writeDraft(templateId, formData, customization, extras);
  }, [editId, template, invitationId, templateId, formData, customization, extras]);

  const occasion = (template?.occasion ?? 'other') as Occasion;
  const occasionLabel = occasionLabels[occasion];
  const headingGroups = getFontGroups(occasion, 'heading');
  const accentGroups = getFontGroups(occasion, 'accent');
  const bodyGroups = getFontGroups(occasion, 'body');
  const patternChoices = sortedPatterns(occasion);
  const isCard = customization.layout === 'card';
  const isPublished = status === 'published';

  const handleFieldChange = (field: keyof FormData, value: string | null) => {
    setSavedNote(false);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExtraChange = (field: keyof ExtrasForm, value: string | boolean) => {
    setSavedNote(false);
    setExtras((prev) => ({ ...prev, [field]: value }));
  };

  const changeDesign = (changes: Partial<TemplateConfig>) => {
    setSavedNote(false);
    setCustomization((prev) => ({ ...prev, ...changes }));
  };

  const buildInput = () => ({
    occasion,
    template_id: template?.id ?? templateId,
    title: formData.title,
    name: formData.name,
    event_date: formData.event_date || null,
    event_time: formData.event_time,
    venue: formData.venue,
    address: formData.address,
    message: formData.message,
    photo_url: formData.photo_url,
    customization,
    extras: formToExtras(extras),
  });

  const save = async (): Promise<Invitation> => {
    const input = buildInput();
    if (invitationId) return updateInvitation(invitationId, input);
    const created = await createInvitation(input);
    setInvitationId(created.id);
    clearDraft(templateId);
    window.history.replaceState(window.history.state, '', `/editor/${template?.id ?? templateId}?id=${created.id}`);
    return created;
  };

  const needLogin = () => {
    if (user) return false;
    writeDraft(templateId, formData, customization, extras);
    navigate('/login', { state: { from: location.pathname + location.search } });
    return true;
  };

  const handleSaveDraft = async () => {
    if (needLogin()) return;
    setSaving('draft');
    setError(null);
    try {
      const saved = await save();
      setStatus(saved.status);
      setSavedNote(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  const handlePublish = async () => {
    if (needLogin()) return;
    setSaving('publish');
    setError(null);
    try {
      const saved = await save();
      const published = await publishInvitation(saved.id);
      setStatus(published.status);
      setPublishedUrl(`${window.location.origin}/invite/${published.slug}`);
      setShowShare(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish. Please try again.');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error && !template) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => navigate('/occasions')}>
            Browse Occasions
          </Button>
        </div>
      </Layout>
    );
  }

  const previewInvitation: Partial<Invitation> = {
    occasion,
    title: formData.title,
    name: formData.name,
    event_date: formData.event_date || null,
    event_time: formData.event_time,
    venue: formData.venue,
    address: formData.address,
    message: formData.message,
    photo_url: formData.photo_url,
    extras: formToExtras(extras),
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
            {occasionLabel} Invitation Editor
          </h1>
          <p className="text-stone-500 mt-1">
            Template: {template?.name} · {template?.style}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Editor (left) */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Event Information</h2>

              {isCard && (
                <FormField label="Opening line" htmlFor="inv-intro" hint="Small words above the title, like You're invited to">
                  <Input id="inv-intro" maxLength={120} value={extras.intro} onChange={(e) => handleExtraChange('intro', e.target.value)} placeholder="e.g. You're invited to" />
                </FormField>
              )}

              <FormField label={occasionTitleField[occasion]} htmlFor="inv-title">
                <Input
                  id="inv-title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. John's Graduation Celebration"
                />
              </FormField>

              <FormField label={occasionNameField[occasion]} htmlFor="inv-name">
                <Input
                  id="inv-name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g. John Smith"
                />
              </FormField>

              {isCard && (
                <FormField label="Event heading" htmlFor="inv-event_label" hint="Shown on a ribbon above the event details">
                  <Input id="inv-event_label" maxLength={60} value={extras.event_label} onChange={(e) => handleExtraChange('event_label', e.target.value)} placeholder="e.g. Graduation Ceremony" />
                </FormField>
              )}

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Date" htmlFor="inv-event_date">
                  <Input
                    type="date"
                    id="inv-event_date"
                  value={formData.event_date}
                    onChange={(e) => handleFieldChange('event_date', e.target.value)}
                  />
                </FormField>
                <FormField label="Time" htmlFor="inv-event_time">
                  <Input
                    type="time"
                    id="inv-event_time"
                  value={formData.event_time}
                    onChange={(e) => handleFieldChange('event_time', e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Venue" htmlFor="inv-venue">
                <Input
                  id="inv-venue"
                  value={formData.venue}
                  onChange={(e) => handleFieldChange('venue', e.target.value)}
                  placeholder="e.g. University Hall"
                />
              </FormField>

              <FormField label="Address" htmlFor="inv-address">
                <Input
                  id="inv-address"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="e.g. 123 Main St, City"
                />
              </FormField>

              <FormField label="Invitation Message" htmlFor="inv-message">
                <TextArea
                  rows={3}
                  id="inv-message"
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Write a personal message for your guests..."
                />
              </FormField>

              {isCard && (
                <>
                  <FormField label="Closing line" htmlFor="inv-closing">
                    <TextArea id="inv-closing" rows={2} maxLength={300} value={extras.closing} onChange={(e) => handleExtraChange('closing', e.target.value)} placeholder="e.g. Thank you for being part of my story." />
                  </FormField>
                  <FormField label="Signed by" htmlFor="inv-signature" hint="Shown after Kind regards. Leave empty to hide it.">
                    <Input id="inv-signature" maxLength={120} value={extras.signature} onChange={(e) => handleExtraChange('signature', e.target.value)} placeholder="e.g. Dorcas Muturia" />
                  </FormField>
                </>
              )}
            </div>

            {isCard && (
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
                <label className="flex items-center gap-2 text-lg font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={extras.second_on}
                    onChange={(e) => handleExtraChange('second_on', e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-rose-600"
                  />
                  Add a second event
                </label>
                <p className="text-sm text-stone-500 -mt-2">For example a thanksgiving party after the ceremony.</p>
                {extras.second_on && (
                  <>
                    <FormField label="Second event heading" htmlFor="inv-second_label">
                      <Input id="inv-second_label" maxLength={60} value={extras.second_label} onChange={(e) => handleExtraChange('second_label', e.target.value)} placeholder="e.g. Celebration Party" />
                    </FormField>
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Second event date" htmlFor="inv-second_date">
                        <Input id="inv-second_date" type="date" value={extras.second_date} onChange={(e) => handleExtraChange('second_date', e.target.value)} />
                      </FormField>
                      <FormField label="Second event time" htmlFor="inv-second_time">
                        <Input id="inv-second_time" type="time" value={extras.second_time} onChange={(e) => handleExtraChange('second_time', e.target.value)} />
                      </FormField>
                    </div>
                    <FormField label="Second event venue" htmlFor="inv-second_venue">
                      <Input id="inv-second_venue" maxLength={160} value={extras.second_venue} onChange={(e) => handleExtraChange('second_venue', e.target.value)} placeholder="e.g. AIC Milimani Nakuru" />
                    </FormField>
                    <FormField label="Second event address" htmlFor="inv-second_address">
                      <Input id="inv-second_address" maxLength={240} value={extras.second_address} onChange={(e) => handleExtraChange('second_address', e.target.value)} placeholder="e.g. Nakuru town" />
                    </FormField>
                  </>
                )}
              </div>
            )}

            {/* Customization */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Customization</h2>

              <FormField label="Pattern">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {patternChoices.map((p) => {
                    const active = (customization.pattern ?? 'none') === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => changeDesign({ pattern: p.id })}
                        className={`rounded-xl border-2 px-3 py-2 text-left transition-colors ${active ? 'border-rose-500 bg-rose-50' : 'border-stone-200 hover:border-stone-300'}`}
                      >
                        <span className="block text-sm font-medium text-stone-800">{p.label}</span>
                        <span className="block text-xs text-stone-500">{p.description}</span>
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {isCard && (
                <label className="flex items-center gap-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={customization.emblem !== 'none'}
                    onChange={(e) => changeDesign({ emblem: e.target.checked ? 'show' : 'none' })}
                    className="w-4 h-4 rounded border-stone-300 text-rose-600"
                  />
                  Show the {occasionLabel.toLowerCase()} symbol at the top
                </label>
              )}

              <ColorRow label="Background color" presets={backgroundColorPresets} value={customization.backgroundColor} onChange={(c) => changeDesign({ backgroundColor: c })} />
              <ColorRow label="Primary color" presets={colorPresets} value={customization.primaryColor} onChange={(c) => changeDesign({ primaryColor: c })} />
              <ColorRow label="Accent color" presets={colorPresets} value={customization.accentColor} onChange={(c) => changeDesign({ accentColor: c })} />
              <ColorRow label="Text color" presets={textColorPresets} value={customization.textColor} onChange={(c) => changeDesign({ textColor: c })} />

              <div className="grid sm:grid-cols-3 gap-3">
                <FontSelect
                  id="design-heading-font"
                  label="Title font"
                  value={customization.headingFont || customization.font || ''}
                  groups={headingGroups}
                  onChange={(v) => changeDesign({ headingFont: v })}
                />
                <FontSelect
                  id="design-accent-font"
                  label="Name font"
                  value={customization.accentFont || customization.headingFont || customization.font || ''}
                  groups={accentGroups}
                  onChange={(v) => changeDesign({ accentFont: v })}
                />
                <FontSelect
                  id="design-font"
                  label="Body text font"
                  value={customization.font || ''}
                  groups={bodyGroups}
                  onChange={(v) => changeDesign({ font: v })}
                />
              </div>
            </div>

            {/* Photo Upload */}
            {(template?.config.supportsPhoto || isCard) && (
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-stone-400" />
                  <h2 className="text-lg font-semibold text-stone-800">Photo</h2>
                </div>
                <PhotoUploader
                  photoUrl={formData.photo_url}
                  onPhotoChange={(url) => {
                    handleFieldChange('photo_url', url);
                    if (isCard) changeDesign({ supportsPhoto: !!url });
                  }}
                />
              </div>
            )}


            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleSaveDraft} disabled={!!saving}>
                <Save className="w-4 h-4" />
                {saving === 'draft' ? 'Saving...' : isPublished ? 'Save changes' : 'Save Draft'}
              </Button>
              <Button className="flex-1" onClick={handlePublish} disabled={!!saving}>
                <Eye className="w-4 h-4" />
                {saving === 'publish' ? 'Publishing...' : isPublished ? 'Update & Share' : 'Publish & Share'}
              </Button>
            </div>
            {savedNote && (
              <p role="status" className="flex items-center gap-1.5 text-sm text-green-700">
                <Check className="w-4 h-4" />
                {isPublished ? 'Changes saved. Your link shows the new version.' : 'Draft saved. Find it in your dashboard.'}
              </p>
            )}
            {!user && (
              <p className="text-sm text-stone-500">You will be asked to log in or sign up when you save. Your changes will be kept.</p>
            )}
          </div>

          {/* Preview (right) */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-2xl bg-stone-100 border border-stone-100 p-4 md:p-6">
              <p className="text-sm font-medium text-stone-500 mb-3 text-center">
                Live Preview
              </p>
              <InvitationPreview
                invitation={previewInvitation}
                template={template}
                customization={customization}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal open={showShare} onClose={() => setShowShare(false)} title="Your invitation is ready!" maxWidth="max-w-lg">
        <div className="space-y-4">
          <p className="text-stone-600">
            Your invitation has been published. Share the link below with your guests.
          </p>
          <SharePanel url={publishedUrl} title={formData.title || 'Your Invitation'} />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowShare(false)}>
              Keep Editing
            </Button>
            <Button className="flex-1" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
