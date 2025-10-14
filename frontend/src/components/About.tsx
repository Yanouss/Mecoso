import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Users, Award, Clock, Target, ArrowRight, CheckCircle, Download, X, Edit3, Save, Plus, Trash2, Image, Loader2, Type, FileText, Upload, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/TranslationContext';

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
  backgroundImage?: string;
  popupImage?: string;
  popupTitle?: string;
  popupDescription?: string;
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
  videoUrl: string;
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
  portfolioFileName?: string;
  isModerator?: boolean;
}

interface AboutFormData {
  badge: string;
  heading: string;
  description: string;
  story: string;
  mission: string;
  image: string;
  portfolioFileName: string;
  stats: Stat[];
  values: Value[];
}

const iconOptions = [
  { name: 'Target', component: Target },
  { name: 'Clock', component: Clock },
  { name: 'Award', component: Award },
  { name: 'Users', component: Users },
  { name: 'CheckCircle', component: CheckCircle },
];

// File upload utility functions
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB in bytes

const isValidImageType = (type: string) => {
  return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml'].includes(type);
};

const isValidVideoType = (type: string) => {
  return ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'].includes(type);
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Drag and Drop Image Upload Component
const DragDropImageUpload = ({ 
  value, 
  onChange, 
  onFileChange,
  label, 
  className = "",
  accept = "image/*,video/*"
}: {
  value: string;
  onChange: (value: string) => void;
  onFileChange: (file: File) => void;
  label: string;
  className?: string;
  accept?: string;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFile = useCallback(async (file: File) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size too large. Maximum size allowed is ${formatFileSize(MAX_FILE_SIZE)}.`);
      return;
    }

    // Check file type
    const isImage = isValidImageType(file.type);
    const isVideo = isValidVideoType(file.type);
    
    if (!isImage && !isVideo) {
      toast.error('Invalid file type. Please upload an image or video file.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
      onFileChange(file);
      toast.success(`${isImage ? 'Image' : 'Video'} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onFileChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    onFileChange(null as any);
    toast.success('File removed successfully.');
  };

  // Check if the current value is a video
  const isVideo = value ? 
    (value.includes('video') || value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov')) : 
    false;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className="relative">
            {/* Preview */}
            <div className="relative w-full h-32 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden mb-3">
              {isVideo ? (
                <video
                  src={value}
                  className="w-full h-full object-cover"
                  muted
                  controls
                  onError={(e) => {
                    console.error('Failed to load video preview:', value);
                    // Fallback to showing file info if video fails to load
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : (
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load image preview:', value);
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              )}
              {/* Fallback element */}
              <div className="hidden absolute inset-0 bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                Failed to load preview
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>

            {/* File info */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Click to replace or drag new file here
            </div>
          </div>
        ) : (
          <div className="text-center">
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-full ${
                  isDragging 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
                }`}>
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isDragging ? 'Drop file here' : 'Drop file here or click to browse'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Images, videos up to {formatFileSize(MAX_FILE_SIZE)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Default data - only used as initial fallback
const DEFAULT_ABOUT_DATA: AboutFormData = {
  badge: "About Our Company",
  heading: "Building Tomorrow's Infrastructure Today",
  description: "Loading...",
  story: "Loading...",
  mission: "Loading...",
  image: "",
  portfolioFileName: "portfolio.pdf",
  stats: [],
  values: []
};

const About = ({
  isModerator = false
}: AboutProps) => {
  const { t } = useTranslation();

  const [activeValue, setActiveValue] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'values'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const isUserModerator = isModerator || (isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin'));
  
  const API_URL = 'http://localhost:5000/api'; // Adjust to your backend URL

  // Initialize with empty default data
  const [formData, setFormData] = useState<AboutFormData>(DEFAULT_ABOUT_DATA);
  const [currentData, setCurrentData] = useState<AboutFormData>(DEFAULT_ABOUT_DATA);

  // File handling states
  const [fileUploads, setFileUploads] = useState<{ [key: string]: File }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAboutData();
  }, []);

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.name === iconName);
    return iconOption ? <iconOption.component className="size-6" /> : <Target className="size-6" />;
  };

  const fetchAboutData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/about`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const aboutData = result.data;
        
        // Process stats to convert icon strings to components
        if (aboutData.stats && Array.isArray(aboutData.stats)) {
          aboutData.stats = aboutData.stats.map((stat: any) => ({
            ...stat,
            icon: getIconComponent(stat.icon || 'Target')
          }));
        } else {
          aboutData.stats = [];
        }
        
        // Process values to convert icon strings to components
        if (aboutData.values && Array.isArray(aboutData.values)) {
          aboutData.values = aboutData.values.map((value: any) => ({
            ...value,
            icon: getIconComponent(value.icon || 'Target')
          }));
        } else {
          aboutData.values = [];
        }
        
        // Merge with defaults to ensure all fields exist
        const completeData = {
          ...DEFAULT_ABOUT_DATA,
          ...aboutData
        };
        
        setCurrentData(completeData);
        setFormData(completeData);
      } else {
        throw new Error(result.message || 'Failed to fetch about data');
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load about data');
      toast.error('Failed to load about data from server');
      
      // Keep the default data as fallback
      setCurrentData(DEFAULT_ABOUT_DATA);
      setFormData(DEFAULT_ABOUT_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof AboutFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatChange = (index: number, field: keyof Stat, value: any) => {
    const newStats = [...formData.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    handleInputChange('stats', newStats);
  };

  const handleValueChange = (index: number, field: keyof Value, value: any) => {
    const newValues = [...formData.values];
    newValues[index] = { ...newValues[index], [field]: value };
    handleInputChange('values', newValues);
  };

  const addStat = () => {
    const newStat: Stat = {
      number: "",
      label: "",
      icon: <Target className="size-6" />,
      backgroundImage: "",
      popupImage: "",
      popupTitle: "",
      popupDescription: ""
    };
    handleInputChange('stats', [...formData.stats, newStat]);
    toast.success('New statistic added successfully.');
  };

  const removeStat = (index: number) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    handleInputChange('stats', newStats);
    toast.success('Statistic removed successfully.');
  };

  const addValue = () => {
    const newValue: Value = {
      title: "",
      description: "",
      icon: <Target className="size-6" />,
      videoUrl: ""
    };
    handleInputChange('values', [...formData.values, newValue]);
    toast.success('New value added successfully.');
  };

  const removeValue = (index: number) => {
    const newValues = formData.values.filter((_, i) => i !== index);
    handleInputChange('values', newValues);
    toast.success('Value removed successfully.');
  };

  const handleFileUpload = (key: string, file: File) => {
    if (!validateFile(file)) return;
    setFileUploads(prev => ({ ...prev, [key]: file }));
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [key]: url }));
  };

  const validateFile = (file: File): boolean => {
    const MAX_FILE_SIZE = 200 * 1024 * 1024;
    const ACCEPTED_TYPES = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 
      'video/x-msvideo', 'video/x-matroska'
    ];

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: `File size must be less than 200MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB.`,
      });
      return false;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload an image or video file.",
      });
      return false;
    }

    return true;
  };


  const handleSave = async () => {
    if (!isUserModerator) {
      toast.error("Access denied", { description: "Moderator/admin only" });
      return;
    }
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("badge", formData.badge);
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("story", formData.story);
      formDataToSend.append("mission", formData.mission);

      // Process stats to convert icon components to strings
      const processedStats = formData.stats.map((stat, index) => {
        const statData = {
          ...stat,
          icon: iconOptions.find(opt => React.isValidElement(stat.icon) && opt.component === stat.icon.type)?.name || "Target",
        };
        
        // If we have uploaded files for this stat, add them with specific field names
        if (fileUploads[`statBg-${index}`]) {
          formDataToSend.append(`statBg${index}`, fileUploads[`statBg-${index}`]);
        }
        if (fileUploads[`statPopup-${index}`]) {
          formDataToSend.append(`statPopup${index}`, fileUploads[`statPopup-${index}`]);
        }
        
        return statData;
      });
      formDataToSend.append("stats", JSON.stringify(processedStats));

      // Process values to convert icon components to strings
      const processedValues = formData.values.map((value, index) => {
        const valueData = {
          ...value,
          icon: iconOptions.find(opt => React.isValidElement(value.icon) && opt.component === value.icon.type)?.name || "Target",
        };
        
        // If we have uploaded video for this value, add it with specific field name
        if (fileUploads[`valueVideo-${index}`]) {
          formDataToSend.append(`valueVideo${index}`, fileUploads[`valueVideo-${index}`]);
        }
        
        return valueData;
      });
      formDataToSend.append("values", JSON.stringify(processedValues));

      // Handle main image upload
      if (fileUploads['mainImage']) {
        formDataToSend.append('image', fileUploads['mainImage']);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/about`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        await fetchAboutData();
        setIsEditModalOpen(false);
        setFileUploads({});
        setPreviewUrls({});
        toast.success("About section updated successfully!");
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error saving: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSaving(false);
    }
  };
  

  const handleCancel = () => {
    setFormData(currentData);
    setFileUploads({});
    setPreviewUrls({});
    setIsEditModalOpen(false);
    toast.info('Changes discarded.');
  };

  const handlePortfolioDownload = async () => {
    try {
      setIsDownloading(true);
      const portfolioUrl = `/portfolio/${currentData.portfolioFileName}`;
      const link = document.createElement('a');
      link.href = portfolioUrl;
      link.download = currentData.portfolioFileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Portfolio download started successfully.');
    } catch (error) {
      console.error('Error downloading portfolio:', error);
      toast.error('Failed to download portfolio. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const closePopup = () => {
    setSelectedStat(null);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    console.log('Processing image path:', imagePath);
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // If it starts with /uploads, construct the backend URL
    if (imagePath.startsWith('/uploads')) {
      const backendUrl = 'http://localhost:5000'; // Adjust to your backend URL
      // Ensure we don't have double slashes
      const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      const fullUrl = `${cleanBackendUrl}${cleanImagePath}`;
      console.log('Constructed image URL:', fullUrl);
      return fullUrl;
    }
    
    // If it's a relative path, ensure it starts with /
    if (!imagePath.startsWith('/')) {
      return `/${imagePath}`;
    }
    
    return imagePath;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading about information...</p>
        </div>
      </div>
    );
  }

  if (error && currentData === DEFAULT_ABOUT_DATA) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100 mb-2">
            Failed to Load About Information
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mb-4">{error}</p>
          <button
            onClick={fetchAboutData}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden transition-all duration-500">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl" />
        
        {/* Edit Button for Moderators */}
        {/* {isUserModerator && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-700 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Edit About Section"
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )} */}

        <div className="container px-6 mx-auto relative z-10">
          
          {/* Header */}
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50 transition-all duration-300">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {t('about.badge', currentData.badge)}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
              {t('about.heading', currentData.heading)}
            </h1>
            <p className="text-xl text-justify text-gray-600 dark:text-slate-300 leading-relaxed">
              {t('about.main_description', currentData.description)}
            </p>
          </div>

          {/* Hero Story Section */}
          <div className="mb-24 grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {currentData.image ? (
                <div className="relative overflow-hidden rounded-3xl shadow-2xl dark:shadow-slate-900/50 group">
                  <img 
                    src={getImageUrl(currentData.image)} 
                    alt="About us" 
                    className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.errorHandled) {
                        target.dataset.errorHandled = 'true';
                        console.error('Failed to load image:', currentData.image);
                        target.style.display = 'none';
                        const parent = target.closest('.relative');
                        if (parent) {
                          const fallback = parent.querySelector('.hidden.text-center') as HTMLElement;
                          if (fallback) {
                            fallback.classList.remove('hidden');
                            fallback.classList.add('flex');
                          }
                        }
                      }
                    }}
                  />
                  <div className="hidden absolute inset-0 bg-gray-200 dark:bg-slate-700 h-[500px] items-center justify-center text-center text-gray-500 dark:text-slate-400">
                    <div>
                      <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Image not available</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent dark:from-black/70 dark:via-transparent dark:to-transparent" />
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-3xl shadow-2xl dark:shadow-slate-900/50 bg-gray-200 dark:bg-slate-700 h-[500px] flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-slate-400">
                    <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Image not available</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 dark:text-slate-300 text-justify leading-relaxed text-lg">
                  {t('about.our_story_content', currentData.story)}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-8 border border-gray-200/50 dark:border-slate-600/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl transition-all duration-300">
                    <Target className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">{t('about.our_mission')}</h3>
                    <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                      {currentData.mission}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Stats Grid */}
          {currentData.stats.length > 0 && (
            <div className="mb-24 grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {currentData.stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => setSelectedStat(stat)}
                >
                  <div className="relative bg-white dark:bg-slate-800/50 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-500 transform hover:-translate-y-2 text-center overflow-hidden h-60 backdrop-blur-sm">
                    {/* Background Image */}
                    {stat.backgroundImage && (
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-500"
                        style={{ backgroundImage: `url(${stat.backgroundImage})` }}
                      />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 opacity-60 group-hover:opacity-40 dark:group-hover:opacity-60 transition-opacity duration-500" />
                    
                    {/* Hover Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 h-full flex flex-col justify-center">
                      <div className="inline-flex p-4 mb-4 bg-gradient-to-br from-blue-100/90 to-purple-100/90 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl group-hover:scale-110 transition-transform duration-500 mx-auto backdrop-blur-sm">
                        <div className="text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-500">
                          {stat.icon}
                        </div>
                      </div>
                      
                      <div className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-500">
                        {stat.number}
                      </div>
                      
                      <div className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                        {stat.label}
                      </div>
                      
                      {/* Click indicator */}
                      <div className="mt-3 text-xs text-gray-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {t('about.click_learn_more')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Popup Modal */}
          {selectedStat && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-slate-700">
                {/* Close Button */}
                <button
                  onClick={closePopup}
                  className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors duration-200 z-10"
                >
                  <X className="size-6 text-gray-600 dark:text-slate-300" />
                </button>
                
                {/* Popup Content */}
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl">
                      <div className="text-blue-600 dark:text-blue-400">
                        {selectedStat.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                        {selectedStat.popupTitle || `${selectedStat.number} ${selectedStat.label}`}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Main Image */}
                  {selectedStat.popupImage && (
                    <div className="mb-6 rounded-2xl overflow-hidden shadow-xl dark:shadow-slate-900/50">
                      <img 
                        src={selectedStat.popupImage} 
                        alt={selectedStat.popupTitle || selectedStat.label}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Description */}
                  {selectedStat.popupDescription && (
                    <div className="text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                      {selectedStat.popupDescription}
                    </div>
                  )}
                  
                  {/* Stats Display */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-2xl border border-gray-200/50 dark:border-slate-600/50">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {selectedStat.number}
                      </div>
                      <div className="text-gray-700 dark:text-slate-300 font-semibold">
                        {selectedStat.label}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Values Section with Video Backgrounds */}
          {currentData.values.length > 0 && (
            <div className="mb-24">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                  {t('about.our_values')}
                </h2>
                <p className="text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto">
                  {t('about.values_description')}
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-8">
                {currentData.values.slice(0, 6).map((value, index) => (
                  <div 
                    key={index}
                    className={`relative group cursor-pointer transition-all duration-500 ${
                      activeValue === index ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onClick={() => setActiveValue(index)}
                  >
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl dark:shadow-slate-900/50 border border-gray-200/50 dark:border-slate-700/50">
                      {/* Video Background */}
                      {value.videoUrl ? (
                        <div className="absolute inset-0">
                          <video
                            src={value.videoUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            autoPlay
                            playsInline
                            onError={(e) => {
                              console.error('Failed to load video:', value.videoUrl);
                              // Hide video on error and show fallback
                              (e.target as HTMLVideoElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30" />
                      )}
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col justify-end p-8">
                        <div className="mb-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 inline-flex self-start">
                          <div className="text-white">
                            {value.icon}
                          </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-3">
                          {value.title}
                        </h3>
                        
                        <p className="text-gray-200 leading-relaxed">
                          {value.description}
                        </p>
                        
                        {/* Hover Indicator */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show More Button */}
              {currentData.values.length > 6 && (
                <div className="text-center mt-12">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {t('common.show_more')}
                    <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* CTA Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              {t('services.ready_to_start')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-300 mb-10">
              {t('services.cta_description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handlePortfolioDownload}
                disabled={isDownloading}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <Download className="size-5 group-hover:scale-110 transition-transform duration-200" />
                    {t('hero.secondary_button')}
                  </>
                )}
              </button>
              
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-semibold rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {t('services.get_in_touch')}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('about.edit_about_page')}</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              {[
                { key: 'general', label: t('about.general_info'), icon: Type },
                { key: 'stats', label: t('about.statistics'), icon: Award },
                { key: 'values', label: t('about.company_values'), icon: Target },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === key
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('about.badge_text')}
                    </label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => handleInputChange('badge', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="About Our Company"
                    />
                  </div>

                  {/* Heading */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('about.main_heading')}
                    </label>
                    <input
                      type="text"
                      value={formData.heading}
                      onChange={(e) => handleInputChange('heading', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Leading Industrial Solutions in Morocco"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('about.description_text')}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Enter description..."
                    />
                  </div>

                  {/* Story */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('about.company_story')}
                    </label>
                    <textarea
                      value={formData.story}
                      onChange={(e) => handleInputChange('story', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Enter company story..."
                    />
                  </div>

                  {/* Mission */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('about.mission_statement')}
                    </label>
                    <textarea
                      value={formData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Enter mission statement..."
                    />
                  </div>

                  {/* Main Story Image */}
                  <DragDropImageUpload
                    value={previewUrls['mainImage'] || formData.image}
                    onChange={(url) => {
                      setPreviewUrls(prev => ({ ...prev, mainImage: url }));
                      handleInputChange('image', url);
                    }}
                    onFileChange={(file) => handleFileUpload('mainImage', file)}
                    label={t('about.story_section_image')}
                    accept="image/*"
                  />
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('about.statistics')}</h3>
                    <button
                      onClick={addStat}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {t('about.add_stat')}
                    </button>
                  </div>

                  {formData.stats.map((stat, index) => (
                    <div key={index} className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">Statistic {index + 1}</h4>
                        <button
                          onClick={() => removeStat(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('about.number')}</label>
                          <input
                            type="text"
                            value={stat.number}
                            onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="50+"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('about.label')}</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Projects Completed"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('about.icon')}</label>
                          <select
                            value={iconOptions.find(opt => opt.component.type === stat.icon.type)?.name || 'Target'}
                            onChange={(e) => handleStatChange(index, 'icon', getIconComponent(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                          >
                            {iconOptions.map(option => (
                              <option key={option.name} value={option.name}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Background Image</label>
                          <DragDropImageUpload
                            value={previewUrls[`statBg-${index}`] || stat.backgroundImage || ''}
                            onChange={(url) => {
                              setPreviewUrls(prev => ({ ...prev, [`statBg-${index}`]: url }));
                              handleStatChange(index, 'backgroundImage', url);
                            }}
                            onFileChange={(file) => handleFileUpload(`statBg-${index}`, file)}
                            label=""
                            accept="image/*"
                            className="mb-2"
                          />
                          <input
                            type="url"
                            value={stat.backgroundImage || ''}
                            onChange={(e) => handleStatChange(index, 'backgroundImage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Or enter image URL..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popup Image</label>
                          <DragDropImageUpload
                            value={previewUrls[`statPopup-${index}`] || stat.popupImage || ''}
                            onChange={(url) => {
                              setPreviewUrls(prev => ({ ...prev, [`statPopup-${index}`]: url }));
                              handleStatChange(index, 'popupImage', url);
                            }}
                            onFileChange={(file) => handleFileUpload(`statPopup-${index}`, file)}
                            label=""
                            accept="image/*"
                            className="mb-2"
                          />
                          <input
                            type="url"
                            value={stat.popupImage || ''}
                            onChange={(e) => handleStatChange(index, 'popupImage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Or enter image URL..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popup Title</label>
                          <input
                            type="text"
                            value={stat.popupTitle || ''}
                            onChange={(e) => handleStatChange(index, 'popupTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="50+ Projects Completed"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Popup Description</label>
                          <textarea
                            value={stat.popupDescription || ''}
                            onChange={(e) => handleStatChange(index, 'popupDescription', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none"
                            placeholder="Detailed description for the popup..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Values Tab */}
              {activeTab === 'values' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('about.company_values')}</h3>
                    <button
                      onClick={addValue}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {t('about.add_value')}
                    </button>
                  </div>

                  {formData.values.map((value, index) => (
                    <div key={index} className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700/50 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">Value {index + 1}</h4>
                        <button
                          onClick={() => removeValue(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('about.title')}</label>
                          <input
                            type="text"
                            value={value.title}
                            onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Complete Solutions"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
                          <select
                            value={iconOptions.find(opt => opt.component.type === value.icon.type)?.name || 'Target'}
                            onChange={(e) => handleValueChange(index, 'icon', getIconComponent(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                          >
                            {iconOptions.map(option => (
                              <option key={option.name} value={option.name}>
                                {option.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('about.description')}</label>
                          <textarea
                            value={value.description}
                            onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none"
                            placeholder="Detailed description of this value..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('about.video_optional')}</label>
                          <DragDropImageUpload
                            value={previewUrls[`valueVideo-${index}`] || value.videoUrl || ''}
                            onChange={(url) => {
                              setPreviewUrls(prev => ({ ...prev, [`valueVideo-${index}`]: url }));
                              handleValueChange(index, 'videoUrl', url);
                            }}
                            onFileChange={(file) => handleFileUpload(`valueVideo-${index}`, file)}
                            label=""
                            accept="video/*"
                            className="mb-2"
                          />
                          <input
                            type="url"
                            value={value.videoUrl || ''}
                            onChange={(e) => handleValueChange(index, 'videoUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Or enter video URL..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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

export default About;