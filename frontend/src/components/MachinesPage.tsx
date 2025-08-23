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
  Zap,
  Cog,
  Gauge,
  Settings,
  ChevronDown,
  Edit3,
  X,
  Save,
  Plus,
  Trash2,
  Type,
  FileText,
  Image,
  Hash
} from 'lucide-react';

interface Machine {
  id: string;
  title: string;
  description: string;
  image: string;
  specifications: string[];
  capacity: string;
  powerRequirement: string;
  category: string;
  model: string;
  yearManufactured: string;
  status: 'Available' | 'In Use' | 'Maintenance';
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface MachinesPageProps {
  badge?: string;
  heading?: string;
  description?: string;
  machines?: Machine[];
  testimonials?: Testimonial[];
  stats?: Stat[];
  isModerator?: boolean;
}

interface MachinesFormData {
  badge: string;
  heading: string;
  description: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  machines: Array<{
    id: string;
    title: string;
    description: string;
    image: string;
    specifications: string[];
    capacity: string;
    powerRequirement: string;
    category: string;
    model: string;
    yearManufactured: string;
    status: 'Available' | 'In Use' | 'Maintenance';
  }>;
}

const MachinesPage = ({
  badge = "Our Equipment",
  heading = "Industrial Machinery Fleet",
  description = "MECOSO operates state-of-the-art industrial machinery for manufacturing, fabrication, and assembly operations. Our equipment fleet ensures precision, efficiency, and reliability in every project we undertake.",
  machines = [
    {
      id: '1',
      title: "CNC Plasma Cutting Machine",
      description: "High-precision plasma cutting system for steel plates and structural components, delivering clean cuts with minimal heat-affected zones.",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      specifications: ["Cutting Thickness: 6-200mm", "Table Size: 6m x 2m", "Precision: ±0.5mm", "Automatic Height Control"],
      capacity: "200mm max thickness",
      powerRequirement: "380V, 200A",
      category: "Cutting",
      model: "MECOSO-PC-6200",
      yearManufactured: "2023",
      status: "Available"
    },
    {
      id: '2',
      title: "Hydraulic Press Brake",
      description: "Heavy-duty press brake for precise bending of steel plates and sheets, essential for tank and structural fabrication.",
      image: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?w=800&h=600&fit=crop",
      specifications: ["Bending Force: 400 Ton", "Working Length: 4000mm", "Throat Depth: 400mm", "NC Control System"],
      capacity: "400 Ton bending force",
      powerRequirement: "380V, 45kW",
      category: "Forming",
      model: "MECOSO-PB-400",
      yearManufactured: "2022",
      status: "Available"
    },
    {
      id: '3',
      title: "Overhead Bridge Crane",
      description: "Heavy-duty overhead crane system for material handling and positioning during assembly operations in our workshop.",
      image: "https://images.unsplash.com/photo-1518709594023-6eab9bab7b23?w=800&h=600&fit=crop",
      specifications: ["Lifting Capacity: 50 Ton", "Span: 25m", "Lifting Height: 12m", "Variable Speed Control"],
      capacity: "50 Ton lifting capacity",
      powerRequirement: "380V, 75kW",
      category: "Handling",
      model: "MECOSO-OC-50",
      yearManufactured: "2021",
      status: "In Use"
    }
  ],
  testimonials = [],
  stats = [
    {
      number: "25+",
      label: "Active Machines",
      icon: <Cog className="size-6" />
    },
    {
      number: "99.5%",
      label: "Uptime Rate",
      icon: <Gauge className="size-6" />
    },
    {
      number: "15+",
      label: "Years Service",
      icon: <Clock className="size-6" />
    },
    {
      number: "24/7",
      label: "Operations",
      icon: <Zap className="size-6" />
    }
  ],
  isModerator = true
}: MachinesPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAllMachines, setShowAllMachines] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'machines'>('general');
  const testimonialRef = useRef<HTMLDivElement>(null);

  // Form data state
  const [formData, setFormData] = useState<MachinesFormData>({
    badge,
    heading,
    description,
    stats: stats.map(stat => ({ number: stat.number, label: stat.label })),
    machines: machines.map(machine => ({ ...machine }))
  });

  // Current data state (what's displayed)
  const [currentData, setCurrentData] = useState({
    badge,
    heading,
    description,
    stats: stats.map(stat => ({ number: stat.number, label: stat.label })),
    machines: machines.map(machine => ({ ...machine }))
  });

  const categories = ['All', ...Array.from(new Set(currentData.machines.map(m => m.category)))];
  const filteredMachines = selectedCategory === 'All' 
    ? currentData.machines 
    : currentData.machines.filter(m => m.category === selectedCategory);
  
  const initialMachineCount = 6;
  const visibleMachines = showAllMachines ? filteredMachines : filteredMachines.slice(0, initialMachineCount);
  const hasMoreMachines = filteredMachines.length > initialMachineCount;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    setShowAllMachines(false);
  }, [selectedCategory]);

  // Icon mapping for stats
  const getIconForStat = (label: string) => {
    switch (label.toLowerCase()) {
      case 'active machines': return <Cog className="size-6" />;
      case 'uptime rate': return <Gauge className="size-6" />;
      case 'years service': return <Clock className="size-6" />;
      case 'operations': return <Zap className="size-6" />;
      default: return <Settings className="size-6" />;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatChange = (index: number, field: 'number' | 'label', value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { number: '', label: '' }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleMachineChange = (machineIndex: number, field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.map((machine, i) => 
        i === machineIndex ? { ...machine, [field]: value } : machine
      )
    }));
  };

  const handleSpecificationChange = (machineIndex: number, specIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.map((machine, i) => 
        i === machineIndex 
          ? { 
              ...machine, 
              specifications: machine.specifications.map((spec, j) => 
                j === specIndex ? value : spec
              )
            }
          : machine
      )
    }));
  };

  const addSpecification = (machineIndex: number) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.map((machine, i) => 
        i === machineIndex 
          ? { ...machine, specifications: [...machine.specifications, ''] }
          : machine
      )
    }));
  };

  const removeSpecification = (machineIndex: number, specIndex: number) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.map((machine, i) => 
        i === machineIndex 
          ? { 
              ...machine, 
              specifications: machine.specifications.filter((_, j) => j !== specIndex)
            }
          : machine
      )
    }));
  };

  const addMachine = () => {
    const newMachine = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '',
      specifications: [''],
      capacity: '',
      powerRequirement: '',
      category: '',
      model: '',
      yearManufactured: new Date().getFullYear().toString(),
      status: 'Available' as const
    };
    
    setFormData(prev => ({
      ...prev,
      machines: [...prev.machines, newMachine]
    }));
  };

  const removeMachine = (machineIndex: number) => {
    setFormData(prev => ({
      ...prev,
      machines: prev.machines.filter((_, i) => i !== machineIndex)
    }));
  };

  const handleSave = () => {
    // Update current data with form data
    setCurrentData({
      badge: formData.badge,
      heading: formData.heading,
      description: formData.description,
      stats: formData.stats,
      machines: formData.machines
    });
    
    // Here you would make the API call to Node.js backend
    console.log('Saving machines page data:', formData);
    // TODO: Add API call to Node.js backend
    // await saveMachinesPageData(formData);
    
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    // Reset form data to current data
    setFormData({
      badge: currentData.badge,
      heading: currentData.heading,
      description: currentData.description,
      stats: currentData.stats,
      machines: currentData.machines
    });
    setIsModalOpen(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`size-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-blue-300'}`} 
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300 border border-green-200 dark:border-green-500/30';
      case 'In Use': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/30';
      default: return 'bg-slate-100 text-slate-800 dark:bg-blue-500/20 dark:text-blue-300 border border-slate-200 dark:border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950 dark:via-blue-900 dark:to-slate-900">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/20 dark:from-blue-400/20 dark:to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        
        {/* Edit Button for Moderators */}
        {isModerator && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-slate-900 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title="Edit Machines Page"
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/20 dark:backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-400/30">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {currentData.badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {currentData.heading}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
              {currentData.description}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {currentData.stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-600/30 dark:text-blue-300 rounded-xl">
                      {getIconForStat(stat.label)}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.number}</div>
                  <div className="text-slate-500 dark:text-slate-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Machines Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="container px-6 mx-auto">
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 dark:bg-cyan-500 text-white shadow-lg transform scale-105 shadow-blue-500/30 dark:shadow-cyan-500/25'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Machines Grid */}
          <div className="w-full">
            <div className="grid lg:grid-cols-2 gap-8 relative">
              {visibleMachines.map((machine, index) => {
                const isNearShowMore = !showAllMachines && hasMoreMachines && index >= initialMachineCount - 2;
                return (
                  <div 
                    key={machine.id}
                    className={`group relative bg-white dark:bg-slate-800 dark:backdrop-blur-sm rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2 ${
                      isNearShowMore ? 'opacity-60' : 'opacity-100'
                    }`}
                  >
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={machine.image} 
                        alt={machine.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-slate-900/80 dark:via-transparent dark:to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-slate-800 dark:bg-slate-700/90 dark:text-slate-100 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600/50">
                          {machine.category}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 backdrop-blur-sm text-sm font-medium rounded-full ${getStatusColor(machine.status)}`}>
                          {machine.status}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white dark:bg-black/70 dark:text-slate-100 text-xs font-medium rounded-full border border-slate-400/30 dark:border-slate-500/30">
                          {machine.model}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-300 transition-colors duration-300">
                        {machine.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4 text-sm">
                        {machine.description}
                      </p>

                      <div className="space-y-1 mb-4">
                        {machine.specifications.slice(0, 2).map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="size-3 text-green-500 dark:text-green-400" />
                            <span className="text-slate-700 dark:text-slate-300 text-xs">{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Target className="size-3 text-blue-500 dark:text-cyan-400" />
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Capacity</div>
                            <div className="text-xs font-medium text-slate-800 dark:text-white">{machine.capacity}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Zap className="size-3 text-blue-500 dark:text-cyan-400" />
                          <div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Power</div>
                            <div className="text-xs font-medium text-slate-800 dark:text-white">{machine.powerRequirement}</div>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedMachine(machine)}
                        className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 hover:from-blue-500 hover:to-indigo-500 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg group-hover:shadow-blue-500/30 dark:group-hover:shadow-cyan-500/25 flex items-center justify-center gap-2 text-sm"
                      >
                        View Details
                        <ArrowUpRight className="size-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {hasMoreMachines && !showAllMachines && (
              <div className="flex justify-center mt-12 relative">
                <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent dark:from-slate-900 dark:to-transparent pointer-events-none z-10" />
                
                <button
                  onClick={() => setShowAllMachines(true)}
                  className="relative z-20 px-8 py-4 bg-white dark:bg-slate-800/50 border-2 border-blue-500 dark:border-cyan-500 text-blue-600 dark:text-cyan-300 rounded-2xl font-semibold hover:bg-blue-50 dark:hover:bg-cyan-600 hover:text-blue-700 dark:hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-cyan-500/25 flex items-center gap-3 backdrop-blur-sm"
                >
                  Show More Machines
                  <ChevronDown className="size-5 animate-bounce" />
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 dark:bg-cyan-500/20 dark:text-cyan-300 text-xs rounded-full border border-blue-200 dark:border-cyan-500/30">
                    +{filteredMachines.length - initialMachineCount}
                  </span>
                </button>
              </div>
            )}

            {showAllMachines && hasMoreMachines && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setShowAllMachines(false)}
                  className="px-8 py-4 bg-white dark:bg-slate-800/50 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
                >
                  Show Less
                  <ChevronRight className="size-5 rotate-90 transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Machine Detail Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800/95 dark:backdrop-blur-md rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
            <div className="relative">
              <img 
                src={selectedMachine.image} 
                alt={selectedMachine.title}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-slate-900/50 dark:to-transparent" />
              <button 
                onClick={() => setSelectedMachine(null)}
                className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm dark:bg-slate-700/90 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-300 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600/50"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-600/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-500/50">
                  {selectedMachine.category}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedMachine.status)}`}>
                  {selectedMachine.status}
                </span>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600/50">
                  {selectedMachine.model}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{selectedMachine.title}</h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">{selectedMachine.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Technical Specifications</h3>
                  <div className="space-y-3">
                    {selectedMachine.specifications.map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="size-5 text-green-500 dark:text-green-400" />
                        <span className="text-slate-700 dark:text-slate-300">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Machine Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Target className="size-5 text-blue-500 dark:text-cyan-400" />
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white">Capacity</div>
                        <div className="text-slate-600 dark:text-slate-300">{selectedMachine.capacity}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="size-5 text-blue-500 dark:text-cyan-400" />
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white">Power Requirement</div>
                        <div className="text-slate-600 dark:text-slate-300">{selectedMachine.powerRequirement}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-blue-500 dark:text-cyan-400" />
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white">Year Manufactured</div>
                        <div className="text-slate-600 dark:text-slate-300">{selectedMachine.yearManufactured}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 text-white rounded-2xl font-semibold hover:from-blue-500 hover:to-indigo-500 dark:hover:from-cyan-500 dark:hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 dark:hover:shadow-cyan-500/25 flex items-center gap-2">
                  Request Access
                  <ChevronRight className="size-5" />
                </button>
                <button 
                  onClick={() => setSelectedMachine(null)}
                  className="px-8 py-4 bg-slate-100 text-slate-800 dark:bg-slate-700/50 dark:text-slate-200 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 border border-slate-200 dark:border-slate-600/50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Machines Page</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              {[
                { key: 'general', label: 'General', icon: Type },
                { key: 'stats', label: 'Statistics', icon: Hash },
                { key: 'machines', label: 'Machines', icon: Cog }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === key
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Badge Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h3>
                    <button
                      onClick={addStat}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stat
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {formData.stats.map((stat, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900 dark:text-white">Stat {index + 1}</h4>
                          {formData.stats.length > 1 && (
                            <button
                              onClick={() => removeStat(index)}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Number/Value
                            </label>
                            <input
                              type="text"
                              value={stat.number}
                              onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              placeholder="e.g., 25+, 99.5%, 24/7"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Label
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              placeholder="e.g., Active Machines, Uptime Rate"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'machines' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Machines</h3>
                    <button
                      onClick={addMachine}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Machine
                    </button>
                  </div>

                  <div className="space-y-8">
                    {formData.machines.map((machine, machineIndex) => (
                      <div key={machine.id} className="p-6 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <div className="flex items-center justify-between mb-6">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Machine {machineIndex + 1}: {machine.title || 'Untitled'}
                          </h4>
                          {formData.machines.length > 1 && (
                            <button
                              onClick={() => removeMachine(machineIndex)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid gap-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                value={machine.title}
                                onChange={(e) => handleMachineChange(machineIndex, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="Machine title..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Category
                              </label>
                              <input
                                type="text"
                                value={machine.category}
                                onChange={(e) => handleMachineChange(machineIndex, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="e.g., Cutting, Forming, Handling"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Description
                            </label>
                            <textarea
                              value={machine.description}
                              onChange={(e) => handleMachineChange(machineIndex, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none"
                              placeholder="Machine description..."
                            />
                          </div>

                          {/* Image */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Image URL
                            </label>
                            <input
                              type="url"
                              value={machine.image}
                              onChange={(e) => handleMachineChange(machineIndex, 'image', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              placeholder="https://example.com/image.jpg"
                            />
                            {machine.image && (
                              <div className="mt-2">
                                <img
                                  src={machine.image}
                                  alt="Preview"
                                  className="w-full h-32 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          {/* Technical Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Model
                              </label>
                              <input
                                type="text"
                                value={machine.model}
                                onChange={(e) => handleMachineChange(machineIndex, 'model', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="Model number..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Year Manufactured
                              </label>
                              <input
                                type="text"
                                value={machine.yearManufactured}
                                onChange={(e) => handleMachineChange(machineIndex, 'yearManufactured', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="Year..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Status
                              </label>
                              <select
                                value={machine.status}
                                onChange={(e) => handleMachineChange(machineIndex, 'status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              >
                                <option value="Available">Available</option>
                                <option value="In Use">In Use</option>
                                <option value="Maintenance">Maintenance</option>
                              </select>
                            </div>
                          </div>

                          {/* Capacity and Power */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Capacity
                              </label>
                              <input
                                type="text"
                                value={machine.capacity}
                                onChange={(e) => handleMachineChange(machineIndex, 'capacity', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="e.g., 200mm max thickness"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Power Requirement
                              </label>
                              <input
                                type="text"
                                value={machine.powerRequirement}
                                onChange={(e) => handleMachineChange(machineIndex, 'powerRequirement', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                placeholder="e.g., 380V, 200A"
                              />
                            </div>
                          </div>

                          {/* Specifications */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                Specifications
                              </label>
                              <button
                                onClick={() => addSpecification(machineIndex)}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                Add Spec
                              </button>
                            </div>
                            
                            <div className="space-y-2">
                              {machine.specifications.map((spec, specIndex) => (
                                <div key={specIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={spec}
                                    onChange={(e) => handleSpecificationChange(machineIndex, specIndex, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                    placeholder="Specification..."
                                  />
                                  {machine.specifications.length > 1 && (
                                    <button
                                      onClick={() => removeSpecification(machineIndex, specIndex)}
                                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
    </div>
  );
};

export default MachinesPage;