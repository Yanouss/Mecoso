import React, { createContext, useContext, useState, useEffect } from 'react';

// Export the Language type so it can be imported by other components
export type Language = 'en' | 'fr';

interface TranslationContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Translation keys and values
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.machines': 'Machines',
    'nav.about': 'About Us',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.quote': 'Get a quote',
    
    // Hero Section
    'hero.badge': 'Industrial Excellence',
    'hero.heading': 'Leading Industrial Solutions in Morocco',
    'hero.description': 'MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we\'ve been delivering excellence in metal structure design, manufacturing, and assembly across all industries.',
    'hero.primary_button': 'Our Services',
    'hero.secondary_button': 'Download Portfolio',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Footer
    'footer.newsletter.title': 'Stay Updated',
    'footer.newsletter.description': 'Get the latest news about our projects, industry insights, and construction innovations delivered to your inbox.',
    'footer.newsletter.subscribe': 'Subscribe',
    'footer.newsletter.placeholder': 'Enter your email address',
    'footer.address': 'Address',
    'footer.phone': 'Phone',
    'footer.email': 'Email',
    'footer.hours': 'Hours',
    
    // Admin Panel
    'admin.panel': 'Admin Panel',
    'admin.hero': 'Edit Hero Section',
    'admin.services': 'Manage Services',
    'admin.testimonials': 'Manage Testimonials',
    'admin.logout': 'Logout',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.machines': 'Machines',
    'nav.about': 'À propos',
    'nav.gallery': 'Galerie',
    'nav.contact': 'Contact',
    'nav.quote': 'Obtenir un devis',
    
    // Hero Section
    'hero.badge': 'Excellence Industrielle',
    'hero.heading': 'Solutions Industrielles de Pointe au Maroc',
    'hero.description': 'MECOSO est votre partenaire de confiance pour des solutions complètes de chaudronnerie et de structures métalliques. Depuis 2005, nous offrons l\'excellence dans la conception, la fabrication et l\'assemblage de structures métalliques pour toutes les industries.',
    'hero.primary_button': 'Nos Services',
    'hero.secondary_button': 'Télécharger Portfolio',
    
    // Common
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.confirm': 'Confirmer',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    
    // Footer
    'footer.newsletter.title': 'Restez Informé',
    'footer.newsletter.description': 'Recevez les dernières nouvelles sur nos projets, les insights de l\'industrie et les innovations de construction dans votre boîte mail.',
    'footer.newsletter.subscribe': 'S\'abonner',
    'footer.newsletter.placeholder': 'Entrez votre adresse email',
    'footer.address': 'Adresse',
    'footer.phone': 'Téléphone',
    'footer.email': 'Email',
    'footer.hours': 'Horaires',
    
    // Admin Panel
    'admin.panel': 'Panneau Admin',
    'admin.hero': 'Modifier Section Hero',
    'admin.services': 'Gérer Services',
    'admin.testimonials': 'Gérer Témoignages',
    'admin.logout': 'Déconnexion',
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Get from localStorage or default to 'en'
      const saved = localStorage.getItem('language') as Language;
      return saved && (saved === 'en' || saved === 'fr') ? saved : 'en';
    }
    return 'en';
  });

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage);
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const translation = translations[currentLanguage]?.[key] || translations.en[key] || fallback || key;
    return translation;
  };

  const value = {
    currentLanguage,
    setLanguage,
    t
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};