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
    key: 'common.saving',
    translations: { en: 'Saving...', fr: 'Enregistrement...' },
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

  // Services Page - Main Content
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
    key: 'services.our_services',
    translations: { en: 'Our Services', fr: 'Nos Services' },
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
    key: 'services.client_testimonials',
    translations: { en: 'Client Testimonials', fr: 'Témoignages Clients' },
    category: 'services'
  },
  {
    key: 'services.add_testimonial',
    translations: { en: 'Add Testimonial', fr: 'Ajouter Témoignage' },
    category: 'services'
  },
  {
    key: 'services.no_services',
    translations: { en: 'No services available', fr: 'Aucun service disponible' },
    category: 'services'
  },
  {
    key: 'services.no_testimonials_available',
    translations: { en: 'No testimonials available yet', fr: 'Aucun témoignage disponible pour le moment' },
    category: 'services'
  },
  {
    key: 'services.default_client_name',
    translations: { en: 'John Doe', fr: 'Jean Dupont' },
    category: 'services'
  },
  {
    key: 'services.default_client_role',
    translations: { en: 'Client', fr: 'Client' },
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
    translations: { en: 'Features', fr: 'Caractéristiques' },
    category: 'services'
  },
  {
    key: 'services.key_features',
    translations: { en: 'Key Features', fr: 'Caractéristiques Clés' },
    category: 'services'
  },
  {
    key: 'services.more',
    translations: { en: 'more', fr: 'plus' },
    category: 'services'
  },
  {
    key: 'services.projects_completed',
    translations: { en: 'Projects Completed', fr: 'Projets Terminés' },
    category: 'services'
  },
  {
    key: 'services.iso_certified',
    translations: { en: 'ISO 9001 Certified', fr: 'Certifié ISO 9001' },
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

  // Services Page - Error Messages
  {
    key: 'services.fetch_error',
    translations: { en: 'Failed to load services', fr: 'Échec du chargement des services' },
    category: 'services'
  },
  {
    key: 'services.testimonials_fetch_error',
    translations: { en: 'Failed to load testimonials', fr: 'Échec du chargement des témoignages' },
    category: 'services'
  },
  {
    key: 'services.file_too_large',
    translations: { en: 'File size must be less than 200MB', fr: 'La taille du fichier doit être inférieure à 200MB' },
    category: 'services'
  },
  {
    key: 'services.invalid_file_type',
    translations: { en: 'Please upload a valid image or video file', fr: 'Veuillez télécharger un fichier image ou vidéo valide' },
    category: 'services'
  },
  {
    key: 'services.file_upload_success',
    translations: { en: 'File uploaded successfully', fr: 'Fichier téléchargé avec succès' },
    category: 'services'
  },
  {
    key: 'services.access_denied_edit',
    translations: { en: 'You need moderator or admin privileges to edit services', fr: 'Vous avez besoin de privilèges modérateur ou admin pour modifier les services' },
    category: 'services'
  },
  {
    key: 'services.access_denied_delete',
    translations: { en: 'You need moderator or admin privileges to delete services', fr: 'Vous avez besoin de privilèges modérateur ou admin pour supprimer les services' },
    category: 'services'
  },
  {
    key: 'services.access_denied_edit_testimonials',
    translations: { en: 'You need moderator or admin privileges to edit testimonials', fr: 'Vous avez besoin de privilèges modérateur ou admin pour modifier les témoignages' },
    category: 'services'
  },
  {
    key: 'services.access_denied_delete_testimonials',
    translations: { en: 'You need moderator or admin privileges to delete testimonials', fr: 'Vous avez besoin de privilèges modérateur ou admin pour supprimer les témoignages' },
    category: 'services'
  },
  {
    key: 'services.main_content_updated',
    translations: { en: 'Main content updated successfully', fr: 'Contenu principal mis à jour avec succès' },
    category: 'services'
  },
  {
    key: 'services.service_updated',
    translations: { en: 'Service updated successfully', fr: 'Service mis à jour avec succès' },
    category: 'services'
  },
  {
    key: 'services.service_added',
    translations: { en: 'Service added successfully', fr: 'Service ajouté avec succès' },
    category: 'services'
  },
  {
    key: 'services.service_deleted',
    translations: { en: 'Service deleted successfully', fr: 'Service supprimé avec succès' },
    category: 'services'
  },
  {
    key: 'services.testimonial_updated',
    translations: { en: 'Testimonial updated successfully', fr: 'Témoignage mis à jour avec succès' },
    category: 'services'
  },
  {
    key: 'services.testimonial_added',
    translations: { en: 'Testimonial added successfully', fr: 'Témoignage ajouté avec succès' },
    category: 'services'
  },
  {
    key: 'services.testimonial_deleted',
    translations: { en: 'Testimonial deleted successfully', fr: 'Témoignage supprimé avec succès' },
    category: 'services'
  },
  {
    key: 'services.save_service_error',
    translations: { en: 'Failed to save service', fr: 'Échec de l\'enregistrement du service' },
    category: 'services'
  },
  {
    key: 'services.delete_service_error',
    translations: { en: 'Failed to delete service', fr: 'Échec de la suppression du service' },
    category: 'services'
  },
  {
    key: 'services.save_testimonial_error',
    translations: { en: 'Failed to save testimonial', fr: 'Échec de l\'enregistrement du témoignage' },
    category: 'services'
  },
  {
    key: 'services.delete_testimonial_error',
    translations: { en: 'Failed to delete testimonial', fr: 'Échec de la suppression du témoignage' },
    category: 'services'
  },
  {
    key: 'services.session_expired',
    translations: { en: 'Session expired or insufficient permissions', fr: 'Session expirée ou permissions insuffisantes' },
    category: 'services'
  },

  // Services Page - Modal Content
  {
    key: 'services.edit_main_content',
    translations: { en: 'Edit Main Content', fr: 'Modifier le Contenu Principal' },
    category: 'services'
  },
  {
    key: 'services.badge_text',
    translations: { en: 'Badge Text', fr: 'Texte du Badge' },
    category: 'services'
  },
  {
    key: 'services.heading_text',
    translations: { en: 'Heading Text', fr: 'Texte du Titre' },
    category: 'services'
  },
  {
    key: 'services.description_text',
    translations: { en: 'Description Text', fr: 'Texte de Description' },
    category: 'services'
  },
  {
    key: 'services.edit_service',
    translations: { en: 'Edit Service', fr: 'Modifier le Service' },
    category: 'services'
  },
  {
    key: 'services.add_new_service',
    translations: { en: 'Add New Service', fr: 'Ajouter un Nouveau Service' },
    category: 'services'
  },
  {
    key: 'services.service_image',
    translations: { en: 'Service Image', fr: 'Image du Service' },
    category: 'services'
  },
  {
    key: 'services.click_to_change',
    translations: { en: 'Click to change image', fr: 'Cliquer pour changer l\'image' },
    category: 'services'
  },
  {
    key: 'services.drop_image_here',
    translations: { en: 'Drop image here or click to upload', fr: 'Déposer l\'image ici ou cliquer pour télécharger' },
    category: 'services'
  },
  {
    key: 'services.supported_formats',
    translations: { en: 'SVG, PNG, JPG, GIF, MP4, WebM, MOV, AVI, MKV', fr: 'SVG, PNG, JPG, GIF, MP4, WebM, MOV, AVI, MKV' },
    category: 'services'
  },
  {
    key: 'services.max_file_size',
    translations: { en: 'Max file size: 200MB', fr: 'Taille max du fichier : 200MB' },
    category: 'services'
  },
  {
    key: 'services.service_title',
    translations: { en: 'Service Title', fr: 'Titre du Service' },
    category: 'services'
  },
  {
    key: 'services.category',
    translations: { en: 'Category', fr: 'Catégorie' },
    category: 'services'
  },
  {
    key: 'services.add_feature',
    translations: { en: 'Add Feature', fr: 'Ajouter Caractéristique' },
    category: 'services'
  },
  {
    key: 'services.feature_placeholder',
    translations: { en: 'Enter feature description', fr: 'Entrer la description de la caractéristique' },
    category: 'services'
  },
  {
    key: 'services.edit_testimonial',
    translations: { en: 'Edit Testimonial', fr: 'Modifier le Témoignage' },
    category: 'services'
  },
  {
    key: 'services.add_new_testimonial',
    translations: { en: 'Add New Testimonial', fr: 'Ajouter un Nouveau Témoignage' },
    category: 'services'
  },
  {
    key: 'services.client_photo',
    translations: { en: 'Client Photo', fr: 'Photo du Client' },
    category: 'services'
  },
  {
    key: 'services.click_to_change_photo',
    translations: { en: 'Click to change photo', fr: 'Cliquer pour changer la photo' },
    category: 'services'
  },
  {
    key: 'services.drop_photo_here',
    translations: { en: 'Drop photo here or click to upload', fr: 'Déposer la photo ici ou cliquer pour télécharger' },
    category: 'services'
  },
  {
    key: 'services.supported_image_formats',
    translations: { en: 'SVG, PNG, JPG, GIF, WebP', fr: 'SVG, PNG, JPG, GIF, WebP' },
    category: 'services'
  },
  {
    key: 'services.client_name',
    translations: { en: 'Client Name', fr: 'Nom du Client' },
    category: 'services'
  },
  {
    key: 'services.role',
    translations: { en: 'Role', fr: 'Rôle' },
    category: 'services'
  },
  {
    key: 'services.company',
    translations: { en: 'Company', fr: 'Entreprise' },
    category: 'services'
  },
  {
    key: 'services.rating',
    translations: { en: 'Rating', fr: 'Note' },
    category: 'services'
  },
  {
    key: 'services.testimonial_content',
    translations: { en: 'Testimonial Content', fr: 'Contenu du Témoignage' },
    category: 'services'
  },
  {
    key: 'services.testimonial_placeholder',
    translations: { en: 'Enter testimonial content here...', fr: 'Entrer le contenu du témoignage ici...' },
    category: 'services'
  },

  // Services Page - Delete Confirmation
  {
    key: 'services.confirm_deletion',
    translations: { en: 'Confirm Deletion', fr: 'Confirmer la Suppression' },
    category: 'services'
  },
  {
    key: 'services.delete_confirmation_message',
    translations: { en: 'Are you sure you want to delete', fr: 'Êtes-vous sûr de vouloir supprimer' },
    category: 'services'
  },
  {
    key: 'services.this_item',
    translations: { en: 'this item', fr: 'cet élément' },
    category: 'services'
  },
  {
    key: 'services.action_cannot_undone',
    translations: { en: 'This action cannot be undone.', fr: 'Cette action ne peut pas être annulée.' },
    category: 'services'
  },

  // Services Page - CTA Section
  {
    key: 'services.ready_to_start',
    translations: { en: 'Ready to Start Your Project?', fr: 'Prêt à Commencer Votre Projet ?' },
    category: 'services'
  },
  {
    key: 'services.cta_description',
    translations: { 
      en: 'Contact us today to discuss your industrial needs and get a personalized solution from our expert team.',
      fr: 'Contactez-nous dès aujourd\'hui pour discuter de vos besoins industriels et obtenir une solution personnalisée de notre équipe d\'experts.'
    },
    category: 'services'
  },
  {
    key: 'services.get_in_touch',
    translations: { en: 'Get in Touch', fr: 'Nous Contacter' },
    category: 'services'
  },
  {
    key: 'services.call_now',
    translations: { en: 'Call Now', fr: 'Appeler Maintenant' },
    category: 'services'
  },
  {
    key: 'services.download_brochure',
    translations: { en: 'Download Brochure', fr: 'Télécharger la Brochure' },
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

  // Admin Panel
  {
    key: 'admin.panel',
    translations: { en: 'Admin Panel', fr: 'Panneau Admin' },
    category: 'admin'
  },
  {
    key: 'admin.hero',
    translations: { en: 'Edit Hero Section', fr: 'Modifier Section Hero' },
    category: 'admin'
  },
  {
    key: 'admin.services',
    translations: { en: 'Manage Services', fr: 'Gérer Services' },
    category: 'admin'
  },
  {
    key: 'admin.testimonials',
    translations: { en: 'Manage Testimonials', fr: 'Gérer Témoignages' },
    category: 'admin'
  },
  {
    key: 'admin.logout',
    translations: { en: 'Logout', fr: 'Déconnexion' },
    category: 'admin'
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