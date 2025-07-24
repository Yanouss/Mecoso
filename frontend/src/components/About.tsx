import React, { useState } from 'react';
import { Users, Award, Clock, Target, ArrowRight, CheckCircle } from 'lucide-react';
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
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
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
}

const About = ({
  badge = "About Our Company",
  heading = "Building Tomorrow's Infrastructure Today",
  description = "With over two decades of excellence in construction, we've transformed skylines and communities across the region through innovative engineering and unwavering commitment to quality.",
  story = "Founded in 2003 by a team of visionary engineers, our company began with a simple belief: that great construction goes beyond buildings—it builds communities, dreams, and lasting legacies. What started as a small firm with big ambitions has grown into one of the region's most trusted construction partners.",
  stats = [
    {
      number: "500+",
      label: "Projects Completed",
      icon: <Target className="size-6" />
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
      description: "Embracing cutting-edge technology and sustainable practices to deliver future-ready solutions.",
      icon: <Target className="size-6" />
    },
    {
      title: "Quality Excellence",
      description: "Every project reflects our commitment to superior craftsmanship and attention to detail.",
      icon: <Award className="size-6" />
    },
    {
      title: "Client Partnership",
      description: "Building lasting relationships through transparent communication and collaborative approach.",
      icon: <Users className="size-6" />
    }
  ],
  team = [
    {
      name: "Sarah Mitchell",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      bio: "Visionary leader with 25+ years in construction and architecture."
    },
    {
      name: "David Chen",
      role: "Chief Engineer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Structural engineering expert specializing in sustainable design."
    },
    {
      name: "Maria Rodriguez",
      role: "Project Director",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Award-winning project manager known for delivering complex builds on time."
    }
  ],
  mission = "To create exceptional spaces that inspire communities, drive economic growth, and stand as testaments to human ingenuity and craftsmanship.",
  image = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop"
}: AboutProps) => {
  const [activeValue, setActiveValue] = useState(0);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
      
      <div className="container px-6 mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            {badge}
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Hero Story Section */}
        <div className="mb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <img 
                src={image} 
                alt="About us" 
                className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Floating Stats Cards */}
              {/* <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-3xl font-bold text-gray-900">{stats[0]?.number}</div>
                <div className="text-sm text-gray-600">{stats[0]?.label}</div>
              </div> */}
              
              {/* <div className="absolute top-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">{stats[1]?.number}</div>
                <div className="text-xs text-gray-600">{stats[1]?.label}</div>
              </div> */}
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {story}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200/50">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Target className="size-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {mission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make and every project we undertake.
            </p>
          </div>
          
          {/* Interactive Stats Grid */}
        <div className="mb-24 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 text-center">
                  <div className="inline-flex p-4 mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
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

          <div className="grid lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  activeValue === index ? 'scale-105' : 'hover:scale-102'
                }`}
                onMouseEnter={() => setActiveValue(index)}
              >
                <div className={`bg-white rounded-3xl p-8 shadow-lg border transition-all duration-500 ${
                  activeValue === index 
                    ? 'shadow-2xl border-blue-200 bg-gradient-to-br from-blue-50/50 to-purple-50/50' 
                    : 'border-gray-100 hover:shadow-xl'
                }`}>
                  <div className={`inline-flex p-4 mb-6 rounded-2xl transition-all duration-500 ${
                    activeValue === index 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg' 
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

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let's turn your vision into reality. Get in touch with our team to discuss your next project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center gap-2 group">
              Get Started Today
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-semibold hover:bg-white/20 backdrop-blur-sm transition-all duration-300 border border-white/20">
              View Our Portfolio
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;