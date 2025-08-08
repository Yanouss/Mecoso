import { Link } from "react-router";

interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
}

const Hero = ({
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  image = {
    src: "images/hero.jpg",
    alt: "Hero section demo image showing interface components",
  },
}: Hero1Props) => {
  return (
    <section 
      className="relative py-44 bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ backgroundImage: `url(${image.src})` }}
    >
      {/* Enhanced overlay with gradient for better visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-blue-900/40 dark:from-slate-900/80 dark:via-slate-800/70 dark:to-blue-900/60"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent dark:from-transparent dark:via-blue-400/10 dark:to-transparent animate-pulse"></div>
      
      <div className="mx-auto container relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl text-white dark:text-slate-100 drop-shadow-2xl animate-fade-in-up">
            {heading}
          </h1>
          <p className="text-white/90 dark:text-slate-200/90 mb-8 max-w-xl lg:text-xl text-justify drop-shadow-lg animate-fade-in-up animation-delay-200">
            {description}
          </p>

          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row max-w-md">
            <div className="text-center mt-16 animate-fade-in-up animation-delay-400">
              <Link
                to="/contact"
                className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-500 transform hover:scale-105 transition-all duration-700 shadow-xl hover:shadow-2xl cursor-pointer group overflow-hidden"
              >
                <span className="relative z-10">Start Your Project</span>
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export { Hero };