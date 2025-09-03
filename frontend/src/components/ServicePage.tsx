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
  File,
  Loader2,
  Shield
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import { API_URL as API_BASE_URL } from '../../config/api'


interface Service {
  _id?: string;
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
  _id?: string;
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
  services = [],
  testimonials = [],
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
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit states
  const [isMainContentModalOpen, setIsMainContentModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isServiceDetailModalOpen, setIsServiceDetailModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Current data states
  const [currentMainContent, setCurrentMainContent] = useState({
    badge,
    heading,
    description
  });
  const [currentServices, setCurrentServices] = useState<Service[]>(services);
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

  // Modal refs for outside click detection
  const mainContentModalRef = useRef<HTMLDivElement>(null);
  const serviceModalRef = useRef<HTMLDivElement>(null);
  const testimonialModalRef = useRef<HTMLDivElement>(null);
  const serviceDetailModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'service' | 'testimonial';
    id: string;
    name: string;
  } | null>(null);

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  const categories = ['All', ...Array.from(new Set(currentServices.map(s => s.category)))];
  const filteredServices = selectedCategory === 'All' 
    ? currentServices 
    : currentServices.filter(s => s.category === selectedCategory);

  // Check if user is moderator or admin
  const isModerator = isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin');

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
    fetchTestimonials(); // Add this line
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/services`);
      const servicesData = response.data.data.map((service: any) => ({
        ...service,
        id: service._id || service.id
      }));
      setCurrentServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/testimonials`);
      setCurrentTestimonials(response.data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    }
  };

  // Get auth token for authenticated requests
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMainContentModalOpen && mainContentModalRef.current && !mainContentModalRef.current.contains(event.target as Node)) {
        cancelMainContent();
      }
      if (isServiceModalOpen && serviceModalRef.current && !serviceModalRef.current.contains(event.target as Node)) {
        setIsServiceModalOpen(false);
      }
      if (isTestimonialModalOpen && testimonialModalRef.current && !testimonialModalRef.current.contains(event.target as Node)) {
        setIsTestimonialModalOpen(false);
      }
      if (isServiceDetailModalOpen && serviceDetailModalRef.current && !serviceDetailModalRef.current.contains(event.target as Node)) {
        setIsServiceDetailModalOpen(false);
        setSelectedService(null);
      }
      if (deleteModalOpen && deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setDeleteModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMainContentModalOpen, isServiceModalOpen, isTestimonialModalOpen, isServiceDetailModalOpen, deleteModalOpen]);

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
        description: "Please upload an image (JPEG, PNG, GIF, WebP).",
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
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit services."
      });
      return;
    }

    if (service) {
      setEditingService(service);
      setServiceForm({
        id: service.id,
        title: service.title,
        description: service.description,
        image: service.image,
        features: [...service.features],
        duration: service.duration,
        price: service.price,
        category: service.category
      });
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

  // Service detail modal handler
  const openServiceDetailModal = (service: Service) => {
    setSelectedService(service);
    setIsServiceDetailModalOpen(true);
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-60">
      <div ref={deleteModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
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

  const saveService = async () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit services."
      });
      return;
    }

    try {
      setSaving(true);
      const cleanedFeatures = serviceForm.features.filter(f => f.trim() !== '');
      const formData = new FormData();
      
      formData.append('title', serviceForm.title);
      formData.append('description', serviceForm.description);
      formData.append('duration', serviceForm.duration);
      formData.append('price', serviceForm.price);
      formData.append('category', serviceForm.category);
      cleanedFeatures.forEach((feature) => {
        formData.append('features', feature);
      });
      
      if (uploadedServiceFile) {
        formData.append('image', uploadedServiceFile);
      }
      
      let response;
      if (editingService) {
        response = await axios.put(
          `${API_BASE_URL}/services/${editingService.id}`, 
          formData, 
          getAuthHeaders()
        );
        toast.success("Service updated successfully");
      } else {
        response = await axios.post(
          `${API_BASE_URL}/services`, 
          formData, 
          getAuthHeaders()
        );
        toast.success("Service added successfully");
      }
      
      // Update local state with the response data
      const updatedService = response.data.data;
      if (editingService) {
        setCurrentServices(prev => prev.map(s => s.id === editingService.id ? {...updatedService, id: updatedService._id || updatedService.id} : s));
      } else {
        setCurrentServices(prev => [...prev, {...updatedService, id: updatedService._id || updatedService.id}]);
      }
      
      setIsServiceModalOpen(false);
      setEditingService(null);
      
      // Clean up object URL if created
      if (uploadedServiceFile) {
        URL.revokeObjectURL(serviceForm.image);
      }
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save service";
      toast.error(errorMessage);
      
      // Handle unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired or insufficient permissions");
        // Optionally trigger logout
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete services."
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/services/${id}`, getAuthHeaders());
      setCurrentServices(prev => prev.filter(s => s.id !== id));
      toast.error("Service deleted", {
        description: "The service has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete service";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteService = (id: string, name: string) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete services."
      });
      return;
    }

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
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit testimonials."
      });
      return;
    }

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

  const saveTestimonial = async () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit testimonials."
      });
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      
      formData.append('name', testimonialForm.name);
      formData.append('role', testimonialForm.role);
      formData.append('company', testimonialForm.company);
      formData.append('content', testimonialForm.content);
      formData.append('rating', testimonialForm.rating.toString());
      
      if (uploadedTestimonialFile) {
        formData.append('image', uploadedTestimonialFile);
      }
      
      let response;
      if (editingTestimonial && editingTestimonial._id) {
        response = await axios.put(
          `${API_BASE_URL}/testimonials/${editingTestimonial._id}`, 
          formData, 
          getAuthHeaders()
        );
        toast.success("Testimonial updated successfully");
      } else {
        response = await axios.post(
          `${API_BASE_URL}/testimonials`, 
          formData, 
          getAuthHeaders()
        );
        toast.success("Testimonial added successfully");
      }
      
      // Update local state
      const updatedTestimonial = response.data.data;
      if (editingTestimonial) {
        setCurrentTestimonials(prev => prev.map(t => 
          t._id === editingTestimonial._id ? updatedTestimonial : t
        ));
      } else {
        setCurrentTestimonials(prev => [...prev, updatedTestimonial]);
      }
      
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
      
      // Clean up object URL if created
      if (uploadedTestimonialFile) {
        URL.revokeObjectURL(testimonialForm.image);
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save testimonial";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete testimonials."
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/testimonials/${id}`, getAuthHeaders());
      setCurrentTestimonials(prev => prev.filter(t => t._id !== id));
      toast.error("Testimonial deleted", {
        description: "The testimonial has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete testimonial";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteTestimonial = (id: string, name: string) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete testimonials."
      });
      return;
    }

    setItemToDelete({ type: 'testimonial', id, name });
    setDeleteModalOpen(true);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it's a relative path starting with /uploads, prepend the backend URL
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = API_BASE_URL.replace('/api', '');
      return `${backendUrl}${imagePath}`;
    }
    
    return imagePath;
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
                  <div className="absolute top-2 right-2 z-20 flex gap-2">
                    <button
                      onClick={() => openServiceModal(service)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Edit Service"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDeleteService(service.id, service.title)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Service Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-full">
                      {service.category}
                    </span>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                    {service.features.length > 3 && (
                      <div className="text-sm text-gray-500 dark:text-slate-500">
                        +{service.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="text-gray-600 dark:text-slate-400 text-sm">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {service.duration}
                    </div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {service.price}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openServiceDetailModal(service)}
                    className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-slate-900">
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

          <div className="max-w-4xl mx-auto">
            <div ref={testimonialRef} className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 min-h-[300px]">
              {currentTestimonials.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500 dark:text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No testimonials yet</p>
                    {isModerator && (
                      <p className="text-sm mt-2">Click "Add Testimonial" to get started</p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {currentTestimonials.map((testimonial, index) => (
                    <div
                      key={testimonial._id || testimonial.name}
                      className={`absolute inset-0 p-8 transition-all duration-500 ease-in-out ${
                        index === currentTestimonial
                          ? 'opacity-100 translate-y-0 z-10'
                          : 'opacity-0 translate-y-8 pointer-events-none z-0'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-start gap-6 h-full">
                        <img
                          src={getImageUrl(testimonial.image)}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 dark:text-slate-100 truncate">
                                {testimonial.name}
                              </h4>
                              <p className="text-gray-600 dark:text-slate-400 text-sm truncate">
                                {testimonial.role}, {testimonial.company}
                              </p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              {renderStars(testimonial.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                            "{testimonial.content}"
                          </p>
                        </div>
                      </div>
                      
                      {/* Edit Controls */}
                      {isModerator && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => openTestimonialModal(testimonial)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                            title="Edit Testimonial"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteTestimonial(testimonial._id || '', testimonial.name)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Navigation Dots */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
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
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Modal */}
      {isMainContentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={mainContentModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Main Content</h3>
              <button
                onClick={cancelMainContent}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={mainContentForm.badge}
                  onChange={(e) => setMainContentForm(prev => ({ ...prev, badge: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Heading
                </label>
                <input
                  type="text"
                  value={mainContentForm.heading}
                  onChange={(e) => setMainContentForm(prev => ({ ...prev, heading: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={mainContentForm.description}
                  onChange={(e) => setMainContentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={cancelMainContent}
                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveMainContent}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div ref={serviceModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Service Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
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
                    accept="image/*"
                    onChange={handleServiceFileInputChange}
                  />
                  
                  {serviceForm.image ? (
                    <div className="space-y-4">
                      <img
                        src={serviceForm.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl mx-auto"
                      />
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {uploadedServiceFile?.name || 'Current image'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-slate-400">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                          SVG, PNG, JPG or GIF (max. 200MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {serviceForm.features.length > 1 && (
                        <button
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addFeature}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Feature
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingService ? 'Update Service' : 'Add Service'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {isServiceDetailModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div ref={serviceDetailModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedService.title}</h3>
              <button
                onClick={() => {
                  setIsServiceDetailModalOpen(false);
                  setSelectedService(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
              
              <div>
                <div className="mb-6">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {selectedService.category}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {selectedService.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <h4 className="font-bold text-gray-900 dark:text-slate-100">Key Features</h4>
                  <div className="space-y-2">
                    {selectedService.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-slate-400">Duration</div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">{selectedService.duration}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-slate-400">Price</div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">{selectedService.price}</div>
                  </div>
                </div>
                
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={testimonialModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </h3>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Client Photo
                </label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
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
                    accept="image/*"
                    onChange={handleTestimonialFileInputChange}
                  />
                  
                  {testimonialForm.image ? (
                    <div className="space-y-4">
                      <img
                        src={testimonialForm.image}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl mx-auto"
                      />
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {uploadedTestimonialFile?.name || 'Current image'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-slate-400">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                          SVG, PNG, JPG or GIF (max. 200MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={testimonialForm.company}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setTestimonialForm(prev => ({ ...prev, rating: star }))}
                      className="p-1 hover:scale-110 transition-transform duration-200"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= testimonialForm.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Testimonial Content
                </label>
                <textarea
                  rows={4}
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveTestimonial}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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