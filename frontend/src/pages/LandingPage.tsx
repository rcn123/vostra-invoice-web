import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
}
