import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from "react-router";
import { Edit3, X, Save, Image, Type, FileText, Upload, Trash2, Loader2, AlertCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { API_URL as API_BASE_URL } from '../../config/api';
import { useTranslation } from '../../context/TranslationContext';



interface Hero1Props {
  badge?: string;
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
  image: {
    src: string;
    alt: string;
  };
  isModerator?: boolean;
}

interface HeroData {
  _id?: string;
  badge: string;
  heading: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  buttons: {
    primary: {
      text: string;
      url: string;
    };
    secondary: {
      text: string;
      url: string;
    };
  };
  isActive: boolean;
  lastUpdated: string;
  updatedBy?: string;
}

interface HeroFormData {
  badge: string;
  heading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  imageFile?: File;
  // French translations
  badgeFr?: string;
  headingFr?: string;
  descriptionFr?: string;
  primaryButtonTextFr?: string;
  secondaryButtonTextFr?: string;
}

const Hero = ({
  heading: initialHeading = "Blocks Built With Shadcn & Tailwind",
  description: initialDescription = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  image: initialImage = {
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    alt: "Hero section demo image showing interface components",
  },
  isModerator: initialIsModerator = false,
}: Hero1Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, isAuthenticated } = useAuth();
  const isModerator = initialIsModerator || (isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin'));

  // ADD THIS LINE - Get translation context
  const { t, currentLanguage } = useTranslation();

  const [formData, setFormData] = useState<HeroFormData>({
    badge: "Industrial Excellence",
    heading: initialHeading,
    description: initialDescription,
    imageSrc: initialImage.src,
    imageAlt: initialImage.alt,
    primaryButtonText: "Start Your Project",
    primaryButtonUrl: "/contact",
    secondaryButtonText: "View Portfolio",
    secondaryButtonUrl: "/portfolio"
  });


  const MAX_FILE_SIZE = 200 * 1024 * 1024;
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


  // Fetch hero data on component mount
  useEffect(() => {
    fetchHeroData();
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);


  const fetchHeroData = async () => {
    try {
      setLoading(true);
      
      // Fetch hero data with translations for current language
      const response = await axios.get(`${API_BASE_URL}/hero/${currentLanguage}`);
      const data = response.data.data;
      setHeroData(data);
      
      // Update form data with fetched data
      setFormData({
        badge: data.badge || "Industrial Excellence",
        heading: data.heading || initialHeading,
        description: data.description || initialDescription,
        imageSrc: data.image?.src || initialImage.src,
        imageAlt: data.image?.alt || initialImage.alt,
        primaryButtonText: data.buttons?.primary?.text || "Start Your Project",
        primaryButtonUrl: data.buttons?.primary?.url || "/contact",
        secondaryButtonText: data.buttons?.secondary?.text || "View Portfolio",
        secondaryButtonUrl: data.buttons?.secondary?.url || "/portfolio"
      });

      // Store the fetched translations
      setTranslations({
        'hero.badge': data.badge,
        'hero.heading': data.heading,
        'hero.description': data.description,
        'hero.primary_button': data.buttons?.primary?.text,
        'hero.secondary_button': data.buttons?.secondary?.text,
      });
      
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast.error('Failed to load hero data');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!loading) {
      fetchHeroData();
    }
  }, [currentLanguage]);


  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    console.log('Processing image path:', imagePath); // Debug log
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it starts with /uploads, construct the backend URL
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = API_BASE_URL.replace('/api', '');
      // Ensure we don't have double slashes
      const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${cleanBackendUrl}${cleanImagePath}`;
    }
    
    // If it's a relative path, ensure it starts with /
    if (!imagePath.startsWith('/')) {
      return `/${imagePath}`;
    }
    
    return imagePath;
  };

  const handleInputChange = (field: keyof HeroFormData, value: string) => {
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

  // File upload handlers
  const handleFileUpload = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const fileUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      imageSrc: fileUrl,
      imageFile: file,
      imageAlt: prev.imageAlt || `Uploaded image: ${file.name}`
    }));
    
    toast.success("File uploaded successfully", {
      description: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)}MB) is ready to use.`,
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageSrc: heroData?.image?.src || initialImage.src,
      imageFile: undefined,
      imageAlt: heroData?.image?.alt || initialImage.alt
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.info("Image reset", {
      description: "The image has been reset to the current saved version.",
    });
  };


  const handleSave = async () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to update the hero section."
      });
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();
      
      // Send data in one language - backend will auto-translate
      formDataToSend.append('badge', formData.badge);
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('imageAlt', formData.imageAlt);
      formDataToSend.append('primaryButtonText', formData.primaryButtonText);
      formDataToSend.append('primaryButtonUrl', formData.primaryButtonUrl);
      formDataToSend.append('secondaryButtonText', formData.secondaryButtonText);
      formDataToSend.append('secondaryButtonUrl', formData.secondaryButtonUrl);
      
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/hero`, 
        formDataToSend, 
        getAuthHeaders()
      );
      
      await fetchHeroData();
      
      const translationInfo = response.data.translationInfo;
      toast.success("Hero section updated", {
        description: translationInfo 
          ? `Content saved in ${translationInfo.detectedLanguage} and auto-translated to ${translationInfo.translatedTo}!`
          : "Your changes have been saved successfully.",
      });
      
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving hero data:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to save hero section";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    if (!heroData) return;
    
    // Reset form data to current saved data
    setFormData({
      badge: heroData.badge || "Industrial Excellence",
      heading: heroData.heading || initialHeading,
      description: heroData.description || initialDescription,
      imageSrc: heroData.image?.src || initialImage.src,
      imageAlt: heroData.image?.alt || initialImage.alt,
      primaryButtonText: heroData.buttons?.primary?.text || "Start Your Project",
      primaryButtonUrl: heroData.buttons?.primary?.url || "/contact",
      secondaryButtonText: heroData.buttons?.secondary?.text || "View Portfolio",
      secondaryButtonUrl: heroData.buttons?.secondary?.url || "/portfolio"
    });
    
    setIsDragOver(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.info("Changes discarded", {
      description: "Your edits have been cancelled.",
    });
    
    setIsModalOpen(false);
  };

  const openEditModal = () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit the hero section."
      });
      return;
    }
    setIsModalOpen(true);
  };

  // Use current data or fallback to props/defaults
// Replace the currentData object
  const currentData = {
    badge: translations['hero.badge'] || heroData?.badge || t('hero.badge'),
    heading: translations['hero.heading'] || heroData?.heading || t('hero.heading'), 
    description: translations['hero.description'] || heroData?.description || t('hero.description'),
    image: heroData?.image || initialImage,
    buttons: {
      primary: {
        text: translations['hero.primary_button'] || heroData?.buttons?.primary?.text || t('hero.primary_button'),
        url: heroData?.buttons?.primary?.url || "/services"
      },
      secondary: {
        text: translations['hero.secondary_button'] || heroData?.buttons?.secondary?.text || t('hero.secondary_button'),
        url: heroData?.buttons?.secondary?.url || "/portfolio"
      }
    }
  };

  const isVideo = (src: string) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(src);
  };

  if (loading) {
    return (
      <section className="relative py-44 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </section>
    );
  }

  return (
    <>
      <section className="relative py-44 overflow-hidden">
        {isVideo(currentData.image.src) ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={getImageUrl(currentData.image.src)}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
            style={{ backgroundImage: `url(${getImageUrl(currentData.image.src)})` }}
          />
        )}

        {/* Enhanced overlay with gradient for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-blue-900/40 dark:from-slate-900/80 dark:via-slate-800/70 dark:to-blue-900/60"></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent dark:from-transparent dark:via-blue-400/10 dark:to-transparent animate-pulse"></div>

        {/* Edit Button for Moderators */}
        {isModerator && (
          <button
            onClick={openEditModal}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Edit Hero Section"
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}

        <div className="mx-auto container relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Badge */}
            {currentData.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-100 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/30">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                {currentData.badge}
              </div>
            )}

            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl text-white dark:text-slate-100 drop-shadow-2xl animate-fade-in-up">
              {currentData.heading}
            </h1>
            <p className="text-white/90 dark:text-slate-200/90 mb-8 max-w-xl lg:text-xl text-justify drop-shadow-lg animate-fade-in-up animation-delay-200">
              {currentData.description}
            </p>

            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row max-w-md">
              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-400">
                {/* Primary Button */}
                <Link
                  to={currentData.buttons.primary.url}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                            dark:from-blue-500 dark:to-blue-600 text-white rounded-2xl font-semibold
                            shadow-xl overflow-hidden inline-block
                            transform transition-transform duration-300 ease-in-out
                            hover:scale-105"
                >
                  <span className="relative z-10">{currentData.buttons.primary.text}</span>
                  {/* Smooth animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                  transform -skew-x-12 -translate-x-full 
                                  group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                </Link>

                {/* Secondary Button */}
                <button
                  onClick={() => {
                    // Trigger file download
                    const link = document.createElement("a");
                    link.href = "/portfolio/MECOSO-Portfolio.pptx";
                    link.download = "MECOSO-Portfolio.pptx";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Show success toast
                    toast.success("Portfolio downloaded successfully!");
                  }}
                  className="relative px-8 py-4 flex items-center justify-center gap-2
                            bg-white/10 backdrop-blur-sm border border-white/30 
                            text-white rounded-2xl font-semibold shadow-xl overflow-hidden
                            transform transition-transform duration-300 ease-in-out
                            hover:scale-105 hover:bg-white/20"
                >
                  <Download className="w-5 h-5" />
                  <span className="relative z-10">{currentData.buttons.secondary.text || "Download Portfolio"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Hero Section</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                
                {/* Badge Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Badge Text
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    placeholder="Enter badge text..."
                  />
                </div>

                {/* Heading Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Main Heading
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => handleInputChange('heading', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    placeholder="Enter main heading..."
                  />
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200"
                    placeholder="Enter description..."
                  />
                </div>

                {/* Media Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Background Image
                    </label>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Upload New Image
                      </label>
                      
                      {/* Drag & Drop Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative w-full min-h-[120px] border-2 border-dashed rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-6 cursor-pointer group ${
                          isDragOver
                            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : formData.imageFile
                            ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        
                        {formData.imageFile ? (
                          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                            <Upload className="w-6 h-6" />
                            <div>
                              <p className="font-medium">New image uploaded!</p>
                              <p className="text-sm opacity-75">Click to change or drag a new file</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            <Upload className="w-6 h-6" />
                            <div className="text-center">
                              <p className="font-medium">
                                {isDragOver ? 'Drop your image here!' : 'Click to upload or drag & drop'}
                              </p>
                              <p className="text-sm opacity-75">Images up to 200MB</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Alt Text / Description
                      </label>
                      <input
                        type="text"
                        value={formData.imageAlt}
                        onChange={(e) => handleInputChange('imageAlt', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                        placeholder="Describe the image..."
                      />
                    </div>

                    {/* Image Preview */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                          Current Preview
                        </label>
                        {formData.imageFile && (
                          <button
                            type="button"
                            onClick={removeImage}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Reset
                          </button>
                        )}
                      </div>
                      <div className="relative w-full h-32 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                        {isVideo(formData.imageSrc) ? (
                          <video
                            src={getImageUrl(formData.imageSrc)}
                            controls
                            className="w-full h-full object-cover"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={getImageUrl(formData.imageSrc)}
                            alt={formData.imageAlt}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm hidden">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Failed to load media
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded"></div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Action Buttons
                    </label>
                  </div>
                  
                  {/* Primary Button */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Primary Button</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.primaryButtonText}
                          onChange={(e) => handleInputChange('primaryButtonText', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                          placeholder="Button text..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Button URL
                        </label>
                        <input
                          type="text"
                          value={formData.primaryButtonUrl}
                          onChange={(e) => handleInputChange('primaryButtonUrl', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                          placeholder="/path or https://..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Button */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Secondary Button</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.secondaryButtonText}
                          onChange={(e) => handleInputChange('secondaryButtonText', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                          placeholder="Button text..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Button URL
                        </label>
                        <input
                          type="text"
                          value={formData.secondaryButtonUrl}
                          onChange={(e) => handleInputChange('secondaryButtonUrl', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                          placeholder="/path or https://..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Hero };