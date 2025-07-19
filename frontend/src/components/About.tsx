import React, { useState } from 'react'

const About = () => {
  const [currentStack, setCurrentStack] = useState(0);
  
  const stackItems = [
    { title: "20+ Years", subtitle: "Experience", color: "bg-[#fcbd0f]" },
    { title: "500+", subtitle: "Projects", color: "bg-blue-500" },
    { title: "100%", subtitle: "Satisfaction", color: "bg-green-500" },
    { title: "24/7", subtitle: "Support", color: "bg-purple-500" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStack((prev) => (prev + 1) % stackItems.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              About <span className="text-[#fcbd0f]">BuildCorp</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              With over two decades of excellence in the construction industry, BuildCorp has established 
              itself as a trusted partner for residential and commercial projects. We combine traditional 
              craftsmanship with modern innovation to deliver exceptional results.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our commitment to quality, safety, and customer satisfaction has made us the preferred 
              choice for clients who demand nothing but the best. From concept to completion, we're 
              with you every step of the way.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { icon: Users, text: "Expert Team" },
                { icon: Award, text: "Quality Work" },
                { icon: Clock, text: "On-Time Delivery" },
                { icon: Shield, text: "Licensed & Insured" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-[#fcbd0f] p-2 rounded-full">
                    <feature.icon className="h-5 w-5 text-black" />
                  </div>
                  <span className="font-medium text-black">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button className="bg-[#fcbd0f] text-black hover:bg-[#fcbd0f]/90">
              Learn More About Us
            </Button>
          </div>

          {/* Animated Stack */}
          <div className="relative flex justify-center items-center h-96">
            <div className="relative w-80 h-80">
              {stackItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full rounded-2xl shadow-lg transition-all duration-500 transform ${
                    index <= currentStack ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    transform: `translateY(${index * -20}px) translateX(${index * 10}px) scale(${1 - index * 0.05})`,
                    zIndex: stackItems.length - index
                  }}
                >
                  <div className={`${item.color} w-full h-full rounded-2xl flex flex-col items-center justify-center text-white`}>
                    <div className="text-5xl font-bold mb-2">{item.title}</div>
                    <div className="text-xl">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About