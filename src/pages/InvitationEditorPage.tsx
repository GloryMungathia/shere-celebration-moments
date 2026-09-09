import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import InvitationPreview from '@/components/InvitationPreview';
import PhotoUploader from '@/components/PhotoUploader';
import Button from '@/components/ui/Button';
import FormField, { Input, TextArea, Select } from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import SharePanel from '@/components/SharePanel';
import Spinner from '@/components/ui/Spinner';
import {
  fetchInvitationTemplates,
  fetchInvitationById,
  createInvitation,
  updateInvitation,
  publishInvitation,
} from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { colorPresets, backgroundColorPresets, textColorPresets } from '@/data/templates';
import { getFontOptions } from '@/data/fonts';
import { occasionNameField, occasionTitleField, occasionLabels } from '@/data/occasions';
import type { InvitationTemplate, TemplateConfig, Occasion, Invitation } from '@/types';

export default function InvitationEditorPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [template, setTemplate] = useState<InvitationTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [invitationId, setInvitationId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    name: '',
    event_date: '',
    event_time: '',
    venue: '',
    address: '',
    message: '',
    photo_url: null as string | null,
  });

  const [customization, setCustomization] = useState<Partial<TemplateConfig>>({});

  const loadTemplate = useCallback(async () => {
    if (!templateId) return;
    try {
      const templates = await fetchInvitationTemplates();
      const tpl = templates.find((t) => t.id === templateId);
      if (!tpl) {
        setError('Template not found.');
        return;
      }
      setTemplate(tpl);
      setCustomization(tpl.config);
    } catch {
      setError('Failed to load template.');
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const occasion = (template?.occasion ?? 'other') as Occasion;
  const occasionLabel = occasionLabels[occasion];
  const fontOptions = getFontOptions(occasion);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const input = {
        occasion,
        template_id: templateId,
        title: formData.title,
        name: formData.name,
        event_date: formData.event_date || null,
        event_time: formData.event_time,
        venue: formData.venue,
        address: formData.address,
        message: formData.message,
        photo_url: formData.photo_url,
        customization,
        status: 'draft' as const,
      };
      if (invitationId) {
        await updateInvitation(invitationId, input);
      } else {
        const created = await createInvitation(input);
        setInvitationId(created.id);
      }
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const input = {
        occasion,
        template_id: templateId,
        title: formData.title,
        name: formData.name,
        event_date: formData.event_date || null,
        event_time: formData.event_time,
        venue: formData.venue,
        address: formData.address,
        message: formData.message,
        photo_url: formData.photo_url,
        customization,
        status: 'draft' as const,
      };

      let id = invitationId;
      if (!id) {
        const created = await createInvitation(input);
        id = created.id;
        setInvitationId(id);
      } else {
        await updateInvitation(id, input);
      }

      const published = await publishInvitation(id);
      const url = `${window.location.origin}/invite/${published.slug}`;
      setPublishedUrl(url);
      setShowShare(true);
    } catch (err) {
      setError('Failed to publish. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
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

              <FormField label={occasionTitleField[occasion]}>
                <Input
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. John's Graduation Celebration"
                />
              </FormField>

              <FormField label={occasionNameField[occasion]}>
                <Input
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  placeholder="e.g. John Smith"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Date">
                  <Input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => handleFieldChange('event_date', e.target.value)}
                  />
                </FormField>
                <FormField label="Time">
                  <Input
                    type="time"
                    value={formData.event_time}
                    onChange={(e) => handleFieldChange('event_time', e.target.value)}
                  />
                </FormField>
              </div>

              <FormField label="Venue">
                <Input
                  value={formData.venue}
                  onChange={(e) => handleFieldChange('venue', e.target.value)}
                  placeholder="e.g. University Hall"
                />
              </FormField>

              <FormField label="Address">
                <Input
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="e.g. 123 Main St, City"
                />
              </FormField>

              <FormField label="Invitation Message">
                <TextArea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Write a personal message for your guests..."
                />
              </FormField>
            </div>

            {/* Customization */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-stone-800">Customization</h2>

              <FormField label="Background Color">
                <div className="flex flex-wrap gap-2">
                  {backgroundColorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization((p) => ({ ...p, backgroundColor: color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (customization.backgroundColor ?? template?.config.backgroundColor) === color
                          ? 'border-stone-800 scale-110'
                          : 'border-stone-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormField>

              <FormField label="Primary Color">
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization((p) => ({ ...p, primaryColor: color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (customization.primaryColor ?? template?.config.primaryColor) === color
                          ? 'border-stone-800 scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormField>

              <FormField label="Accent Color">
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization((p) => ({ ...p, accentColor: color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (customization.accentColor ?? template?.config.accentColor) === color
                          ? 'border-stone-800 scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormField>

              <FormField label="Text Color">
                <div className="flex flex-wrap gap-2">
                  {textColorPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setCustomization((p) => ({ ...p, textColor: color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        (customization.textColor ?? template?.config.textColor) === color
                          ? 'border-stone-800 scale-110'
                          : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </FormField>

              <FormField label="Font">
                <Select
                  value={customization.font ?? template?.config.font}
                  onChange={(e) => setCustomization((p) => ({ ...p, font: e.target.value }))}
                >
                  {fontOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

            {/* Photo Upload */}
            {template?.config.supportsPhoto && user && (
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-stone-400" />
                  <h2 className="text-lg font-semibold text-stone-800">Photo</h2>
                </div>
                <PhotoUploader
                  photoUrl={formData.photo_url}
                  userId={user.id}
                  onPhotoChange={(url) => handleFieldChange('photo_url', url ?? '')}
                />
              </div>
            )}

            {!user && template?.config.supportsPhoto && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
                Sign in to upload a photo for your invitation.
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleSaveDraft} disabled={saving}>
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button className="flex-1" onClick={handlePublish} disabled={saving}>
                <Eye className="w-4 h-4" />
                {saving ? 'Publishing...' : 'Publish & Share'}
              </Button>
            </div>
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
