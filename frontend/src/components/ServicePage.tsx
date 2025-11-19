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
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL as API_BASE_URL } from '../../config/api';
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

const ServicePage = ({
  badge: initialBadge,
  heading: initialHeading,
  description: initialDescription,
  services: initialServices = [],
  testimonials: initialTestimonials = [],
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
  const { t, currentLanguage } = useTranslation();
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

  const [currentPage, setCurrentPage] = useState(1);
  const SERVICES_PER_PAGE = 6;

  // Current data states
  const [currentMainContent, setCurrentMainContent] = useState({
    badge: t('services.badge'),
    heading: t('services.heading'),
    description: t('services.description')
  });
  const [currentServices, setCurrentServices] = useState<Service[]>([]);
  const [currentTestimonials, setCurrentTestimonials] = useState<Testimonial[]>([]);

  // Form data states
  const [mainContentForm, setMainContentForm] = useState<MainContentFormData>({
    badge: t('services.badge'),
    heading: t('services.heading'),
    description: t('services.description')
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

  const MAX_FILE_SIZE = 200 * 1024 * 1024;
  const ACCEPTED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ];

  const categories = ['All', ...Array.from(new Set(currentServices.map(s => s.category)))];

  const allFilteredServices = selectedCategory === 'All' 
    ? currentServices 
    : currentServices.filter(s => s.category === selectedCategory);

  const totalPages = Math.ceil(allFilteredServices.length / SERVICES_PER_PAGE);
  const startIndex = (currentPage - 1) * SERVICES_PER_PAGE;
  const filteredServices = allFilteredServices.slice(startIndex, startIndex + SERVICES_PER_PAGE);

  const isModerator = isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin');

  // Fetch services and testimonials on component mount and language change
  useEffect(() => {
    fetchServices();
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchServices();
      fetchTestimonials();
    }
  }, [currentLanguage]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/services/translated`, {
        params: { lang: currentLanguage }
      });

      const servicesData = response.data.data.map((service: any) => ({
        ...service,
        id: service._id || service.id
      }));
      setCurrentServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(t('services.fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/testimonials/translated`, {
        params: { lang: currentLanguage }
      });
      setCurrentTestimonials(response.data.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error(t('services.testimonials_fetch_error'));
    }
  };

  // Update translations when language changes
  useEffect(() => {
    setCurrentMainContent({
      badge: t('services.badge'),
      heading: t('services.heading'),
      description: t('services.description')
    });
    
    setMainContentForm({
      badge: t('services.badge'),
      heading: t('services.heading'),
      description: t('services.description')
    });
  }, [t, currentLanguage]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };
  };

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

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t('services.file_too_large'), {
        description: `File size must be less than 200MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
      });
      return false;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(t('services.invalid_file_type'), {
        description: t('services.supported_formats'),
      });
      return false;
    }

    return true;
  };

  const handleServiceFileSelect = (file: File) => {
    if (!validateFile(file)) return;
    setUploadedServiceFile(file);
    const fileUrl = URL.createObjectURL(file);
    setServiceForm(prev => ({ ...prev, image: fileUrl }));
    toast.success(t('services.file_upload_success'), {
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

  const handleTestimonialFileSelect = (file: File) => {
    if (!validateFile(file)) return;
    setUploadedTestimonialFile(file);
    const fileUrl = URL.createObjectURL(file);
    setTestimonialForm(prev => ({ ...prev, image: fileUrl }));
    toast.success(t('services.file_upload_success'), {
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

  const openMainContentModal = () => {
    setMainContentForm(currentMainContent);
    setIsMainContentModalOpen(true);
  };

  const saveMainContent = () => {
    setCurrentMainContent(mainContentForm);
    setIsMainContentModalOpen(false);
    toast.success(t('services.main_content_updated'));
  };

  const cancelMainContent = () => {
    setMainContentForm(currentMainContent);
    setIsMainContentModalOpen(false);
  };

  const openServiceModal = (service?: Service) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_edit')
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

  const openServiceDetailModal = (service: Service) => {
    setSelectedService(service);
    setIsServiceDetailModalOpen(true);
  };

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
        description: t('services.access_denied_edit')
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
        
        const translationInfo = response.data.translationInfo;
        toast.success(t('services.service_updated'), {
          description: translationInfo?.message || "Service updated and translated automatically."
        });
      } else {
        response = await axios.post(
          `${API_BASE_URL}/services`, 
          formData, 
          getAuthHeaders()
        );
        
        const translationInfo = response.data.translationInfo;
        toast.success(t('services.service_added'), {
          description: translationInfo?.message || "Service added and translated automatically."
        });
      }
      
      await fetchServices();
      setIsServiceModalOpen(false);
      setEditingService(null);
      
      if (uploadedServiceFile) {
        URL.revokeObjectURL(serviceForm.image);
      }
    } catch (error: any) {
      console.error('Error saving service:', error);
      const errorMessage = error.response?.data?.message || error.message || t('services.save_service_error');
      toast.error(errorMessage);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error(t('services.session_expired'));
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete')
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/services/${id}`, getAuthHeaders());
      await fetchServices();
      toast.error(t('services.service_deleted'), {
        description: "The service has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting service:', error);
      const errorMessage = error.response?.data?.message || error.message || t('services.delete_service_error');
      toast.error(errorMessage);
    }
  };

  const confirmDeleteService = (id: string, name: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete')
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

  const openTestimonialModal = (testimonial?: Testimonial) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_edit_testimonials')
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
        description: t('services.access_denied_edit_testimonials')
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
        
        const translationInfo = response.data.translationInfo;
        toast.success(t('services.testimonial_updated'), {
          description: translationInfo?.message || "Testimonial updated and translated automatically."
        });
      } else {
        response = await axios.post(
          `${API_BASE_URL}/testimonials`, 
          formData, 
          getAuthHeaders()
        );
        
        const translationInfo = response.data.translationInfo;
        toast.success(t('services.testimonial_added'), {
          description: translationInfo?.message || "Testimonial added and translated automatically."
        });
      }
      
      await fetchTestimonials();
      setIsTestimonialModalOpen(false);
      setEditingTestimonial(null);
      
      if (uploadedTestimonialFile) {
        URL.revokeObjectURL(testimonialForm.image);
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || t('services.save_testimonial_error');
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete_testimonials')
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/testimonials/${id}`, getAuthHeaders());
      await fetchTestimonials();
      toast.error(t('services.testimonial_deleted'), {
        description: "The testimonial has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting testimonial:', error);
      const errorMessage = error.response?.data?.message || error.message || t('services.delete_testimonial_error');
      toast.error(errorMessage);
    }
  };

  const confirmDeleteTestimonial = (id: string, name: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('services.access_denied_delete_testimonials')
      });
      return;
    }

    setItemToDelete({ type: 'testimonial', id, name });
    setDeleteModalOpen(true);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {isModerator && (
          <button
            onClick={openMainContentModal}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-900 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title={t('services.edit_main_content')}
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
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{t('services.our_services')}</h2>
            {isModerator && (
              <button
                onClick={() => openServiceModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('services.add_service')}
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
          <div className="space-y-8">
            {allFilteredServices.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="w-16 h-16 text-gray-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">
                  {t('services.no_services')}
                </h3>
                <p className="text-gray-500 dark:text-slate-500">
                  {selectedCategory === 'All' 
                    ? t('services.no_services_available')
                    : `No services found in the "${selectedCategory}" category.`}
                </p>
                {isModerator && (
                  <button
                    onClick={() => openServiceModal()}
                    className="mt-4 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Add First Service
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid lg:grid-cols-3 gap-8">
                  {filteredServices.map((service) => (
                    <div 
                      key={service.id}
                      className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2"
                    >
                      {isModerator && (
                        <div className="absolute top-2 right-2 z-20 flex gap-2">
                          <button
                            onClick={() => openServiceModal(service)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                            title={t('services.edit_service')}
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

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {service.description}
                        </p>
                        
                        <div className="space-y-2 mb-6">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-gray-600 dark:text-slate-400">{feature}</span>
                            </div>
                          ))}
                          {service.features.length > 3 && (
                            <div className="text-sm text-gray-500 dark:text-slate-500">
                              +{service.features.length - 3} {t('services.more')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-gray-600 dark:text-slate-400 text-sm">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {service.duration}
                          </div>
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {service.price}
                          </div>
                        </div>

                        <button
                          onClick={() => openServiceDetailModal(service)}
                          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          {t('services.view_details')}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <PaginationComponent 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />

                <div className="text-center text-gray-500 dark:text-slate-400 text-sm">
                  Showing {startIndex + 1}-{Math.min(startIndex + SERVICES_PER_PAGE, allFilteredServices.length)} of {allFilteredServices.length} services
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-slate-900">
        <div className="container px-6 mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{t('services.client_testimonials')}</h2>
            {isModerator && (
              <button
                onClick={() => openTestimonialModal()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('services.add_testimonial')}
              </button>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            <div ref={testimonialRef} className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 min-h-[300px]">
              {currentTestimonials.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500 dark:text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('services.no_testimonials_available')}</p>
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
                      
                      {isModerator && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => openTestimonialModal(testimonial)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                            title={t('services.edit_testimonial')}
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('services.edit_main_content')}</h3>
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
                {t('common.cancel')}
              </button>
              <button
                onClick={saveMainContent}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}






      {/* Service Modal - Add/Edit */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div ref={serviceModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
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
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {t('services.service_image')}
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
                    accept="image/*,video/*"
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
                        {t('services.click_to_change')}
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
                          {t('services.supported_formats')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-500">
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
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {t('services.description')}
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
                    {t('services.duration')}
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
                    {t('services.price')}
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
                  {t('services.features')}
                </label>
                <div className="space-y-2">
                  {serviceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                        placeholder={t('services.feature_placeholder')}
                      />
                      {serviceForm.features.length > 1 && (
                        <button onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-500 dark:bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addFeature}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                {t('services.add_feature')}
              </button>
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
                <button
                  onClick={() => window.location.href = '/contact'}
                  className="flex-1 py-4 bg-blue-600 dark:bg-blue-500 text-white text-center rounded-lg font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                >
                  {t('services.get_started')}
                </button>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('services.ready_to_start')}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t('services.cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/contact'}
                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t('services.get_in_touch')}
              </button>
              <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300">
                {t('services.call_now')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
};

export default ServicePage;