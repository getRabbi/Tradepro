import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/home/Hero'
import LiveTicker from '@/components/home/LiveTicker'
import InstrumentCards from '@/components/home/InstrumentCards'
import Features from '@/components/home/Features'
import { Education, CTASection } from '@/components/home/Education'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <LiveTicker />
        <InstrumentCards />
        <Features />
        <Education />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
