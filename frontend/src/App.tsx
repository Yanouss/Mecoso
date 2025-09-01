import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
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
import { Toaster } from "sonner";

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
            url: "/services",
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
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <BrowserRouter>
          <div className="mx-auto min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicePage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/machines" element={<MachinesPage />} />
            </Routes>
            <Footer />
            <Toaster 
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;