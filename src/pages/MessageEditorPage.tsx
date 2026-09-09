import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import FormField, { Input, TextArea, Select } from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import SharePanel from '@/components/SharePanel';
import Spinner from '@/components/ui/Spinner';
import {
  fetchMessageTemplates,
  createMessage,
  updateMessage,
  publishMessage,
} from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { messageCategoryLabels, messageCategoryIcons } from '@/data/messageTemplates';
import { getMessageFontOptions } from '@/data/fonts';
import type { MessageCategory, MessageTemplate } from '@/types';

export default function MessageEditorPage() {
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [template, setTemplate] = useState<MessageTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [messageId, setMessageId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    recipient_name: '',
    title: '',
    message: '',
    sender_name: '',
    font: '',
  });

  const loadTemplate = useCallback(async () => {
    if (!templateId) {
      setLoading(false);
      return;
    }
    try {
      const templates = await fetchMessageTemplates();
      const tpl = templates.find((t) => t.id === templateId);
      if (!tpl) {
        setError('Message template not found.');
        return;
      }
      setTemplate(tpl);
      setFormData((prev) => ({
        ...prev,
        title: tpl.title,
        message: tpl.message,
      }));
    } catch {
      setError('Failed to load message template.');
    } finally {
      setLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const category = (template?.category ?? 'other') as MessageCategory;
  const fontOptions = getMessageFontOptions(category);
  const selectedFont = formData.font || fontOptions[0]?.value || "'Dancing Script', cursive";

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
        category,
        recipient_name: formData.recipient_name,
        title: formData.title,
        message: formData.message,
        sender_name: formData.sender_name,
        font: selectedFont,
        status: 'draft' as const,
      };
      if (messageId) {
        await updateMessage(messageId, input);
      } else {
        const created = await createMessage(input);
        setMessageId(created.id);
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
        category,
        recipient_name: formData.recipient_name,
        title: formData.title,
        message: formData.message,
        sender_name: formData.sender_name,
        font: selectedFont,
        status: 'draft' as const,
      };

      let id = messageId;
      if (!id) {
        const created = await createMessage(input);
        id = created.id;
        setMessageId(id);
      } else {
        await updateMessage(id, input);
      }

      const published = await publishMessage(id);
      const url = `${window.location.origin}/message/${published.slug}`;
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

              <FormField label="Recipient Name">
                <Input
                  value={formData.recipient_name}
                  onChange={(e) => handleFieldChange('recipient_name', e.target.value)}
                  placeholder="e.g. Sarah"
                />
              </FormField>

              <FormField label="Message Title">
                <Input
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="e.g. Congratulations on Your Graduation!"
                />
              </FormField>

              <FormField label="Message Body">
                <TextArea
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleFieldChange('message', e.target.value)}
                  placeholder="Write your message here..."
                />
              </FormField>

              <FormField label="From (Sender Name)">
                <Input
                  value={formData.sender_name}
                  onChange={(e) => handleFieldChange('sender_name', e.target.value)}
                  placeholder="e.g. John"
                />
              </FormField>

              <FormField label="Font">
                <Select
                  value={selectedFont}
                  onChange={(e) => handleFieldChange('font', e.target.value)}
                >
                  {fontOptions.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>

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
