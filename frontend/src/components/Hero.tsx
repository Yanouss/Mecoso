import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  badge = "✨ Your Website Builder",
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  image = {
    src: "images/hero.jpg",
    alt: "Hero section demo image showing interface components",
  },
}: Hero1Props) => {
  return (
    <section 
      className="relative py-44 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${image.src})` }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="mx-auto container relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {badge && (
            <Badge variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              {badge}
              <ArrowUpRight className="ml-2 size-4" />
            </Badge>
          )}
          <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl text-white">
            {heading}
          </h1>
          <p className="text-white/90 mb-8 max-w-xl lg:text-xl">
            {description}
          </p>

          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row max-w-md">
            <div className="text-center mt-16">
              <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-500 transform hover:scale-105 transition-all duration-700 shadow-lg hover:shadow-xl cursor-pointer">
                Start Your Project
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export { Hero };