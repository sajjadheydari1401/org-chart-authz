import { HomeCurrentAreas } from '@/components/home/home-current-areas';
import { HomeHeader } from '@/components/home/home-header';
import { HomeHero } from '@/components/home/home-hero';
import { HomePlannedAreas } from '@/components/home/home-planned-areas';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <HomeHeader />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <HomeHero />
        <HomeCurrentAreas />
        <HomePlannedAreas />
      </div>
    </main>
  );
}
