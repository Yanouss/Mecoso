import React, { useState, useEffect } from 'react';
import { Users, Award, Clock, Target, ArrowRight, CheckCircle, Building, Lightbulb, Heart, Shield, Star, Trophy, MapPin, Phone, Mail, X, Edit3, Save, Plus, Trash2, Type, Upload, Video, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL as API_BASE_URL } from '../../config/api'; 
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
  expertise: string[];
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
  videoUrl?: string;
}

interface Partner {
  src: string;
  name: string;
}

interface AboutData {
  badge: string;
  heading: string;
  description: string;
  story: string;
  mission: string;
  vision: string;
  image: string;
  heroImage: string;
  stats: Stat[];
  values: Value[];
  team: TeamMember[];
  partners: Partner[];
  portfolioFileName?: string;
}

interface AboutPageProps {
  isModerator?: boolean;
}

const iconOptions = [
  { name: 'Target', component: Target },
  { name: 'Clock', component: Clock },
  { name: 'Award', component: Award },
  { name: 'Users', component: Users },
  { name: 'CheckCircle', component: CheckCircle },
  { name: 'Building', component: Building },
  { name: 'Shield', component: Shield },
  { name: 'Heart', component: Heart },
  { name: 'Lightbulb', component: Lightbulb },
];

const AboutPage: React.FC<AboutPageProps> = ({ isModerator: propIsModerator = false }) => {
  const { t } = useTranslation();
  
  // Create default data inside component after hooks
  const defaultData: AboutData = {
    badge: t('about.badge'),
    heading: t('about.heading'),
    description: t('about.description'),
    story: t('about.our_story'),
    mission: t('about.our_mission'),
    image: "/images/team.jpg",
    heroImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop",
    stats: [
      {
        number: "50+",
        label: "Projects Completed",
        icon: <Target className="size-6" />,
        backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
        popupImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
        popupTitle: "50+ Projects Completed",
        popupDescription: "Over the years, we have successfully completed more than 50 major industrial projects across Morocco, ranging from manufacturing facilities to complex structural installations."
      }
    ],
    values: [
      {
        title: "Complete Solutions",
        description: "From initial design to final commissioning and ongoing maintenance, MECOSO delivers seamless, end-to-end industrial solutions tailored to your needs.",
        icon: <Target className="size-6" />
      }
    ],
    team: [],
    partners: []
  };

  const [data, setData] = useState<AboutData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeValue, setActiveValue] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [selectedStat, setSelectedStat] = useState<Stat | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'values' | 'partners'>('general');
  const [formData, setFormData] = useState<AboutData>(defaultData);

  
  // File handling states
  const [fileUploads, setFileUploads] = useState<{[key: string]: File}>({});
  const [previewUrls, setPreviewUrls] = useState<{[key: string]: string}>({});

  const [isDragging, setIsDragging] = useState(false);
  const [currentUploadKey, setCurrentUploadKey] = useState<string>('');

  const [showAllValues, setShowAllValues] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const isModerator = propIsModerator || (isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin'));

  const API_URL = 'http://localhost:5000/api'; // Adjust to your backend URL

  useEffect(() => {
    fetchAboutData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (selectedStat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedStat]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  };


  const fetchAboutData = async () => {
    try {
      const response = await fetch(`${API_URL}/about`);
      const result = await response.json();
      
      if (result.success) {
        const aboutData = result.data;
        
        // Process stats to convert icon strings to components
        if (aboutData.stats) {
          aboutData.stats = aboutData.stats.map((stat: any) => ({
            ...stat,
            icon: getIconComponent(stat.icon || 'Target')
          }));
        }
        
        // Process values to convert icon strings to components
        if (aboutData.values) {
          aboutData.values = aboutData.values.map((value: any) => ({
            ...value,
            icon: getIconComponent(value.icon || 'Target')
          }));
        }
        
        setData({ ...defaultData, ...aboutData });
        setFormData({ ...defaultData, ...aboutData });
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      // Use default data on error
    } finally {
      setLoading(false);
    }
  };
  

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.name === iconName);
    return iconOption ? <iconOption.component className="size-6" /> : <Target className="size-6" />;
  };

  const handleFileChange = (key: string, file: File) => {
    if (!validateFile(file)) return;
    setFileUploads(prev => ({ ...prev, [key]: file }));
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => ({ ...prev, [key]: url }));
  };

  const handleInputChange = (field: keyof AboutData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handlePartnerChange = (index: number, field: keyof Partner, value: any) => {
    const newPartners = [...formData.partners];
    newPartners[index] = { ...newPartners[index], [field]: value };
    handleInputChange('partners', newPartners);
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
  };

  const removeStat = (index: number) => {
    const newStats = formData.stats.filter((_, i) => i !== index);
    handleInputChange('stats', newStats);
  };

  const addValue = () => {
    if (formData.values.length >= 10) {
      toast.error('Maximum 10 values allowed');
      return;
    }
    
    const newValue: Value = {
      title: "",
      description: "",
      icon: <Target className="size-6" />,
      videoUrl: ""
    };
    handleInputChange('values', [...formData.values, newValue]);
  };

  const removeValue = (index: number) => {
    const newValues = formData.values.filter((_, i) => i !== index);
    handleInputChange('values', newValues);
  };

  const addPartner = () => {
    const newPartner: Partner = {
      src: "",
      name: ""
    };
    handleInputChange('partners', [...formData.partners, newPartner]);
  };

  const removePartner = (index: number) => {
    const newPartners = formData.partners.filter((_, i) => i !== index);
    handleInputChange('partners', newPartners);
  };


  const handleSave = async () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to update the about page."
      });
      return;
    }

    setSaving(true);
    
    try {
      const formDataToSend = new FormData();
      
      // Add text fields
      formDataToSend.append('badge', formData.badge);
      formDataToSend.append('heading', formData.heading);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('story', formData.story);
      formDataToSend.append('mission', formData.mission);
      formDataToSend.append('vision', formData.vision);
      
      // Add hero image URL if not uploading file
      if (!fileUploads.heroImage) {
        formDataToSend.append('heroImage', formData.heroImage);
      }
      
      // Process stats (convert icons back to strings)
      const processedStats = formData.stats.map(stat => ({
        ...stat,
        icon: iconOptions.find(opt => opt.component === stat.icon)?.name || 'Target'
      }));
      formDataToSend.append('stats', JSON.stringify(processedStats));
      
      // Process values (convert icons back to strings)
      const processedValues = formData.values.map(value => ({
        ...value,
        icon: iconOptions.find(opt => opt.component === value.icon)?.name || 'Target'
      }));
      formDataToSend.append('values', JSON.stringify(processedValues));
      
      // Add partners
      formDataToSend.append('partners', JSON.stringify(formData.partners));
      
      // Add file uploads
      Object.entries(fileUploads).forEach(([key, file]) => {
        formDataToSend.append(key, file);
      });
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/about`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (result.success) {
        await fetchAboutData(); // Refresh data
        setIsEditModalOpen(false);
        setFileUploads({});
        setPreviewUrls({});
        toast.success('About page updated successfully!');
      } else {
        throw new Error(result.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      toast.error('Error saving data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    setFormData(data);
    setFileUploads({});
    setPreviewUrls({});
    setIsEditModalOpen(false);
  };

  const openEditModal = () => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to edit the about page."
      });
      return;
    }
    setIsEditModalOpen(true);
  };

  const closePopup = () => {
    setSelectedStat(null);
  };


  const getMediaPreview = (mediaUrl: string, isVideo: boolean = false, autoPlayWithoutControls: boolean = false) => {

    if (!mediaUrl) {
      return (
        <div className="w-full h-48 bg-gray-100 dark:bg-slate-700 flex items-center justify-center rounded-lg">
          <Image className="w-12 h-12 mx-auto text-gray-400 dark:text-slate-500 mb-2" />
          <p className="text-sm text-gray-500 dark:text-slate-400">No media available</p>
        </div>
      );
    }

    const resolvedUrl = getMediaUrl(mediaUrl);
    const isVideoFile = isVideo || isVideoUrl(mediaUrl);

    if (isVideoFile) {
      return (
        <div className="w-full">
          <video
            className="w-full h-48 object-cover rounded-lg"
            autoPlay={autoPlayWithoutControls}
            muted
            loop
            playsInline
            controls={!autoPlayWithoutControls}
            preload="metadata"
            key={resolvedUrl}
            onError={(e) => {
              console.error('Video loading error:', resolvedUrl);
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          >
            <source src={resolvedUrl} type="video/mp4" />
            <source src={resolvedUrl} type="video/webm" />
            <source src={resolvedUrl} type="video/ogg" />
            Your browser does not support the video tag.
          </video>
          <div className="hidden w-full h-48 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            Failed to load video
          </div>
        </div>
      );
    }

    // Otherwise image
    return (
      <div className="w-full">
        <img
          src={resolvedUrl}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg"
          key={resolvedUrl}
          onError={(e) => {
            console.error('Image loading error:', resolvedUrl);
            e.currentTarget.style.display = 'none';
            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="hidden w-full h-48 bg-gray-200 dark:bg-slate-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
          Failed to load image
        </div>
      </div>
    );
  };



  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setIsDragging(true);
    setCurrentUploadKey(key);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setCurrentUploadKey('');
  };

  const handleDrop = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    setIsDragging(false);
    setCurrentUploadKey('');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(key, files[0]);
    }
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


  // Helper function to check if URL is a video
  const isVideoUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check common video extensions
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv'];
    const urlLower = url.toLowerCase();
    
    return videoExtensions.some(ext => urlLower.includes(ext));
  };

  // Helper function to get proper media URL
  const getMediaUrl = (url: string): string => {
    if (!url) return '';
    
    if (url.startsWith('http')) {
      return url;
    }
    
    // Handle local uploads
    if (url.startsWith('/uploads/')) {
      return `${API_URL.replace('/api', '')}${url}`;
    }
    
    return url;
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 relative">
      {/* Edit Button for Moderators */}
      {isModerator && (
        <button
          onClick={openEditModal}
          className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-800 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl group"
          title="Edit About Page"
        >
          <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        </button>
      )}


      {/* Hero Section */}
      <section className="relative py-32 lg:py-44 overflow-hidden">
        {/* Video/Image background */}
        {isVideoUrl(data.heroImage) ? (
          // Video background
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
            key={data.heroImage}
            onError={(e) => {
              console.error('Video loading error:', data.heroImage);
              // Fallback to image if video fails
              const videoElement = e.currentTarget;
              videoElement.style.display = 'none';
              const fallbackDiv = videoElement.nextElementSibling as HTMLElement;
              if (fallbackDiv) fallbackDiv.style.display = 'block';
            }}
          >
            <source 
              src={getMediaUrl(data.heroImage)} 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          // Image background
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${getMediaUrl(data.heroImage)})`, 
              zIndex: -2 
            }}
          />
        )}
        
        {/* Fallback for video errors - hidden by default */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden"
          style={{ 
            backgroundImage: `url(${getMediaUrl(data.heroImage)})`, 
            zIndex: -1 
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-blue-900/40" />
        
        {/* Animated elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 dark:bg-blue-400/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 dark:bg-purple-400/30 rounded-full blur-xl animate-pulse delay-1000" />
        
        {/* Content */}
        <div className="container px-6 mx-auto relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-300 dark:text-blue-200 bg-blue-900/30 dark:bg-blue-800/40 backdrop-blur-sm rounded-full border border-blue-500/30 dark:border-blue-400/40">
            <div className="w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse" />
            {t('about.badge')}
          </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white dark:text-slate-100 mb-6 leading-tight">
              {t('about.heading')}
            </h1>
            
            <p className="text-xl text-white/90 dark:text-slate-200/90 leading-relaxed max-w-3xl mb-8">
              {t('about.description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="px-8 py-4 bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl font-semibold transform transition-transform duration-500 shadow-xl hover:shadow-2xl inline-flex items-center gap-2 group relative overflow-hidden cursor-pointer">
                <span className="relative z-10 transition-colors duration-500">{t('about.learn_story')}</span>

                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-500 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>

            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {data.stats.map((stat, index) => (
              <div 
                key={index}
                className="group cursor-pointer"
                onClick={() => setSelectedStat(stat)}
              >
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 transition-all duration-700 ease-in-out hover:shadow-2xl dark:hover:shadow-2xl transform text-center overflow-hidden h-60">
                  
                  {/* Background Image */}
                  {stat.backgroundImage && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 group-hover:opacity-30 dark:opacity-30 dark:group-hover:opacity-40 transition-opacity duration-700 ease-in-out"
                      style={{ backgroundImage: `url(${stat.backgroundImage})` }}
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/40 dark:to-purple-900/40 opacity-60 group-hover:opacity-40 transition-opacity duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-800/30 dark:to-purple-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out" />

                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <div className="inline-flex p-4 mb-4 bg-gradient-to-br from-blue-100/90 to-purple-100/90 dark:from-blue-800/90 dark:to-purple-800/90 rounded-2xl transition-colors duration-700 ease-in-out mx-auto backdrop-blur-sm">
                      <div className="text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-700 ease-in-out">
                        {stat.icon}
                      </div>
                    </div>
                    
                    <div className="text-4xl font-bold text-gray-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-700 ease-in-out">
                      {stat.number}
                    </div>
                    
                    <div className="text-gray-700 dark:text-slate-300 font-medium text-sm">
                      {stat.label}
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                      Click to learn more
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Popup Modal */}
      {selectedStat && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full transition-colors duration-200 z-10"
            >
              <X className="size-6 text-gray-600 dark:text-slate-400" />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800 dark:to-purple-800 rounded-2xl">
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
              
              {selectedStat.popupImage && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src={selectedStat.popupImage} 
                    alt={selectedStat.popupTitle || selectedStat.label}
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              )}
              
              {selectedStat.popupDescription && (
                <div className="text-lg text-gray-700 dark:text-slate-300 leading-relaxed">
                  {selectedStat.popupDescription}
                </div>
              )}
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl border border-gray-200/50 dark:border-slate-600/50">
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


      {/* Story Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container px-6 mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
                {data.image ? (
                  <img 
                    src={data.image.startsWith('/') ? `${API_URL.replace('/api', '')}${data.image}` : data.image}
                    alt="Our story" 
                    className="w-full h-[500px] object-cover transition-transform duration-1500 ease-in-out"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop" 
                    alt="Our story" 
                    className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </div>
            
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-800/40 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-600/50">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                  {t('about.our_story')}
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight">
                  {t('about.two_decades')}
                </h2>
                
                <p className="text-lg text-gray-700 dark:text-slate-300 leading-relaxed mb-8">
                  {data.story}
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl">
                      <Target className="size-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{t('about.our_mission')}</h3>

                      <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                        {data.mission}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 border border-gray-200/50 dark:border-slate-600/50">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-xl">
                      <Lightbulb className="size-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{t('about.our_vision')}</h3>

                      <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                        {data.vision}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.15),transparent_50%)]" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-800/40 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-600/50">
            <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
            {t('about.our_values')}
          </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              {t('about.values_subtitle')}
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed">
              {t('about.values_description')}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {data.values.slice(0, showAllValues ? data.values.length : 4).map((value, index) => (
              <div 
                key={index}
                className={`group cursor-pointer transition-transform duration-700 ease-in-out ${
                  activeValue === index ? 'scale-[1.01]' : 'hover:scale-[1.005]'
                }`}
                onMouseEnter={() => setActiveValue(index)}
              >
                <div className={`bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border transition-all duration-700 ease-in-out h-full ${
                  activeValue === index 
                    ? 'shadow-2xl border-blue-200 dark:border-blue-600 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/30 dark:to-purple-900/30' 
                    : 'border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200/50 dark:hover:border-blue-600/40'
                }`}>
                  <div className={`inline-flex p-4 mb-6 rounded-2xl transition-all duration-700 ease-in-out ${
                    activeValue === index 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-800/40 dark:group-hover:to-purple-800/40'
                  }`}>
                    {value.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4 transition-colors duration-700 ease-in-out group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {value.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4 transition-colors duration-700 ease-in-out group-hover:text-gray-800 dark:group-hover:text-slate-200">
                    {value.description}
                  </p>

                  {/* Video Preview for Value */}
                  {value.videoUrl && (
                    <div className="mt-4">
                      {getMediaPreview(
                        value.videoUrl,
                        true, // Explicitly mark as video
                        true  // Auto-play without controls
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Show More/Less Button */}
          {data.values.length > 6 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAllValues(!showAllValues)}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {showAllValues ? t('about.show_less') : t('about.show_more')}
                <ArrowRight className={`size-5 transition-transform duration-200 ${showAllValues ? 'rotate-180' : 'group-hover:translate-x-1'}`} />
              </button>
            </div>
          )}
        </div>
      </section>



      {/* Partners Section */}
      <section className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-400/20 dark:to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/5 to-pink-500/5 dark:from-indigo-400/10 dark:to-pink-400/10 rounded-full blur-2xl" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-20 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 text-sm font-medium text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-800/40 dark:to-purple-800/40 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-600/50 shadow-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse delay-200" />
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse delay-400" />
              </div>
              <span className="ml-2">{t('about.trusted_partnerships')}</span>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-slate-100 mb-8 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                {t('about.industry_leaders')}
              </span>
              <br />
              <span className="text-gray-900 dark:text-slate-100">Choose Us</span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto">
              {t('about.partners_description')}
            </p>
          </div>

          {data.partners.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {data.partners.map((partner, idx) => (
                  <div key={idx} className="group relative">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-2xl dark:hover:shadow-lg transition-all duration-500 transform hover:scale-[1.005] relative overflow-hidden h-32 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-300/20 to-transparent" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[1px]">
                        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-2xl" />
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-center w-full h-full">
                        <img 
                          src={partner.src.startsWith('/') ? `${API_URL.replace('/api', '')}${partner.src}` : partner.src}
                          alt={partner.name}
                          className="max-h-16 max-w-[80%] object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.01]"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm hidden rounded-lg">
                          {partner.name}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-2xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group cursor-pointer">
              <Building className="size-5" />
              <span>{t('about.join_network')}</span>
              <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
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
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit About Page</h2>
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
                { key: 'general', label: 'General Info', icon: Type },
                { key: 'stats', label: 'Statistics', icon: Award },
                { key: 'values', label: 'Values', icon: Target },
                { key: 'partners', label: 'Partners', icon: Building }
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
                      Badge Text
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
                      Main Heading
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
                      Description
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
                      Company Story
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
                      Mission Statement
                    </label>
                    <textarea
                      value={formData.mission}
                      onChange={(e) => handleInputChange('mission', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Enter mission statement..."
                    />
                  </div>

                  {/* Vision */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Vision Statement
                    </label>
                    <textarea
                      value={formData.vision}
                      onChange={(e) => handleInputChange('vision', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                      placeholder="Enter vision statement..."
                    />
                  </div>

                  {/* Main Story Image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Story Section Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                        isDragging && currentUploadKey === 'image'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'image')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'image')}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange('image', file);
                          }
                        }}
                        className="hidden"
                      />
                      
                      {previewUrls.image || formData.image ? (
                        <div className="space-y-4">
                          {/* Update this container to be wider */}
                          <div className="relative w-full h-48 mx-auto bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                            {getMediaPreview(
                              previewUrls.image || (formData.image?.startsWith('/') 
                                ? `${API_URL.replace('/api', '')}${formData.image}` 
                                : formData.image),
                              fileUploads.image?.type?.startsWith('video/') // ✅ Only mark as video if type is video/*
                            )}

                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {fileUploads.image?.name || 'Current image'}
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
                              Images or videos up to 200MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hero Image */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Hero Background Image
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                        isDragging && currentUploadKey === 'heroImage'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                      }`}
                      onDragOver={(e) => handleDragOver(e, 'heroImage')}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'heroImage')}
                      onClick={() => document.getElementById('heroImage-upload')?.click()}
                    >
                      <input
                        id="heroImage-upload"
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange('heroImage', file);
                          }
                        }}
                        className="hidden"
                      />
                      
                      {previewUrls.heroImage || formData.heroImage ? (
                        <div className="space-y-4">
                          {/* Update this container to be wider */}
                          <div className="relative w-full h-48 mx-auto bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden">
                            {getMediaPreview(
                              previewUrls.heroImage || formData.heroImage,
                              fileUploads.heroImage?.type?.startsWith('video/') // ✅ Correct detection
                            )}

                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {fileUploads.heroImage?.name || 'Current image'}
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
                              Images or videos up to 200MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => handleInputChange('heroImage', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                      placeholder="Or enter image URL..."
                    />
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>
                    <button
                      onClick={addStat}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stat
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number</label>
                          <input
                            type="text"
                            value={stat.number}
                            onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="50+"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Label</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            placeholder="Projects Completed"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icon</label>
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
                          <div
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 mb-2 ${
                              isDragging && currentUploadKey === `stat_${index}_backgroundImage`
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                            }`}
                            onDragOver={(e) => handleDragOver(e, `stat_${index}_backgroundImage`)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, `stat_${index}_backgroundImage`)}
                            onClick={() => document.getElementById(`stat_${index}_backgroundImage-upload`)?.click()}
                          >
                            <input
                              id={`stat_${index}_backgroundImage-upload`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileChange(`stat_${index}_backgroundImage`, file);
                                }
                              }}
                              className="hidden"
                            />
                            
                            {previewUrls[`stat_${index}_backgroundImage`] || stat.backgroundImage ? (
                              <div className="space-y-2">
                                <div className="relative w-full h-56 mx-auto bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                                  <img
                                    src={previewUrls[`stat_${index}_backgroundImage`] || stat.backgroundImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                                  {fileUploads[`stat_${index}_backgroundImage`]?.name || 'Current image'}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-6 h-6 mx-auto text-gray-400 dark:text-slate-500" />
                                <p className="text-xs text-gray-600 dark:text-slate-400">
                                  Click or drag to upload
                                </p>
                              </div>
                            )}
                          </div>
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
                          <div
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 mb-2 ${
                              isDragging && currentUploadKey === `stat_${index}_popupImage`
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                            }`}
                            onDragOver={(e) => handleDragOver(e, `stat_${index}_popupImage`)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, `stat_${index}_popupImage`)}
                            onClick={() => document.getElementById(`stat_${index}_popupImage-upload`)?.click()}
                          >
                            <input
                              id={`stat_${index}_popupImage-upload`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileChange(`stat_${index}_popupImage`, file);
                                }
                              }}
                              className="hidden"
                            />
                            
                            {previewUrls[`stat_${index}_popupImage`] || stat.popupImage ? (
                              <div className="space-y-2">
                                <div className="relative w-full h-56 mx-auto bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                                  <img
                                    src={previewUrls[`stat_${index}_popupImage`] || stat.popupImage}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                                  {fileUploads[`stat_${index}_popupImage`]?.name || 'Current image'}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="w-6 h-6 mx-auto text-gray-400 dark:text-slate-500" />
                                <p className="text-xs text-gray-600 dark:text-slate-400">
                                  Click or drag to upload
                                </p>
                              </div>
                            )}
                          </div>
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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Company Values</h3>
                    <button
                      onClick={addValue}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Value
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
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
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                          <textarea
                            value={value.description}
                            onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none"
                            placeholder="Detailed description of this value..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video (Optional)</label>
                          <div
                            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 mb-2 ${
                              isDragging && currentUploadKey === `value_${index}_video`
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                            }`}
                            onDragOver={(e) => handleDragOver(e, `value_${index}_video`)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, `value_${index}_video`)}
                            onClick={() => document.getElementById(`value_${index}_video-upload`)?.click()}
                          >
                            <input
                              id={`value_${index}_video-upload`}
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileChange(`value_${index}_video`, file);
                                  // Also update the video URL in form data
                                  handleValueChange(index, 'videoUrl', URL.createObjectURL(file));
                                }
                              }}
                              className="hidden"
                            />
                            
                            {previewUrls[`value_${index}_video`] || value.videoUrl ? (
                              <div className="space-y-2">
                                <div className="relative w-full h-48 mx-auto bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                                  {getMediaPreview(
                                    previewUrls[`value_${index}_video`] || value.videoUrl,
                                    true, // Mark as video
                                    true  // Auto-play without controls
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                                  {fileUploads[`value_${index}_video`]?.name || 'Current video'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-500">
                                  Click or drag to replace
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                                  <Video className="w-8 h-8 text-gray-400 dark:text-slate-500" />
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-slate-400">
                                    <span className="text-blue-600 dark:text-blue-400 font-medium">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                                    Videos up to 200MB
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
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


              {/* Partners Tab */}
              {activeTab === 'partners' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Partners</h3>
                    <button
                      onClick={addPartner}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Partner
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.partners.map((partner, index) => (
                      <div key={index} className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700/50 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">Partner {index + 1}</h4>
                          <button
                            onClick={() => removePartner(index)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Partner Name</label>
                            <input
                              type="text"
                              value={partner.name}
                              onChange={(e) => handlePartnerChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              placeholder="Partner Name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo</label>
                            <div
                              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 mb-2 ${
                                isDragging && currentUploadKey === `partner_${index}_src`
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
                              }`}
                              onDragOver={(e) => handleDragOver(e, `partner_${index}_src`)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, `partner_${index}_src`)}
                              onClick={() => document.getElementById(`partner_${index}_src-upload`)?.click()}
                            >
                              <input
                                id={`partner_${index}_src-upload`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileChange(`partner_${index}_src`, file);
                                  }
                                }}
                                className="hidden"
                              />
                              
                              {previewUrls[`partner_${index}_src`] || partner.src ? (
                                <div className="space-y-2">
                                  <div className="relative w-16 h-16 mx-auto bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                                    <img
                                      src={previewUrls[`partner_${index}_src`] || (partner.src?.startsWith('/') ? `${API_URL.replace('/api', '')}${partner.src}` : partner.src)}
                                      alt={partner.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-slate-400 truncate">
                                    {fileUploads[`partner_${index}_src`]?.name || 'Current logo'}
                                  </p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Upload className="w-6 h-6 mx-auto text-gray-400 dark:text-slate-500" />
                                  <p className="text-xs text-gray-600 dark:text-slate-400">
                                    Click or drag to upload
                                  </p>
                                </div>
                              )}
                            </div>
                            <input
                              type="url"
                              value={partner.src}
                              onChange={(e) => handlePartnerChange(index, 'src', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              placeholder="Or enter logo URL..."
                            />
                          </div>

                          {/* Image Preview */}
                          {(previewUrls[`partner_${index}_src`] || (partner.src && !fileUploads[`partner_${index}_src`])) && (
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</label>
                              <div className="relative w-full h-24 bg-gray-100 dark:bg-slate-600 rounded-lg overflow-hidden flex items-center justify-center">
                                <img
                                  src={previewUrls[`partner_${index}_src`] || (partner.src?.startsWith('/') ? `${API_URL.replace('/api', '')}${partner.src}` : partner.src)}
                                  alt={partner.name}
                                  className="max-h-16 max-w-[80%] object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                                <div className="absolute inset-0 bg-gray-200 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm hidden">
                                  Failed to load image
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {formData.partners.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No partners yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by adding your first partner.</p>
                      <button
                        onClick={addPartner}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Partner
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-4 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage