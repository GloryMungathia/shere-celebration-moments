import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { fetchMessageTemplates } from '@/lib/api';
import {
  messageCategoryLabels,
  messageCategoryIcons,
} from '@/data/messageTemplates';
import type { MessageCategory, MessageTemplate } from '@/types';

const categories = Object.keys(messageCategoryLabels) as MessageCategory[];

export default function MessageCategoryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MessageCategory | null>(null);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    fetchMessageTemplates(selectedCategory)
      .then(setTemplates)
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  if (selectedCategory) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All categories
          </button>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800">
              {messageCategoryIcons[selectedCategory]} {messageCategoryLabels[selectedCategory]} Messages
            </h1>
            <p className="text-stone-500 mt-1">
              Choose a message template to personalize
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : templates.length === 0 ? (
            <p className="text-stone-500 text-center py-12">
              No message templates available for this category yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <h3 className="text-lg font-semibold text-stone-800 mb-2">
                    {tpl.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed mb-4">{tpl.message}</p>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/message-editor?template=${tpl.id}`)
                    }
                  >
                    Use this message
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">
            Celebration Messages
          </h1>
          <p className="mt-3 text-stone-500">
            Choose a category to find the perfect message
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="group rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {messageCategoryIcons[cat]}
              </div>
              <h3 className="text-lg font-semibold text-stone-800">
                {messageCategoryLabels[cat]}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
