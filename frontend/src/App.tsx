import { BrowserRouter, Routes, Route } from "react-router";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import Services from "./components/Services";
import About from "./components/About";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import AboutPage from "./components/AboutPage";
import ServicePage from "./components/ServicePage";
import GalleryPage from "./components/GalleryPage";
import MachinesPage from "./components/MachinesPage";

function Home() {
  return (
    <>
      <Hero
        heading="Leading Industrial Solutions in Morocco"
        description="MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions.
        Since 2005, we've been delivering excellence in metal structure design, manufacturing, and assembly
        across all industries."
        buttons={{
          primary: {
            text: "Our Services",
            url: "https://example.com/components",
          }
        }}
        image={{
          src: "/images/hero.jpg",
          alt: "Preview of a modern UI dashboard",
        }}
      />
      <Services />
      <About />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;