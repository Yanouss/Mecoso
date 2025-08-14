import React, { useState } from 'react';
import { Link } from "react-router";
import { Edit3, X, Save, Image, Type, FileText } from 'lucide-react';

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

interface HeroFormData {
  heading: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
}

const Hero = ({
  heading = "Blocks Built With Shadcn & Tailwind",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  image = {
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80",
    alt: "Hero section demo image showing interface components",
  },
  isModerator = true, // Set to true for demo purposes
}: Hero1Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<HeroFormData>({
    heading,
    description,
    imageSrc: image.src,
    imageAlt: image.alt,
    primaryButtonText: "Start Your Project",
    primaryButtonUrl: "/contact"
  });
  
  const [currentData, setCurrentData] = useState({
    heading,
    description,
    image,
    primaryButton: {
      text: "Start Your Project",
      url: "/contact"
    }
  });

  const handleInputChange = (field: keyof HeroFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Update the current data with form data
    setCurrentData({
      heading: formData.heading,
      description: formData.description,
      image: {
        src: formData.imageSrc,
        alt: formData.imageAlt
      },
      primaryButton: {
        text: formData.primaryButtonText,
        url: formData.primaryButtonUrl
      }
    });
    
    // Here you would make the API call to Node.js backend
    console.log('Saving hero data:', formData);
    // TODO: Add API call to Node.js backend
    // await saveHeroData(formData);
    
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    // Reset form data to current data
    setFormData({
      heading: currentData.heading,
      description: currentData.description,
      imageSrc: currentData.image.src,
      imageAlt: currentData.image.alt,
      primaryButtonText: currentData.primaryButton.text,
      primaryButtonUrl: currentData.primaryButton.url
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <section 
        className="relative py-44 bg-cover bg-center bg-no-repeat transition-all duration-500"
        style={{ backgroundImage: `url(${currentData.image.src})` }}
      >
        {/* Enhanced overlay with gradient for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-blue-900/40 dark:from-slate-900/80 dark:via-slate-800/70 dark:to-blue-900/60"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent dark:from-transparent dark:via-blue-400/10 dark:to-transparent animate-pulse"></div>
        
        {/* Edit Button for Moderators */}
        {isModerator && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Edit Hero Section"
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        <div className="mx-auto container relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl text-white dark:text-slate-100 drop-shadow-2xl animate-fade-in-up">
              {currentData.heading}
            </h1>
            <p className="text-white/90 dark:text-slate-200/90 mb-8 max-w-xl lg:text-xl text-justify drop-shadow-lg animate-fade-in-up animation-delay-200">
              {currentData.description}
            </p>

            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row max-w-md">
              <div className="text-center mt-16 animate-fade-in-up animation-delay-400">
                <Link
                  to={currentData.primaryButton.url}
                  className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-400 dark:hover:to-blue-500 transform hover:scale-105 transition-all duration-700 shadow-xl hover:shadow-2xl cursor-pointer group overflow-hidden"
                >
                  <span className="relative z-10">{currentData.primaryButton.text}</span>
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Link>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
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

                {/* Image Section */}
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
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.imageSrc}
                        onChange={(e) => handleInputChange('imageSrc', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Alt Text
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
                    {formData.imageSrc && (
                      <div className="mt-3">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Preview
                        </label>
                        <div className="relative w-full h-32 bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden">
                          <img
                            src={formData.imageSrc}
                            alt={formData.imageAlt}
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

                {/* Button Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded"></div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Primary Button
                    </label>
                  </div>
                  
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
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Hero };