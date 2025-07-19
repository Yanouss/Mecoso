import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import Services from "./components/Services";

function App() {
  return (
    <div className="mx-auto min-h-screen bg-white">
      <Navbar />
      <Hero
        badge="Construction & Building Solutions"
        heading="BUILDING ROBUST LASTING SOLUTIONS."
        description="Combining modern techniques with industry expertise to craft structures that are safe, sustainable, and built to last."
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
    </div>
  );
}

export default App;
