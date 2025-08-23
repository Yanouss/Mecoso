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
  MapPin,
  Edit3,
  X,
  Save,
  Plus,
  Trash2,
  Type,
  FileText,
  Image,
  DollarSign,
  Settings
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
  isModerator?: boolean;
}

interface ServiceFormData {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  duration: string;
  price: string;
  category: string;
}

interface TestimonialFormData {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

interface MainContentFormData {
  badge: string;
  heading: string;
  description: string;
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
  ],
  isModerator = true
}: ServicePageProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Edit states
  const [isMainContentModalOpen, setIsMainContentModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Current data states
  const [currentMainContent, setCurrentMainContent] = useState({
    badge,
    heading,
    description
  });
  const [currentServices, setCurrentServices] = useState(services);
  const [currentTestimonials, setCurrentTestimonials] = useState(testimonials);

  // Form data states
  const [mainContentForm, setMainContentForm] = useState<MainContentFormData>({
    badge,
    heading,
    description
  });
  const [serviceForm, setServiceForm] = useState<ServiceFormData>({
    id: '',
    title: '',
    description: '',
    image: '',
    features: [''],
    duration: '',
    price: '',
    category: ''
  });
  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormData>({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    image: ''
  });

  const categories = ['All', ...Array.from(new Set(currentServices.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All' 
    ? currentServices 
    : currentServices.filter(s => s.category === selectedCategory);

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % currentTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentTestimonials.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`size-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
      />
    ));
  };

  // Main Content handlers
  const openMainContentModal = () => {
    setMainContentForm(currentMainContent);
    setIsMainContentModalOpen(true);
  };

  const saveMainContent = () => {
    setCurrentMainContent(mainContentForm);
    setIsMainContentModalOpen(false);
  };

  const cancelMainContent = () => {
    setMainContentForm(currentMainContent);
    setIsMainContentModalOpen(false);
  };

  // Service handlers
  const openServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm(service);
    } else {
      setEditingService(null);
      setServiceForm({
        id: Date.now().toString(),
        title: '',
        description: '',
        image: '',
        features: [''],
        duration: '',
        price: '',
        category: ''
      });
    }
    setIsServiceModalOpen(true);
  };

  const saveService = () => {
    const cleanedFeatures = serviceForm.features.filter(f => f.trim() !== '');
    const updatedService = { ...serviceForm, features: cleanedFeatures };

    if (editingService) {
      setCurrentServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s));
    } else {
      setCurrentServices(prev => [...prev, updatedService]);
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
  };

  const deleteService = (id: string) => {
    setCurrentServices(prev => prev.filter(s => s.id !== id));
  };

  const addFeature = () => {
    setServiceForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Testimonial handlers
  const openTestimonialModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setTestimonialForm(testimonial);
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({
        name: '',
        role: '',
        company: '',
        content: '',
        rating: 5,
        image: ''
      });
    }
    setIsTestimonialModalOpen(true);
  };

  const saveTestimonial = () => {
    if (editingTestimonial) {
      setCurrentTestimonials(prev => prev.map(t => 
        t.name === editingTestimonial.name ? testimonialForm : t
      ));
    } else {
      setCurrentTestimonials(prev => [...prev, testimonialForm]);
    }
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
  };

  const deleteTestimonial = (name: string) => {
    setCurrentTestimonials(prev => prev.filter(t => t.name !== name));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Edit Button for Main Content */}
        {isModerator && (
          <button
            onClick={openMainContentModal}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-900 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Edit Main Content"
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {currentMainContent.badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
              {currentMainContent.heading}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed mb-12">
              {currentMainContent.description}
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
          
          {/* Services Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Services</h2>
            {isModerator && (
              <button
                onClick={() => openServiceModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            )}
          </div>
          
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
                {/* Edit Controls */}
                {isModerator && (
                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                    <button
                      onClick={() => openServiceModal(service)}
                      className="p-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors text-blue-600 dark:text-blue-400"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="p-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors text-red-600 dark:text-red-400"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

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
                  <div className="absolute top-4 right-4 mr-16">
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
          <div className="flex justify-between items-center mb-16">
            <div className="text-center flex-1">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">Client Success Stories</h2>
              <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                Hear what our clients say about working with us and the results we've delivered.
              </p>
            </div>
            {isModerator && (
              <button
                onClick={() => openTestimonialModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Testimonial
              </button>
            )}
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl dark:shadow-2xl dark:shadow-blue-500/5 p-12 border border-gray-100 dark:border-slate-700">
              {/* Edit Controls */}
              {isModerator && currentTestimonials[currentTestimonial] && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => openTestimonialModal(currentTestimonials[currentTestimonial])}
                    className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-blue-600 dark:text-blue-400"
                    title="Edit Testimonial"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTestimonial(currentTestimonials[currentTestimonial].name)}
                    className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-red-600 dark:text-red-400"
                    title="Delete Testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {currentTestimonials[currentTestimonial] && (
                <>
                  <div className="flex items-center gap-2 mb-6">
                    {renderStars(currentTestimonials[currentTestimonial].rating)}
                  </div>
                  
                  <blockquote className="text-2xl text-gray-800 dark:text-slate-200 leading-relaxed mb-8 italic">
                    "{currentTestimonials[currentTestimonial].content}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4">
                    <img 
                      src={currentTestimonials[currentTestimonial].image} 
                      alt={currentTestimonials[currentTestimonial].name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-slate-100">{currentTestimonials[currentTestimonial].name}</div>
                      <div className="text-gray-600 dark:text-slate-400">{currentTestimonials[currentTestimonial].role}</div>
                      <div className="text-blue-600 dark:text-blue-400 text-sm">{currentTestimonials[currentTestimonial].company}</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {currentTestimonials.map((_, index) => (
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

      {/* Main Content Edit Modal */}
      {isMainContentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Main Content</h2>
              </div>
              <button
                onClick={cancelMainContent}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Badge Text</label>
                  <input
                    type="text"
                    value={mainContentForm.badge}
                    onChange={(e) => setMainContentForm(prev => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Badge text..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Main Heading</label>
                  <input
                    type="text"
                    value={mainContentForm.heading}
                    onChange={(e) => setMainContentForm(prev => ({ ...prev, heading: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Main heading..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    value={mainContentForm.description}
                    onChange={(e) => setMainContentForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Description..."
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={cancelMainContent}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveMainContent}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Edit Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h2>
              </div>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Service Title</label>
                    </div>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Service title..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
                    </div>
                    <textarea
                      value={serviceForm.description}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Service description..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Image URL</label>
                    </div>
                    <input
                      type="url"
                      value={serviceForm.image}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Category</label>
                      <input
                        type="text"
                        value={serviceForm.category}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Manufacturing"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Price</label>
                      </div>
                      <input
                        type="text"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Starting at $10,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Duration</label>
                    </div>
                    <input
                      type="text"
                      value={serviceForm.duration}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="4-8 weeks"
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Features</label>
                      <button
                        type="button"
                        onClick={addFeature}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {serviceForm.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Feature description..."
                          />
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Edit Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
              </div>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Client name..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
                    <input
                      type="text"
                      value={testimonialForm.role}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Job title..."
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Company</label>
                  <input
                    type="text"
                    value={testimonialForm.company}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Company name..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Testimonial Content</label>
                  <textarea
                    value={testimonialForm.content}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                    placeholder="What did they say about your service..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Rating</label>
                    <select
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Image URL</label>
                    <input
                      type="url"
                      value={testimonialForm.image}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, image: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveTestimonial}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                {editingTestimonial ? 'Update Testimonial' : 'Add Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;