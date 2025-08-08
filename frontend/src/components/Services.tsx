import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  feature7?: Feature;
  feature8?: Feature;
  feature9?: Feature;
  feature10?: Feature;
  feature11?: Feature;
}

const ServicesCarousel = ({
  heading = "Our Core Services",
  description = "MECOSO delivers complete industrial solutions. From design and fabrication to installation and maintenance. Serving the mining, energy, and heavy industry sectors with a focus on quality, safety, and innovation.",
  feature1 = {
    title: "Thickener Manufacturing & Assembly",
    description: "Designing and assembling high-performance thickeners for efficient solid-liquid separation in industrial and mining applications.",
    image: "images/service1.jpg",
  },
  feature2 = {
    title: "Tank Manufacturing & Assembly",
    description: "Expert fabrication and on-site assembly of storage tanks and cement silos, ensuring durability, safety, and compliance.",
    image: "images/service2.jpg",
  },
  feature3 = {
    title: "Room Bin & Storage Hopper Manufacturing",
    description: "Custom-engineered bins and hoppers for optimal material storage and flow, tailored to your operational needs.",
    image: "images/service3.jpg",
  },
  feature4 = {
    title: "Steel Structure Fabrication & Erection",
    description: "Precision fabrication and erection of steel frameworks for industrial facilities, built to endure and perform.",
    image: "images/service4.jpg",
  },
  feature5 = {
    title: "Industrial Equipment Installation & Commissioning",
    description: "Professional setup and calibration of industrial machinery, ensuring seamless startup and optimal performance.",
    image: "images/service5.jpg",
  },
  feature6 = {
    title: "Pipeline & Piping Work",
    description: "Comprehensive pipeline services for gas, steam, and fluid systems, including standard and high-pressure pipelines.",
    image: "images/service6.jpg",
  },
  feature7 = {
    title: "Equipment Design & Manufacturing",
    description: "Custom-built industrial equipment designed for performance, efficiency, and reliability in demanding environments.",
    image: "images/service7.png",
  },
  feature8 = {
    title: "Mining Equipment Rehabilitation & Maintenance",
    description: "Extending the life of mining assets with expert refurbishment, repairs, and preventive maintenance strategies.",
    image: "images/service8.jpg",
  },
  feature9 = {
    title: "Photovoltaic Structure Manufacturing",
    description: "Manufacturing robust support structures for solar installations, engineered for efficiency and durability.",
    image: "images/service9.jpg",
  },
  feature10 = {
    title: "Lubrication Station Systems",
    description: "Design and integration of centralized lubrication systems that enhance equipment lifespan and reliability.",
    image: "images/service10.jpg",
  },
  feature11 = {
    title: "Industrial Maintenance Support & Training",
    description: "Providing on-site technical support and staff training to maintain high operational standards and reduce downtime.",
    image: "images/service11.png",
  },
}: ServicesCarouselProps) => {
  const features = [
    feature1,
    feature2,
    feature3,
    feature4,
    feature5,
    feature6,
    feature7,
    feature8,
    feature9,
    feature10,
    feature11,
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, features.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-all duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="container px-6 mx-auto relative z-10">
        {/* Header */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/50 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
            What We Do
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Main Carousel Container */}
        <div className="relative w-[100%] mx-auto">
          
          {/* Carousel Viewport */}
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl dark:shadow-slate-900/50">
            
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-black/80 dark:via-black/60 dark:to-black/40" />
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
                      <div className="flex items-center justify-center w-12 h-12 bg-white/20 dark:bg-white/25 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/40">
                        <span className="text-lg font-bold">
                          {String(currentIndex + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <div className="h-px bg-white/30 dark:bg-white/40 w-16" />
                      <span className="text-sm font-medium text-white/80 dark:text-white/90 uppercase tracking-wider">
                        Service
                      </span>
                    </div>

                    {/* Title with Animation */}
                    <div className="overflow-hidden">
                      <h2 
                        key={currentIndex}
                        className="text-4xl lg:text-6xl font-bold leading-tight animate-slide-up text-white dark:text-slate-100"
                      >
                        {features[currentIndex].title}
                      </h2>
                    </div>

                    {/* Description with Animation */}
                    <div className="overflow-hidden">
                      <p 
                        key={`desc-${currentIndex}`}
                        className="text-xl text-white/90 dark:text-slate-200/90 leading-relaxed max-w-lg animate-slide-up-delayed"
                      >
                        {features[currentIndex].description}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-4">
                      <button className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl dark:shadow-slate-900/50">
                        <span>Learn More</span>
                        <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
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
              className="p-4 bg-white/20 dark:bg-white/25 hover:bg-white/30 dark:hover:bg-white/35 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/40 text-white transition-all duration-300 hover:scale-110 group"
            >
              <ChevronLeft className="size-6 group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-4 flex items-center z-30">
            <button
              onClick={goToNext}
              className="p-4 bg-white/20 dark:bg-white/25 hover:bg-white/30 dark:hover:bg-white/35 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/40 text-white transition-all duration-300 hover:scale-110 group"
            >
              <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform duration-300" />
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
                    ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                    : 'bg-white/40 dark:bg-white/50 hover:bg-white/60 dark:hover:bg-white/70 hover:scale-110'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
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