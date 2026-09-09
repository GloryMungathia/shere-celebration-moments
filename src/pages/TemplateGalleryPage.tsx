import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TemplateCard from '@/components/TemplateCard';
import Spinner from '@/components/ui/Spinner';
import { fetchInvitationTemplates } from '@/lib/api';
import { getOccasionInfo, occasionLabels } from '@/data/occasions';
import type { Occasion, InvitationTemplate } from '@/types';

export default function TemplateGalleryPage() {
  const { occasion } = useParams<{ occasion: string }>();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const occasionKey = occasion as Occasion;
  const occasionInfo = getOccasionInfo(occasionKey);

  useEffect(() => {
    if (!occasion) return;
    setLoading(true);
    fetchInvitationTemplates(occasion)
      .then(setTemplates)
      .catch(() => setError('Failed to load templates. Please try again.'))
      .finally(() => setLoading(false));
  }, [occasion]);

  if (!occasionInfo) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-stone-500">Occasion not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button
          onClick={() => navigate('/occasions')}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to occasions
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${occasionInfo.gradient} flex items-center justify-center`}
            >
              <occasionInfo.icon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
              {occasionLabels[occasionKey]} Templates
            </h1>
          </div>
          <p className="text-stone-500">
            Choose a design to start customizing your {occasionLabels[occasionKey].toLowerCase()} invitation
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500">{error}</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500">No templates available yet for this occasion.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onUse={() => navigate(`/editor/${tpl.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
