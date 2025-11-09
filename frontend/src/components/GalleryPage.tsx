import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Eye, Filter, X, Edit3, Save, Plus, Trash2, Image, Type, FileText, Tag, Layers, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';
import { galleryApi } from '../services/galleryApi';
import { useTranslation } from '../../context/TranslationContext';


interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  size: 'small' | 'medium' | 'large';
}

interface GalleryPageProps {
  badge?: string;
  heading?: string;
  description?: string;
  galleryItems?: GalleryItem[];
  isModerator?: boolean;
}

interface GalleryFormData {
  badge: string;
  heading: string;
  description: string;
  galleryItems: GalleryItem[];
}

const GalleryPage = ({
  badge,
  heading,
  description,
  galleryItems = [
    {
      id: '1',
      title: "Thickener Installation Project",
      description: "Large-scale thickener manufacturing and installation for a major mining operation in Morocco, featuring advanced solid-liquid separation technology.",
      category: "Mining Equipment",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop",
      size: 'large'
    },
    {
      id: '2',
      title: "Industrial Steel Framework",
      description: "Precision steel structure fabrication for a manufacturing facility, showcasing our expertise in structural engineering.",
      category: "Steel Structures",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&h=400&fit=crop",
      size: 'medium'
    },
    {
      id: '3',
      title: "Storage Tank Assembly",
      description: "Custom storage tank manufacturing and on-site assembly for chemical processing facility.",
      category: "Storage Solutions",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&h=800&fit=crop",
      size: 'medium'
    },
    {
      id: '4',
      title: "Pipeline Installation",
      description: "High-pressure pipeline system installation for gas distribution network across industrial complex.",
      category: "Pipeline Systems",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
      size: 'small'
    },
    {
      id: '5',
      title: "Solar Structure Manufacturing",
      description: "Photovoltaic support structures engineered for maximum efficiency and long-term durability in desert conditions.",
      category: "Solar Solutions",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop",
      size: 'large'
    },
    {
      id: '6',
      title: "Mining Equipment Rehabilitation",
      description: "Complete overhaul and modernization of aging mining equipment, extending operational life by 15+ years.",
      category: "Maintenance",
      image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&h=400&fit=crop",
      size: 'small'
    },
    {
      id: '7',
      title: "Industrial Hopper System",
      description: "Custom-engineered material handling hoppers designed for optimal flow and minimal maintenance requirements.",
      category: "Material Handling",
      image: "https://images.unsplash.com/photo-1565006259165-cfd7c9b14d73?w=600&h=700&fit=crop",
      size: 'medium'
    },
    {
      id: '8',
      title: "Cement Silo Construction",
      description: "Large-capacity cement silos with advanced loading and unloading systems for construction industry.",
      category: "Storage Solutions",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=500&fit=crop",
      size: 'small'
    },
    {
      id: '9',
      title: "Lubrication System Integration",
      description: "Centralized lubrication system design and installation, reducing maintenance costs by 40%.",
      category: "Systems Integration",
      image: "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800&h=600&fit=crop",
      size: 'large'
    },
    {
      id: '10',
      title: "Heavy Machinery Installation",
      description: "Professional installation and commissioning of industrial processing equipment.",
      category: "Equipment Installation",
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&h=400&fit=crop",
      size: 'medium'
    },
    {
      id: '11',
      title: "Structural Welding Project",
      description: "High-precision welding work on critical structural components for power generation facility.",
      category: "Welding Services",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=800&fit=crop",
      size: 'medium'
    },
    {
      id: '12',
      title: "Processing Plant Construction",
      description: "Complete processing plant construction including equipment installation and system integration.",
      category: "Plant Construction",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=600&h=400&fit=crop",
      size: 'small'
    }
  ],
}: GalleryPageProps) => {

  const { t, currentLanguage } = useTranslation();
  
  const { user, isAuthenticated } = useAuth();
  const isModerator = isAuthenticated && user && (user.role === 'moderator' || user.role === 'admin');

  const [visibleItems, setVisibleItems] = useState(8);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [showingAll, setShowingAll] = useState(false);

  // Edit functionality states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<GalleryFormData>({
    badge: badge || t('gallery.badge'),
    heading: heading || t('gallery.heading'),
    description: description || t('gallery.description'),
    galleryItems
  });
  
  const [currentData, setCurrentData] = useState<{
    badge: string;
    heading: string;
    description: string;
    galleryItems: GalleryItem[];
  }>({
    badge: t('gallery.badge'),
    heading: t('gallery.heading'),
    description: t('gallery.description'),
    galleryItems: []
  });

  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: '',
    description: '',
    category: '',
    image: '',
    size: 'medium'
  });

  useEffect(() => {
    fetchGalleryData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fetchGalleryData();
    }
  }, [currentLanguage]);

  const fetchGalleryData = async () => {
    try {
      setIsLoading(true);
      // Use translated endpoint
      const response = await galleryApi.getGalleryPageTranslated(currentLanguage);
      
      setCurrentData({
        badge: t('gallery.badge'),
        heading: t('gallery.heading'),
        description: t('gallery.description'),
        galleryItems: response.data.galleryItems
      });
      
      setFormData({
        badge: t('gallery.badge'),
        heading: t('gallery.heading'),
        description: t('gallery.description'),
        galleryItems: response.data.galleryItems
      });
    } catch (error) {
      toast.error(t('gallery.fetch_error'));
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract unique categories from current data
  const categories = Array.from(new Set(currentData.galleryItems.map(item => item.category)));

  // Filter items based on active filter
  const filteredItems = activeFilter 
    ? currentData.galleryItems.filter(item => item.category === activeFilter)
    : currentData.galleryItems;

  const showMoreItems = () => {
    setVisibleItems(prev => Math.min(prev + 4, filteredItems.length));
    if (visibleItems + 4 >= filteredItems.length) {
      setShowingAll(true);
    }
  };

  const showLessItems = () => {
    setVisibleItems(8);
    setShowingAll(false);
  };

  const getItemWidth = (index: number, totalInRow: number) => {
    const patterns = {
      4: ['25%', '25%', '25%', '25%'],
      5: ['20%', '20%', '20%', '20%', '20%'],
      mixed4: ['30%', '25%', '22%', '23%'],
      mixed5: ['22%', '18%', '20%', '20%', '20%']
    };
    
    if (totalInRow === 4) {
      return patterns.mixed4[index % 4];
    } else if (totalInRow === 5) {
      return patterns.mixed5[index % 5];
    }
    
    return patterns[totalInRow as keyof typeof patterns]?.[index] || '20%';
  };

  const getImageHeight = (size: string) => {
    switch (size) {
      case 'large':
        return 'h-80 md:h-96';
      case 'medium':
        return 'h-72 md:h-80';
      case 'small':
        return 'h-64 md:h-72';
      default:
        return 'h-64 md:h-72';
    }
  };

  // Group items into rows with 4-5 items each
  const groupItemsIntoRows = () => {
    const rows = [];
    let currentRow = [];
    
    for (let i = 0; i < Math.min(visibleItems, filteredItems.length); i++) {
      currentRow.push(filteredItems[i]);
      
      const shouldEndRow = (currentRow.length === 4 && i % 2 === 0) || 
                           (currentRow.length === 5 && i % 2 === 1) ||
                           currentRow.length === 5;
      
      if (shouldEndRow || i === Math.min(visibleItems, filteredItems.length) - 1) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    }
    
    return rows;
  };

  // Edit functionality handlers
  const handleInputChange = (field: keyof GalleryFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (itemId: string, field: keyof GalleryItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      galleryItems: prev.galleryItems.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItem = () => {
    if (newItem.title && newItem.description && newItem.category && newItem.image) {
      const item: GalleryItem = {
        id: Date.now().toString(),
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
        image: newItem.image,
        size: newItem.size as 'small' | 'medium' | 'large'
      };
      
      setFormData(prev => ({
        ...prev,
        galleryItems: [...prev.galleryItems, item]
      }));
      
      setNewItem({
        title: '',
        description: '',
        category: '',
        image: '',
        size: 'medium'
      });
      
      setIsItemModalOpen(false);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      galleryItems: prev.galleryItems.filter(item => item.id !== itemId)
    }));
  };

  const handleSave = async () => {
    try {
      if (!user) {
        toast.error(t('gallery.login_required'));
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error(t('gallery.token_not_found'));
        return;
      }

      const response = await galleryApi.updateGalleryPage(formData, token);
      
      // Refresh with translated data
      await fetchGalleryData();
      
      // Show translation info
      const translationInfo = response.data.translationInfo;
      toast.success(t('gallery.updated_success'), {
        description: translationInfo?.message || "All changes have been saved and translated automatically."
      });
      
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || t('gallery.save_failed'));
      console.error('Error saving gallery:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      badge: currentData.badge,
      heading: currentData.heading,
      description: currentData.description,
      galleryItems: currentData.galleryItems
    });
    setIsEditModalOpen(false);
  };

  const openEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    setNewItem({
      title: item.title,
      description: item.description,
      category: item.category,
      image: item.image,
      size: item.size
    });
    setIsItemModalOpen(true);
  };

  const handleEditItem = () => {
    if (editingItem && newItem.title && newItem.description && newItem.category && newItem.image) {
      setFormData(prev => ({
        ...prev,
        galleryItems: prev.galleryItems.map(item => 
          item.id === editingItem.id ? {
            ...item,
            title: newItem.title!,
            description: newItem.description!,
            category: newItem.category!,
            image: newItem.image!,
            size: newItem.size as 'small' | 'medium' | 'large'
          } : item
        )
      }));
      
      setEditingItem(null);
      setNewItem({
        title: '',
        description: '',
        category: '',
        image: '',
        size: 'medium'
      });
      setIsItemModalOpen(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error(t('gallery.token_not_found'));
      }

      const response = await galleryApi.uploadImage(file, token);
      return response.data.url;
    } catch (error) {
      toast.error(t('gallery.upload_failed'));
      throw error;
    }
  };

  // Fire confetti when a project is selected
  useEffect(() => {
    if (selectedItem) {
      const fireConfetti = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
        });
      };

      const timer = setTimeout(fireConfetti, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedItem]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setVisibleItems(8);
    setShowingAll(false);
  }, [activeFilter]);

  // Add this useEffect to update data when language changes
  useEffect(() => {
    // Only update if we have API data loaded
    if (currentData.galleryItems.length > 0) {
      setCurrentData(prev => ({
        ...prev,
        badge: t('gallery.badge'),
        heading: t('gallery.heading'),
        description: t('gallery.description')
      }));
      
      setFormData(prev => ({
        ...prev,
        badge: t('gallery.badge'),
        heading: t('gallery.heading'),
        description: t('gallery.description')
      }));
    } else {
      // Use translated defaults if no API data yet
      setCurrentData({
        badge: t('gallery.badge'),
        heading: t('gallery.heading'),
        description: t('gallery.description'),
        galleryItems: []
      });
    }
  }, [t]); // This will run when translation changes

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {/* Edit Button for Moderators */}
        {isModerator && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-800 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title={t('gallery.edit_gallery_section')}
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-700/50">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {currentData.badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-300 dark:to-slate-400 bg-clip-text text-transparent mb-6 leading-tight">
              {currentData.heading}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed mb-12">
              {currentData.description}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          {/* Filter Controls */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative w-full max-w-2xl">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-sm hover:shadow-md dark:hover:shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto text-gray-700 dark:text-slate-300"
              >
                <Filter className="size-5" />
                <span>{activeFilter ? `${t('gallery.filter')}: ${activeFilter}` : t('gallery.filter_projects')}</span>
                {activeFilter && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveFilter(null);
                    }}
                    className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </button>
              
              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg dark:shadow-2xl p-4 z-20 animate-fadeIn">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveFilter(category);
                          setShowFilters(false);
                          setVisibleItems(8);
                        }}
                        className={`px-4 py-2 text-sm rounded-full transition-all ${
                          activeFilter === category 
                            ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                            : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Gallery Grid - Full Width Rows */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, index) => (
                  <div 
                    key={index}
                    className="bg-gray-200/50 dark:bg-slate-700/50 animate-pulse rounded-2xl h-64 md:h-72"
                  />
                ))}
              </div>
            ) : (
              groupItemsIntoRows().map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 w-full">
                  {row.map((item, itemIndex) => {
                    const itemWidth = getItemWidth(itemIndex, row.length);
                    return (
                      <div 
                        key={item.id}
                        className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl dark:hover:shadow-2xl hover:scale-[1.02] ${getImageHeight(item.size)}`}
                        style={{ 
                          width: itemWidth, 
                          flexShrink: 0,
                          transformStyle: 'preserve-3d',
                          perspective: '1000px'
                        }}
                        onClick={() => setSelectedItem(item)}
                      >
                        {/* 3D Tilt Effect */}
                        <div className="absolute inset-0 group-hover:rotate-x-[5deg] group-hover:rotate-y-[5deg] transition-transform duration-500 ease-out">
                          {/* Background Image with Blur-Up Effect */}
                          <div className="absolute inset-0">
                            <img 
                              src={item.image} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                          </div>

                          {/* Content Overlay */}
                          <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-end">
                            <div className="transform translate-y-6 md:translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                              <div className="inline-block px-2 md:px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs md:text-sm font-medium rounded-full mb-2 md:mb-3">
                                {item.category}
                              </div>
                              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 md:mb-3 leading-tight">
                                {item.title}
                              </h3>
                              <p className="text-gray-200 leading-relaxed mb-3 md:mb-4 text-xs md:text-sm lg:text-base line-clamp-3">
                                {item.description}
                              </p>
                              <div className="flex items-center gap-2 text-white font-medium">
                                <Eye className="size-3 md:size-4" />
                                <span className="text-xs md:text-sm">{t('gallery.view_details')}</span>
                                <ArrowUpRight className="size-3 md:size-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                              </div>
                            </div>

                            {/* Always visible title for mobile */}
                            <div className="md:hidden absolute bottom-3 left-3 right-3">
                              <h3 className="text-base font-bold text-white mb-1 line-clamp-2">
                                {item.title}
                              </h3>
                              <div className="text-xs text-gray-300">
                                {item.category}
                              </div>
                            </div>
                          </div>

                          {/* Hover indicator */}
                          <div className="absolute top-3 md:top-4 right-3 md:right-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <ArrowUpRight className="size-4 md:size-5 text-white" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Fade Effect and Show More/Less Button */}
          {(visibleItems < filteredItems.length || showingAll) && (
            <div className="relative mt-16">
              {/* Enhanced Fade Effect - only show when not showing all */}
              {!showingAll && (
                <>
                  {/* Primary fade gradient - stronger opacity */}
                  <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-slate-900 via-white/95 dark:via-slate-900/95 to-transparent pointer-events-none z-10" />
                  
                  {/* Secondary overlay for extra strength */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-slate-900 via-white/90 dark:via-slate-900/90 to-transparent pointer-events-none z-10" />
                  
                  {/* Bottom solid overlay to ensure complete fade */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-white dark:bg-slate-900 pointer-events-none z-10" />
                </>
              )}
              
              {/* Show More/Less Button */}
              <div className="text-center relative z-20">
                {!showingAll ? (
                  <button 
                    onClick={showMoreItems}
                    className="px-8 py-4 bg-gray-900 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-2xl dark:hover:shadow-2xl flex items-center gap-2 mx-auto"
                  >
                    {t('gallery.show_more_projects')}
                    <ArrowUpRight className="size-5 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                ) : (
                  <button 
                    onClick={showLessItems}
                    className="px-8 py-4 bg-gray-600 dark:bg-slate-600 hover:bg-gray-700 dark:hover:bg-slate-700 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl dark:shadow-2xl dark:hover:shadow-2xl flex items-center gap-2 mx-auto"
                  >
                    {t('gallery.show_less_projects')}
                    <X className="size-5" />
                  </button>
                )}
                <p className="text-gray-500 dark:text-slate-400 text-sm mt-4">
                  {t('gallery.showing_projects', {
                    current: Math.min(visibleItems, filteredItems.length),
                    total: filteredItems.length,
                    category: activeFilter
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white dark:bg-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn"
            style={{
              animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
            }}
          >
            <div className="relative">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full h-80 lg:h-96 object-cover"
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors duration-300 flex items-center justify-center text-gray-800 dark:text-slate-200 font-bold hover:rotate-90 transform transition-transform duration-300"
              >
                ✕
              </button>
              
              {/* Category Badge on Image */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-800 dark:text-slate-200 font-medium rounded-full">
                  {selectedItem.category}
                </span>
              </div>
            </div>
            
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-6 leading-tight">
                {selectedItem.title}
              </h2>
              <p className="text-gray-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                {selectedItem.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-500 dark:hover:bg-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl dark:shadow-2xl dark:hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  {t('gallery.contact_about_project')}
                  <ArrowUpRight className="size-5" />
                </button>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Gallery Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('gallery.edit_gallery_section')}</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
              <div className="space-y-8">
                {/* Header Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {t('gallery.header_information')}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('gallery.badge_text')}
                      </label>
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => handleInputChange('badge', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={t('gallery.badge_placeholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('gallery.main_heading')}
                      </label>
                      <input
                        type="text"
                        value={formData.heading}
                        onChange={(e) => handleInputChange('heading', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={t('gallery.heading_placeholder')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('gallery.description')}
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        placeholder={t('gallery.description_placeholder')}
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Items Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Image className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      {t('gallery.gallery_items')} ({formData.galleryItems.length})
                    </h3>
                    <button
                      onClick={() => setIsItemModalOpen(true)}
                      className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      {t('gallery.add_item')}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {formData.galleryItems.map((item, index) => (
                      <div key={item.id} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('gallery.item')} {index + 1}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditItem(item)}
                              className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded"
                              title={t('gallery.edit_item')}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                              title={t('gallery.delete_item')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="aspect-video bg-gray-200 dark:bg-slate-600 rounded overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm hidden">
                            {t('gallery.no_image')}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                              {item.category}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.size}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                {t('gallery.save_changes')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-60">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  {editingItem ? <Edit3 className="w-5 h-5 text-green-600 dark:text-green-400" /> : <Plus className="w-5 h-5 text-green-600 dark:text-green-400" />}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingItem ? t('gallery.edit_gallery_item') : t('gallery.add_new_gallery_item')}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsItemModalOpen(false);
                  setEditingItem(null);
                  setNewItem({
                    title: '',
                    description: '',
                    category: '',
                    image: '',
                    size: 'medium'
                  });
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('gallery.project_title')}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={newItem.title || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder={t('gallery.project_title_placeholder')}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('gallery.category')}
                      </label>
                    </div>
                    <input
                      type="text"
                      value={newItem.category || ''}
                      onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder={t('gallery.category_placeholder')}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('gallery.description')}
                    </label>
                  </div>
                  <textarea
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder={t('gallery.project_description_placeholder')}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('gallery.upload_image')}
                    </label>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const imageUrl = await handleImageUpload(file);
                          setNewItem(prev => ({ ...prev, image: imageUrl }));
                        } catch (error) {
                          console.error('Upload failed:', error);
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('gallery.size')}
                    </label>
                  </div>
                  <select
                    value={newItem.size || 'medium'}
                    onChange={(e) => setNewItem(prev => ({ ...prev, size: e.target.value as 'small' | 'medium' | 'large' }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="small">{t('gallery.size_small')}</option>
                    <option value="medium">{t('gallery.size_medium')}</option>
                    <option value="large">{t('gallery.size_large')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={() => {
                  setIsItemModalOpen(false);
                  setEditingItem(null);
                  setNewItem({
                    title: '',
                    description: '',
                    category: '',
                    image: '',
                    size: 'medium'
                  });
                }}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={editingItem ? handleEditItem : handleAddItem}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                disabled={!newItem.title || !newItem.description || !newItem.category || !newItem.image}
              >
                {editingItem ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingItem ? t('gallery.update_item') : t('gallery.add_item')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default GalleryPage;