import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { API_URL as API_BASE_URL } from '../../config/api';
import { toast } from 'sonner';
import { useTranslation } from '../../context/TranslationContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle, 
  ArrowRight,
  MessageSquare,
  User,
  Building,
  Calendar,
  Edit3,
  X,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

interface ContactInfo {
  icon: React.ReactNode;
  title: string;
  details: string[];
  accent?: boolean;
}

interface ContactProps {
  badge?: string;
  heading?: string;
  description?: string;
  contactInfo?: ContactInfo[];
  officeImage?: string;
  isModerator?: boolean;
}

interface ContactData {
  _id?: string;
  badge: string;
  heading: string;
  description: string;
  contactInfo: Array<{
    iconType: 'MapPin' | 'Phone' | 'Mail' | 'Clock';
    title: string;
    details: string[];
    accent: boolean;
  }>;
}

interface ContactFormData {
  badge: string;
  heading: string;
  description: string;
  contactInfo: Array<{
    iconType: 'MapPin' | 'Phone' | 'Mail' | 'Clock';
    title: string;
    details: string[];
    accent: boolean;
  }>;
}

const iconMap = {
  MapPin: <MapPin className="size-6" />,
  Phone: <Phone className="size-6" />,
  Mail: <Mail className="size-6" />,
  Clock: <Clock className="size-6" />
};

const Contact = ({
  badge = "Get In Touch",
  heading = "Let's Build Something Amazing Together",
  description = "Ready to start your next construction project? Our expert team is here to turn your vision into reality with professional consultation and tailored solutions.",
  contactInfo = [
    {
      icon: <MapPin className="size-6" />,
      title: "Visit Our Atelier",
      details: ["Zone industrielle siege aprt 2 imm H 465 op raja", "Massira II, Marrakech 40000", "Morocco"],
      accent: true
    },
    {
      icon: <Phone className="size-6" />,
      title: "Call Us",
      details: ["+212 603301313", "+212 808612536"]
    },
    {
      icon: <Mail className="size-6" />,
      title: "Email Us",
      details: ["entreprisemecoso@gmail.com"]
    },
    {
      icon: <Clock className="size-6" />,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"]
    }
  ]

}: ContactProps) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [clickedCard, setClickedCard] = useState<number | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<ContactFormData>({
    badge,
    heading,
    description,
    contactInfo: contactInfo.map(info => ({
      iconType: getIconType(info.icon),
      title: info.title,
      details: [...info.details],
      accent: info.accent || false
    }))
  });
  
  const [currentData, setCurrentData] = useState<ContactData>({
    badge,
    heading,
    description,
    contactInfo: contactInfo.map(info => ({
      iconType: getIconType(info.icon),
      title: info.title,
      details: [...info.details],
      accent: info.accent || false
    }))
  });

  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const isModerator = isAuthenticated && (user?.role === 'moderator' || user?.role === 'admin');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchContactData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditModalOpen && 
          modalRef.current && 
          !modalRef.current.contains(event.target as Node)) {
        handleEditCancel();
      }
    };

    if (isEditModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditModalOpen]);

  const fetchContactData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact`);
      setCurrentData(response.data.data);
    } catch (error) {
      console.error('Error fetching contact data:', error);
      setCurrentData({
        badge,
        heading,
        description,
        contactInfo: contactInfo.map(info => ({
          iconType: getIconTypeFromElement(info.icon),
          title: info.title,
          details: [...info.details],
          accent: info.accent || false
        }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  function getIconTypeFromElement(iconElement: React.ReactNode): 'MapPin' | 'Phone' | 'Mail' | 'Clock' {
    if (React.isValidElement(iconElement)) {
      const elementType = (iconElement as React.ReactElement).type;
      if (elementType === MapPin) return 'MapPin';
      if (elementType === Phone) return 'Phone';
      if (elementType === Mail) return 'Mail';
      if (elementType === Clock) return 'Clock';
    }
    return 'MapPin';
  }

  function getIconType(iconType: string): 'MapPin' | 'Phone' | 'Mail' | 'Clock' {
    if (iconType === 'MapPin') return 'MapPin';
    if (iconType === 'Phone') return 'Phone';
    if (iconType === 'Mail') return 'Mail';
    if (iconType === 'Clock') return 'Clock';
    return 'MapPin';
  }

  useEffect(() => {
    const loadLeaflet = async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setMapLoaded(true);
        initializeMap();
      };
      document.head.appendChild(script);
    };

    loadLeaflet();

    return () => {
      const links = document.querySelectorAll('link[href*="leaflet"]');
      const scripts = document.querySelectorAll('script[src*="leaflet"]');
      links.forEach(link => link.remove());
      scripts.forEach(script => script.remove());
    };
  }, []);

  const initializeMap = () => {
    setTimeout(() => {
      if (window.L && document.getElementById('map')) {
        const marrakechCoords = [31.632695987129228, -8.062983332507335];
        
        const map = window.L.map('map').setView(marrakechCoords, 13);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        const customIcon = window.L.divIcon({
          html: `
            <div style="
              width: 40px; 
              height: 40px; 
              background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
              border: 3px solid white;
              position: relative;
            ">
              <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"/>
              </svg>
            </div>
            <div style="
              position: absolute;
              top: 100%;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
              border-top: 12px solid #3b82f6;
            "></div>
          `,
          className: 'custom-marker',
          iconSize: [40, 52],
          iconAnchor: [20, 52],
          popupAnchor: [0, -52]
        });

        const marker = window.L.marker(marrakechCoords, { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
          <div style="text-align: center; padding: 10px; min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">Our Headquarters</h4>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Zone Industrielle Harbil Marrakech</p>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">Siege appt 2 IMM H 465 OP RAJA</p>
            <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Massira II, Marrakech</p>
            <div style="padding: 6px 12px; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; border-radius: 6px; font-size: 12px; font-weight: 500;">
              🏢 Main Office
            </div>
          </div>
        `);

        const projectSites = [
          { coords: [31.6078, -7.9929], name: "Project Site A", color: "#10b981" },
          { coords: [31.6412, -7.9534], name: "Project Site B", color: "#f59e0b" },
          { coords: [31.6156, -8.0089], name: "Project Site C", color: "#ef4444" }
        ];

        projectSites.forEach(site => {
          const siteIcon = window.L.divIcon({
            html: `
              <div style="
                width: 16px; 
                height: 16px; 
                background: ${site.color}; 
                border-radius: 50%; 
                border: 2px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                animation: pulse 2s infinite;
              "></div>
            `,
            className: 'project-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          window.L.marker(site.coords, { icon: siteIcon })
            .addTo(map)
            .bindPopup(`
              <div style="text-align: center; padding: 8px;">
                <h5 style="margin: 0 0 4px 0; color: #1f2937;">${site.name}</h5>
                <p style="margin: 0; color: #6b7280; font-size: 12px;">Active Construction</p>
              </div>
            `);
        });

        const style = document.createElement('style');
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
          .leaflet-popup-content-wrapper {
            border-radius: 12px !important;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          }
          .leaflet-popup-tip {
            box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
          }
        `;
        document.head.appendChild(style);
      }
    }, 100);
  };

  const handleEditInputChange = (field: keyof Omit<ContactFormData, 'contactInfo'>, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactInfoChange = (index: number, field: keyof ContactFormData['contactInfo'][0], value: any) => {
    setEditFormData(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.map((info, i) => 
        i === index ? { ...info, [field]: value } : info
      )
    }));
  };

  const handleDetailChange = (contactIndex: number, detailIndex: number, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.map((info, i) => 
        i === contactIndex 
          ? { 
              ...info, 
              details: info.details.map((detail, j) => j === detailIndex ? value : detail)
            }
          : info
      )
    }));
  };

  const addDetail = (contactIndex: number) => {
    setEditFormData(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.map((info, i) => 
        i === contactIndex 
          ? { ...info, details: [...info.details, ''] }
          : info
      )
    }));
  };

  const removeDetail = (contactIndex: number, detailIndex: number) => {
    setEditFormData(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.map((info, i) => 
        i === contactIndex 
          ? { 
              ...info, 
              details: info.details.filter((_, j) => j !== detailIndex)
            }
          : info
      )
    }));
  };

  const addContactInfo = () => {
    setEditFormData(prev => ({
      ...prev,
      contactInfo: [...prev.contactInfo, {
        iconType: 'Phone',
        title: 'New Contact',
        details: [''],
        accent: false
      }]
    }));
  };

  const removeContactInfo = (index: number) => {
    setEditFormData(prev => ({
      ...prev,
      contactInfo: prev.contactInfo.filter((_, i) => i !== index)
    }));
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_BASE_URL}/contact`,
        editFormData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setCurrentData(response.data.data);
      toast.success(t('contact.updated_success'));
      setIsEditModalOpen(false);
    } catch (error: any) {
      console.error('Error saving contact data:', error);
      const errorMessage = error.response?.data?.message || error.message || t('contact.update_failed');
      toast.error(errorMessage);
    }
  };

  const handleEditOpen = () => {
    setEditFormData({
      badge: currentData.badge,
      heading: currentData.heading,
      description: currentData.description,
      contactInfo: currentData.contactInfo.map(info => ({
        iconType: info.iconType,
        title: info.title,
        details: [...info.details],
        accent: info.accent || false
      }))
    });
    setIsEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setEditFormData({
      badge: currentData.badge,
      heading: currentData.heading,
      description: currentData.description,
      contactInfo: currentData.contactInfo.map(info => ({
        iconType: getIconType(info.icon),
        title: info.title,
        details: [...info.details],
        accent: info.accent || false
      }))
    });
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: ''
      });
    }, 3000);
  };

  const getCardStyles = (index: number, isAccent: boolean) => {
    const isHovered = hoveredCard === index;
    const isClicked = clickedCard === index;
    
    if (isClicked) {
      return 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-transparent shadow-2xl transform scale-105';
    }
    
    if (isHovered) {
      return 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent shadow-2xl transform scale-105';
    }
    
    if (isAccent) {
      return 'bg-gradient-to-br from-blue-600 to-purple-600 text-white border-transparent shadow-2xl';
    }
    
    return 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-400';
  };

  const getIconStyles = (index: number, isAccent: boolean) => {
    const isHovered = hoveredCard === index;
    const isClicked = clickedCard === index;
    
    if (isClicked || isHovered || isAccent) {
      return 'bg-white/20 backdrop-blur-sm scale-110';
    }
    
    return 'bg-gray-100 dark:bg-slate-700 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/50 dark:group-hover:to-purple-900/50 group-hover:scale-110';
  };

  const getTextStyles = (index: number, isAccent: boolean) => {
    const isHovered = hoveredCard === index;
    const isClicked = clickedCard === index;
    
    if (isClicked || isHovered || isAccent) {
      return 'text-white';
    }
    
    return 'text-gray-900 dark:text-slate-100';
  };

  const getDetailStyles = (index: number, isAccent: boolean) => {
    const isHovered = hoveredCard === index;
    const isClicked = clickedCard === index;
    
    if (isClicked || isHovered || isAccent) {
      return 'text-white/90';
    }
    
    return 'text-gray-600 dark:text-slate-400';
  };

  return (
    <>
      <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden min-h-screen transition-all duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.08),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_70%,rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        
        {isModerator && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="absolute top-4 right-4 z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 text-gray-800 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl group"
            title={t('common.edit')}
          >
            <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>
        )}
        
        <div className="container px-6 mx-auto relative z-10">
          
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100/80 dark:bg-blue-900/50 backdrop-blur-sm rounded-full border border-blue-200/50 dark:border-blue-600/50">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse" />
              {t('contact.badge')}
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
              {t('contact.heading')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-slate-300 leading-relaxed">
              {t('contact.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 mb-20">
            
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                      <MessageSquare className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100">{t('contact.start_project')}</h2>
                      <p className="text-gray-600 dark:text-slate-400">{t('contact.form_description')}</p>
                    </div>
                  </div>

                  {!isSubmitted ? (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            {t('contact.full_name')} *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-slate-500" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('name')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 ${
                                focusedField === 'name' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                              placeholder={t('contact.placeholder.name')}
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            {t('contact.email_address')} *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-slate-500" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('email')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 ${
                                focusedField === 'email' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                              placeholder={t('contact.placeholder.email')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            {t('contact.company_organization')}
                          </label>
                          <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-slate-500" />
                            <input
                              type="text"
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('company')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 ${
                                focusedField === 'company' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                              placeholder={t('contact.placeholder.company')}
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                            {t('contact.phone_number')}
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-slate-500" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('phone')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 ${
                                focusedField === 'phone' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                              placeholder={t('contact.placeholder.phone')}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-200 dark:border-slate-600">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">{t('contact.project_details')}</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                              {t('contact.service_interested')} *
                            </label>
                            <select
                              name="service"
                              value={formData.service}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('service')}
                              onBlur={() => setFocusedField(null)}
                              required
                              className={`w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 ${
                                focusedField === 'service' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                            >
                              <option value="">{t('contact.select_service')}</option>
                              <option value="architectural-design">{t('contact.service.architectural')}</option>
                              <option value="project-management">{t('contact.service.project_mgmt')}</option>
                              <option value="structural-engineering">{t('contact.service.structural')}</option>
                              <option value="heavy-machinery">{t('contact.service.machinery')}</option>
                              <option value="quality-assurance">{t('contact.service.quality')}</option>
                              <option value="green-building">{t('contact.service.green')}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                              {t('contact.project_type')}
                            </label>
                            <select
                              name="projectType"
                              value={formData.projectType}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('projectType')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 ${
                                focusedField === 'projectType' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                            >
                              <option value="">{t('contact.select_project_type')}</option>
                              <option value="residential">{t('contact.project.residential')}</option>
                              <option value="commercial">{t('contact.project.commercial')}</option>
                              <option value="industrial">{t('contact.project.industrial')}</option>
                              <option value="infrastructure">{t('contact.project.infrastructure')}</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                              {t('contact.estimated_budget')}
                            </label>
                            <select
                              name="budget"
                              value={formData.budget}
                              onChange={handleInputChange}
                              onFocus={() => setFocusedField('budget')}
                              onBlur={() => setFocusedField(null)}
                              className={`w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 ${
                                focusedField === 'budget' 
                                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                  : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                              }`}
                            >
                              <option value="">{t('contact.select_budget')}</option>
                              <option value="under-500k">{t('contact.budget.under_500k')}</option>
                              <option value="500k-2m">{t('contact.budget.500k_2m')}</option>
                              <option value="2m-5m">{t('contact.budget.2m_5m')}</option>
                              <option value="5m-20m">{t('contact.budget.5m_20m')}</option>
                              <option value="over-20m">{t('contact.budget.over_20m')}</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                              {t('contact.timeline')}
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 dark:text-slate-500" />
                              <select
                                name="timeline"
                                value={formData.timeline}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('timeline')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none transition-all duration-300 text-gray-900 dark:text-slate-100 ${
                                  focusedField === 'timeline' 
                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                                }`}
                              >
                                <option value="">{t('contact.select_timeline')}</option>
                                <option value="asap">{t('contact.timeline.asap')}</option>
                                <option value="1-3-months">{t('contact.timeline.1_3_months')}</option>
                                <option value="3-6-months">{t('contact.timeline.3_6_months')}</option>
                                <option value="6-12-months">{t('contact.timeline.6_12_months')}</option>
                                <option value="over-1-year">{t('contact.timeline.over_1_year')}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">
                          {t('contact.project_description')}
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          rows={6}
                          className={`w-full px-4 py-4 bg-gray-50 dark:bg-slate-700 border-2 rounded-2xl focus:outline-none resize-none transition-all duration-300 text-gray-900 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 ${
                            focusedField === 'message' 
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]' 
                              : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                          }`}
                          placeholder={t('contact.placeholder.message')}
                        />
                      </div>

                      <div className="pt-6">
                        <button
                          onClick={handleSubmit}
                          className="w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <Send className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                          {t('contact.send_message')}
                          <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex p-6 bg-green-100 dark:bg-green-900/50 rounded-full mb-6">
                        <CheckCircle className="size-12 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">
                        {t('contact.message_sent')}
                      </h3>
                      <p className="text-gray-600 dark:text-slate-400 text-lg mb-6">
                        {t('contact.thank_you')}
                      </p>
                      <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-xl font-medium">
                        <Clock className="size-4" />
                        {t('contact.expected_response')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {currentData.contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="group cursor-pointer transition-all duration-500"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => setClickedCard(clickedCard === index ? null : index)}
                >
                  <div className={`p-6 rounded-3xl shadow-lg border transition-all duration-500 ${getCardStyles(index, info.accent || false)}`}>
                    <div className={`inline-flex p-3 rounded-2xl mb-4 transition-all duration-500 ${getIconStyles(index, info.accent || false)}`}>
                      {iconMap[info.iconType]}
                    </div>
                    <h3 className={`text-xl font-bold mb-4 ${getTextStyles(index, info.accent || false)}`}>
                      {info.title}
                    </h3>
                    <ul className="space-y-2">
                      {info.details.map((detail, idx) => (
                        <li 
                          key={idx}
                          className={`${getDetailStyles(index, info.accent || false)} hover:opacity-80 transition-opacity duration-300`}
                        >
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                {t('contact.find_office')}
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                {t('contact.visit_description')}
              </p>
            </div>

            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-slate-600">
              <div 
                id="map" 
                className="w-full h-full"
                style={{ minHeight: '400px' }}
              >
                {!mapLoaded && (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-slate-400">{t('contact.loading_map')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center gap-2 group"
                onClick={() => window.open('https://maps.google.com/?q=31.632695987129228,-8.062983332507335', '_blank')}
              >
                <MapPin className="size-5" />
                {t('contact.get_directions')}
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button 
                className="px-8 py-4 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-300 border border-gray-200 dark:border-slate-600 inline-flex items-center gap-2"
                onClick={() => window.open('tel:+212524123456', '_self')}
              >
                <Phone className="size-5" />
                {t('contact.call_now')}
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-slate-600">
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300">
                <div className="inline-flex p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full mb-3">
                  <MapPin className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{t('contact.prime_location')}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{t('contact.prime_location_desc')}</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300">
                <div className="inline-flex p-3 bg-green-100 dark:bg-green-900/50 rounded-full mb-3">
                  <Clock className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{t('contact.easy_access')}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{t('contact.easy_access_desc')}</p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-300">
                <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full mb-3">
                  <Building className="size-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">{t('contact.modern_facilities')}</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400">{t('contact.modern_facilities_desc')}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('contact.edit_section')}</h2>
              </div>
              <button
                onClick={handleEditCancel}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-600 pb-2">
                    {t('contact.basic_info')}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.badge_text')}
                      </label>
                      <input
                        type="text"
                        value={editFormData.badge}
                        onChange={(e) => handleEditInputChange('badge', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={t('contact.badge_text')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.main_heading')}
                      </label>
                      <input
                        type="text"
                        value={editFormData.heading}
                        onChange={(e) => handleEditInputChange('heading', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder={t('contact.main_heading')}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('contact.description_text')}
                      </label>
                      <textarea
                        value={editFormData.description}
                        onChange={(e) => handleEditInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                        placeholder={t('contact.description_text')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-600 pb-2 flex-1">
                      {t('contact.contact_info')}
                    </h3>
                    <button
                      onClick={addContactInfo}
                      className="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      {t('contact.add_contact')}
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {editFormData.contactInfo.map((contact, index) => (
                      <div key={index} className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white">{t('contact.contact_item')} #{index + 1}</h4>
                          {editFormData.contactInfo.length > 1 && (
                            <button
                              onClick={() => removeContactInfo(index)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('contact.icon_type')}
                            </label>
                            <select
                              value={contact.iconType}
                              onChange={(e) => handleContactInfoChange(index, 'iconType', e.target.value as any)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                            >
                              <option value="MapPin">Map Pin</option>
                              <option value="Phone">Phone</option>
                              <option value="Mail">Mail</option>
                              <option value="Clock">Clock</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t('contact.title')}
                            </label>
                            <input
                              type="text"
                              value={contact.title}
                              onChange={(e) => handleContactInfoChange(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                              placeholder={t('contact.title')}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              {t('contact.details')}
                            </label>
                            <button
                              onClick={() => addDetail(index)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
                            >
                              {t('contact.add_detail')}
                            </button>
                          </div>
                          <div className="space-y-2">
                            {contact.details.map((detail, detailIndex) => (
                              <div key={detailIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={detail}
                                  onChange={(e) => handleDetailChange(index, detailIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm"
                                  placeholder={t('contact.details')}
                                />
                                {contact.details.length > 1 && (
                                  <button
                                    onClick={() => removeDetail(index, detailIndex)}
                                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`accent-${index}`}
                            checked={contact.accent}
                            onChange={(e) => handleContactInfoChange(index, 'accent', e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label htmlFor={`accent-${index}`} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('contact.accent_style')}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
              <button
                onClick={handleEditCancel}
                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-500 transition-all duration-200 font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleEditSave}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                {t('contact.save_changes')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;