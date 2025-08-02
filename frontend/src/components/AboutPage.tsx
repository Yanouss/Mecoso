import React, { useState, useEffect } from 'react';
import { Users, Award, Clock, Target, ArrowRight, CheckCircle, Building, Lightbulb, Heart, Shield, Star, Trophy, MapPin, Phone, Mail, X } from 'lucide-react';

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
  backgroundImage?: string;
  popupImage?: string;
  popupTitle?: string;
  popupDescription?: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface AboutPageProps {
  badge?: string;
  heading?: string;
  description?: string;
  story?: string;
  stats?: Stat[];
  values?: Value[];
  team?: TeamMember[];
  mission?: string;
  vision?: string;
  milestones?: Milestone[];
  heroImage?: string;
}

const AboutPage = ({
  badge = "About Our Company",
  heading = "Leading Industrial Solutions in Morocco",
  story = "Founded in 2005 by KACEMY Abderahman, MECOSO has grown from a specialized boilermaking workshop into Morocco's leading provider of comprehensive industrial metalwork solutions. With two decades of experience, we've built our reputation on delivering quality, safety, and innovation to clients across diverse industries.",
  description = "MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we've been delivering excellence in metal structure design, manufacturing, and assemblyacross all industries",
  
  stats = [
      {
        number: "50+",
        label: "Projects Completed",
        icon: <Target className="size-6" />,
        backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        popupImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
        popupTitle: "50+ Projects Completed",
        popupDescription: "Over the years, we have successfully completed more than 50 major industrial projects across Morocco, ranging from manufacturing facilities to complex structural installations. Each project showcases our commitment to excellence and innovation."
      },
      {
        number: "20+",
        label: "Years Experience",
        icon: <Clock className="size-6" />,
        backgroundImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
        popupImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
        popupTitle: "20+ Years of Excellence",
        popupDescription: "Since 2005, MECOSO has been at the forefront of industrial metalwork solutions in Morocco. Our two decades of experience have shaped us into the trusted partner that industries rely on for quality and innovation."
      },
      {
        number: "2,000 m²",
        label: "Advanced manufacturing facility",
        icon: <Building className="size-6" />,
        backgroundImage: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400&h=300&fit=crop",
        popupImage: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&h=600&fit=crop",
        popupTitle: "2,000 m² Manufacturing Facility",
        popupDescription: "Our state-of-the-art 2,000 square meter manufacturing facility is equipped with the latest technology and machinery, enabling us to handle projects of any scale with precision and efficiency."
      },
      {
        number: "ISO 9001",
        label: "2015 certified",
        icon: <Award className="size-6" />,
        backgroundImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        popupImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop",
        popupTitle: "ISO 9001:2015 Certified",
        popupDescription: "Our commitment to quality is validated by our ISO 9001:2015 certification. This international standard ensures that our quality management systems meet the highest global standards for customer satisfaction and continuous improvement."
      }
  ],
  
  values = [
      {
        title: " Complete Solutions",
        description: "From initial design to final commissioning and ongoing maintenance, MECOSO delivers seamless, end-to-end industrial solutions tailored to your needs.",
        icon: <Target className="size-6" />,
        videoUrl: "/videos/values/value1.mp4"
      },
      {
        title: "Advanced Technology",
        description: "We leverage state-of-the-art machinery and cutting-edge processes to ensure efficiency, precision, and innovation at every stage.",
        icon: <Award className="size-6" />,
        videoUrl: "/videos/values/value4.mp4"
      },
      {
        title: "Quality Assurance",
        description: "Certified to ISO 9001:2015 standards, our rigorous quality control systems guarantee consistent excellence across all operations.",
        icon: <Users className="size-6" />,
        videoUrl: "/videos/values/value3.mp4"
      },
      {
        title: "Safety First",
        description: "We prioritize safety above all, adhering to the highest industry standards to protect our people, partners, and projects.",
        icon: <Users className="size-6" />,
        videoUrl: "/videos/values/value6.mp4"
      },
      {
        title: "Experienced Team",
        description: "Our multidisciplinary team brings deep expertise and hands-on experience, ensuring professional execution and reliable support every step of the way.",
        icon: <Users className="size-6" />,
        videoUrl: "/videos/values/value2.mp4"
      },
      {
        title: "Client Partnership",
        description: "Building lasting relationships through collaborative approach.",
        icon: <Users className="size-6" />,
        videoUrl: "/videos/values/value5.mp4"
      }
  ],
  mission = "To provide comprehensive, high-quality metalwork solutions that meet the evolving needs of modern industry while maintaining the highest standards of safety, quality, and customer satisfaction",
  
  vision = "To be the leading construction company that shapes the future of our cities through sustainable, innovative, and transformative building solutions.",

  milestones = [
    {
      year: "2003",
      title: "Company Founded",
      description: "Started with a small team of passionate engineers and a big vision for the future."
    },
    {
      year: "2008",
      title: "First Major Project",
      description: "Completed our first landmark commercial building, establishing our reputation for excellence."
    },
    {
      year: "2015",
      title: "Sustainability Focus",
      description: "Pioneered green building practices and became certified in sustainable construction methods."
    },
    {
      year: "2020",
      title: "Digital Innovation",
      description: "Integrated cutting-edge technology and BIM modeling into our construction processes."
    },
    {
      year: "2024",
      title: "Industry Recognition",
      description: "Received multiple awards for outstanding construction projects and innovation in design."
    }
  ],
  heroImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop"
}: AboutPageProps) => {
  const [activeValue, setActiveValue] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closePopup = () => {
    setSelectedStat(null);
  };

  useEffect(() => {
    if (selectedStat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedStat]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative py-32 lg:py-44 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300"
          style={{ 
            backgroundImage: `url(${heroImage})`,
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-300 bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-500/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              {badge}
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {heading}
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mb-8">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center gap-2 group">
                <span>Learn Our Story</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Image Backgrounds and Popups */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
                onClick={() => setSelectedStat(stat)}
              >
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center overflow-hidden h-60">
                  {/* Background Image */}
                  {stat.backgroundImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ backgroundImage: `url(${stat.backgroundImage})` }}
                    />
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Hover Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="inline-flex p-4 mb-4 bg-gradient-to-br from-blue-100/90 to-purple-100/90 rounded-2xl group-hover:scale-110 transition-transform duration-500 mx-auto backdrop-blur-sm">
                      <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-500">
                        {stat.icon}
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-500">
                      {stat.number}
                    </div>
                    
                    <div className="text-gray-700 font-medium text-sm">
                      {stat.label}
                    </div>
                    
                    {/* Click indicator */}
                    <div className="mt-3 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to learn more
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popup Modal */}
      {selectedStat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 z-10"
            >
              <X className="size-6 text-gray-600" />
            </button>
            
            {/* Popup Content */}
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl">
                  <div className="text-blue-600">
                    {selectedStat.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {selectedStat.popupTitle || `${selectedStat.number} ${selectedStat.label}`}
                  </h3>
                </div>
              </div>
              
              {/* Main Image */}
              {selectedStat.popupImage && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src={selectedStat.popupImage} 
                    alt={selectedStat.popupTitle || selectedStat.label}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}
              
              {/* Description */}
              {selectedStat.popupDescription && (
                <div className="text-lg text-gray-700 leading-relaxed">
                  {selectedStat.popupDescription}
                </div>
              )}
              
              {/* Stats Display */}
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-200/50">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {selectedStat.number}
                  </div>
                  <div className="text-gray-700 font-semibold">
                    {selectedStat.label}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop" 
                  alt="Our story" 
                  className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Our Story
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Two Decades of Excellence
                </h2>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-8">
                  {story}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Target className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {mission}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-gray-200/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Lightbulb className="size-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {vision}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Our Values
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Principles That Guide Us
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Every decision we make and every project we undertake is guided by these core values that define who we are.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`group cursor-pointer transition-all duration-500 ${
                  activeValue === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveValue(index)}
              >
                <div className={`bg-white rounded-3xl p-8 shadow-lg border transition-all duration-500 h-full ${
                  activeValue === index 
                    ? 'shadow-2xl border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50' 
                    : 'border-gray-100 hover:shadow-xl'
                }`}>
                  <div className={`inline-flex p-4 mb-6 rounded-2xl transition-all duration-500 ${
                    activeValue === index 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100'
                  }`}>
                    {value.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 rounded-full blur-2xl" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-400" />
              </div>
              <span className="ml-2">Trusted Partnerships</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Industry Leaders
              </span>
              <br />
              <span className="text-gray-900">Choose Us</span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              We proudly collaborate with Morocco's most prestigious organizations and international companies who trust us to deliver excellence in every project.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[
                { src: "/images/partners/Partner1.jpg", name: "Partner 1" },
                { src: "/images/partners/Partner2.jpg", name: "Partner 2" },
                { src: "/images/partners/Partner3.jpg", name: "Partner 3" },
                { src: "/images/partners/Partner4.jpg", name: "Partner 4" },
                { src: "/images/partners/Partner5.jpg", name: "Partner 5" },
                { src: "/images/partners/Partner5.png", name: "Partner 6" },
                { src: "/images/partners/Partner6.webp", name: "Partner 7" },
                { src: "/images/partners/Partner7.png", name: "Partner 8" },
                { src: "/images/partners/Partner8.jpg", name: "Partner 9" },
                { src: "/images/partners/Partner9.png", name: "Partner 10" },
                { src: "/images/partners/Partner10.jpg", name: "Partner 11" },
                { src: "/images/partners/Partner11.png", name: "Partner 12" },
                { src: "/images/partners/Partner12.png", name: "Partner 13" },
                { src: "/images/partners/Partner13.jpg", name: "Partner 14" }
              ].map((partner, idx) => (
                <div key={idx} className="group relative">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden h-32 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]">
                      <div className="w-full h-full bg-white rounded-2xl" />
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      <img 
                        src={partner.src} 
                        alt={partner.name}
                        className="max-h-16 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group cursor-pointer">
              <Building className="size-5" />
              <span>Join Our Network of Partners</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;