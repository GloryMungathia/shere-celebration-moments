import { Link } from 'react-router-dom';
import type { OccasionInfo } from '@/data/occasions';

interface OccasionCardProps {
  occasion: OccasionInfo;
  to: string;
}

export default function OccasionCard({ occasion, to }: OccasionCardProps) {
  const Icon = occasion.icon;
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl bg-white border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-6 text-center"
    >
      <div
        className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${occasion.gradient} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-stone-800 mb-1">{occasion.label}</h3>
      <p className="text-sm text-stone-500">{occasion.description}</p>
    </Link>
  );
}
