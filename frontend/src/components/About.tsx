import React, { useState } from 'react';
import { Users, Award, Clock, Target, ArrowRight, CheckCircle, Download, X } from 'lucide-react';
import { Link } from 'react-router';

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
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
  videoUrl: string;
}

interface AboutProps {
  badge?: string;
  heading?: string;
  description?: string;
  story?: string;
  stats?: Stat[];
  values?: Value[];
  team?: TeamMember[];
  mission?: string;
  image?: string;
  portfolioFileName?: string;
}

const About = ({
  badge = "About Our Company",
  heading = "Building Tomorrow's Infrastructure Today",
  description = "Our commitment to quality, safety, and innovation has made us a leader in the industrial metalwork sector in Morocco.",
  story = "Founded in 2005 by KACEMY Abderahman, MECOSO has grown from a specialized boilermaking workshop into Morocco's leading provider of comprehensive industrial metalwork solutions. With two decades of experience, we've built our reputation on delivering quality, safety, and innovation to clients across diverse industries",

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
      icon: <Award className="size-6" />,
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
      videoUrl: "/videos/values/value1.mp4" // Industrial design/engineering video
    },
    {
      title: "Advanced Technology",
      description: "We leverage state-of-the-art machinery and cutting-edge processes to ensure efficiency, precision, and innovation at every stage.",
      icon: <Award className="size-6" />,
      videoUrl: "/videos/values/value4.mp4" // Modern manufacturing/machinery video
    },
    {
      title: "Quality Assurance",
      description: "Certified to ISO 9001:2015 standards, our rigorous quality control systems guarantee consistent excellence across all operations.",
      icon: <Users className="size-6" />,
      videoUrl: "/videos/values/value3.mp4" // Quality control/inspection video
    },
    {
      title: "Safety First",
      description: "We prioritize safety above all, adhering to the highest industry standards to protect our people, partners, and projects.",
      icon: <Users className="size-6" />,
      videoUrl: "/videos/values/value6.mp4" // Safety equipment/workers video
    },
    {
      title: "Experienced Team",
      description: "Our multidisciplinary team brings deep expertise and hands-on experience, ensuring professional execution and reliable support every step of the way.",
      icon: <Users className="size-6" />,
      videoUrl: "/videos/values/value2.mp4" // Team of workers/professionals
    },
    {
      title: "Client Partnership",
      description: "Building lasting relationships through collaborative approach.",
      icon: <Users className="size-6" />,
      videoUrl: "/videos/values/value5.mp4" // Business meeting/handshake video
    }
  ],
  mission = "To provide comprehensive, high-quality metalwork solutions that meet the evolving needs of modern industry while maintaining the highest standards of safety, quality, and customer satisfaction",
  image = "/images/team.jpg",
  portfolioFileName = "MECOSO-Portfolio.pptx"
}: AboutProps) => {
  const [activeValue, setActiveValue] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);

  const handlePortfolioDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Create the download URL
      const portfolioUrl = `/portfolio/${portfolioFileName}`;
      
      // Create a temporary anchor element for download
      const link = document.createElement('a');
      link.href = portfolioUrl;
      link.download = portfolioFileName;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading portfolio:', error);
      // You could add a toast notification here for error handling
    } finally {
      setIsDownloading(false);
    }
  };

  const closePopup = () => {
    setSelectedStat(null);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-all duration-500">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl" />
      
      <div className="container px-6 mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
            {badge}
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-xl text-justify text-gray-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hero Story Section */}
        <div className="mb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl dark:shadow-slate-900/50 group">
              <img 
                src={image} 
                alt="About us" 
                className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-slate-300 text-justify leading-relaxed text-lg">
                {story}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-8 border border-gray-200/50 dark:border-slate-600/50 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl transition-all duration-300">
                  <Target className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Our Mission</h3>
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                    {mission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Stats Grid */}
        <div className="mb-24 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group cursor-pointer"
              onClick={() => setSelectedStat(stat)}
            >
              <div className="relative bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-500 transform hover:-translate-y-2 text-center overflow-hidden h-60 backdrop-blur-sm">
                {/* Background Image */}
                {stat.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-500"
                    style={{ backgroundImage: `url(${stat.backgroundImage})` }}
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 opacity-60 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity duration-500" />
                
                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <div className="inline-flex p-4 mb-4 bg-gradient-to-br from-blue-100/90 to-purple-100/90 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-500 mx-auto backdrop-blur-sm">
                    <div className="text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-500">
                      {stat.icon}
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500">
                    {stat.number}
                  </div>
                  
                  <div className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                    {stat.label}
                  </div>
                  
                  {/* Click indicator */}
                  <div className="mt-3 text-xs text-gray-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to learn more
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Popup Modal */}
        {selectedStat && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-slate-700">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors duration-200 z-10"
              >
                <X className="size-6 text-gray-600 dark:text-slate-300" />
              </button>
              
              {/* Popup Content */}
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl">
                    <div className="text-blue-600 dark:text-blue-400">
                      {selectedStat.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                      {selectedStat.popupTitle || `${selectedStat.number} ${selectedStat.label}`}
                    </h3>
                  </div>
                </div>
                
                {/* Main Image */}
                {selectedStat.popupImage && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-xl dark:shadow-slate-900/50">
                    <img 
                      src={selectedStat.popupImage} 
                      alt={selectedStat.popupTitle || selectedStat.label}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>
                )}
                
                {/* Description */}
                {selectedStat.popupDescription && (
                  <div className="text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                    {selectedStat.popupDescription}
                  </div>
                )}
                
                {/* Stats Display */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-2xl border border-gray-200/50 dark:border-slate-600/50">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {selectedStat.number}
                    </div>
                    <div className="text-gray-700 dark:text-slate-300 font-semibold">
                      {selectedStat.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Values Section with Video Backgrounds */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Why Choose MECOSO?
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
              The principles that guide every decision we make and every project we undertake.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeValue === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveValue(index)}
              >
                <div className={`relative overflow-hidden rounded-3xl shadow-lg border transition-all duration-500 h-80 ${
                  activeValue === index 
                    ? 'shadow-2xl border-blue-200 dark:border-blue-700 dark:shadow-slate-900/50' 
                    : 'border-gray-100 dark:border-slate-700 hover:shadow-xl dark:hover:shadow-slate-900/50'
                }`}>
                  {/* Video Background */}
                  <video 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                  >
                    <source src={value.videoUrl} type="video/mp4" />
                  </video>
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    activeValue === index 
                      ? 'bg-gradient-to-t from-black/80 via-black/40 to-black/20 dark:from-black/90 dark:via-black/50 dark:to-black/30' 
                      : 'bg-gradient-to-t from-black/70 via-black/30 to-black/10 group-hover:from-black/75 group-hover:via-black/35 dark:from-black/80 dark:via-black/40 dark:to-black/20 dark:group-hover:from-black/85 dark:group-hover:via-black/45'
                  }`} />
                  
                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-200 dark:text-slate-200 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 transition-all duration-500 ${
                    activeValue === index 
                      ? 'bg-blue-500/20 dark:bg-blue-400/25' 
                      : 'bg-transparent group-hover:bg-blue-500/10 dark:group-hover:bg-blue-400/15'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-12 shadow-2xl dark:shadow-slate-900/50 border border-gray-800 dark:border-slate-700">
          <h2 className="text-4xl font-bold text-white dark:text-slate-100 mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            From concept to commissioning, we're ready to deliver industrial excellence. Reach out to discuss your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-500 dark:hover:bg-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center gap-2 group">
              Get Started Now
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <button 
              onClick={handlePortfolioDownload}
              disabled={isDownloading}
              className="px-8 py-4 bg-white/10 dark:bg-slate-700/50 text-white dark:text-slate-200 rounded-2xl font-semibold hover:bg-white/20 dark:hover:bg-slate-600/50 backdrop-blur-sm transition-all duration-300 border border-white/20 dark:border-slate-600/50 inline-flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white dark:border-slate-200"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="size-5 group-hover:translate-y-1 transition-transform duration-300" />
                  Download Our Portfolio
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;