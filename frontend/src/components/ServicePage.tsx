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
import { useTranslation } from '../../context/TranslationContext';

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


const PaginationComponent = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void; 
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center mt-12 space-x-2">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === 1
            ? 'text-gray-400 dark:text-slate-500 cursor-not-allowed'
            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[40px] ${
            page === currentPage
              ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
              : page === '...'
              ? 'text-gray-400 dark:text-slate-500 cursor-default'
              : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentPage === totalPages
            ? 'text-gray-400 dark:text-slate-500 cursor-not-allowed'
            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

const ServicePage = (props: ServicePageProps) => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const {
    badge = t('services.badge'),
    heading = t('services.heading'),
    description = t('services.description'),
    services = [],
    testimonials = [],
    stats = [
    {
      number: "50+",
      label: t('services.projects_completed'),
      icon: <Target className="size-6" />
    },
    {
      number: "ISO 9001",
      label: t('services.iso_certified'),
      icon: <Award className="size-6" />
    },
    {
      number: "20+",
      label: t('services.years_experience'),
      icon: <Clock className="size-6" />
    },
    {
      number: "50+",
      label: t('services.expert_team'),
      icon: <Users className="size-6" />
    }
  ]
  } = props;
  
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

  const [currentPage, setCurrentPage] = useState(1);
  const SERVICES_PER_PAGE = 6;

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
  const ACCEPTED_TYPES = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',

    // Videos
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',   // .mov
    'video/x-msvideo',   // .avi
    'video/x-matroska',  // .mkv
  ];


  const categories = ['All', ...Array.from(new Set(currentServices.map(s => s.category)))];

  const allFilteredServices = selectedCategory === 'All' 
  ? currentServices 
  : currentServices.filter(s => s.category === selectedCategory);

  // Pagination logic
  const totalPages = Math.ceil(allFilteredServices.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const filteredServices = allFilteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);

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
      toast.error(t('common.error'), {
        description: t('services.fetch_error') || 'Failed to load services'
      });
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
      toast.error(t('common.error'), {
        description: t('services.testimonials_fetch_error') || 'Failed to load testimonials'
      });
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

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
      toast.error(t('common.error'), {
        description: t('services.file_too_large') || `File size must be less than 200MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
      });
      return false;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(t('common.error'), {
        description: t('services.invalid_file_type') || "Please upload an image (JPEG, PNG, GIF, WebP).",
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

    toast.success(t('common.success'), {
      description: t('services.file_upload_success') || `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) is ready to use.`,
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

    toast.success(t('common.success'), {
      description: t('services.file_upload_success') || `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) is ready to use.`,
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
    toast.success(t('common.success'), {
      description: t('services.main_content_updated') || "Main content updated successfully"
    });
  };

  const cancelMainContent = () => {
    setMainContentForm(currentMainContent);
    setIsMainContentModalOpen(false);
  };

  // Service handlers
  const openServiceModal = (service?: Service) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_edit') || "You need moderator or admin privileges to edit services."
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
          {t('services.confirm_deletion')}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('services.delete_confirmation_message')} {itemToDelete?.name || t('services.this_item')}? 
          {t('services.action_cannot_undone')}
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
          >
            {t('common.cancel')}
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
            {t('common.delete')}
          </button>
        </div>
      </div>
    </div>
  );

  const saveService = async () => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_edit') || "You need moderator or admin privileges to edit services."
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
        toast.success(t('common.success'), {
          description: t('services.service_updated') || "Service updated successfully"
        });
      } else {
        response = await axios.post(
          `${API_BASE_URL}/services`, 
          formData, 
          getAuthHeaders()
        );
        toast.success(t('common.success'), {
          description: t('services.service_added') || "Service added successfully"
        });
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
      const errorMessage = error.response?.data?.message || error.message || t('services.save_service_error') || "Failed to save service";
      toast.error(t('common.error'), {
        description: errorMessage
      });
      
      // Handle unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(t('common.error'), {
          description: t('services.session_expired') || "Session expired or insufficient permissions"
        });
        // Optionally trigger logout
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete') || "You need moderator or admin privileges to delete services."
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/services/${id}`, getAuthHeaders());
      setCurrentServices(prev => prev.filter(s => s.id !== id));
      toast.error(t('common.success'), {
        description: t('services.service_deleted') || "The service has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      const errorMessage = error.response?.data?.message || error.message || t('services.delete_service_error') || "Failed to delete service";
      toast.error(t('common.error'), {
        description: errorMessage
      });
    }
  };

  const confirmDeleteService = (id: string, name: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete') || "You need moderator or admin privileges to delete services."
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
      toast.error(t('common.error'), {
        description: t('services.access_denied_edit_testimonials') || "You need moderator or admin privileges to edit testimonials."
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
      toast.error(t('common.error'), {
        description: t('services.access_denied_edit_testimonials') || "You need moderator or admin privileges to edit testimonials."
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
        toast.success(t('common.success'), {
          description: t('services.testimonial_updated') || "Testimonial updated successfully"
        });
      } else {
        response = await axios.post(
          `${API_BASE_URL}/testimonials`, 
          formData, 
          getAuthHeaders()
        );
        toast.success(t('common.success'), {
          description: t('services.testimonial_added') || "Testimonial added successfully"
        });
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
      const errorMessage = error.response?.data?.message || error.message || t('services.save_testimonial_error') || "Failed to save testimonial";
      toast.error(t('common.error'), {
        description: errorMessage
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete_testimonials') || "You need moderator or admin privileges to delete testimonials."
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/testimonials/${id}`, getAuthHeaders());
      setCurrentTestimonials(prev => prev.filter(t => t._id !== id));
      toast.error(t('common.success'), {
        description: t('services.testimonial_deleted') || "The testimonial has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || t('services.delete_testimonial_error') || "Failed to delete testimonial";
      toast.error(t('common.error'), {
        description: errorMessage
      });
    }
  };

  const confirmDeleteTestimonial = (id: string, name: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete_testimonials') || "You need moderator or admin privileges to delete testimonials."
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
        <span className="ml-2 text-gray-600 dark:text-slate-400">{t('common.loading')}</span>
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
            title={t('common.edit')}
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{t('services.our_services')}</h2>
            {isModerator && (
              <button
                onClick={() => openServiceModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                {t('services.add_service')}
              </button>
            )}
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-md hover:shadow-lg border border-gray-200 dark:border-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredServices.map((service, index) => (
              <div 
                key={service.id} 
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={getImageUrl(service.image)} 
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Edit/Delete Buttons */}
                  {isModerator && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openServiceModal(service);
                        }}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors shadow-lg"
                        title={t('common.edit')}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteService(service.id, service.title);
                        }}
                        className="p-2 bg-red-500/90 backdrop-blur-sm rounded-lg text-white hover:bg-red-600 transition-colors shadow-lg"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                  
                  <p className="text-gray-600 dark:text-slate-300 mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {service.price}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full text-xs font-medium">
                        +{service.features.length - 3} {t('services.more')}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => openServiceDetailModal(service)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {t('services.view_details')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <PaginationComponent 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container px-6 mx-auto">
          
          {/* Testimonials Header with Add Button */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{t('services.client_testimonials')}</h2>
            {isModerator && (
              <button
                onClick={() => openTestimonialModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                {t('services.add_testimonial')}
              </button>
            )}
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div 
              ref={testimonialRef}
              className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 lg:p-12"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-bl-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-yellow-500/10 dark:from-green-400/20 dark:to-yellow-400/20 rounded-tr-3xl" />
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                  {/* Testimonial Image */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img 
                        src={getImageUrl(currentTestimonials[currentTestimonial]?.image)} 
                        alt={currentTestimonials[currentTestimonial]?.name}
                        className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover shadow-lg border-4 border-white dark:border-slate-700"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-blue-600 dark:bg-blue-500 rounded-full p-2 shadow-lg">
                        <div className="w-6 h-6 bg-white dark:bg-slate-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-500 text-lg font-bold">"</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start mb-4">
                      {renderStars(currentTestimonials[currentTestimonial]?.rating || 5)}
                    </div>
                    
                    <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-slate-300 leading-relaxed mb-6 italic">
                      "{currentTestimonials[currentTestimonial]?.content || t('services.no_testimonials_available')}"
                    </blockquote>
                    
                    <div>
                      <div className="font-bold text-gray-900 dark:text-slate-100 text-lg">
                        {currentTestimonials[currentTestimonial]?.name || t('services.default_client_name')}
                      </div>
                      <div className="text-gray-600 dark:text-slate-400">
                        {currentTestimonials[currentTestimonial]?.role || t('services.default_client_role')} 
                        {currentTestimonials[currentTestimonial]?.company && (
                          <> · {currentTestimonials[currentTestimonial]?.company}</>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Testimonial Navigation */}
                <div className="flex justify-center lg:justify-end mt-8 lg:mt-0 lg:absolute lg:bottom-8 lg:right-8">
                  <div className="flex items-center gap-4">
                    {/* Edit/Delete Buttons */}
                    {isModerator && currentTestimonials.length > 0 && (
                      <div className="flex gap-2 mr-4">
                        <button
                          onClick={() => openTestimonialModal(currentTestimonials[currentTestimonial])}
                          className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg"
                          title={t('common.edit')}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDeleteTestimonial(
                            currentTestimonials[currentTestimonial]._id!, 
                            currentTestimonials[currentTestimonial].name
                          )}
                          className="p-2 bg-red-500 dark:bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-600 transition-colors shadow-lg"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t('services.ready_to_start')}</h2>
            <p className="text-blue-100 text-xl mb-8 max-w-2xl mx-auto">
              {t('services.cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {t('services.get_in_touch')}
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 font-bold rounded-lg hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('services.call_now')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Main Content Modal */}
      {isMainContentModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={mainContentModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('services.edit_main_content')}
                </h3>
                <button
                  onClick={cancelMainContent}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {t('services.badge_text')}
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
                  {t('services.heading_text')}
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
                  {t('services.description_text')}
                </label>
                <textarea
                  value={mainContentForm.description}
                  onChange={(e) => setMainContentForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-4">
              <button
                onClick={cancelMainContent}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={saveMainContent}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={serviceModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingService ? t('services.edit_service') : t('services.add_new_service')}
                </h3>
                <button
                  onClick={() => setIsServiceModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Service Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-4">
                  {t('services.service_image')}
                </label>
                
                <div
                  onDragOver={handleServiceDragOver}
                  onDragLeave={handleServiceDragLeave}
                  onDrop={handleServiceDrop}
                  onClick={() => serviceFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDraggingService
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <input
                    type="file"
                    ref={serviceFileInputRef}
                    onChange={handleServiceFileInputChange}
                    className="hidden"
                    accept="image/*,video/*"
                  />
                  
                  {serviceForm.image ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-32 h-32 rounded-lg overflow-hidden">
                        {serviceForm.image.startsWith('blob:') || serviceForm.image.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) ? (
                          <video 
                            src={serviceForm.image} 
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <img 
                            src={serviceForm.image} 
                            alt="Service preview"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {t('services.click_to_change')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                          {t('services.drop_image_here')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {t('services.supported_formats')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                          {t('services.max_file_size')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('services.service_title')}
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
                    {t('services.category')}
                  </label>
                  <input
                    type="text"
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="e.g., Web Development, Marketing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {t('services.description')}
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('services.duration')}
                  </label>
                  <input
                    type="text"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="e.g., 2-4 weeks"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('services.price')}
                  </label>
                  <input
                    type="text"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="e.g., $1,500 - $3,000"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    {t('services.features')}
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('services.add_feature')}
                  </button>
                </div>
                
                <div className="space-y-3">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder={t('services.feature_placeholder')}
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-500 dark:bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-4">
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={saveService}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {isServiceDetailModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={serviceDetailModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={getImageUrl(selectedService.image)} 
                alt={selectedService.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => {
                  setIsServiceDetailModalOpen(false);
                  setSelectedService(null);
                }}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {selectedService.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedService.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {selectedService.price}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed mb-8">
                {selectedService.description}
              </p>
              
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                  {t('services.key_features')}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedService.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Link
                  to="/contact"
                  className="flex-1 py-4 bg-blue-600 dark:bg-blue-500 text-white text-center rounded-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('services.get_started')}
                </Link>
                <button className="px-6 py-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  {t('services.download_brochure')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Testimonial Modal */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={testimonialModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingTestimonial ? t('services.edit_testimonial') : t('services.add_new_testimonial')}
                </h3>
                <button
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Testimonial Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-4">
                  {t('services.client_photo')}
                </label>
                
                <div
                  onDragOver={handleTestimonialDragOver}
                  onDragLeave={handleTestimonialDragLeave}
                  onDrop={handleTestimonialDrop}
                  onClick={() => testimonialFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    isDraggingTestimonial
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <input
                    type="file"
                    ref={testimonialFileInputRef}
                    onChange={handleTestimonialFileInputChange}
                    className="hidden"
                    accept="image/*"
                  />
                  
                  {testimonialForm.image ? (
                    <div className="space-y-4">
                      <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden">
                        <img 
                          src={testimonialForm.image} 
                          alt="Client preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {t('services.click_to_change_photo')}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">
                          {t('services.drop_photo_here')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-slate-400">
                          {t('services.supported_image_formats')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                          {t('services.max_file_size')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {t('services.client_name')}
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
                    {t('services.role')}
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
                  {t('services.company')}
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
                  {t('services.rating')}
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm(prev => ({ ...prev, rating: star }))}
                      className="p-2 hover:scale-110 transition-transform duration-200"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= testimonialForm.rating 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {t('services.testimonial_content')}
                </label>
                <textarea
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  placeholder={t('services.testimonial_placeholder')}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-4">
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={saveTestimonial}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? t('common.saving') : t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePage;