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
import { useTranslation } from '../../context/TranslationContext';
import { API_URL } from '../../config/api';
import { toast } from 'sonner';
import axios from 'axios';

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
  const { t, currentLanguage } = useTranslation();
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
    badge: t('machines.badge'),
    heading: t('machines.heading'),
    description: t('machines.description'),
    stats: [
      { number: "25+", label: t('machines.stats.active_machines') },
      { number: "99.5%", label: t('machines.stats.uptime_rate') },
      { number: "15+", label: t('machines.stats.years_service') },
      { number: "24/7", label: t('machines.stats.operations') }
    ],
    machines: []
  });

  // Current data state (what's displayed)
  const [currentData, setCurrentData] = useState<MachinesFormData>({
    badge: t('machines.badge'),
    heading: t('machines.heading'),
    description: t('machines.description'),
    stats: [
      { number: "25+", label: t('machines.stats.active_machines') },
      { number: "99.5%", label: t('machines.stats.uptime_rate') },
      { number: "15+", label: t('machines.stats.years_service') },
      { number: "24/7", label: t('machines.stats.operations') }
    ],
    machines: []
  });

  // Load machines page data on component mount
  useEffect(() => {
    loadMachinesPageData();
  }, []);

  // Reload when language changes
  useEffect(() => {
    if (!isLoading) {
      loadMachinesPageData();
    }
  }, [currentLanguage]);

  const loadMachinesPageData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/machines/translated`, {
        params: { lang: currentLanguage }
      });

      const loadedData = {
        badge: t('machines.badge'),
        heading: t('machines.heading'),
        description: t('machines.description'),
        stats: [
          { number: "25+", label: t('machines.stats.active_machines') },
          { number: "99.5%", label: t('machines.stats.uptime_rate') },
          { number: "15+", label: t('machines.stats.years_service') },
          { number: "24/7", label: t('machines.stats.operations') }
        ],
        machines: response.data.data
      };

      setCurrentData(loadedData);
      setFormData(loadedData);
    } catch (error) {
      console.error('Error loading machines page data:', error);
      toast.error(t('machines.error.load_failed'));
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
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('active') || lowerLabel.includes('machines') || lowerLabel.includes('actives')) return <Cog className="size-6" />;
    if (lowerLabel.includes('uptime') || lowerLabel.includes('fonctionnement')) return <Gauge className="size-6" />;
    if (lowerLabel.includes('years') || lowerLabel.includes('service') || lowerLabel.includes('années')) return <Clock className="size-6" />;
    if (lowerLabel.includes('operations') || lowerLabel.includes('opérations')) return <Zap className="size-6" />;
    return <Settings className="size-6" />;
  };

  // Get translated category label
  const getCategoryLabel = (category: string) => {
    const categoryKey = `machines.categories.${category.toLowerCase()}`;
    const translated = t(categoryKey);
    return translated !== categoryKey ? translated : category;
  };

  // Get translated status label
  const getStatusLabel = (status: string) => {
    const statusKey = `machines.status.${status.toLowerCase().replace(' ', '_')}`;
    const translated = t(statusKey);
    return translated !== statusKey ? translated : status;
  };

  // File upload handler
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error(t('machines.error.auth_required'));
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
        throw new Error(errorData.message || t('machines.error.upload_failed'));
      }

      const result = await response.json();
      toast.success(t('machines.success.upload'));
      return result.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error instanceof Error ? error.message : t('machines.error.upload_failed'));
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
      toast.error(t('machines.error.max_stats'));
      return;
    }
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { number: '', label: '' }]
    }));
  };

  const removeStat = (index: number) => {
    if (formData.stats.length <= 1) {
      toast.error(t('machines.error.min_stats'));
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
      toast.error(t('machines.error.required_fields'));
      return false;
    }

    if (formData.stats.length === 0) {
      toast.error(t('machines.error.min_stats'));
      return false;
    }

    for (let i = 0; i < formData.stats.length; i++) {
      if (!formData.stats[i].number.trim() || !formData.stats[i].label.trim()) {
        toast.error(t('machines.error.stat_required').replace('{number}', (i + 1).toString()));
        return false;
      }
    }

    for (let i = 0; i < formData.machines.length; i++) {
      const machine = formData.machines[i];
      if (!machine.title.trim() || !machine.category.trim()) {
        toast.error(t('machines.error.machine_required').replace('{number}', (i + 1).toString()));
        return false;
      }

      if (machine.specifications.filter(spec => spec.trim() !== '').length === 0) {
        toast.error(t('machines.error.specs_required').replace('{number}', (i + 1).toString()));
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!isModerator) {
      toast.error(t('machines.error.unauthorized'));
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error(t('machines.error.token_not_found'));
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
        throw new Error(errorData.message || t('machines.error.update_failed'));
      }

      const result = await response.json();
      
      // Show translation info if available
      if (result.translationInfo) {
        toast.success(t('machines.success.update'), {
          description: result.translationInfo.message || 'Machines updated and translated automatically!'
        });
      } else {
        toast.success(t('machines.success.update'));
      }
      
      // Reload data with translations
      await loadMachinesPageData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving machines page:', error);
      toast.error(error instanceof Error ? error.message : t('machines.error.update_failed'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      badge: currentData.badge,
      heading: currentData.heading,
      description: currentData.description,
      stats: currentData.stats,
      machines: currentData.machines
    });
    setIsModalOpen(false);
  };

  const openMachineDetailModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsMachineDetailModalOpen(true);
  };

  const deleteMachine = async (id: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('machines.error.unauthorized')
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error(t('machines.error.token_not_found'));
      }

      const response = await fetch(`${API_URL}/machines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('machines.error.machine_delete_failed'));
      }

      // Reload data
      await loadMachinesPageData();
      
      toast.error(t('machines.success.machine_delete'), {
        description: "The machine has been permanently removed.",
      });
    } catch (error: any) {
      console.error('Error deleting machine:', error);
      const errorMessage = error.message || t('machines.error.machine_delete_failed');
      toast.error(errorMessage);
    }
  };

  const confirmDeleteMachine = (id: string, name: string) => {
    if (!isModerator) {
      toast.error(t('common.error'), {
        description: t('machines.error.unauthorized')
      });
      return;
    }

    setItemToDelete({ type: 'machine', id, name });
    setDeleteModalOpen(true);
  };

  const DeleteConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-60">
      <div ref={deleteModalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {t('machines.delete.confirm')}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t('machines.delete.message').replace('{name}', itemToDelete?.name || 'this machine')}
        </p>
        
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
          >
            {t('common.cancel')}
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
            {t('common.delete')}
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
      toast.error(t('machines.error.spec_required'));
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
      toast.error(t('machines.error.machine_required').replace('{number}', ''));
      return false;
    }

    if (machineFormData.specifications.filter(spec => spec.trim() !== '').length === 0) {
      toast.error(t('machines.error.spec_required'));
      return false;
    }

    return true;
  };

  const handleSaveMachine = async () => {
    if (!isModerator || !machineFormData || !editingMachine) {
      toast.error(t('machines.error.unauthorized'));
      return;
    }

    if (!validateMachineForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error(t('machines.error.token_not_found'));
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
        throw new Error(errorData.message || t('machines.error.machine_update_failed'));
      }

      const result = await response.json();
      
      // Show translation info if available
      if (result.translationInfo) {
        toast.success(t('machines.success.machine_update'), {
          description: result.translationInfo.message || 'Machine updated and translated automatically!'
        });
      } else {
        toast.success(t('machines.success.machine_update'));
      }
      
      // Reload data with translations
      await loadMachinesPageData();

      setIsEditMachineModalOpen(false);
      setEditingMachine(null);
      setMachineFormData(null);
    } catch (error) {
      console.error('Error saving machine:', error);
      toast.error(error instanceof Error ? error.message : t('machines.error.machine_update_failed'));
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

    if (!file.type.startsWith('image/')) {
      toast.error(t('machines.error.invalid_file_type'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('machines.error.file_too_large'));
      return;
    }

    try {
      const imageUrl = await handleImageUpload(file);
      handleMachineFormChange('image', imageUrl);
    } catch (error) {
      // Error handled in handleImageUpload
    }
  };
  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, machineIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(t('machines.error.invalid_file_type'));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error(t('machines.error.file_too_large'));
      return;
    }

    try {
      const imageUrl = await handleImageUpload(file);
      handleMachineChange(machineIndex, 'image', imageUrl);
    } catch (error) {
      // Error handled in handleImageUpload
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




  const EditMachineModal = () => {
    if (!isEditMachineModalOpen || !machineFormData) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div 
          ref={editMachineModalRef}
          className="edit-modal bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {editingMachine ? t('machines.edit_machine') : t('machines.add_machine')}
            </h2>
            <button
              onClick={handleCancelMachineEdit}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Machine Image */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('machines.machine_image')}
              </label>
              <div className="space-y-4">
                {/* Current Image Preview */}
                {machineFormData.image && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-600">
                    <img
                      src={machineFormData.image}
                      alt={t('machines.current_image')}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop';
                      }}
                    />
                    <button
                      onClick={() => handleMachineFormChange('image', '')}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title={t('machines.remove_image')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-3" />
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                        <span>{t('machines.click_to_upload')}</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleMachineFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {t('machines.image_formats')}
                    </p>
                    {isUploading && (
                      <div className="mt-3 flex items-center justify-center gap-2">
                        <Loader className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {t('machines.uploading')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* URL Input */}
                <input
                  type="text"
                  value={machineFormData.image}
                  onChange={(e) => handleMachineFormChange('image', e.target.value)}
                  placeholder={t('machines.enter_url')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('machines.machine_title')} *
              </label>
              <input
                type="text"
                value={machineFormData.title}
                onChange={(e) => handleMachineFormChange('title', e.target.value)}
                placeholder={t('machines.title_placeholder')}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>

            {/* Category and Status Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('machines.machine_category')} *
                </label>
                <select
                  value={machineFormData.category}
                  onChange={(e) => handleMachineFormChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  required
                >
                  <option value="">{t('machines.select_category')}</option>
                  <option value="Cutting">{getCategoryLabel('Cutting')}</option>
                  <option value="Forming">{getCategoryLabel('Forming')}</option>
                  <option value="Handling">{getCategoryLabel('Handling')}</option>
                  <option value="Welding">{getCategoryLabel('Welding')}</option>
                  <option value="Assembly">{getCategoryLabel('Assembly')}</option>
                  <option value="Testing">{getCategoryLabel('Testing')}</option>
                  <option value="Other">{getCategoryLabel('Other')}</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('machines.status')}
                </label>
                <select
                  value={machineFormData.status}
                  onChange={(e) => handleMachineFormChange('status', e.target.value as Machine['status'])}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="">{t('machines.select_status')}</option>
                  <option value="Available">{getStatusLabel('Available')}</option>
                  <option value="In Use">{getStatusLabel('In Use')}</option>
                  <option value="Maintenance">{getStatusLabel('Maintenance')}</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t('machines.machine_description')}
              </label>
              <textarea
                value={machineFormData.description}
                onChange={(e) => handleMachineFormChange('description', e.target.value)}
                placeholder={t('machines.description_placeholder')}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Model and Year Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('machines.model')}
                </label>
                <input
                  type="text"
                  value={machineFormData.model}
                  onChange={(e) => handleMachineFormChange('model', e.target.value)}
                  placeholder={t('machines.model_placeholder')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Year Manufactured */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('machines.year_manufactured')}
                </label>
                <input
                  type="text"
                  value={machineFormData.yearManufactured}
                  onChange={(e) => handleMachineFormChange('yearManufactured', e.target.value)}
                  placeholder={t('machines.year_placeholder')}
                  maxLength={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Capacity and Power Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('machines.capacity')}
                </label>
                <input
                  type="text"
                  value={machineFormData.capacity}
                  onChange={(e) => handleMachineFormChange('capacity', e.target.value)}
                  placeholder={t('machines.capacity_placeholder')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Power Requirement */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('machines.power_requirement')}
                </label>
                <input
                  type="text"
                  value={machineFormData.powerRequirement}
                  onChange={(e) => handleMachineFormChange('powerRequirement', e.target.value)}
                  placeholder={t('machines.power_placeholder')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t('machines.specifications')} *
                </label>
                <button
                  type="button"
                  onClick={addMachineSpec}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('machines.add_spec')}
                </button>
              </div>
              <div className="space-y-3">
                {machineFormData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => handleMachineSpecChange(index, e.target.value)}
                      placeholder={t('machines.spec_placeholder')}
                      className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => removeMachineSpec(index)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title={t('machines.remove_spec')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={handleCancelMachineEdit}
              disabled={isSaving}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSaveMachine}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {editingMachine ? t('common.update') : t('common.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main Edit Modal (Page Content) Component
  const MainEditModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="edit-modal bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('machines.edit_page')}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 px-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'general'
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('machines.general')}
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'stats'
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('machines.statistics')}
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'machines'
                  ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('machines.machines_list')}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('machines.badge_text')}
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    placeholder={t('machines.placeholder.badge')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('machines.main_heading')}
                  </label>
                  <input
                    type="text"
                    value={formData.heading}
                    onChange={(e) => handleInputChange('heading', e.target.value)}
                    placeholder={t('machines.placeholder.heading')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('machines.description_text')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('machines.placeholder.description')}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t('machines.statistics')}
                  </h3>
                  <button
                    onClick={addStat}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('machines.add_stat')}
                  </button>
                </div>

                <div className="grid gap-4">
                  {formData.stats.map((stat, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              {t('machines.stat_number')}
                            </label>
                            <input
                              type="text"
                              value={stat.number}
                              onChange={(e) => handleStatChange(index, 'number', e.target.value)}
                              placeholder={t('machines.placeholder.stat_number')}
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                              {t('machines.stat_label')}
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                              placeholder={t('machines.placeholder.stat_label')}
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => removeStat(index)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Machines Tab */}
            {activeTab === 'machines' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {t('machines.machines_list')}
                  </h3>
                  <button
                    onClick={addMachine}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('machines.add_machine')}
                  </button>
                </div>

                {formData.machines.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <Cog className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">
                      {t('machines.no_machines_added')}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {formData.machines.map((machine, machineIndex) => (
                      <div
                        key={machine.id}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900"
                      >
                        <div className="flex items-start gap-4">
                          {/* Machine preview image */}
                          <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
                            {machine.image ? (
                              <img
                                src={machine.image}
                                alt={machine.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                              </div>
                            )}
                          </div>

                          {/* Machine info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                              {machine.title || t('machines.placeholder.machine_title')}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {getCategoryLabel(machine.category)} • {getStatusLabel(machine.status)}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 line-clamp-2">
                              {machine.description || t('machines.placeholder.machine_description')}
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingMachine(machine);
                                setMachineFormData({...machine});
                                setIsEditMachineModalOpen(true);
                              }}
                              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                              title={t('common.edit')}
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => removeMachine(machineIndex)}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                              title={t('common.delete')}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('common.save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Machine Detail Modal Component
  const MachineDetailModal = () => {
    if (!isMachineDetailModalOpen || !selectedMachine) return null;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div 
          ref={machineDetailModalRef}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header with Image */}
          <div className="relative h-80 overflow-hidden">
            <img
              src={selectedMachine.image}
              alt={selectedMachine.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            
            {/* Close button */}
            <button
              onClick={() => {
                setIsMachineDetailModalOpen(false);
                setSelectedMachine(null);
              }}
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Status badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 backdrop-blur-sm text-sm font-medium rounded-full ${getStatusColor(selectedMachine.status)}`}>
                {getStatusLabel(selectedMachine.status)}
              </span>
            </div>

            {/* Title and Category */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-full">
                  {getCategoryLabel(selectedMachine.category)}
                </span>
                {selectedMachine.model && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    {t('machines.model')}: {selectedMachine.model}
                  </span>
                )}
                {selectedMachine.yearManufactured && (
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                    {selectedMachine.yearManufactured}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedMachine.title}
              </h2>
              {selectedMachine.description && (
                <p className="text-white/90 text-lg">
                  {selectedMachine.description}
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-20rem)]">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Capacity */}
              {selectedMachine.capacity && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {t('machines.capacity')}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 ml-11">
                    {selectedMachine.capacity}
                  </p>
                </div>
              )}

              {/* Power Requirement */}
              {selectedMachine.powerRequirement && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {t('machines.power_requirement')}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 ml-11">
                    {selectedMachine.powerRequirement}
                  </p>
                </div>
              )}
            </div>

            {/* Technical Specifications */}
            {selectedMachine.specifications && selectedMachine.specifications.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {t('machines.technical_specifications')}
                </h3>
                <div className="grid gap-3">
                  {selectedMachine.specifications.filter(spec => spec.trim() !== '').map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => {
                  setIsMachineDetailModalOpen(false);
                  setSelectedMachine(null);
                  // Navigate to contact page or open contact modal
                  window.location.href = '/contact';
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center gap-2"
              >
                {t('machines.request_access')}
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };




  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-slate-600 dark:text-slate-300">{t('machines.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      
      {deleteModalOpen && <DeleteConfirmationModal />}

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950 dark:via-blue-900 dark:to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.1),transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.05),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/20 dark:from-blue-400/20 dark:to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        
        {isModerator && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-slate-900 dark:text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title={t('machines.edit_page')}
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
                {getCategoryLabel(category)}
              </button>
            ))}
          </div>

          {/* Machines Grid */}
          <div className="w-full">
            {filteredMachines.length === 0 ? (
              <div className="text-center py-16">
                <Cog className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  {t('machines.no_machines')}
                </h3>
                <p className="text-slate-500 dark:text-slate-500">
                  {selectedCategory === 'All' 
                    ? t('machines.no_machines_added')
                    : t('machines.no_machines_category').replace('{category}', getCategoryLabel(selectedCategory))}
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
                        {isModerator && (
                          <div className="absolute top-2 right-2 z-20 flex gap-2">
                            <button
                              onClick={() => openEditMachineModal(machine)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-blue-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                              title={t('machines.edit_machine')}
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => confirmDeleteMachine(machine.id, machine.title)}
                              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                              title={t('common.delete')}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

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
                              {getCategoryLabel(machine.category)}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className={`px-3 py-1 backdrop-blur-sm text-sm font-medium rounded-full ${getStatusColor(machine.status)}`}>
                              {getStatusLabel(machine.status)}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">
                            {machine.title}
                          </h3>
                          <p className="text-gray-600 dark:text-slate-400 mb-4 line-clamp-2">
                            {machine.description}
                          </p>
                          
                          <div className="space-y-2 mb-6">
                            {machine.specifications.filter(spec => spec.trim() !== '').slice(0, 3).map((spec, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-gray-600 dark:text-slate-400">{spec}</span>
                              </div>
                            ))}
                            {machine.specifications.filter(spec => spec.trim() !== '').length > 3 && (
                              <div className="text-sm text-gray-500 dark:text-slate-500">
                                +{machine.specifications.filter(spec => spec.trim() !== '').length - 3} {t('services.more')}
                              </div>
                            )}
                          </div>

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

                          <button
                            onClick={() => openMachineDetailModal(machine)}
                            className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                          >
                            {t('machines.view_details')}
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
                      {t('machines.show_more')}
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
                      {t('machines.show_less')}
                      <ChevronRight className="size-5 rotate-90 transform" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Edit Modals */}
    {isModalOpen && <MainEditModal />}
    {isEditMachineModalOpen && <EditMachineModal />}
    {isMachineDetailModalOpen && <MachineDetailModal />}
    {deleteModalOpen && <DeleteConfirmationModal />}
  
    </div>

  );
};

export default MachinesPage;
