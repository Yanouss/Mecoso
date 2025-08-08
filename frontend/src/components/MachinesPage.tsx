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
  ChevronDown
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

interface MachinesPageProps {
  badge?: string;
  heading?: string;
  description?: string;
  machines?: Machine[];
  testimonials?: Testimonial[];
  stats?: Array<{
    number: string;
    label: string;
    icon: React.ReactNode;
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
    },
    {
      id: '4',
      title: "Welding Robot System",
      description: "Automated welding system for consistent, high-quality welds on tanks, structures, and industrial equipment components.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop",
      specifications: ["6-Axis Movement", "MIG/TIG/Arc Welding", "Programmable Paths", "Quality Monitoring"],
      capacity: "24/7 operation",
      powerRequirement: "380V, 25kW",
      category: "Welding",
      model: "MECOSO-WR-6A",
      yearManufactured: "2023",
      status: "Available"
    },
    {
      id: '5',
      title: "Surface Grinding Machine",
      description: "Precision surface grinding for finishing critical components and ensuring perfect dimensional accuracy.",
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=800&h=600&fit=crop",
      specifications: ["Grinding Surface: 2000x800mm", "Precision: ±0.01mm", "Magnetic Chuck", "Coolant System"],
      capacity: "2000x800mm surface",
      powerRequirement: "380V, 15kW",
      category: "Machining",
      model: "MECOSO-SG-2000",
      yearManufactured: "2022",
      status: "Available"
    },
    {
      id: '6',
      title: "Rolling Machine",
      description: "Plate rolling machine for forming cylindrical tanks, pipes, and curved structural components with precise radius control.",
      image: "https://images.unsplash.com/photo-1581092335878-0d0b0da2d715?w=800&h=600&fit=crop",
      specifications: ["Rolling Capacity: 30mm x 3000mm", "Min. Diameter: 800mm", "Hydraulic Drive", "Digital Controls"],
      capacity: "30mm thickness",
      powerRequirement: "380V, 55kW",
      category: "Forming",
      model: "MECOSO-RM-3000",
      yearManufactured: "2021",
      status: "Available"
    },
    {
      id: '7',
      title: "Shot Blasting Machine",
      description: "Automated shot blasting system for surface preparation and cleaning of steel components before coating or welding.",
      image: "https://images.unsplash.com/photo-1581092446596-22e9b99a89e7?w=800&h=600&fit=crop",
      specifications: ["Chamber Size: 3m x 2m x 2m", "Turbine Power: 15kW x 8", "Dust Collection", "Automated Cycle"],
      capacity: "3m x 2m x 2m parts",
      powerRequirement: "380V, 120kW",
      category: "Surface Prep",
      model: "MECOSO-SB-8T",
      yearManufactured: "2022",
      status: "Available"
    },
    {
      id: '8',
      title: "Hydraulic Shearing Machine",
      description: "High-precision hydraulic shear for cutting steel plates and sheets to exact dimensions with clean, straight edges.",
      image: "https://images.unsplash.com/photo-1581092164919-43f2b6b4c66a?w=800&h=600&fit=crop",
      specifications: ["Cutting Length: 4000mm", "Max Thickness: 25mm", "Hydraulic System", "Digital Positioning"],
      capacity: "25mm steel cutting",
      powerRequirement: "380V, 37kW",
      category: "Cutting",
      model: "MECOSO-HS-4000",
      yearManufactured: "2023",
      status: "Available"
    },
    {
      id: '9',
      title: "Assembly Station System",
      description: "Modular assembly stations equipped with pneumatic tools and lifting aids for efficient component assembly operations.",
      image: "https://images.unsplash.com/photo-1581092446596-22e9b99a89e7?w=800&h=600&fit=crop",
      specifications: ["Modular Design", "Pneumatic Tools", "Lifting Aids", "Ergonomic Workstations"],
      capacity: "Multiple stations",
      powerRequirement: "380V, 10kW",
      category: "Assembly",
      model: "MECOSO-AS-MOD",
      yearManufactured: "2023",
      status: "Available"
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
  ]
}: MachinesPageProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAllMachines, setShowAllMachines] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const categories = ['All', ...Array.from(new Set(machines.map(m => m.category)))];
  const filteredMachines = selectedCategory === 'All' 
    ? machines 
    : machines.filter(m => m.category === selectedCategory);
  
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
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/20 dark:backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-400/30">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {badge}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {heading}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-12">
              {description}
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-slate-800/50 dark:backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-center mb-3">
                    <div className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-600/30 dark:text-blue-300 rounded-xl">
                      {stat.icon}
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
    </div>
  );
};

export default MachinesPage;