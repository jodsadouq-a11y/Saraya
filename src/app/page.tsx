import Header from '@/components/Header';
import ScrollProgress from '@/components/ScrollProgress';
import MotionRoot from '@/components/MotionRoot';
import CursorFX from '@/components/CursorFX';
import Hero from '@/components/Hero';
import Story from '@/components/Story';
import Halls from '@/components/Halls';
import Gallery from '@/components/Gallery';
import Services from '@/components/Services';
import About from '@/components/About';
import Pause from '@/components/Pause';
import Booking from '@/components/Booking';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function Home() {
  return (
    <>
      <MotionRoot />
      <ScrollProgress />
      <CursorFX />
      <Header />
      <main id="main">
        <Hero />
        <Story />
        <Halls />
        <Gallery />
        <Services />
        <About />
        <Pause />
        <Booking />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
