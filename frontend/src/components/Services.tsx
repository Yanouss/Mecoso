import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Trash2, Plus, X, Save, Image, Type, FileText, Grid3X3, Upload, File, Loader2, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL as API_BASE_URL } from '../../config/api';

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
  order?: number;
}

interface ServicesCarouselProps {
  heading?: string;
  description?: string;
  isModerator?: boolean;
}

type ModalMode = 'add' | 'edit' | 'delete' | 'manage' | 'detail' | null;

interface ServiceFormData {
  title: string;
  description: string;
  image: string;
  features: string[];
  duration: string;
  price: string;
  category: string;
}

const ServicesCarousel = ({
  heading = "Our Core Services",
  description = "MECOSO delivers complete industrial solutions. From design and fabrication to installation and maintenance. Serving the mining, energy, and heavy industry sectors with a focus on quality, safety, and innovation.",
  isModerator: initialIsModerator = false,
}: ServicesCarouselProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    image: '',
    features: [''],
    duration: '',
    price: '',
    category: ''
  });
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated } = useAuth();
  const isModerator = initialIsModerator || (isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin'));

  const MAX_FILE_SIZE = 200 * 1024 * 1024;
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (modalMode) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalMode]);

  // Outside click handler for modals
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalMode && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalMode]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/services`);
      const servicesData = response.data.data.map((service: any) => ({
        ...service,
        id: service._id || service.id
      }));
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

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
    if (!isPlaying || modalMode || services.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, services.length, modalMode]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setUploadedFile(file);
    
    const fileUrl = URL.createObjectURL(file);
    handleInputChange('image', fileUrl);

    toast.success("File uploaded successfully", {
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) is ready to use.`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openAddModal = () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to add services."
      });
      return;
    }

    setFormData({ 
      title: '', 
      description: '', 
      image: '', 
      features: [''], 
      duration: '', 
      price: '', 
      category: '' 
    });
    setUploadedFile(null);
    setModalMode('add');
  };

  const openEditModal = (service: Service) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit services."
      });
      return;
    }

    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      image: service.image,
      features: [...service.features],
      duration: service.duration,
      price: service.price,
      category: service.category
    });
    setUploadedFile(null);
    setModalMode('edit');
  };

  const openDeleteModal = (service: Service) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete services."
      });
      return;
    }

    setEditingService(service);
    setModalMode('delete');
  };

  const openDetailModal = (service: Service) => {
    setSelectedService(service);
    setModalMode('detail');
  };

  const openManageModal = () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to manage services."
      });
      return;
    }

    setModalMode('manage');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingService(null);
    setSelectedService(null);
    setFormData({ 
      title: '', 
      description: '', 
      image: '', 
      features: [''], 
      duration: '', 
      price: '', 
      category: '' 
    });
    setUploadedFile(null);
    
    if (formData.image && formData.image.startsWith('blob:')) {
      URL.revokeObjectURL(formData.image);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAdd = async () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to add services."
      });
      return;
    }

    try {
      setSaving(true);
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      cleanedFeatures.forEach((feature) => {
        formDataToSend.append('features', feature);
      });
      
      if (uploadedFile) {
        formDataToSend.append('image', uploadedFile);
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/services`, 
        formDataToSend, 
        getAuthHeaders()
      );
      
      const newService = response.data.data;
      setServices(prev => [...prev, {...newService, id: newService._id || newService.id}]);
      
      toast.success("Service added successfully", {
        description: `${formData.title} has been added to your services.`,
      });
      
      closeModal();
    } catch (error: any) {
      console.error('Error adding service:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to add service";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async () => {
    if (!isModerator || !editingService) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit services."
      });
      return;
    }

    try {
      setSaving(true);
      const cleanedFeatures = formData.features.filter(f => f.trim() !== '');
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('duration', formData.duration);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      cleanedFeatures.forEach((feature) => {
        formDataToSend.append('features', feature);
      });
      
      if (uploadedFile) {
        formDataToSend.append('image', uploadedFile);
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/services/${editingService.id}`, 
        formDataToSend, 
        getAuthHeaders()
      );
      
      const updatedService = response.data.data;
      setServices(prev => prev.map(s => 
        s.id === editingService.id ? {...updatedService, id: updatedService._id || updatedService.id} : s
      ));
      
      toast.success("Service updated successfully", {
        description: `${formData.title} has been updated.`,
      });
      
      closeModal();
    } catch (error: any) {
      console.error('Error updating service:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to update service";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModerator || !editingService) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete services."
      });
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/services/${editingService.id}`, getAuthHeaders());
      setServices(prev => prev.filter(s => s.id !== editingService.id));
      
      if (currentIndex >= services.length - 1 && services.length > 1) {
        setCurrentIndex(services.length - 2);
      } else if (services.length === 1) {
        setCurrentIndex(0);
      }
      
      toast.error("Service deleted", {
        description: `${editingService.title} has been removed from your services.`,
      });
      
      closeModal();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete service";
      toast.error(errorMessage);
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
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
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-all duration-300">
        <div className="container px-6 mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-all duration-300">
        <div className="container px-6 mx-auto relative z-10 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No Services Available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">There are currently no services to display.</p>
            {isModerator && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Add First Service
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-all duration-300">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Moderator Controls */}
        {isModerator && (
          <div className="absolute top-4 right-4 z-40 flex gap-2">
            <button
              onClick={openManageModal}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-700 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
              title="Manage Services"
            >
              <Grid3X3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
            <button
              onClick={openAddModal}
              className="bg-green-600/90 backdrop-blur-sm border border-green-500/30 rounded-lg p-3 text-white hover:bg-green-500/90 transition-all duration-300 shadow-lg hover:shadow-xl group"
              title="Add New Service"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
            </button>
          </div>
        )}
        
        <div className="container px-6 mx-auto relative z-10">
          {/* Header */}
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/50 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              What We Do
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Main Carousel Container */}
          <div className="relative w-[100%] mx-auto">
            
            {/* Carousel Viewport */}
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl dark:shadow-slate-900/50">
              
              {/* Background Slides */}
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-110'
                  }`}
                >
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-black/80 dark:via-black/60 dark:to-black/40" />
                </div>
              ))}

              

              {/* Content Overlay */}
              <div className="relative z-20 h-full flex items-center">
                <div className="container px-8 mx-auto">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Text Content */}
                    <div className="text-white space-y-8">
                      
                      {/* Service Number Badge */}
                      <div className="inline-flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-white/20 dark:bg-white/25 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/40">
                          <span className="text-lg font-bold">
                            {String(currentIndex + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="h-px bg-white/30 dark:bg-white/40 w-16" />
                        <span className="text-sm font-medium text-white/80 dark:text-white/90 uppercase tracking-wider">
                          Service
                        </span>
                      </div>

                      {/* Title with Animation */}
                      <div className="overflow-hidden">
                        <h2 
                          key={currentIndex}
                          className="text-4xl lg:text-6xl font-bold leading-tight animate-slide-up text-white dark:text-slate-100"
                        >
                          {services[currentIndex].title}
                        </h2>
                      </div>

                      {/* Description with Animation */}
                      <div className="overflow-hidden">
                        <p 
                          key={`desc-${currentIndex}`}
                          className="text-xl text-white/90 dark:text-slate-200/90 leading-relaxed max-w-lg animate-slide-up-delayed"
                        >
                          {services[currentIndex].description}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4">
                        <button 
                          onClick={() => openDetailModal(services[currentIndex])}
                          className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl dark:shadow-slate-900/50"
                        >
                          <span>Learn More</span>
                          <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-4 flex items-center z-30">
              <button
                onClick={goToPrevious}
                className="p-4 bg-white/20 dark:bg-white/25 hover:bg-white/30 dark:hover:bg-white/35 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/40 text-white transition-all duration-300 hover:scale-110 group"
              >
                <ChevronLeft className="size-6 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center z-30">
              <button
                onClick={goToNext}
                className="p-4 bg-white/20 dark:bg-white/25 hover:bg-white/30 dark:hover:bg-white/35 backdrop-blur-sm rounded-2xl border border-white/30 dark:border-white/40 text-white transition-all duration-300 hover:scale-110 group"
              >
                <ChevronRight className="size-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-6 z-30 flex gap-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                      : 'bg-white/40 dark:bg-white/50 hover:bg-white/60 dark:hover:bg-white/70 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
          }

          .animate-slide-up-delayed {
            animation: slide-up 0.8s ease-out 0.2s both;
          }
        `}</style>
      </section>

      {/* Modals */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          
          {/* Add/Edit Modal */}
          {(modalMode === 'add' || modalMode === 'edit') && (
            <div className="w-full flex items-center justify-center min-h-screen py-4">
              <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 my-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {modalMode === 'add' ? 'Add New Service' : 'Edit Service'}
                  </h3>
                  <button
                    onClick={closeModal}
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
                        isDragging
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileInputChange}
                      />
                      
                      {formData.image ? (
                        <div className="space-y-4">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-xl mx-auto"
                          />
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {uploadedFile?.name || 'Current image'}
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
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
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
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
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
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Price
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                      Features
                    </label>
                    <div className="space-y-2">
                      {formData.features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                            placeholder={`Feature ${index + 1}`}
                          />
                          {formData.features.length > 1 && (
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
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={modalMode === 'add' ? handleAdd : handleEdit}
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
                        {modalMode === 'add' ? 'Add Service' : 'Update Service'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {modalMode === 'delete' && editingService && (
            <div className="w-full flex items-center justify-center min-h-screen py-4">
              <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 my-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Confirm Deletion
                </h3>
                
                <p className="text-gray-600 dark:text-slate-300 mb-6">
                  Are you sure you want to delete the service "{editingService.title}"? This action cannot be undone.
                </p>
                
                <div className="flex justify-end gap-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                  >
                    Delete Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Service Detail Modal */}
          {modalMode === 'detail' && selectedService && (
            <div className="w-full flex items-center justify-center min-h-screen py-4">
              <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 my-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedService.title}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={getImageUrl(selectedService.image)}
                      alt={selectedService.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
                        <Clock className="w-5 h-5" />
                        <span>{selectedService.duration}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
                        <DollarSign className="w-5 h-5" />
                        <span>{selectedService.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600 dark:text-slate-300">
                        <Grid3X3 className="w-5 h-5" />
                        <span>{selectedService.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Description
                    </h4>
                    <p className="text-gray-600 dark:text-slate-300 mb-8 leading-relaxed">
                      {selectedService.description}
                    </p>
                    
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Services Modal */}
          {modalMode === 'manage' && (
            <div className="w-full flex items-center justify-center min-h-screen py-4">
              <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 my-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Manage Services
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img
                          src={getImageUrl(service.image)}
                          alt={service.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {service.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {service.category}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(service)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(service)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Service
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ServicesCarousel;