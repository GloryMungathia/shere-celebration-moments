import Layout from '@/components/layout/Layout';
import OccasionCard from '@/components/OccasionCard';
import { occasions } from '@/data/occasions';

export default function OccasionSelectionPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800">
            What are you celebrating?
          </h1>
          <p className="mt-3 text-stone-500">
            Choose an occasion to browse available templates
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {occasions.map((occ) => (
            <OccasionCard
              key={occ.key}
              occasion={occ}
              to={`/templates/${occ.key}`}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
