import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Mail,
  Pencil,
  Eye,
  Share2,
  Trash2,
  FileText,
  Calendar,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import SharePanel from '@/components/SharePanel';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchUserInvitations,
  fetchUserMessages,
  deleteInvitation,
  deleteMessage,
  publishInvitation,
  publishMessage,
} from '@/lib/api';
import { occasionLabels } from '@/data/occasions';
import { messageCategoryLabels } from '@/data/messageTemplates';
import type { Invitation, CelebrationMessage } from '@/types';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [messages, setMessages] = useState<CelebrationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'invitations' | 'messages'>('invitations');
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'invitation' | 'message';
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (!user) return;
    Promise.all([fetchUserInvitations(), fetchUserMessages()])
      .then(([invs, msgs]) => {
        setInvitations(invs);
        setMessages(msgs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, authLoading, navigate]);

  const handleShare = (slug: string, title: string, type: 'invitation' | 'message') => {
    const path = type === 'invitation' ? '/invite' : '/message';
    setShareUrl(`${window.location.origin}${path}/${slug}`);
    setShareTitle(title);
    setShowShare(true);
  };

  const handlePublish = async (type: 'invitation' | 'message', id: string) => {
    try {
      if (type === 'invitation') {
        const pub = await publishInvitation(id);
        setInvitations((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: 'published', slug: pub.slug } : i))
        );
        handleShare(pub.slug!, invitations.find((i) => i.id === id)?.title || 'Invitation', 'invitation');
      } else {
        const pub = await publishMessage(id);
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: 'published', slug: pub.slug } : m))
        );
        handleShare(pub.slug!, messages.find((m) => m.id === id)?.title || 'Message', 'message');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'invitation') {
        await deleteInvitation(deleteTarget.id);
        setInvitations((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      } else {
        await deleteMessage(deleteTarget.id);
        setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  if (authLoading || loading) {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
            Welcome back, {user?.user_metadata?.name || user?.email}
          </h1>
          <p className="text-stone-500 mt-1">Manage your invitations and messages</p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to="/occasions">
            <Button size="sm">
              <Heart className="w-4 h-4" />
              New Invitation
            </Button>
          </Link>
          <Link to="/messages">
            <Button size="sm" variant="outline">
              <Mail className="w-4 h-4" />
              New Message
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-stone-200">
          <button
            onClick={() => setTab('invitations')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'invitations'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            My Invitations ({invitations.length})
          </button>
          <button
            onClick={() => setTab('messages')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === 'messages'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            My Messages ({messages.length})
          </button>
        </div>

        {tab === 'invitations' && (
          <div className="space-y-3">
            {invitations.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">No invitations yet.</p>
                <Link to="/occasions">
                  <Button size="sm">Create your first invitation</Button>
                </Link>
              </div>
            ) : (
              invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl bg-white border border-stone-100 shadow-sm p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-stone-800 truncate">
                        {inv.title || inv.name || 'Untitled'}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          inv.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {inv.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                      <span>{occasionLabels[inv.occasion]}</span>
                      {inv.event_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(inv.event_date).toLocaleDateString()}
                        </span>
                      )}
                      <span>{new Date(inv.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inv.status === 'published' && inv.slug ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShare(inv.slug!, inv.title || 'Invitation', 'invitation')}
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Link to={`/invite/${inv.slug}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handlePublish('invitation', inv.id)}>
                        <Eye className="w-4 h-4" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget({ type: 'invitation', id: inv.id, name: inv.title || inv.name || 'this invitation' })}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'messages' && (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <Mail className="w-12 h-12 text-stone-200 mx-auto mb-4" />
                <p className="text-stone-500 mb-4">No messages yet.</p>
                <Link to="/messages">
                  <Button size="sm">Create your first message</Button>
                </Link>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-2xl bg-white border border-stone-100 shadow-sm p-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-stone-800 truncate">
                        {msg.title || 'Untitled'}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          msg.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {msg.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500">
                      <span>{messageCategoryLabels[msg.category as keyof typeof messageCategoryLabels]}</span>
                      {msg.recipient_name && <span>To: {msg.recipient_name}</span>}
                      <span>{new Date(msg.created_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {msg.status === 'published' && msg.slug ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShare(msg.slug!, msg.title || 'Message', 'message')}
                        >
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                        <Link to={`/message/${msg.slug}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handlePublish('message', msg.id)}>
                        <Eye className="w-4 h-4" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget({ type: 'message', id: msg.id, name: msg.title || 'this message' })}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Modal open={showShare} onClose={() => setShowShare(false)} title="Share" maxWidth="max-w-lg">
        <SharePanel url={shareUrl} title={shareTitle} />
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete" maxWidth="max-w-sm">
        <div className="space-y-4">
          <p className="text-stone-600">
            Are you sure you want to delete {deleteTarget?.name}? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}
