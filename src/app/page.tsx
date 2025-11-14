import { HeroSection } from '@/components/home/hero-section';
import { AboutUs } from '@/components/home/featured-cards';
import { HealthCalculator } from '@/components/home/health-calculator';
import NewsHealthpedia from '@/components/home/news-healthpedia';
import { Affiliations } from '@/components/home/affiliations';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <div className="w-full bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <AboutUs />
        </div>
      </div>
      <div className="w-full bg-white dark:bg-gray-900 transition-colors duration-300">
        <NewsHealthpedia />
      </div>
      <div className="w-full bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <HealthCalculator />
        </div>
      </div>
      <div className="w-full bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <Affiliations />
        </div>
      </div>
    </div>
  );
};