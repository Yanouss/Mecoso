import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronRight, 
  ArrowUpRight, 
  Clock, 
  Award, 
  Users, 
  Target,
  CheckCircle,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router';

interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  duration: string;
  price: string;
  category: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

interface ServicePageProps {
  badge?: string;
  heading?: string;
  description?: string;
  services?: Service[];
  testimonials?: Testimonial[];
  stats?: Array<{
    number: string;
    label: string;
    icon: React.ReactNode;
  }>;
}

const ServicePage = ({
  badge = "Our Services",
  heading = "Our Core Services",
  description = "MECOSO delivers complete industrial solutions. From design and fabrication to installation and maintenance. Serving the mining, energy, and heavy industry sectors with a focus on quality, safety, and innovation.",
  services = [
    {
      id: '1',
      title: "Thickener Manufacturing & Assembly",
      description: "Designing and assembling high-performance thickeners for efficient solid-liquid separation in industrial and mining applications.",
      image: "images/service1.jpg",
      features: ["High-Performance Design", "Solid-Liquid Separation", "Industrial Applications", "Mining Solutions"],
      duration: "6-12 weeks",
      price: "Custom quotes",
      category: "Manufacturing"
    },
    {
      id: '2',
      title: "Tank Manufacturing & Assembly",
      description: "Expert fabrication and on-site assembly of storage tanks and cement silos, ensuring durability, safety, and compliance.",
      image: "images/service2.jpg",
      features: ["Storage Solutions", "Cement Silos", "On-site Assembly", "Safety Compliance"],
      duration: "4-10 weeks",
      price: "Starting at $15,000",
      category: "Manufacturing"
    },
    {
      id: '3',
      title: "Room Bin & Storage Hopper Manufacturing",
      description: "Custom-engineered bins and hoppers for optimal material storage and flow, tailored to your operational needs.",
      image: "images/service3.jpg",
      features: ["Custom Engineering", "Optimal Flow Design", "Material Storage", "Operational Efficiency"],
      duration: "3-8 weeks",
      price: "Starting at $8,000",
      category: "Manufacturing"
    },
    {
      id: '4',
      title: "Steel Structure Fabrication & Erection",
      description: "Precision fabrication and erection of steel frameworks for industrial facilities, built to endure and perform.",
      image: "images/service4.jpg",
      features: ["Precision Fabrication", "Steel Frameworks", "Industrial Facilities", "Structural Engineering"],
      duration: "8-16 weeks",
      price: "Custom quotes",
      category: "Construction"
    },
    {
      id: '5',
      title: "Industrial Equipment Installation & Commissioning",
      description: "Professional setup and calibration of industrial machinery, ensuring seamless startup and optimal performance.",
      image: "images/service5.jpg",
      features: ["Professional Setup", "Equipment Calibration", "Seamless Startup", "Performance Optimization"],
      duration: "2-6 weeks",
      price: "Starting at $5,000",
      category: "Installation"
    },
    {
      id: '6',
      title: "Pipeline & Piping Work",
      description: "Comprehensive pipeline services for gas, steam, and fluid systems, including standard and high-pressure pipelines.",
      image: "images/service6.jpg",
      features: ["Gas Systems", "Steam Pipelines", "Fluid Systems", "High-Pressure Solutions"],
      duration: "4-12 weeks",
      price: "Starting at $10,000",
      category: "Installation"
    },
    {
      id: '7',
      title: "Equipment Design & Manufacturing",
      description: "Custom-built industrial equipment designed for performance, efficiency, and reliability in demanding environments.",
      image: "images/service7.png",
      features: ["Custom Design", "Performance Focused", "High Efficiency", "Reliable Operations"],
      duration: "6-14 weeks",
      price: "Custom quotes",
      category: "Design"
    },
    {
      id: '8',
      title: "Mining Equipment Rehabilitation & Maintenance",
      description: "Extending the life of mining assets with expert refurbishment, repairs, and preventive maintenance strategies.",
      image: "images/service8.jpg",
      features: ["Asset Extension", "Expert Refurbishment", "Preventive Maintenance", "Cost Optimization"],
      duration: "Ongoing",
      price: "Maintenance contracts",
      category: "Maintenance"
    },
    {
      id: '9',
      title: "Photovoltaic Structure Manufacturing",
      description: "Manufacturing robust support structures for solar installations, engineered for efficiency and durability.",
      image: "images/service9.jpg",
      features: ["Solar Support", "Robust Design", "High Efficiency", "Long-term Durability"],
      duration: "4-8 weeks",
      price: "Starting at $12,000",
      category: "Manufacturing"
    },
    {
      id: '10',
      title: "Lubrication Station Systems",
      description: "Design and integration of centralized lubrication systems that enhance equipment lifespan and reliability.",
      image: "images/service10.jpg",
      features: ["Centralized Systems", "Equipment Protection", "Enhanced Lifespan", "Automated Solutions"],
      duration: "3-6 weeks",
      price: "Starting at $7,000",
      category: "Systems"
    },
    {
      id: '11',
      title: "Industrial Maintenance Support & Training",
      description: "Providing on-site technical support and staff training to maintain high operational standards and reduce downtime.",
      image: "images/service11.png",
      features: ["On-site Support", "Staff Training", "Operational Standards", "Downtime Reduction"],
      duration: "Ongoing",
      price: "Training packages",
      category: "Support"
    }
  ],
  testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Operations Manager",
      company: "Morocco Mining Corp",
      content: "MECOSO's thickener manufacturing service exceeded our expectations. Their expertise in solid-liquid separation technology significantly improved our mining operations efficiency.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Fatima Benali",
      role: "Project Director",
      company: "Atlas Energy Solutions",
      content: "Outstanding steel structure fabrication and erection services. MECOSO delivered our industrial facility framework on time and with exceptional quality standards.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Omar Alami",
      role: "Maintenance Chief",
      company: "Casablanca Industrial Complex",
      content: "Their mining equipment rehabilitation service has extended our machinery life significantly. Professional team with deep industrial expertise and reliable support.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    }
  ],
  stats = [
    {
      number: "50+",
      label: "Projects Completed",
      icon: <Target className="size-6" />
    },
    {
      number: "ISO 9001",
      label: "2015 certified",
      icon: <Award className="size-6" />
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
    }
  ]
}: ServicePageProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`size-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed mb-12">
              {description}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl text-blue-600 dark:text-blue-400">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-1">{stat.number}</div>
                  <div className="text-gray-600 dark:text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <div 
                key={service.id}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Service Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-800 dark:text-slate-200 text-sm font-medium rounded-full">
                      {service.category}
                    </span>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-600/90 dark:bg-blue-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                      {service.price}
                    </span>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="size-4 text-green-500 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 mb-6 text-gray-600 dark:text-slate-400">
                    <Clock className="size-4" />
                    <span className="text-sm">{service.duration}</span>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={() => setSelectedService(service)}
                    className="w-full py-3 bg-gray-900 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Learn More
                    <ArrowUpRight className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-900 dark:bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.2),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Our Process</h2>
            <p className="text-xl text-gray-300 dark:text-slate-400 max-w-2xl mx-auto">
              A streamlined approach that ensures quality, efficiency, and client satisfaction at every step.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Understanding your industrial needs and project requirements" },
              { step: "02", title: "Design & Planning", desc: "Detailed engineering design and comprehensive project planning" },
              { step: "03", title: "Manufacturing & Installation", desc: "Expert fabrication and professional on-site installation" },
              { step: "04", title: "Commissioning & Support", desc: "System commissioning and ongoing maintenance support" }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/10 dark:bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-600/30 hover:bg-white/20 dark:hover:bg-slate-700/40 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-400 dark:text-blue-300 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-300 dark:text-slate-400">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">Client Success Stories</h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Hear what our clients say about working with us and the results we've delivered.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-2xl dark:shadow-blue-500/5 p-12 border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>
              
              <blockquote className="text-2xl text-gray-800 dark:text-slate-200 leading-relaxed mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonials[currentTestimonial].image} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900 dark:text-slate-100">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600 dark:text-slate-400">{testimonials[currentTestimonial].role}</div>
                  <div className="text-blue-600 dark:text-blue-400 text-sm">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'bg-blue-600 dark:bg-blue-500 scale-125'
                      : 'bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedService.image} 
                alt={selectedService.title}
                className="w-full h-64 object-cover"
              />
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors duration-300 text-gray-800 dark:text-slate-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full">
                  {selectedService.category}
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                  {selectedService.price}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">{selectedService.title}</h2>
              <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed mb-8">{selectedService.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Key Features</h3>
                  <div className="space-y-3">
                    {selectedService.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="size-5 text-green-500 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-slate-200">Duration</div>
                        <div className="text-gray-600 dark:text-slate-400">{selectedService.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="size-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-slate-200">Investment</div>
                        <div className="text-gray-600 dark:text-slate-400">{selectedService.price}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Link 
                  to="/contact"
                  className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-500 dark:hover:bg-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  Get Started
                  <ChevronRight className="size-5" />
                </Link>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="px-8 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;