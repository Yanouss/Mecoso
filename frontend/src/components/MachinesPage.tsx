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
  Hash,
  Upload,
  Loader
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';

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

interface MachinesPageData {
  page: {
    badge: string;
    heading: string;
    description: string;
    stats: Array<{ number: string; label: string; }>;
  };
  machines: Machine[];
}

const MachinesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showAllMachines, setShowAllMachines] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'machines'>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);


  const [isMachineDetailModalOpen, setIsMachineDetailModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'machine';
    id: string;
    name: string;
  } | null>(null);

  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [isEditMachineModalOpen, setIsEditMachineModalOpen] = useState(false);
  const [machineFormData, setMachineFormData] = useState<Machine | null>(null);
  const editMachineModalRef = useRef<HTMLDivElement>(null);


  const machineDetailModalRef = useRef<HTMLDivElement>(null);
  const deleteModalRef = useRef<HTMLDivElement>(null);


  // Check if user has moderator/admin permissions
  const isModerator = isAuthenticated && user && (user.role === 'moderator' || user.role === 'admin');

  // Form data state
  const [formData, setFormData] = useState<MachinesFormData>({
    badge: "Our Equipment",
    heading: "Industrial Machinery Fleet", 
    description: "MECOSO operates state-of-the-art industrial machinery for manufacturing, fabrication, and assembly operations. Our equipment fleet ensures precision, efficiency, and reliability in every project we undertake.",
    stats: [
      { number: "25+", label: "Active Machines" },
      { number: "99.5%", label: "Uptime Rate" },
      { number: "15+", label: "Years Service" },
      { number: "24/7", label: "Operations" }
    ],
    machines: []
  });

  // Current data state (what's displayed)
  const [currentData, setCurrentData] = useState<MachinesFormData>({
    badge: "Our Equipment",
    heading: "Industrial Machinery Fleet", 
    description: "MECOSO operates state-of-the-art industrial machinery for manufacturing, fabrication, and assembly operations. Our equipment fleet ensures precision, efficiency, and reliability in every project we undertake.",
    stats: [
      { number: "25+", label: "Active Machines" },
      { number: "99.5%", label: "Uptime Rate" },
      { number: "15+", label: "Years Service" },
      { number: "24/7", label: "Operations" }
    ],
    machines: []
  });

  // Load machines page data on component mount
  useEffect(() => {
    loadMachinesPageData();
  }, []);

  const loadMachinesPageData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/machines/page`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load machines page data');
      }

      const result = await response.json();
      const data: MachinesPageData = result.data;
      
      const loadedData = {
        badge: data.page.badge,
        heading: data.page.heading,
        description: data.page.description,
        stats: data.page.stats,
        machines: data.machines
      };

      setCurrentData(loadedData);
      setFormData(loadedData);
    } catch (error) {
      console.error('Error loading machines page data:', error);
      toast.error('Failed to load machines data');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(currentData.machines.map(m => m.category)))];
  const filteredMachines = selectedCategory === 'All' 
    ? currentData.machines 
    : currentData.machines.filter(m => m.category === selectedCategory);
  
  const initialMachineCount = 6;
  const visibleMachines = showAllMachines ? filteredMachines : filteredMachines.slice(0, initialMachineCount);
  const hasMoreMachines = filteredMachines.length > initialMachineCount;

  useEffect(() => {
    setShowAllMachines(false);
  }, [selectedCategory]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isModalOpen && event.target && !(event.target as Element).closest('.edit-modal')) {
        // Don't close if clicking inside the edit modal
        return;
      }
      if (isMachineDetailModalOpen && machineDetailModalRef.current && !machineDetailModalRef.current.contains(event.target as Node)) {
        setIsMachineDetailModalOpen(false);
        setSelectedMachine(null);
      }
      if (deleteModalOpen && deleteModalRef.current && !deleteModalRef.current.contains(event.target as Node)) {
        setDeleteModalOpen(false);
      }
      if (isEditMachineModalOpen && editMachineModalRef.current && !editMachineModalRef.current.contains(event.target as Node)) {
        setIsEditMachineModalOpen(false);
        setEditingMachine(null);
        setMachineFormData(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, isMachineDetailModalOpen, deleteModalOpen, isEditMachineModalOpen]);


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

  // File upload handler
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/machines/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      toast.success('Image uploaded successfully');
      return result.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed');
      throw error;
    } finally {
      setIsUploading(false);
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
    if (formData.stats.length >= 10) {
      toast.error('Maximum 10 stats allowed');
      return;
    }
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { number: '', label: '' }]
    }));
  };

  const removeStat = (index: number) => {
    if (formData.stats.length <= 1) {
      toast.error('At least one stat is required');
      return;
    }
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
      id: `machine_${Date.now()}`,
      title: '',
      description: '',
      image: '',
      specifications: [''],
      capacity: '',
      powerRequirement: '',
      category: 'Cutting',
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

  const validateForm = (): boolean => {
    if (!formData.badge.trim() || !formData.heading.trim() || !formData.description.trim()) {
      toast.error('Badge, heading, and description are required');
      return false;
    }

    if (formData.stats.length === 0) {
      toast.error('At least one statistic is required');
      return false;
    }

    for (let i = 0; i < formData.stats.length; i++) {
      if (!formData.stats[i].number.trim() || !formData.stats[i].label.trim()) {
        toast.error(`Stat ${i + 1} must have both number and label`);
        return false;
      }
    }

    for (let i = 0; i < formData.machines.length; i++) {
      const machine = formData.machines[i];
      if (!machine.title.trim() || !machine.category.trim()) {
        toast.error(`Machine ${i + 1}: Title and Category are required`);
        return false;
      }

      if (machine.specifications.filter(spec => spec.trim() !== '').length === 0) {
        toast.error(`Machine ${i + 1} must have at least one specification`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!isModerator) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/machines/page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          badge: formData.badge,
          heading: formData.heading,
          description: formData.description,
          stats: formData.stats,
          machines: formData.machines
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update machines page');
      }

      const result = await response.json();
      
      // Update current data with the response
      const updatedData = {
        badge: result.data.page.badge,
        heading: result.data.page.heading,
        description: result.data.page.description,
        stats: result.data.page.stats,
        machines: result.data.machines
      };

      setCurrentData(updatedData);
      setFormData(updatedData);
      setIsModalOpen(false);
      toast.success('Machines page updated successfully');
    } catch (error) {
      console.error('Error saving machines page:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
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


    // Machine detail modal handler
  const openMachineDetailModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsMachineDetailModalOpen(true);
  };

  const deleteMachine = async (id: string) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete machines."
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/machines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete machine');
      }

      // Update current data by removing the deleted machine
      setCurrentData(prev => ({
        ...prev,
        machines: prev.machines.filter(m => m.id !== id)
      }));
      
      setFormData(prev => ({
        ...prev,
        machines: prev.machines.filter(m => m.id !== id)
      }));

      toast.error("Machine deleted", {
        description: "The machine has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting machine:', error);
      const errorMessage = error.message || "Failed to delete machine";
      toast.error(errorMessage);
    }
  };

  const confirmDeleteMachine = (id: string, name: string) => {
    if (!isModerator) {
      toast.error("Access denied", {
        description: "You need moderator or admin privileges to delete machines."
      });
      return;
    }

    setItemToDelete({ type: 'machine', id, name });
    setDeleteModalOpen(true);
  };

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-60">
      <div ref={deleteModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Confirm Deletion
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete {itemToDelete?.name || 'this machine'}? 
          This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (itemToDelete) {
                deleteMachine(itemToDelete.id);
              }
              setDeleteModalOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );


  const openEditMachineModal = (machine: Machine) => {
    setEditingMachine(machine);
    setMachineFormData({...machine});
    setIsEditMachineModalOpen(true);
  };

  const handleMachineFormChange = (field: string, value: string | string[]) => {
    if (!machineFormData) return;
    setMachineFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleMachineSpecChange = (specIndex: number, value: string) => {
    if (!machineFormData) return;
    setMachineFormData(prev => prev ? {
      ...prev,
      specifications: prev.specifications.map((spec, i) => i === specIndex ? value : spec)
    } : null);
  };

  const addMachineSpec = () => {
    if (!machineFormData) return;
    setMachineFormData(prev => prev ? {
      ...prev,
      specifications: [...prev.specifications, '']
    } : null);
  };

  const removeMachineSpec = (specIndex: number) => {
    if (!machineFormData || machineFormData.specifications.length <= 1) {
      toast.error('At least one specification is required');
      return;
    }
    setMachineFormData(prev => prev ? {
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== specIndex)
    } : null);
  };

  const validateMachineForm = (): boolean => {
    if (!machineFormData) return false;
    
    if (!machineFormData.title.trim() || !machineFormData.category.trim()) {
      toast.error('Title and Category are required');
      return false;
    }

    if (machineFormData.specifications.filter(spec => spec.trim() !== '').length === 0) {
      toast.error('At least one specification is required');
      return false;
    }

    return true;
  };

  const handleSaveMachine = async () => {
    if (!isModerator || !machineFormData || !editingMachine) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    if (!validateMachineForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/machines/${editingMachine.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(machineFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update machine');
      }

      const result = await response.json();
      
      // Update both current data and form data
      const updatedMachine = result.data;
      setCurrentData(prev => ({
        ...prev,
        machines: prev.machines.map(m => m.id === updatedMachine.id ? updatedMachine : m)
      }));
      
      setFormData(prev => ({
        ...prev,
        machines: prev.machines.map(m => m.id === updatedMachine.id ? updatedMachine : m)
      }));

      setIsEditMachineModalOpen(false);
      setEditingMachine(null);
      setMachineFormData(null);
      toast.success('Machine updated successfully');
    } catch (error) {
      console.error('Error saving machine:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelMachineEdit = () => {
    setIsEditMachineModalOpen(false);
    setEditingMachine(null);
    setMachineFormData(null);
  };

  const handleMachineFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !machineFormData) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(file);
      handleMachineFormChange('image', imageUrl);
    } catch (error) {
      // Error is already handled in handleImageUpload
    }
  };
  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, machineIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(file);
      handleMachineChange(machineIndex, 'image', imageUrl);
    } catch (error) {
      // Error is already handled in handleImageUpload
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 dark:text-slate-300">Loading machines...</span>
        </div>
      </div>
    );
  }

  {deleteModalOpen && <DeleteConfirmationModal />}
  return (
    
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {deleteModalOpen && <DeleteConfirmationModal />}

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950 dark:via-blue-900 dark:to-slate-900">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/20 dark:from-blue-400/20 dark:to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        
        {/* Edit Button for Moderators - Only show if authenticated and authorized */}
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
            {filteredMachines.length === 0 ? (
              <div className="text-center py-16">
                <Cog className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  No machines available
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  {selectedCategory === 'All' 
                    ? 'No machines have been added yet.' 
                    : `No machines found in the "${selectedCategory}" category.`}
                </p>
              </div>
            ) : (
              <>
                <div className="grid lg:grid-cols-3 gap-6 relative">
                  {visibleMachines.map((machine, index) => {
                    const isNearShowMore = !showAllMachines && hasMoreMachines && index >= initialMachineCount - 2;
                    return (
                      <div 
                        key={machine.id}
                        className="group relative bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all duration-500 transform hover:-translate-y-2"
                      >
                        {/* Edit Controls */}
                        {isModerator && (
                          <div className="absolute top-2 right-2 z-20 flex gap-2">
                            <button
                              onClick={() => openEditMachineModal(machine)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                              title="Edit Machine"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDeleteMachine(machine.id, machine.title)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                              title="Delete Machine"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Machine Image */}
                        <div className="relative overflow-hidden">
                          <img
                            src={machine.image}
                            alt={machine.title}
                            className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <span className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-full">
                              {machine.category}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 backdrop-blur-sm text-sm font-medium rounded-full ${getStatusColor(machine.status)}`}>
                              {machine.status}
                            </span>
                          </div>
                        </div>

                        {/* Machine Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                            {machine.title}
                          </h3>
                          <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {machine.description}
                          </p>
                          
                          {/* Specifications */}
                          <div className="space-y-2 mb-6">
                            {machine.specifications.filter(spec => spec.trim() !== '').slice(0, 3).map((spec, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-600 dark:text-slate-400">{spec}</span>
                              </div>
                            ))}
                            {machine.specifications.filter(spec => spec.trim() !== '').length > 3 && (
                              <div className="text-sm text-gray-500 dark:text-slate-500">
                                +{machine.specifications.filter(spec => spec.trim() !== '').length - 3} more specifications
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className="text-gray-600 dark:text-slate-400 text-sm">
                              <Target className="w-4 h-4 inline mr-1" />
                              {machine.capacity}
                            </div>
                            <div className="text-gray-600 dark:text-slate-400 text-sm">
                              <Zap className="w-4 h-4 inline mr-1" />
                              {machine.powerRequirement}
                            </div>
                          </div>

                          {/* Action Button */}
                          <button
                            onClick={() => openMachineDetailModal(machine)}
                            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            View Details
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
              </>
            )}
          </div>
        </div>
      </section>


      {/* Edit Modal - Only accessible to moderators/admins */}
      {isModalOpen && isModerator && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Machines Page</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Logged in as: {user?.name} ({user?.role})
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                disabled={isSaving}
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
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                    activeTab === key
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-white dark:bg-slate-800'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isSaving || formData.stats.length >= 10}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={isSaving}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={isSaving}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                              disabled={isSaving}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          {formData.machines.length > 0 && (
                            <button
                              onClick={() => removeMachine(machineIndex)}
                              disabled={isSaving}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                                Title *
                              </label>
                              <input
                                type="text"
                                value={machine.title}
                                onChange={(e) => handleMachineChange(machineIndex, 'title', e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Machine title..."
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Category *
                              </label>
                              <select
                                value={machine.category}
                                onChange={(e) => handleMachineChange(machineIndex, 'category', e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <option value="">Select category</option>
                                <option value="Cutting">Cutting</option>
                                <option value="Forming">Forming</option>
                                <option value="Handling">Handling</option>
                                <option value="Welding">Welding</option>
                                <option value="Assembly">Assembly</option>
                                <option value="Testing">Testing</option>
                                <option value="Other">Other</option>
                              </select>
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
                              disabled={isSaving}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="Machine description..."
                            />
                          </div>

                          {/* Image Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                              Machine Image
                            </label>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="url"
                                  value={machine.image}
                                  onChange={(e) => handleMachineChange(machineIndex, 'image', e.target.value)}
                                  disabled={isSaving}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                  placeholder="https://example.com/image.jpg or upload a file"
                                />
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, machineIndex)}
                                    disabled={isSaving || isUploading}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                  />
                                  <button
                                    type="button"
                                    disabled={isSaving || isUploading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isUploading ? (
                                      <Loader className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Upload className="w-4 h-4" />
                                    )}
                                    Upload
                                  </button>
                                </div>
                              </div>
                              
                              {machine.image && (
                                <div className="mt-2">
                                  <img
                                    src={machine.image}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop';
                                    }}
                                  />
                                </div>
                              )}
                            </div>
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
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="YYYY"
                                pattern="\d{4}"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                Status
                              </label>
                              <select
                                value={machine.status}
                                onChange={(e) => handleMachineChange(machineIndex, 'status', e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="e.g., 380V, 200A"
                              />
                            </div>
                          </div>

                          {/* Specifications */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                                Specifications *
                              </label>
                              <button
                                onClick={() => addSpecification(machineIndex)}
                                disabled={isSaving}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    disabled={isSaving}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Specification..."
                                  />
                                  {machine.specifications.length > 1 && (
                                    <button
                                      onClick={() => removeSpecification(machineIndex, specIndex)}
                                      disabled={isSaving}
                                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSaving}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Machine Detail Modal */}
      {isMachineDetailModalOpen && selectedMachine && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div ref={machineDetailModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedMachine.title}</h3>
              <button
                onClick={() => {
                  setIsMachineDetailModalOpen(false);
                  setSelectedMachine(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img
                  src={selectedMachine.image}
                  alt={selectedMachine.title}
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop';
                  }}
                />
              </div>
              
              <div>
                <div className="mb-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                    {selectedMachine.category}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedMachine.status)}`}>
                    {selectedMachine.status}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-full border border-slate-200 dark:border-slate-600/50">
                    {selectedMachine.model}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {selectedMachine.description}
                </p>
                
                <div className="space-y-4 mb-8">
                  <h4 className="font-bold text-gray-900 dark:text-slate-100">Technical Specifications</h4>
                  <div className="space-y-2">
                    {selectedMachine.specifications.filter(spec => spec.trim() !== '').map((spec, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-slate-400">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-slate-400">Capacity</div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">{selectedMachine.capacity}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-slate-400">Power Requirement</div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">{selectedMachine.powerRequirement}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-slate-400">Year Manufactured</div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">{selectedMachine.yearManufactured}</div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <Settings className="w-6 h-6 text-orange-600 dark:text-orange-400 mb-2" />
                    <div className="text-sm text-gray-600 dark:text-slate-400">Status</div>
                    <div className="font-semibold text-gray-900 dark:text-slate-100">{selectedMachine.status}</div>
                  </div>
                </div>
                
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Request Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Individual Machine Edit Modal */}
      {isEditMachineModalOpen && editingMachine && machineFormData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div ref={editMachineModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Machine</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {editingMachine.title}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelMachineEdit}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                disabled={isSaving}
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={machineFormData.title}
                      onChange={(e) => handleMachineFormChange('title', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Machine title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Category *
                    </label>
                    <select
                      value={machineFormData.category}
                      onChange={(e) => handleMachineFormChange('category', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select category</option>
                      <option value="Cutting">Cutting</option>
                      <option value="Forming">Forming</option>
                      <option value="Handling">Handling</option>
                      <option value="Welding">Welding</option>
                      <option value="Assembly">Assembly</option>
                      <option value="Testing">Testing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={machineFormData.description}
                    onChange={(e) => handleMachineFormChange('description', e.target.value)}
                    rows={4}
                    disabled={isSaving}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Machine description..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Machine Image
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="url"
                        value={machineFormData.image}
                        onChange={(e) => handleMachineFormChange('image', e.target.value)}
                        disabled={isSaving}
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="https://example.com/image.jpg or upload a file"
                      />
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMachineFileUpload}
                          disabled={isSaving || isUploading}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <button
                          type="button"
                          disabled={isSaving || isUploading}
                          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUploading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Upload
                        </button>
                      </div>
                    </div>
                    
                    {machineFormData.image && (
                      <div className="mt-3">
                        <img
                          src={machineFormData.image}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-slate-600"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={machineFormData.model}
                      onChange={(e) => handleMachineFormChange('model', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Model number..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Year Manufactured
                    </label>
                    <input
                      type="text"
                      value={machineFormData.yearManufactured}
                      onChange={(e) => handleMachineFormChange('yearManufactured', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="YYYY"
                      pattern="\d{4}"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Status
                    </label>
                    <select
                      value={machineFormData.status}
                      onChange={(e) => handleMachineFormChange('status', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                      value={machineFormData.capacity}
                      onChange={(e) => handleMachineFormChange('capacity', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g., 200mm max thickness"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Power Requirement
                    </label>
                    <input
                      type="text"
                      value={machineFormData.powerRequirement}
                      onChange={(e) => handleMachineFormChange('powerRequirement', e.target.value)}
                      disabled={isSaving}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="e.g., 380V, 200A"
                    />
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                      Specifications *
                    </label>
                    <button
                      onClick={addMachineSpec}
                      disabled={isSaving}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                      Add Spec
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {machineFormData.specifications.map((spec, specIndex) => (
                      <div key={specIndex} className="flex gap-2">
                        <input
                          type="text"
                          value={spec}
                          onChange={(e) => handleMachineSpecChange(specIndex, e.target.value)}
                          disabled={isSaving}
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Specification..."
                        />
                        {machineFormData.specifications.length > 1 && (
                          <button
                            onClick={() => removeMachineSpec(specIndex)}
                            disabled={isSaving}
                            className="p-3 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={handleCancelMachineEdit}
                disabled={isSaving}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMachine}
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Machine'}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default MachinesPage;