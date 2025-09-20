const mongoose = require('mongoose');
const Translation = require('../models/Translation.model.js');
require('dotenv').config();

const defaultTranslations = [
  // Navigation
  {
    key: 'nav.home',
    translations: { en: 'Home', fr: 'Accueil' },
    category: 'navbar'
  },
  {
    key: 'nav.services',
    translations: { en: 'Services', fr: 'Services' },
    category: 'navbar'
  },
  {
    key: 'nav.machines',
    translations: { en: 'Machines', fr: 'Machines' },
    category: 'navbar'
  },
  {
    key: 'nav.about',
    translations: { en: 'About Us', fr: 'À propos' },
    category: 'navbar'
  },
  {
    key: 'nav.gallery',
    translations: { en: 'Gallery', fr: 'Galerie' },
    category: 'navbar'
  },
  {
    key: 'nav.contact',
    translations: { en: 'Contact', fr: 'Contact' },
    category: 'navbar'
  },
  {
    key: 'nav.quote',
    translations: { en: 'Get a quote', fr: 'Obtenir un devis' },
    category: 'navbar'
  },

  // Hero Section
  {
    key: 'hero.badge',
    translations: { en: 'Industrial Excellence', fr: 'Excellence Industrielle' },
    category: 'hero'
  },
  {
    key: 'hero.heading',
    translations: { 
      en: 'Leading Industrial Solutions in Morocco', 
      fr: 'Solutions Industrielles de Pointe au Maroc' 
    },
    category: 'hero'
  },
  {
    key: 'hero.description',
    translations: { 
      en: 'MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we\'ve been delivering excellence in metal structure design, manufacturing, and assembly across all industries.',
      fr: 'MECOSO est votre partenaire de confiance pour des solutions complètes de chaudronnerie et de structures métalliques. Depuis 2005, nous offrons l\'excellence dans la conception, la fabrication et l\'assemblage de structures métalliques pour toutes les industries.'
    },
    category: 'hero'
  },
  {
    key: 'hero.primary_button',
    translations: { en: 'Our Services', fr: 'Nos Services' },
    category: 'hero'
  },
  {
    key: 'hero.secondary_button',
    translations: { en: 'Download Portfolio', fr: 'Télécharger Portfolio' },
    category: 'hero'
  },

  // Footer
  {
    key: 'footer.newsletter.title',
    translations: { en: 'Stay Updated', fr: 'Restez Informé' },
    category: 'footer'
  },
  {
    key: 'footer.newsletter.description',
    translations: { 
      en: 'Get the latest news about our projects, industry insights, and construction innovations delivered to your inbox.',
      fr: 'Recevez les dernières nouvelles sur nos projets, les insights de l\'industrie et les innovations de construction dans votre boîte mail.'
    },
    category: 'footer'
  },
  {
    key: 'footer.newsletter.subscribe',
    translations: { en: 'Subscribe', fr: 'S\'abonner' },
    category: 'footer'
  },
  {
    key: 'footer.newsletter.placeholder',
    translations: { en: 'Enter your email address', fr: 'Entrez votre adresse email' },
    category: 'footer'
  },
  {
    key: 'footer.address',
    translations: { en: 'Address', fr: 'Adresse' },
    category: 'footer'
  },
  {
    key: 'footer.phone',
    translations: { en: 'Phone', fr: 'Téléphone' },
    category: 'footer'
  },
  {
    key: 'footer.email',
    translations: { en: 'Email', fr: 'Email' },
    category: 'footer'
  },
  {
    key: 'footer.hours',
    translations: { en: 'Hours', fr: 'Horaires' },
    category: 'footer'
  },

  // Common
  {
    key: 'common.loading',
    translations: { en: 'Loading...', fr: 'Chargement...' },
    category: 'common'
  },
  {
    key: 'common.save',
    translations: { en: 'Save', fr: 'Enregistrer' },
    category: 'common'
  },
  {
    key: 'common.cancel',
    translations: { en: 'Cancel', fr: 'Annuler' },
    category: 'common'
  },
  {
    key: 'common.edit',
    translations: { en: 'Edit', fr: 'Modifier' },
    category: 'common'
  },
  {
    key: 'common.delete',
    translations: { en: 'Delete', fr: 'Supprimer' },
    category: 'common'
  },
  {
    key: 'common.confirm',
    translations: { en: 'Confirm', fr: 'Confirmer' },
    category: 'common'
  },
  {
    key: 'common.error',
    translations: { en: 'Error', fr: 'Erreur' },
    category: 'common'
  },
  {
    key: 'common.success',
    translations: { en: 'Success', fr: 'Succès' },
    category: 'common'
  }
];

const seedTranslations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing translations
    await Translation.deleteMany({});
    console.log('Cleared existing translations');

    // Insert default translations
    await Translation.insertMany(defaultTranslations);
    console.log(`Inserted ${defaultTranslations.length} default translations`);

    console.log('Translation seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding translations:', error);
    process.exit(1);
  }
};
seedTranslations();