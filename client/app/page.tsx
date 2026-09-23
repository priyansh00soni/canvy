import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import PrinciplesStrip from '@/components/landing/PrinciplesStrip'
import ProductShowcase from '@/components/landing/ProductShowcase'
import InteractionStory from '@/components/landing/InteractionStory'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <main id="main-content">
      <Nav />
      <Hero />
      <PrinciplesStrip />
      <ProductShowcase />
      <div id="how">
        <InteractionStory />
      </div>
      <Footer />
    </main>
  )
}
