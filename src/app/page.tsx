import { HeroSection } from '@/components/home/hero-section';
import { AboutUs } from '@/components/home/featured-cards';
import { HealthCalculator } from '@/components/home/health-calculator';
import NewsHealthpedia from '@/components/home/news-healthpedia';
import { Affiliations } from '@/components/home/affiliations';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <NewsHealthpedia />
      <HealthCalculator />
      <Affiliations />
    </>
  );
};