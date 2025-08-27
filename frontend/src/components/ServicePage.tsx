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
  Settings,
  Upload,
  File
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

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

  // Drag and drop states
  const [isDraggingService, setIsDraggingService] = useState(false);
  const [isDraggingTestimonial, setIsDraggingTestimonial] = useState(false);
  const [uploadedServiceFile, setUploadedServiceFile] = useState<File | null>(null);
  const [uploadedTestimonialFile, setUploadedTestimonialFile] = useState<File | null>(null);
  const serviceFileInputRef = useRef<HTMLInputElement>(null);
  const testimonialFileInputRef = useRef<HTMLInputElement>(null);


  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'service' | 'testimonial';
    id: string;
    name: string;
  } | null>(null);

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/mov', 'video/avi'];

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

  // File validation function
  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: `File size must be less than 200MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
      });
      return false;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, MOV, AVI).",
      });
      return false;
    }

    return true;
  };

  // Service image handlers
  const handleServiceFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setUploadedServiceFile(file);
    
    // Create a temporary URL for preview
    const fileUrl = URL.createObjectURL(file);
    setServiceForm(prev => ({ ...prev, image: fileUrl }));

    toast.success("File uploaded successfully", {
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) is ready to use.`,
    });
  };

  const handleServiceDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingService(true);
  };

  const handleServiceDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingService(false);
  };

  const handleServiceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingService(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleServiceFileSelect(files[0]);
    }
  };

  const handleServiceFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleServiceFileSelect(files[0]);
    }
  };

  // Testimonial image handlers
  const handleTestimonialFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setUploadedTestimonialFile(file);
    
    // Create a temporary URL for preview
    const fileUrl = URL.createObjectURL(file);
    setTestimonialForm(prev => ({ ...prev, image: fileUrl }));

    toast.success("File uploaded successfully", {
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) is ready to use.`,
    });
  };

  const handleTestimonialDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTestimonial(true);
  };

  const handleTestimonialDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTestimonial(false);
  };

  const handleTestimonialDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingTestimonial(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleTestimonialFileSelect(files[0]);
    }
  };

  const handleTestimonialFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleTestimonialFileSelect(files[0]);
    }
  };

  // Main Content handlers
  const openMainContentModal = () => {
    setMainContentForm(currentMainContent);
    setIsMainContentModalOpen(true);
  };

  const saveMainContent = () => {
    setCurrentMainContent(mainContentForm);
    setIsMainContentModalOpen(false);
    toast.success("Main content updated successfully");
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
      setUploadedServiceFile(null);
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
      setUploadedServiceFile(null);
    }
    setIsServiceModalOpen(true);
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-60">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Confirm Deletion
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete {itemToDelete?.name || 'this item'}? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (itemToDelete) {
                if (itemToDelete.type === 'service') {
                  deleteService(itemToDelete.id);
                } else if (itemToDelete.type === 'testimonial') {
                  deleteTestimonial(itemToDelete.id);
                }
              }
              setDeleteModalOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const saveService = () => {
    const cleanedFeatures = serviceForm.features.filter(f => f.trim() !== '');
    const updatedService = { ...serviceForm, features: cleanedFeatures };

    if (editingService) {
      setCurrentServices(prev => prev.map(s => s.id === editingService.id ? updatedService : s));
      toast.success("Service updated successfully");
    } else {
      setCurrentServices(prev => [...prev, updatedService]);
      toast.success("Service added successfully");
    }
    setIsServiceModalOpen(false);
    setEditingService(null);
    
    // Clean up object URL if created
    if (uploadedServiceFile) {
      URL.revokeObjectURL(serviceForm.image);
    }
  };

  const deleteService = (id: string) => {
    setCurrentServices(prev => prev.filter(s => s.id !== id));
    toast.error("Service deleted", {
      description: "The service has been permanently removed.",
    });
  };

  const confirmDeleteService = (id: string, name: string) => {
    setItemToDelete({ type: 'service', id, name });
    setDeleteModalOpen(true);
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
      setUploadedTestimonialFile(null);
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
      setUploadedTestimonialFile(null);
    }
    setIsTestimonialModalOpen(true);
  };

  const saveTestimonial = () => {
    if (editingTestimonial) {
      setCurrentTestimonials(prev => prev.map(t => 
        t.name === editingTestimonial.name ? testimonialForm : t
      ));
      toast.success("Testimonial updated successfully");
    } else {
      setCurrentTestimonials(prev => [...prev, testimonialForm]);
      toast.success("Testimonial added successfully");
    }
    setIsTestimonialModalOpen(false);
    setEditingTestimonial(null);
    
    // Clean up object URL if created
    if (uploadedTestimonialFile) {
      URL.revokeObjectURL(testimonialForm.image);
    }
  };

  const deleteTestimonial = (name: string) => {
    setCurrentTestimonials(prev => prev.filter(t => t.name !== name));
    toast.error("Testimonial deleted", {
      description: "The testimonial has been permanently removed.",
    });
  };

  const confirmDeleteTestimonial = (name: string) => {
    setItemToDelete({ type: 'testimonial', id: name, name });
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {deleteModalOpen && <DeleteConfirmationModal />}
      
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
                      onClick={() => confirmDeleteService(service.id, service.title)}
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
              { step: "03", title: "Fabrication", desc: "Precision manufacturing using advanced technology and quality materials" },
              { step: "04", title: "Installation", desc: "Professional on-site assembly and commissioning by expert teams" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-300 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          
          {/* Testimonials Header with Add Button */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Client Testimonials</h2>
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
            <div 
              ref={testimonialRef}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 lg:p-12 border border-gray-100 dark:border-slate-700"
            >
              {currentTestimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`transition-all duration-500 ease-in-out ${
                    index === currentTestimonial ? 'opacity-100 translate-y-0' : 'opacity-0 absolute translate-y-8 pointer-events-none'
                  }`}
                >
                  {/* Edit Controls */}
                  {isModerator && (
                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                      <button
                        onClick={() => openTestimonialModal(testimonial)}
                        className="p-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors text-blue-600 dark:text-blue-400"
                        title="Edit Testimonial"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteTestimonial(testimonial.name)}
                        className="p-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm rounded-lg hover:bg-white dark:hover:bg-slate-600 transition-colors text-red-600 dark:text-red-400"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100">{testimonial.name}</h4>
                      <p className="text-gray-600 dark:text-slate-400">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-slate-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </blockquote>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {currentTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 dark:bg-blue-500 scale-125' 
                      : 'bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_30%,rgba(0,0,0,0.2),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Transform Your Operations?</h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-12">
              Let's discuss how our industrial solutions can optimize your processes and drive efficiency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-blue-600 dark:text-blue-700 rounded-2xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Schedule Consultation
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white hover:text-blue-600 dark:hover:text-blue-700 transition-all duration-300 transform hover:scale-105">
                Request Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {/* Main Content Modal */}
      {isMainContentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Main Content</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Badge Text</label>
                <input
                  type="text"
                  value={mainContentForm.badge}
                  onChange={(e) => setMainContentForm({...mainContentForm, badge: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Heading</label>
                <input
                  type="text"
                  value={mainContentForm.heading}
                  onChange={(e) => setMainContentForm({...mainContentForm, heading: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={mainContentForm.description}
                  onChange={(e) => setMainContentForm({...mainContentForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-4">
              <button
                onClick={cancelMainContent}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveMainContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({...serviceForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration</label>
                <input
                  type="text"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price</label>
                <input
                  type="text"
                  value={serviceForm.price}
                  onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Features</label>
                <div className="space-y-2">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                        placeholder="Enter feature"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addFeature}
                  className="mt-2 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500"
                >
                  Add Feature
                </button>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Service Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDraggingService 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                  onDragOver={handleServiceDragOver}
                  onDragLeave={handleServiceDragLeave}
                  onDrop={handleServiceDrop}
                  onClick={() => serviceFileInputRef.current?.click()}
                >
                  <input
                    ref={serviceFileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleServiceFileInputChange}
                    accept="image/*,video/*"
                  />
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Upload an image or video (max 200MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                {serviceForm.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700">
                      {serviceForm.image.startsWith('data:video') || serviceForm.image.endsWith('.mp4') || serviceForm.image.endsWith('.webm') || serviceForm.image.endsWith('.mov') || serviceForm.image.endsWith('.avi') ? (
                        <video 
                          src={serviceForm.image} 
                          className="w-full h-48 object-cover"
                          controls
                        />
                      ) : (
                        <img 
                          src={serviceForm.image} 
                          alt="Preview" 
                          className="w-full h-48 object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-4">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                <input
                  type="text"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                <textarea
                  rows={4}
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({...testimonialForm, rating: star})}
                      className="text-2xl focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${star <= testimonialForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDraggingTestimonial 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                  }`}
                  onDragOver={handleTestimonialDragOver}
                  onDragLeave={handleTestimonialDragLeave}
                  onDrop={handleTestimonialDrop}
                  onClick={() => testimonialFileInputRef.current?.click()}
                >
                  <input
                    ref={testimonialFileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleTestimonialFileInputChange}
                    accept="image/*"
                  />
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Drag and drop or click to upload
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Upload a profile image (max 200MB)
                      </p>
                    </div>
                  </div>
                </div>
                
                {testimonialForm.image && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                    <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-slate-700 w-32 h-32">
                      <img 
                        src={testimonialForm.image} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-4">
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveTestimonial}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
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