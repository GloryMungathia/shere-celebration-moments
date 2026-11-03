import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Check } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import FormField, { Input, TextArea, Select } from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import SharePanel from '@/components/SharePanel';
import Spinner from '@/components/ui/Spinner';
import { fetchMessageById, createMessage, updateMessage, publishMessage } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { messageCategoryLabels, messageCategoryIcons, getMessageTemplate } from '@/data/messageTemplates';
import { getMessageFontGroups } from '@/data/fonts';
import type { CelebrationMessage, ItemStatus, MessageCategory } from '@/types';

const EMPTY_FORM = { recipient_name: '', title: '', message: '', sender_name: '', font: '' };
type FormData = typeof EMPTY_FORM;

const draftKey = (key: string) => `shere_message_draft_${key}`;

function readDraft(key: string): FormData | null {
  try {
    const raw = sessionStorage.getItem(draftKey(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeDraft(key: string, form: FormData) {
  try {
    sessionStorage.setItem(draftKey(key), JSON.stringify(form));
  } catch {
    return;
  }
}

function clearDraft(key: string) {
  try {
    sessionStorage.removeItem(draftKey(key));
  } catch {
    return;
  }
}

export default function MessageEditorPage() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const editId = searchParams.get('id');
  const draftId = templateId ?? 'blank';
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [category, setCategory] = useState<MessageCategory>('other');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedNote, setSavedNote] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [messageId, setMessageId] = useState<string | null>(editId);
  const [status, setStatus] = useState<ItemStatus>('draft');
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

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
          const msg = await fetchMessageById(editId);
          if (!active) return;
          setCategory(msg.category);
          setMessageId(msg.id);
          setStatus(msg.status);
          setFormData({
            recipient_name: msg.recipient_name ?? '',
            title: msg.title ?? '',
            message: msg.message ?? '',
            sender_name: msg.sender_name ?? '',
            font: msg.font ?? '',
          });
        } catch (err) {
          if (active) setError(err instanceof Error ? err.message : 'Failed to load this message.');
        } finally {
          if (active) setLoading(false);
        }
        return;
      }

      const tpl = templateId ? getMessageTemplate(templateId) : null;
      if (templateId && !tpl) setError('Message template not found.');
      setCategory(tpl?.category ?? 'other');
      const draft = readDraft(draftId);
      setFormData(draft ?? { ...EMPTY_FORM, title: tpl?.title ?? '', message: tpl?.message ?? '' });
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [templateId, editId, draftId, user, authLoading, navigate, location.pathname, location.search]);

  useEffect(() => {
    if (!editId && !messageId && !loading) writeDraft(draftId, formData);
  }, [editId, messageId, loading, draftId, formData]);

  const fontGroups = getMessageFontGroups(category);
  const selectedFont = formData.font || fontGroups[0]?.options[0]?.value || "'Dancing Script', cursive";
  const isPublished = status === 'published';

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setSavedNote(false);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const save = async (): Promise<CelebrationMessage> => {
    const input = {
      category,
      recipient_name: formData.recipient_name,
      title: formData.title,
      message: formData.message,
      sender_name: formData.sender_name,
      font: selectedFont,
    };
    if (messageId) return updateMessage(messageId, input);
    const created = await createMessage(input);
    setMessageId(created.id);
    clearDraft(draftId);
    window.history.replaceState(window.history.state, '', `/message-editor?id=${created.id}`);
    return created;
  };

  const needLogin = () => {
    if (user) return false;
    writeDraft(draftId, formData);
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
      const published = await publishMessage(saved.id);
      setStatus(published.status);
      setPublishedUrl(`${window.location.origin}/message/${published.slug}`);
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <button
          onClick={() => navigate('/messages')}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to messages
        </button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
            {messageCategoryIcons[category]} Message Editor
          </h1>
          <p className="text-stone-500 mt-1">
            {messageCategoryLabels[category]} message
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
              <h2 className="text-lg font-semibold text-stone-800">Message Details</h2>

              <FormField label="Recipient Name" htmlFor="msg-recipient_name">
                <Input
                  id="msg-recipient_name"
                  value={formData.recipient_name}
                  onChange={(e) => handleFieldChange('recipient_name', e.target.value)}
                  placeholder="e.g. Sarah"
                />
              </FormField>

              <FormField label="Message Title" htmlFor="msg-title">
                <Input
                  id="msg-title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Congratulations on Your Graduation!"
                />
              </FormField>

              <FormField label="Message Body" htmlFor="msg-message">
                <TextArea
                  rows={6}
                  id="msg-message"
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Write your message here..."
                />
              </FormField>

              <FormField label="From (Sender Name)" htmlFor="msg-sender_name">
                <Input
                  id="msg-sender_name"
                  value={formData.sender_name}
                  onChange={(e) => handleFieldChange('sender_name', e.target.value)}
                  placeholder="e.g. John"
                />
              </FormField>

              <FormField label="Font" htmlFor="msg-font">
                <Select
                  id="msg-font"
                  value={selectedFont}
                  onChange={(e) => handleFieldChange('font', e.target.value)}
                  style={{ fontFamily: selectedFont }}
                >
                  {fontGroups.map((g) => (
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
            </div>

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
              <div
                className="rounded-2xl bg-white p-8 md:p-10 text-center shadow-sm"
                style={{ fontFamily: selectedFont }}
              >
                <div className="text-4xl mb-4">
                  {messageCategoryIcons[category]}
                </div>
                {formData.recipient_name && (
                  <p className="text-sm text-stone-500 mb-2">
                    Dear {formData.recipient_name},
                  </p>
                )}
                <h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-4">
                  {formData.title || 'Your Message Title'}
                </h2>
                <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {formData.message || 'Your message will appear here...'}
                </p>
                {formData.sender_name && (
                  <p className="text-sm text-stone-500 mt-6">
                    With love,
                    <br />
                    <span className="font-medium text-stone-700">
                      {formData.sender_name}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal open={showShare} onClose={() => setShowShare(false)} title="Your message is ready!" maxWidth="max-w-lg">
        <div className="space-y-4">
          <p className="text-stone-600">
            Your celebration message has been published. Share the link below.
          </p>
          <SharePanel url={publishedUrl} title={formData.title || 'Your Message'} />
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
