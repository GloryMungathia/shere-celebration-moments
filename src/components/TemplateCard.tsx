import type { InvitationTemplate } from '@/types';
import InvitationPreview from './InvitationPreview';
import Button from './ui/Button';

interface TemplateCardProps {
  template: InvitationTemplate;
  onUse: () => void;
}

export default function TemplateCard({ template, onUse }: TemplateCardProps) {
  return (
    <div className="group rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="aspect-[3/4] overflow-hidden bg-stone-50 relative">
        <div className="absolute inset-0 scale-[0.85] origin-center">
          <InvitationPreview
            invitation={{
              occasion: template.occasion,
              title: 'Sample Event',
              name: 'Jane & John',
              event_date: '2026-06-15',
              event_time: '4:00 PM',
              venue: 'Grand Hall',
              message: 'Join us for a celebration!',
            }}
            template={template}
            customization={template.config}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-stone-800">{template.name}</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 capitalize">
            {template.style}
          </span>
        </div>
        <Button size="sm" className="w-full" onClick={onUse}>
          Use this template
        </Button>
      </div>
    </div>
  );
}
