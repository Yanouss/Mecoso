import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface ServicesCarouselProps {
  heading?: string;
  description?: string;
  feature1?: Feature;
  feature2?: Feature;
  feature3?: Feature;
  feature4?: Feature;
  feature5?: Feature;
  feature6?: Feature;
}

const ServicesCarousel = ({
  heading = "Our Construction Services",
  description = "We deliver reliable, innovative, and tailored construction solutions across every stage of your project.",
  feature1 = {
    title: "Architectural Design",
    description: "Bringing your vision to life with modern, sustainable, and client-focused architectural plans that blend functionality with aesthetic excellence.",
    image: "images/service6.jpg",
  },
  feature2 = {
    title: "Project Management",
    description: "Ensuring timely delivery and cost efficiency through effective planning, coordination, and supervision of all construction phases.",
    image: "images/service1.jpg",
  },
  feature3 = {
    title: "Structural Engineering",
    description: "Designing robust, safe, and code-compliant structures that stand the test of time with innovative engineering solutions.",
    image: "images/service2.jpg",
  },
  feature4 = {
    title: "Heavy Machinery & Logistics",
    description: "Utilizing state-of-the-art equipment and expert logistics coordination to streamline construction operations efficiently.",
    image: "images/service3.jpg",
  },
  feature5 = {
    title: "Quality Assurance",
    description: "Rigorous testing and inspection protocols ensuring excellence and compliance at every project phase and milestone.",
    image: "images/service4.jpg",
  },
  feature6 = {
    title: "Green Building Solutions",
    description: "Sustainable construction practices and eco-friendly materials creating environmentally responsible structures for a better future.",
    image: "images/service5.jpg",
  },
}: ServicesCarouselProps) => {
  const features = [feature1, feature2, feature3, feature4, feature5, feature6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)]" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="container px-6 mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            What We Do
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Main Carousel Container */}
        <div className="relative w-[100%] mx-auto">
          
          {/* Carousel Viewport */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Background Slides */}
            {features.map((feature, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentIndex 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-110'
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              </div>
            ))}

            {/* Content Overlay */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container px-8 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  
                  {/* Text Content */}
                  <div className="text-white space-y-8">
                    
                    {/* Service Number Badge */}
                    <div className="inline-flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                        <span className="text-lg font-bold">
                          {String(currentIndex + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="h-px bg-white/30 w-16" />
                      <span className="text-sm font-medium text-white/80 uppercase tracking-wider">
                        Service
                      </span>
                    </div>

                    {/* Title with Animation */}
                    <div className="overflow-hidden">
                      <h2 
                        key={currentIndex}
                        className="text-4xl lg:text-6xl font-bold leading-tight animate-slide-up"
                      >
                        {features[currentIndex].title}
                      </h2>
                    </div>

                    {/* Description with Animation */}
                    <div className="overflow-hidden">
                      <p 
                        key={`desc-${currentIndex}`}
                        className="text-xl text-white/90 leading-relaxed max-w-lg animate-slide-up-delayed"
                      >
                        {features[currentIndex].description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <button className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                        <span>Learn More</span>
                        <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Elements */}
                  <div className="hidden lg:block">
                    <div className="relative">
                      
                      {/* Floating Cards Preview */}
                      <div className="absolute -top-8 -right-8 grid grid-cols-2 gap-4">
                        {features.slice(0, 4).map((feature, index) => (
                          <div
                            key={index}
                            className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-500 cursor-pointer ${
                              index === currentIndex 
                                ? 'border-blue-600 shadow-lg scale-110' 
                                : 'border-white/30 hover:border-white/60 hover:scale-105'
                            }`}
                            onClick={() => goToSlide(index)}
                          >
                            <img
                              src={feature.image}
                              alt={feature.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Progress Circle */}
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            r="16"
                            fill="none"
                            stroke="blue"
                            strokeWidth="2"
                            strokeDasharray={`${((currentIndex + 1) / features.length) * 100} 100`}
                            className="transition-all duration-1000 ease-in-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {currentIndex + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-4 flex items-center z-30">
            <button
              onClick={goToPrevious}
              className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl border border-white/30 text-white transition-all duration-300 hover:scale-110 group"
            >
              <ChevronLeft className="size-6 group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-4 flex items-center z-30">
            <button
              onClick={goToNext}
              className="p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl border border-white/30 text-white transition-all duration-300 hover:scale-110 group"
            >
              <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Play/Pause Control */}
          <div className="absolute bottom-6 left-6 z-30">
            <button
              onClick={togglePlayPause}
              className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 text-white transition-all duration-300 hover:scale-110"
            >
              {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
            </button>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 right-6 z-30 flex gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-125'
                    : 'bg-white/40 hover:bg-white/60 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Stats/Info */}
        {/* <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Projects Completed" },
            { number: "98%", label: "Client Satisfaction" },
            { number: "20+", label: "Years Experience" },
            { number: "24/7", label: "Support Available" }
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-pointer">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div> */}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </section>
  );
};

export default ServicesCarousel;