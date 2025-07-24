import React, { useState, useEffect } from 'react';
import { Users, Award, Clock, Target, ArrowRight, CheckCircle, Building, Lightbulb, Heart, Shield, Star, Trophy, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router';

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
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
  heading = "Building Tomorrow's Infrastructure Today",
  description = "With over two decades of excellence in construction, we've transformed skylines and communities across the region through innovative engineering and unwavering commitment to quality.",
  story = "Founded in 2003 by a team of visionary engineers, our company began with a simple belief: that great construction goes beyond buildings—it builds communities, dreams, and lasting legacies. What started as a small firm with big ambitions has grown into one of the region's most trusted construction partners, delivering exceptional projects that stand as testaments to our commitment to excellence.",
  stats = [
    {
      number: "500+",
      label: "Projects Completed",
      icon: <Building className="size-6" />
    },
    {
      number: "20+",
      label: "Years Experience",
      icon: <Clock className="size-6" />
    },
    {
      number: "50+",
      label: "Expert Team",
      icon: <Users className="size-6" />
    },
    {
      number: "25+",
      label: "Industry Awards",
      icon: <Award className="size-6" />
    }
  ],
  values = [
    {
      title: "Innovation",
      description: "Embracing cutting-edge technology and sustainable practices to deliver future-ready solutions that exceed expectations.",
      icon: <Lightbulb className="size-6" />
    },
    {
      title: "Quality Excellence",
      description: "Every project reflects our commitment to superior craftsmanship and meticulous attention to detail.",
      icon: <Star className="size-6" />
    },
    {
      title: "Client Partnership",
      description: "Building lasting relationships through transparent communication and collaborative approach to every project.",
      icon: <Heart className="size-6" />
    },
    {
      title: "Safety First",
      description: "Maintaining the highest safety standards to protect our team and ensure secure work environments.",
      icon: <Shield className="size-6" />
    }
  ],
  mission = "To create exceptional spaces that inspire communities, drive economic growth, and stand as testaments to human ingenuity and craftsmanship.",
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

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative py-32 lg:py-44 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300"
          style={{ 
            backgroundImage: `url(${heroImage})`,
          }}
        />
        
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        
        {/* Animated shapes */}
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
              <Link to="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center gap-2 group">
                <span>Learn Our Story</span>
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 text-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex p-4 mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                      <div className="text-blue-600 group-hover:text-purple-600 transition-colors duration-500">
                        {stat.icon}
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-500">
                      {stat.number}
                    </div>
                    
                    <div className="text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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

              {/* Mission & Vision Cards */}
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

      {/* Timeline Section */}
      <section className="py-24 bg-white">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Our Journey
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Milestones That Define Us
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              From humble beginnings to industry leadership, here's our journey of growth and innovation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500" />
              
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-8 mb-12 group">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container px-6 mx-auto">
          <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-16 shadow-2xl relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Build Something Amazing?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Let's turn your vision into reality. Partner with us to create exceptional spaces that inspire and endure.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group">
                  <span>Start Your Project</span>
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300 border border-white/20">
                  View Our Portfolio
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;