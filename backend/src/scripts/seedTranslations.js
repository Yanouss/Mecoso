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
  },

  // Services Page
  {
    key: 'services.badge',
    translations: { en: 'Our Services', fr: 'Nos Services' },
    category: 'services'
  },
  {
    key: 'services.heading',
    translations: { en: 'Our Core Services', fr: 'Nos Services Principaux' },
    category: 'services'
  },
  {
    key: 'services.description',
    translations: { 
      en: 'MECOSO delivers complete industrial solutions. From design and fabrication to installation and maintenance. Serving the mining, energy, and heavy industry sectors with a focus on quality, safety, and innovation.',
      fr: 'MECOSO fournit des solutions industrielles complètes. De la conception et fabrication à l\'installation et maintenance. Au service des secteurs minier, énergétique et de l\'industrie lourde avec un focus sur la qualité, la sécurité et l\'innovation.'
    },
    category: 'services'
  },
  {
    key: 'services.all_categories',
    translations: { en: 'All', fr: 'Tout' },
    category: 'services'
  },
  {
    key: 'services.view_details',
    translations: { en: 'View Details', fr: 'Voir Détails' },
    category: 'services'
  },
  {
    key: 'services.get_started',
    translations: { en: 'Get Started', fr: 'Commencer' },
    category: 'services'
  },
  {
    key: 'services.add_service',
    translations: { en: 'Add Service', fr: 'Ajouter Service' },
    category: 'services'
  },
  {
    key: 'services.testimonials',
    translations: { en: 'Client Testimonials', fr: 'Témoignages Clients' },
    category: 'services'
  },
  {
    key: 'services.no_services',
    translations: { en: 'No services available', fr: 'Aucun service disponible' },
    category: 'services'
  },
  {
    key: 'services.no_testimonials',
    translations: { en: 'No testimonials yet', fr: 'Aucun témoignage pour le moment' },
    category: 'services'
  },
  {
    key: 'services.duration',
    translations: { en: 'Duration', fr: 'Durée' },
    category: 'services'
  },
  {
    key: 'services.price',
    translations: { en: 'Price', fr: 'Prix' },
    category: 'services'
  },
  {
    key: 'services.features',
    translations: { en: 'Key Features', fr: 'Caractéristiques Clés' },
    category: 'services'
  },
  {
    key: 'services.projects_completed',
    translations: { en: 'Projects Completed', fr: 'Projets Terminés' },
    category: 'services'
  },
  {
    key: 'services.iso_certified',
    translations: { en: '2015 certified', fr: '2015 certifié' },
    category: 'services'
  },
  {
    key: 'services.years_experience',
    translations: { en: 'Years Experience', fr: 'Années d\'Expérience' },
    category: 'services'
  },
  {
    key: 'services.expert_team',
    translations: { en: 'Expert Team', fr: 'Équipe Experte' },
    category: 'services'
  },

  // About Page
  {
    key: 'about.badge',
    translations: { en: 'About Our Company', fr: 'À Propos de Notre Entreprise' },
    category: 'about'
  },
  {
    key: 'about.heading',
    translations: { en: 'Leading Industrial Solutions in Morocco', fr: 'Solutions Industrielles de Pointe au Maroc' },
    category: 'about'
  },
  {
    key: 'about.description',
    translations: { 
      en: 'MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we\'ve been delivering excellence in metal structure design, manufacturing, and assembly across all industries',
      fr: 'MECOSO est votre partenaire de confiance pour des solutions complètes de chaudronnerie et de structures métalliques. Depuis 2005, nous offrons l\'excellence dans la conception, la fabrication et l\'assemblage de structures métalliques pour toutes les industries'
    },
    category: 'about'
  },
  {
    key: 'about.our_story',
    translations: { en: 'Our Story', fr: 'Notre Histoire' },
    category: 'about'
  },
  {
    key: 'about.two_decades',
    translations: { en: 'Two Decades of Excellence', fr: 'Deux Décennies d\'Excellence' },
    category: 'about'
  },
  {
    key: 'about.our_mission',
    translations: { en: 'Our Mission', fr: 'Notre Mission' },
    category: 'about'
  },
  {
    key: 'about.our_vision',
    translations: { en: 'Our Vision', fr: 'Notre Vision' },
    category: 'about'
  },
  {
    key: 'about.our_values',
    translations: { en: 'Our Values', fr: 'Nos Valeurs' },
    category: 'about'
  },
  {
    key: 'about.values_subtitle',
    translations: { en: 'The Principles That Guide Us', fr: 'Les Principes Qui Nous Guident' },
    category: 'about'
  },
  {
    key: 'about.values_description',
    translations: { 
      en: 'Every decision we make and every project we undertake is guided by these core values that define who we are.',
      fr: 'Chaque décision que nous prenons et chaque projet que nous entreprenons est guidé par ces valeurs fondamentales qui définissent qui nous sommes.'
    },
    category: 'about'
  },
  {
    key: 'about.trusted_partnerships',
    translations: { en: 'Trusted Partnerships', fr: 'Partenariats de Confiance' },
    category: 'about'
  },
  {
    key: 'about.industry_leaders',
    translations: { en: 'Industry Leaders Choose Us', fr: 'Les Leaders de l\'Industrie Nous Choisissent' },
    category: 'about'
  },
  {
    key: 'about.partners_description',
    translations: { 
      en: 'We proudly collaborate with Morocco\'s most prestigious organizations and international companies who trust us to deliver excellence in every project.',
      fr: 'Nous collaborons fièrement avec les organisations les plus prestigieuses du Maroc et les entreprises internationales qui nous font confiance pour livrer l\'excellence dans chaque projet.'
    },
    category: 'about'
  },
  {
    key: 'about.join_network',
    translations: { en: 'Join Our Network of Partners', fr: 'Rejoignez Notre Réseau de Partenaires' },
    category: 'about'
  },
  {
    key: 'about.learn_story',
    translations: { en: 'Learn Our Story', fr: 'Découvrez Notre Histoire' },
    category: 'about'
  },
  {
    key: 'about.show_more',
    translations: { en: 'Show More', fr: 'Afficher Plus' },
    category: 'about'
  },
  {
    key: 'about.show_less',
    translations: { en: 'Show Less', fr: 'Afficher Moins' },
    category: 'about'
  },


  
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