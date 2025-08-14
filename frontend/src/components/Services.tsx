import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Trash2, Plus, X, Save, Image, Type, FileText, Grid3X3 } from 'lucide-react';

interface Feature {
  id?: number;
  title: string;
  description: string;
  image: string;
}

interface ServicesCarouselProps {
  heading?: string;
  description?: string;
  features?: Feature[];
  isModerator?: boolean;
}

type ModalMode = 'add' | 'edit' | 'delete' | 'manage' | null;

interface ServiceFormData {
  title: string;
  description: string;
  image: string;
}

const ServicesCarousel = ({
  heading = "Our Core Services",
  description = "MECOSO delivers complete industrial solutions. From design and fabrication to installation and maintenance. Serving the mining, energy, and heavy industry sectors with a focus on quality, safety, and innovation.",
  features: initialFeatures = [
    {
      id: 1,
      title: "Thickener Manufacturing & Assembly",
      description: "Designing and assembling high-performance thickeners for efficient solid-liquid separation in industrial and mining applications.",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 2,
      title: "Tank Manufacturing & Assembly",
      description: "Expert fabrication and on-site assembly of storage tanks and cement silos, ensuring durability, safety, and compliance.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 3,
      title: "Room Bin & Storage Hopper Manufacturing",
      description: "Custom-engineered bins and hoppers for optimal material storage and flow, tailored to your operational needs.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 4,
      title: "Steel Structure Fabrication & Erection",
      description: "Precision fabrication and erection of steel frameworks for industrial facilities, built to endure and perform.",
      image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: 5,
      title: "Industrial Equipment Installation & Commissioning",
      description: "Professional setup and calibration of industrial machinery, ensuring seamless startup and optimal performance.",
      image: "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  isModerator = true, // Set to true for demo purposes
}: ServicesCarouselProps) => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (!isPlaying || modalMode) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, features.length, modalMode]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const handleInputChange = (field: keyof ServiceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openAddModal = () => {
    setFormData({ title: '', description: '', image: '' });
    setModalMode('add');
  };

  const openEditModal = (feature: Feature) => {
    setEditingFeature(feature);
    setFormData({
      title: feature.title,
      description: feature.description,
      image: feature.image
    });
    setModalMode('edit');
  };

  const openDeleteModal = (feature: Feature) => {
    setEditingFeature(feature);
    setModalMode('delete');
  };

  const openManageModal = () => {
    setModalMode('manage');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingFeature(null);
    setFormData({ title: '', description: '', image: '' });
  };

  const handleAdd = () => {
    const newId = Math.max(...features.map(f => f.id || 0), 0) + 1;
    const newFeature: Feature = {
      id: newId,
      ...formData
    };
    setFeatures([...features, newFeature]);
    console.log('Adding new service:', newFeature);
    // TODO: Add API call to Node.js backend
    closeModal();
  };

  const handleEdit = () => {
    if (!editingFeature) return;
    const updatedFeatures = features.map(f => 
      f.id === editingFeature.id ? { ...f, ...formData } : f
    );
    setFeatures(updatedFeatures);
    console.log('Updating service:', { id: editingFeature.id, ...formData });
    // TODO: Add API call to Node.js backend
    closeModal();
  };

  const handleDelete = () => {
    if (!editingFeature) return;
    const updatedFeatures = features.filter(f => f.id !== editingFeature.id);
    setFeatures(updatedFeatures);
    
    // Adjust current index if necessary
    if (currentIndex >= updatedFeatures.length && updatedFeatures.length > 0) {
      setCurrentIndex(updatedFeatures.length - 1);
    } else if (updatedFeatures.length === 0) {
      setCurrentIndex(0);
    }
    
    console.log('Deleting service:', editingFeature.id);
    // TODO: Add API call to Node.js backend
    closeModal();
  };

  const reorderFeatures = (fromIndex: number, toIndex: number) => {
    const newFeatures = [...features];
    const [movedItem] = newFeatures.splice(fromIndex, 1);
    newFeatures.splice(toIndex, 0, movedItem);
    setFeatures(newFeatures);
    console.log('Reordering services from', fromIndex, 'to', toIndex);
    // TODO: Add API call to Node.js backend
  };

  if (features.length === 0) {
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
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-110'
                  }`}
                >
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 dark:from-black/80 dark:via-black/60 dark:to-black/40" />
                </div>
              ))}

              {/* Current Slide Edit Controls */}
              {isModerator && features[currentIndex] && (
                <div className="absolute top-4 left-4 z-30 flex gap-2">
                  <button
                    onClick={() => openEditModal(features[currentIndex])}
                    className="bg-blue-600/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-2 text-white hover:bg-blue-500/90 transition-all duration-300 shadow-lg group"
                    title="Edit This Service"
                  >
                    <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(features[currentIndex])}
                    className="bg-red-600/90 backdrop-blur-sm border border-red-500/30 rounded-lg p-2 text-white hover:bg-red-500/90 transition-all duration-300 shadow-lg group"
                    title="Delete This Service"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>
              )}

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
                          {features[currentIndex].title}
                        </h2>
                      </div>

                      {/* Description with Animation */}
                      <div className="overflow-hidden">
                        <p 
                          key={`desc-${currentIndex}`}
                          className="text-xl text-white/90 dark:text-slate-200/90 leading-relaxed max-w-lg animate-slide-up-delayed"
                        >
                          {features[currentIndex].description}
                        </p>
                      </div>

                      {/* CTA Button */}
                      <div className="pt-4">
                        <button className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 text-white rounded-2xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl dark:shadow-slate-900/50">
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
              {features.map((_, index) => (
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          
          {/* Add/Edit Modal */}
          {(modalMode === 'add' || modalMode === 'edit') && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    {modalMode === 'add' ? (
                      <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {modalMode === 'add' ? 'Add New Service' : 'Edit Service'}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Service Title
                      </label>
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                      placeholder="Enter service title..."
                    />
                  </div>

                  {/* Description */}
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
                      placeholder="Enter service description..."
                    />
                  </div>

                  {/* Image */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Service Image
                      </label>
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                        placeholder="https://example.com/image.jpg"
                      />

                      {/* Image Preview */}
                      {formData.image && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Preview
                          </label>
                          <div className="relative w-full h-48 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
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
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={modalMode === 'add' ? handleAdd : handleEdit}
                  disabled={!formData.title || !formData.description || !formData.image}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {modalMode === 'add' ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {modalMode === 'delete' && editingFeature && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Service
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete "{editingFeature.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Service
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manage Services Modal */}
          {modalMode === 'manage' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Grid3X3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Manage Services ({features.length})
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    Drag and drop to reorder services, or use the action buttons to edit/delete.
                  </p>
                  <button
                    onClick={openAddModal}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    Add Service
                  </button>
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all duration-200"
                    >
                      {/* Drag Handle */}
                      <div className="flex-shrink-0 cursor-move text-gray-400 dark:text-gray-500">
                        <Grid3X3 className="w-5 h-5" />
                      </div>

                      {/* Service Number */}
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </div>

                      {/* Service Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-slate-600 rounded-lg overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gray-300 dark:bg-slate-500 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hidden">
                          No Image
                        </div>
                      </div>

                      {/* Service Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {feature.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex-shrink-0 flex gap-2">
                        <button
                          onClick={() => openEditModal(feature)}
                          className="p-2 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-blue-600 dark:text-blue-400 rounded-lg transition-all duration-200 group"
                          title="Edit Service"
                        >
                          <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(feature)}
                          className="p-2 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/70 text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 group"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        </button>
                        
                        {/* Reorder Buttons */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => index > 0 && reorderFeatures(index, index - 1)}
                            disabled={index === 0}
                            className="p-1 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-gray-600 dark:text-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            title="Move Up"
                          >
                            <ChevronLeft className="w-3 h-3 rotate-90" />
                          </button>
                          <button
                            onClick={() => index < features.length - 1 && reorderFeatures(index, index + 1)}
                            disabled={index === features.length - 1}
                            className="p-1 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 text-gray-600 dark:text-gray-400 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            title="Move Down"
                          >
                            <ChevronRight className="w-3 h-3 rotate-90" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {features.length === 0 && (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                      <Grid3X3 className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No Services Available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Get started by adding your first service.
                    </p>
                    <button
                      onClick={openAddModal}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Service
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </>
  );
};

export default ServicesCarousel;