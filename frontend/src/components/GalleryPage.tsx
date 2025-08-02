import React, { useState } from 'react';
import { ArrowUpRight, Eye } from 'lucide-react';

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
}

const GalleryPage = ({
  badge = "Our Portfolio",
  heading = "Project Gallery",
  description = "Explore our completed projects and industrial solutions. From mining equipment to steel structures, see the quality and precision that defines MECOSO's work across various industrial sectors.",
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
  ]
}: GalleryPageProps) => {
  const [visibleItems, setVisibleItems] = useState(8);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const showMoreItems = () => {
    setVisibleItems(prev => Math.min(prev + 4, galleryItems.length));
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'large':
        return 'lg:col-span-2 lg:row-span-2 h-96 lg:h-auto';
      case 'medium':
        return 'lg:col-span-1 lg:row-span-2 h-80';
      case 'small':
        return 'lg:col-span-1 lg:row-span-1 h-64';
      default:
        return 'lg:col-span-1 lg:row-span-1 h-64';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              {badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {galleryItems.slice(0, visibleItems).map((item, index) => (
              <div 
                key={item.id}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${getSizeClasses(item.size)}`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                    <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full mb-3">
                      {item.category}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-gray-200 leading-relaxed mb-4 text-sm lg:text-base">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Eye className="size-4" />
                      <span className="text-sm">View Details</span>
                      <ArrowUpRight className="size-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Always visible title for mobile */}
                  <div className="lg:hidden absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <div className="text-sm text-gray-300">
                      {item.category}
                    </div>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute top-4 right-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-200">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <ArrowUpRight className="size-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fade Effect and Show More Button */}
          {visibleItems < galleryItems.length && (
            <div className="relative mt-16">
              {/* Fade Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
              
              {/* Show More Button */}
              <div className="text-center relative z-10">
                <button 
                  onClick={showMoreItems}
                  className="px-8 py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  Show More Projects
                  <ArrowUpRight className="size-5 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
                <p className="text-gray-500 text-sm mt-4">
                  Showing {visibleItems} of {galleryItems.length} projects
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedItem.image} 
                alt={selectedItem.title}
                className="w-full h-80 lg:h-96 object-cover"
              />
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-300 flex items-center justify-center text-gray-800 font-bold"
              >
                ✕
              </button>
              
              {/* Category Badge on Image */}
              <div className="absolute top-6 left-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 font-medium rounded-full">
                  {selectedItem.category}
                </span>
              </div>
            </div>
            
            <div className="p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {selectedItem.title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {selectedItem.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Contact Us About This Project
                  <ArrowUpRight className="size-5" />
                </button>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;