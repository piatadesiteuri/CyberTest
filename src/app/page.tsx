import HeroSection from '@/components/HeroSection'
import HowItWorks from '@/components/HowItWorks'
import CurriculumSection from '@/components/CurriculumSection'
import SuccessStories from '@/components/SuccessStories'
import SupportSection from '@/components/SupportSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <HowItWorks />
      <CurriculumSection />
      <SuccessStories />
      <SupportSection />
      <Footer />
    </main>
  )
}