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
  {
    key: 'common.show_more',
    translations: { en: 'Show More', fr: 'Afficher Plus' },
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
  {
    key: 'services.delete_success_message',
    translations: { 
      en: '{serviceName} has been removed from your services.', 
      fr: '{serviceName} a été supprimé de vos services.' 
    },
    category: 'services'
  },
  {
    key: 'services.access_denied_add',
    translations: { 
      en: 'You need moderator or admin privileges to add services.', 
      fr: 'Vous avez besoin de privilèges modérateur ou admin pour ajouter des services.' 
    },
    category: 'services'
  },
  {
    key: 'services.access_denied_manage',
    translations: { 
      en: 'You need moderator or admin privileges to manage services.', 
      fr: 'Vous avez besoin de privilèges modérateur ou admin pour gérer les services.' 
    },
    category: 'services'
  },
  {
    key: 'services.no_services_available',
    translations: { 
      en: 'There are currently no services to display.', 
      fr: 'Il n\'y a actuellement aucun service à afficher.' 
    },
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
  {
    key: 'about.our_story_content',
    translations: { 
      en: 'Our Story Content', 
      fr: 'Contenu de Notre Histoire' 
    },
    category: 'about'
  },
  {
    key: 'about.values_title',
    translations: { 
      en: 'Why Choose MECOSO?', 
      fr: 'Pourquoi Choisir MECOSO?' 
    },
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
  },
  {
    key: 'about.image',
    translations: { en: 'Company Image', fr: 'Image de l\'Entreprise' },
    category: 'about'
  },
  {
    key: 'about.hero_background',
    translations: { en: 'Hero Background', fr: 'Arrière-plan Hero' },
    category: 'about'
  },
  {
    key: 'about.story_section_image',
    translations: { en: 'Story Section Image', fr: 'Image Section Histoire' },
    category: 'about'
  },
  {
    key: 'about.click_learn_more',
    translations: { en: 'Click to learn more', fr: 'Cliquer pour en savoir plus' },
    category: 'about'
  },
  {
    key: 'about.edit_about_page',
    translations: { en: 'Edit About Page', fr: 'Modifier la Page À Propos' },
    category: 'about'
  },
  {
    key: 'about.general_info',
    translations: { en: 'General Info', fr: 'Informations Générales' },
    category: 'about'
  },
  {
    key: 'about.statistics',
    translations: { en: 'Statistics', fr: 'Statistiques' },
    category: 'about'
  },
  {
    key: 'about.company_values',
    translations: { en: 'Company Values', fr: 'Valeurs de l\'Entreprise' },
    category: 'about'
  },
  {
    key: 'about.partners',
    translations: { en: 'Partners', fr: 'Partenaires' },
    category: 'about'
  },
  {
    key: 'about.badge_text',
    translations: { en: 'Badge Text', fr: 'Texte du Badge' },
    category: 'about'
  },
  {
    key: 'about.main_heading',
    translations: { en: 'Main Heading', fr: 'Titre Principal' },
    category: 'about'
  },
  {
    key: 'about.description_text',
    translations: { en: 'Description Text', fr: 'Texte de Description' },
    category: 'about'
  },
  {
    key: 'about.company_story',
    translations: { en: 'Company Story', fr: 'Histoire de l\'Entreprise' },
    category: 'about'
  },
  {
    key: 'about.mission_statement',
    translations: { en: 'Mission Statement', fr: 'Déclaration de Mission' },
    category: 'about'
  },
  {
    key: 'about.vision_statement',
    translations: { en: 'Vision Statement', fr: 'Déclaration de Vision' },
    category: 'about'
  },
  {
    key: 'about.add_stat',
    translations: { en: 'Add Stat', fr: 'Ajouter Statistique' },
    category: 'about'
  },
  {
    key: 'about.statistic',
    translations: { en: 'Statistic', fr: 'Statistique' },
    category: 'about'
  },
  {
    key: 'about.number',
    translations: { en: 'Number', fr: 'Nombre' },
    category: 'about'
  },
  {
    key: 'about.label',
    translations: { en: 'Label', fr: 'Étiquette' },
    category: 'about'
  },
  {
    key: 'about.icon',
    translations: { en: 'Icon', fr: 'Icône' },
    category: 'about'
  },
  {
    key: 'about.background_image',
    translations: { en: 'Background Image', fr: 'Image d\'Arrière-plan' },
    category: 'about'
  },
  {
    key: 'about.popup_image',
    translations: { en: 'Popup Image', fr: 'Image Popup' },
    category: 'about'
  },
  {
    key: 'about.popup_title',
    translations: { en: 'Popup Title', fr: 'Titre Popup' },
    category: 'about'
  },
  {
    key: 'about.popup_description',
    translations: { en: 'Popup Description', fr: 'Description Popup' },
    category: 'about'
  },
  {
    key: 'about.add_value',
    translations: { en: 'Add Value', fr: 'Ajouter Valeur' },
    category: 'about'
  },
  {
    key: 'about.value',
    translations: { en: 'Value', fr: 'Valeur' },
    category: 'about'
  },
  {
    key: 'about.title',
    translations: { en: 'Title', fr: 'Titre' },
    category: 'about'
  },
  {
    key: 'about.description',
    translations: { en: 'Description', fr: 'Description' },
    category: 'about'
  },
  {
    key: 'about.video_optional',
    translations: { en: 'Video (Optional)', fr: 'Vidéo (Optionnel)' },
    category: 'about'
  },
  {
    key: 'about.add_partner',
    translations: { en: 'Add Partner', fr: 'Ajouter Partenaire' },
    category: 'about'
  },
  {
    key: 'about.partner',
    translations: { en: 'Partner', fr: 'Partenaire' },
    category: 'about'
  },
  {
    key: 'about.partner_name',
    translations: { en: 'Partner Name', fr: 'Nom du Partenaire' },
    category: 'about'
  },
  {
    key: 'about.logo',
    translations: { en: 'Logo', fr: 'Logo' },
    category: 'about'
  },
  {
    key: 'about.preview',
    translations: { en: 'Preview', fr: 'Aperçu' },
    category: 'about'
  },
  {
    key: 'about.no_partners_yet',
    translations: { en: 'No partners yet', fr: 'Aucun partenaire pour le moment' },
    category: 'about'
  },
  {
    key: 'about.get_started_first_partner',
    translations: { en: 'Get started by adding your first partner.', fr: 'Commencez par ajouter votre premier partenaire.' },
    category: 'about'
  },
  {
    key: 'about.about_page_updated',
    translations: { en: 'About page updated successfully!', fr: 'Page À propos mise à jour avec succès!' },
    category: 'about'
  },
  {
    key: 'about.access_denied',
    translations: { en: 'Access denied', fr: 'Accès refusé' },
    category: 'about'
  },
  {
    key: 'about.access_denied_description',
    translations: { en: 'You need moderator or admin privileges to edit the about page.', fr: 'Vous avez besoin de privilèges modérateur ou admin pour modifier la page à propos.' },
    category: 'about'
  },
  {
    key: 'about.failed_to_load_image',
    translations: { en: 'Failed to load image', fr: 'Échec du chargement de l\'image' },
    category: 'about'
  },
  {
    key: 'about.failed_to_load_video',
    translations: { en: 'Failed to load video', fr: 'Échec du chargement de la vidéo' },
    category: 'about'
  },
  {
    key: 'about.no_media_available',
    translations: { en: 'No media available', fr: 'Aucun média disponible' },
    category: 'about'
  },
  {
    key: 'about.current_image',
    translations: { en: 'Current image', fr: 'Image actuelle' },
    category: 'about'
  },
  {
    key: 'about.current_video',
    translations: { en: 'Current video', fr: 'Vidéo actuelle' },
    category: 'about'
  },
  {
    key: 'about.current_logo',
    translations: { en: 'Current logo', fr: 'Logo actuel' },
    category: 'about'
  },
  {
    key: 'about.click_drag_upload',
    translations: { en: 'Click to upload or drag and drop', fr: 'Cliquer pour télécharger ou glisser-déposer' },
    category: 'about'
  },
  {
    key: 'about.images_videos_200mb',
    translations: { en: 'Images or videos up to 200MB', fr: 'Images ou vidéos jusqu\'à 200MB' },
    category: 'about'
  },
  {
    key: 'about.videos_200mb',
    translations: { en: 'Videos up to 200MB', fr: 'Vidéos jusqu\'à 200MB' },
    category: 'about'
  },
  {
    key: 'about.click_drag_replace',
    translations: { en: 'Click or drag to replace', fr: 'Cliquer ou glisser pour remplacer' },
    category: 'about'
  },
  {
    key: 'about.enter_image_url',
    translations: { en: 'Or enter image URL...', fr: 'Ou entrer l\'URL de l\'image...' },
    category: 'about'
  },
  {
    key: 'about.enter_video_url',
    translations: { en: 'Or enter video URL...', fr: 'Ou entrer l\'URL de la vidéo...' },
    category: 'about'
  },
  {
    key: 'about.enter_logo_url',
    translations: { en: 'Or enter logo URL...', fr: 'Ou entrer l\'URL du logo...' },
    category: 'about'
  },
  {
    key: 'about.popup_description_placeholder',
    translations: { en: 'Detailed description for the popup...', fr: 'Description détaillée pour le popup...' },
    category: 'about'
  },
  {
    key: 'about.value_description_placeholder',
    translations: { en: 'Detailed description of this value...', fr: 'Description détaillée de cette valeur...' },
    category: 'about'
  },
  {
    key: 'about.save_changes',
    translations: { en: 'Save Changes', fr: 'Enregistrer les Modifications' },
    category: 'about'
  },
  {
    key: 'about.maximum_10_values',
    translations: { en: 'Maximum 10 values allowed', fr: 'Maximum 10 valeurs autorisées' },
    category: 'about'
  },
  {
    key: 'about.error_saving_data',
    translations: { en: 'Error saving data: ', fr: 'Erreur lors de l\'enregistrement des données: ' },
    category: 'about'
  },
  {
    key: 'about.unknown_error',
    translations: { en: 'Unknown error', fr: 'Erreur inconnue' },
    category: 'about'
  },
  {
    key: 'about.projects_completed',
    translations: { en: 'Projects Completed', fr: 'Projets Terminés' },
    category: 'about'
  },
  {
    key: 'about.complete_solutions',
    translations: { en: 'Complete Solutions', fr: 'Solutions Complètes' },
    category: 'about'
  },
  {
    key: 'about.main_description',
    translations: { 
      en: 'MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we\'ve been delivering excellence in metal structure design, manufacturing, and assembly across all industries',
      fr: 'MECOSO est votre partenaire de confiance pour des solutions complètes de chaudronnerie et de structures métalliques. Depuis 2005, nous offrons l\'excellence dans la conception, la fabrication et l\'assemblage de structures métalliques pour toutes les industries'
    },
    category: 'about'
  },

  // Gallery Page (all keys missing from seedTranslations.js)
  {
    key: 'gallery.badge',
    translations: { en: 'Our Portfolio', fr: 'Notre Portfolio' },
    category: 'gallery'
  },
  {
    key: 'gallery.heading',
    translations: { en: 'Project Gallery', fr: 'Galerie de Projets' },
    category: 'gallery'
  },
  {
    key: 'gallery.description',
    translations: { 
      en: 'Explore our completed projects and industrial solutions. From mining equipment to steel structures, see the quality and precision that defines MECOSO\'s work across various industrial sectors.',
      fr: 'Découvrez nos projets réalisés et solutions industrielles. Des équipements miniers aux structures métalliques, découvrez la qualité et la précision qui définissent le travail de MECOSO dans divers secteurs industriels.'
    },
    category: 'gallery'
  },
  {
    key: 'gallery.filter',
    translations: { en: 'Filter', fr: 'Filtrer' },
    category: 'gallery'
  },
  {
    key: 'gallery.filter_projects',
    translations: { en: 'Filter Projects', fr: 'Filtrer les Projets' },
    category: 'gallery'
  },
  {
    key: 'gallery.view_details',
    translations: { en: 'View Details', fr: 'Voir les Détails' },
    category: 'gallery'
  },
  {
    key: 'gallery.show_more_projects',
    translations: { en: 'Show More Projects', fr: 'Afficher Plus de Projets' },
    category: 'gallery'
  },
  {
    key: 'gallery.show_less_projects',
    translations: { en: 'Show Less Projects', fr: 'Afficher Moins de Projets' },
    category: 'gallery'
  },
  {
    key: 'gallery.showing_projects',
    translations: { 
      en: 'Showing {current} of {total} projects{category, select, null {} other { in {category}}}',
      fr: 'Affichage de {current} sur {total} projets{category, select, null {} other { dans {category}}}'
    },
    category: 'gallery'
  },
  {
    key: 'gallery.contact_about_project',
    translations: { en: 'Contact Us About This Project', fr: 'Nous Contacter À Propos de Ce Projet' },
    category: 'gallery'
  },
  {
    key: 'gallery.edit_gallery_section',
    translations: { en: 'Edit Gallery Section', fr: 'Modifier la Section Galerie' },
    category: 'gallery'
  },
  {
    key: 'gallery.header_information',
    translations: { en: 'Header Information', fr: 'Informations d\'En-tête' },
    category: 'gallery'
  },
  {
    key: 'gallery.badge_text',
    translations: { en: 'Badge Text', fr: 'Texte du Badge' },
    category: 'gallery'
  },
  {
    key: 'gallery.badge_placeholder',
    translations: { en: 'Enter badge text...', fr: 'Entrez le texte du badge...' },
    category: 'gallery'
  },
  {
    key: 'gallery.main_heading',
    translations: { en: 'Main Heading', fr: 'Titre Principal' },
    category: 'gallery'
  },
  {
    key: 'gallery.heading_placeholder',
    translations: { en: 'Enter main heading...', fr: 'Entrez le titre principal...' },
    category: 'gallery'
  },
  {
    key: 'gallery.description_placeholder',
    translations: { en: 'Enter description...', fr: 'Entrez la description...' },
    category: 'gallery'
  },
  {
    key: 'gallery.gallery_items',
    translations: { en: 'Gallery Items', fr: 'Éléments de la Galerie' },
    category: 'gallery'
  },
  {
    key: 'gallery.add_item',
    translations: { en: 'Add Item', fr: 'Ajouter un Élément' },
    category: 'gallery'
  },
  {
    key: 'gallery.item',
    translations: { en: 'Item', fr: 'Élément' },
    category: 'gallery'
  },
  {
    key: 'gallery.edit_item',
    translations: { en: 'Edit item', fr: 'Modifier l\'élément' },
    category: 'gallery'
  },
  {
    key: 'gallery.delete_item',
    translations: { en: 'Delete item', fr: 'Supprimer l\'élément' },
    category: 'gallery'
  },
  {
    key: 'gallery.no_image',
    translations: { en: 'No image', fr: 'Aucune image' },
    category: 'gallery'
  },
  {
    key: 'gallery.save_changes',
    translations: { en: 'Save Changes', fr: 'Enregistrer les Modifications' },
    category: 'gallery'
  },
  {
    key: 'gallery.edit_gallery_item',
    translations: { en: 'Edit Gallery Item', fr: 'Modifier l\'Élément de la Galerie' },
    category: 'gallery'
  },
  {
    key: 'gallery.add_new_gallery_item',
    translations: { en: 'Add New Gallery Item', fr: 'Ajouter un Nouvel Élément à la Galerie' },
    category: 'gallery'
  },
  {
    key: 'gallery.project_title',
    translations: { en: 'Project Title', fr: 'Titre du Projet' },
    category: 'gallery'
  },
  {
    key: 'gallery.project_title_placeholder',
    translations: { en: 'Enter project title...', fr: 'Entrez le titre du projet...' },
    category: 'gallery'
  },
  {
    key: 'gallery.category',
    translations: { en: 'Category', fr: 'Catégorie' },
    category: 'gallery'
  },
  {
    key: 'gallery.category_placeholder',
    translations: { en: 'Enter category...', fr: 'Entrez la catégorie...' },
    category: 'gallery'
  },
  {
    key: 'gallery.project_description_placeholder',
    translations: { en: 'Enter project description...', fr: 'Entrez la description du projet...' },
    category: 'gallery'
  },
  {
    key: 'gallery.upload_image',
    translations: { en: 'Upload Image', fr: 'Télécharger une Image' },
    category: 'gallery'
  },
  {
    key: 'gallery.size',
    translations: { en: 'Size', fr: 'Taille' },
    category: 'gallery'
  },
  {
    key: 'gallery.size_small',
    translations: { en: 'Small', fr: 'Petit' },
    category: 'gallery'
  },
  {
    key: 'gallery.size_medium',
    translations: { en: 'Medium', fr: 'Moyen' },
    category: 'gallery'
  },
  {
    key: 'gallery.size_large',
    translations: { en: 'Large', fr: 'Grand' },
    category: 'gallery'
  },
  {
    key: 'gallery.update_item',
    translations: { en: 'Update Item', fr: 'Mettre à Jour l\'Élément' },
    category: 'gallery'
  },
  {
    key: 'gallery.fetch_error',
    translations: { en: 'Failed to load gallery data', fr: 'Échec du chargement des données de la galerie' },
    category: 'gallery'
  },
  {
    key: 'gallery.login_required',
    translations: { en: 'You must be logged in to save changes', fr: 'Vous devez être connecté pour enregistrer les modifications' },
    category: 'gallery'
  },
  {
    key: 'gallery.token_not_found',
    translations: { en: 'Authentication token not found', fr: 'Jeton d\'authentification non trouvé' },
    category: 'gallery'
  },
  {
    key: 'gallery.updated_success',
    translations: { en: 'Gallery updated successfully', fr: 'Galerie mise à jour avec succès' },
    category: 'gallery'
  },
  {
    key: 'gallery.save_failed',
    translations: { en: 'Failed to save gallery changes', fr: 'Échec de l\'enregistrement des modifications de la galerie' },
    category: 'gallery'
  },
  {
    key: 'gallery.upload_failed',
    translations: { en: 'Failed to upload image', fr: 'Échec du téléchargement de l\'image' },
    category: 'gallery'
  },

  // Machines Page (all keys missing from seedTranslations.js)
  {
    key: 'machines.badge',
    translations: { en: 'Our Equipment', fr: 'Notre Équipement' },
    category: 'machines'
  },
  {
    key: 'machines.heading',
    translations: { en: 'Industrial Machinery Fleet', fr: 'Parc de Machines Industrielles' },
    category: 'machines'
  },
  {
    key: 'machines.description',
    translations: { 
      en: 'MECOSO operates state-of-the-art industrial machinery for manufacturing, fabrication, and assembly operations. Our equipment fleet ensures precision, efficiency, and reliability in every project we undertake.',
      fr: 'MECOSO exploite des machines industrielles de pointe pour les opérations de fabrication, d\'usinage et d\'assemblage. Notre parc d\'équipements garantit précision, efficacité et fiabilité dans chaque projet que nous entreprenons.'
    },
    category: 'machines'
  },
  {
    key: 'machines.stats.active_machines',
    translations: { en: 'Active Machines', fr: 'Machines Actives' },
    category: 'machines'
  },
  {
    key: 'machines.stats.uptime_rate',
    translations: { en: 'Uptime Rate', fr: 'Taux de Fonctionnement' },
    category: 'machines'
  },
  {
    key: 'machines.stats.years_service',
    translations: { en: 'Years Service', fr: 'Années de Service' },
    category: 'machines'
  },
  {
    key: 'machines.stats.operations',
    translations: { en: 'Operations', fr: 'Opérations' },
    category: 'machines'
  },
  {
    key: 'machines.categories.all',
    translations: { en: 'All', fr: 'Tout' },
    category: 'machines'
  },
  {
    key: 'machines.categories.cutting',
    translations: { en: 'Cutting', fr: 'Découpe' },
    category: 'machines'
  },
  {
    key: 'machines.categories.forming',
    translations: { en: 'Forming', fr: 'Formage' },
    category: 'machines'
  },
  {
    key: 'machines.categories.handling',
    translations: { en: 'Handling', fr: 'Manutention' },
    category: 'machines'
  },
  {
    key: 'machines.categories.welding',
    translations: { en: 'Welding', fr: 'Soudage' },
    category: 'machines'
  },
  {
    key: 'machines.categories.assembly',
    translations: { en: 'Assembly', fr: 'Assemblage' },
    category: 'machines'
  },
  {
    key: 'machines.categories.testing',
    translations: { en: 'Testing', fr: 'Test' },
    category: 'machines'
  },
  {
    key: 'machines.categories.other',
    translations: { en: 'Other', fr: 'Autre' },
    category: 'machines'
  },
  {
    key: 'machines.status.available',
    translations: { en: 'Available', fr: 'Disponible' },
    category: 'machines'
  },
  {
    key: 'machines.status.in_use',
    translations: { en: 'In Use', fr: 'En Utilisation' },
    category: 'machines'
  },
  {
    key: 'machines.status.maintenance',
    translations: { en: 'Maintenance', fr: 'Maintenance' },
    category: 'machines'
  },
  {
    key: 'machines.no_machines',
    translations: { en: 'No machines available', fr: 'Aucune machine disponible' },
    category: 'machines'
  },
  {
    key: 'machines.no_machines_category',
    translations: { en: 'No machines found in the "{category}" category.', fr: 'Aucune machine trouvée dans la catégorie "{category}".' },
    category: 'machines'
  },
  {
    key: 'machines.no_machines_added',
    translations: { en: 'No machines have been added yet.', fr: 'Aucune machine n\'a été ajoutée pour le moment.' },
    category: 'machines'
  },
  {
    key: 'machines.view_details',
    translations: { en: 'View Details', fr: 'Voir les Détails' },
    category: 'machines'
  },
  {
    key: 'machines.show_more',
    translations: { en: 'Show More Machines', fr: 'Afficher Plus de Machines' },
    category: 'machines'
  },
  {
    key: 'machines.show_less',
    translations: { en: 'Show Less', fr: 'Afficher Moins' },
    category: 'machines'
  },
  {
    key: 'machines.loading',
    translations: { en: 'Loading machines...', fr: 'Chargement des machines...' },
    category: 'machines'
  },
  {
    key: 'machines.specifications',
    translations: { en: 'Specifications', fr: 'Spécifications' },
    category: 'machines'
  },
  {
    key: 'machines.capacity',
    translations: { en: 'Capacity', fr: 'Capacité' },
    category: 'machines'
  },
  {
    key: 'machines.power_requirement',
    translations: { en: 'Power Requirement', fr: 'Besoins en Énergie' },
    category: 'machines'
  },
  {
    key: 'machines.model',
    translations: { en: 'Model', fr: 'Modèle' },
    category: 'machines'
  },
  {
    key: 'machines.year_manufactured',
    translations: { en: 'Year Manufactured', fr: 'Année de Fabrication' },
    category: 'machines'
  },
  {
    key: 'machines.status',
    translations: { en: 'Status', fr: 'Statut' },
    category: 'machines'
  },
  {
    key: 'machines.technical_specifications',
    translations: { en: 'Technical Specifications', fr: 'Spécifications Techniques' },
    category: 'machines'
  },
  {
    key: 'machines.request_access',
    translations: { en: 'Request Access', fr: 'Demander l\'Accès' },
    category: 'machines'
  },
  {
    key: 'machines.edit_page',
    translations: { en: 'Edit Machines Page', fr: 'Modifier la Page des Machines' },
    category: 'machines'
  },
  {
    key: 'machines.edit_machine',
    translations: { en: 'Edit Machine', fr: 'Modifier la Machine' },
    category: 'machines'
  },
  {
    key: 'machines.general',
    translations: { en: 'General', fr: 'Général' },
    category: 'machines'
  },
  {
    key: 'machines.statistics',
    translations: { en: 'Statistics', fr: 'Statistiques' },
    category: 'machines'
  },
  {
    key: 'machines.machines_list',
    translations: { en: 'Machines', fr: 'Machines' },
    category: 'machines'
  },
  {
    key: 'machines.badge_text',
    translations: { en: 'Badge Text', fr: 'Texte du Badge' },
    category: 'machines'
  },
  {
    key: 'machines.main_heading',
    translations: { en: 'Main Heading', fr: 'Titre Principal' },
    category: 'machines'
  },
  {
    key: 'machines.description_text',
    translations: { en: 'Description', fr: 'Description' },
    category: 'machines'
  },
  {
    key: 'machines.add_stat',
    translations: { en: 'Add Stat', fr: 'Ajouter Statistique' },
    category: 'machines'
  },
  {
    key: 'machines.stat_number',
    translations: { en: 'Number/Value', fr: 'Nombre/Valeur' },
    category: 'machines'
  },
  {
    key: 'machines.stat_label',
    translations: { en: 'Label', fr: 'Étiquette' },
    category: 'machines'
  },
  {
    key: 'machines.add_machine',
    translations: { en: 'Add Machine', fr: 'Ajouter Machine' },
    category: 'machines'
  },
  {
    key: 'machines.machine_title',
    translations: { en: 'Title', fr: 'Titre' },
    category: 'machines'
  },
  {
    key: 'machines.machine_category',
    translations: { en: 'Category', fr: 'Catégorie' },
    category: 'machines'
  },
  {
    key: 'machines.machine_description',
    translations: { en: 'Description', fr: 'Description' },
    category: 'machines'
  },
  {
    key: 'machines.machine_image',
    translations: { en: 'Machine Image', fr: 'Image de la Machine' },
    category: 'machines'
  },
  {
    key: 'machines.upload_image',
    translations: { en: 'Upload', fr: 'Télécharger' },
    category: 'machines'
  },
  {
    key: 'machines.add_spec',
    translations: { en: 'Add Spec', fr: 'Ajouter Spécification' },
    category: 'machines'
  },
  {
    key: 'machines.specification',
    translations: { en: 'Specification', fr: 'Spécification' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.badge',
    translations: { en: 'Enter badge text...', fr: 'Entrez le texte du badge...' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.heading',
    translations: { en: 'Enter main heading...', fr: 'Entrez le titre principal...' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.description',
    translations: { en: 'Enter description...', fr: 'Entrez la description...' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.stat_number',
    translations: { en: 'e.g., 25+, 99.5%, 24/7', fr: 'ex. : 25+, 99.5%, 24/7' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.stat_label',
    translations: { en: 'e.g., Active Machines, Uptime Rate', fr: 'ex. : Machines Actives, Taux de Fonctionnement' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.machine_title',
    translations: { en: 'Machine title...', fr: 'Titre de la machine...' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.machine_description',
    translations: { en: 'Machine description...', fr: 'Description de la machine...' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.image_url',
    translations: { en: 'https://example.com/image.jpg or upload a file', fr: 'https://exemple.com/image.jpg ou télécharger un fichier' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.model',
    translations: { en: 'Model number...', fr: 'Numéro de modèle...' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.year',
    translations: { en: 'YYYY', fr: 'AAAA' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.capacity',
    translations: { en: 'e.g., 200mm max thickness', fr: 'ex. : épaisseur max 200mm' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.power',
    translations: { en: 'e.g., 380V, 200A', fr: 'ex. : 380V, 200A' },
    category: 'machines'
  },
  {
    key: 'machines.placeholder.specification',
    translations: { en: 'Specification...', fr: 'Spécification...' },
    category: 'machines'
  },
  {
    key: 'machines.delete.confirm',
    translations: { en: 'Confirm Deletion', fr: 'Confirmer la Suppression' },
    category: 'machines'
  },
  {
    key: 'machines.delete.message',
    translations: { en: 'Are you sure you want to delete {name}? This action cannot be undone.', fr: 'Êtes-vous sûr de vouloir supprimer {name} ? Cette action ne peut pas être annulée.' },
    category: 'machines'
  },
  {
    key: 'machines.error.load_failed',
    translations: { en: 'Failed to load machines data', fr: 'Échec du chargement des données des machines' },
    category: 'machines'
  },
  {
    key: 'machines.error.upload_failed',
    translations: { en: 'Upload failed', fr: 'Échec du téléchargement' },
    category: 'machines'
  },
  {
    key: 'machines.error.auth_required',
    translations: { en: 'Authentication required', fr: 'Authentification requise' },
    category: 'machines'
  },
  {
    key: 'machines.error.unauthorized',
    translations: { en: 'Unauthorized: Admin access required', fr: 'Non autorisé : Accès administrateur requis' },
    category: 'machines'
  },
  {
    key: 'machines.error.token_not_found',
    translations: { en: 'Authentication token not found', fr: 'Jeton d\'authentification non trouvé' },
    category: 'machines'
  },
  {
    key: 'machines.error.update_failed',
    translations: { en: 'Failed to update machines page', fr: 'Échec de la mise à jour de la page des machines' },
    category: 'machines'
  },
  {
    key: 'machines.error.machine_update_failed',
    translations: { en: 'Failed to update machine', fr: 'Échec de la mise à jour de la machine' },
    category: 'machines'
  },
  {
    key: 'machines.error.machine_delete_failed',
    translations: { en: 'Failed to delete machine', fr: 'Échec de la suppression de la machine' },
    category: 'machines'
  },
  {
    key: 'machines.error.max_stats',
    translations: { en: 'Maximum 10 stats allowed', fr: 'Maximum 10 statistiques autorisées' },
    category: 'machines'
  },
  {
    key: 'machines.error.min_stats',
    translations: { en: 'At least one stat is required', fr: 'Au moins une statistique est requise' },
    category: 'machines'
  },
  {
    key: 'machines.error.required_fields',
    translations: { en: 'Badge, heading, and description are required', fr: 'Le badge, le titre et la description sont requis' },
    category: 'machines'
  },
  {
    key: 'machines.error.stat_required',
    translations: { en: 'Stat {number} must have both number and label', fr: 'La statistique {number} doit avoir un nombre et une étiquette' },
    category: 'machines'
  },
  {
    key: 'machines.error.machine_required',
    translations: { en: 'Machine {number}: Title and Category are required', fr: 'Machine {number} : Le titre et la catégorie sont requis' },
    category: 'machines'
  },
  {
    key: 'machines.error.specs_required',
    translations: { en: 'Machine {number} must have at least one specification', fr: 'La machine {number} doit avoir au moins une spécification' },
    category: 'machines'
  },
  {
    key: 'machines.error.spec_required',
    translations: { en: 'At least one specification is required', fr: 'Au moins une spécification est requise' },
    category: 'machines'
  },
  {
    key: 'machines.error.invalid_file_type',
    translations: { en: 'Please select an image file', fr: 'Veuillez sélectionner un fichier image' },
    category: 'machines'
  },
  {
    key: 'machines.error.file_too_large',
    translations: { en: 'File size must be less than 5MB', fr: 'La taille du fichier doit être inférieure à 5MB' },
    category: 'machines'
  },
  {
    key: 'machines.success.upload',
    translations: { en: 'Image uploaded successfully', fr: 'Image téléchargée avec succès' },
    category: 'machines'
  },
  {
    key: 'machines.success.update',
    translations: { en: 'Machines page updated successfully', fr: 'Page des machines mise à jour avec succès' },
    category: 'machines'
  },
  {
    key: 'machines.success.machine_update',
    translations: { en: 'Machine updated successfully', fr: 'Machine mise à jour avec succès' },
    category: 'machines'
  },
  {
    key: 'machines.success.machine_delete',
    translations: { en: 'Machine deleted successfully', fr: 'Machine supprimée avec succès' },
    category: 'machines'
  },

  // Contact Page
  {
    key: 'contact.badge',
    translations: { en: 'Get In Touch', fr: 'Entrer en contact' },
    category: 'contact'
  },
  {
    key: 'contact.heading',
    translations: { 
      en: 'Let\'s Build Something Amazing Together', 
      fr: 'Construisons Quelque Chose d\'Incroyable Ensemble' 
    },
    category: 'contact'
  },
  {
    key: 'contact.description',
    translations: { 
      en: 'Ready to start your next construction project? Our expert team is here to turn your vision into reality with professional consultation and tailored solutions.',
      fr: 'Prêt à démarrer votre prochain projet de construction ? Notre équipe d\'experts est là pour transformer votre vision en réalité avec des consultations professionnelles et des solutions sur mesure.'
    },
    category: 'contact'
  },
  {
    key: 'contact.start_project',
    translations: { en: 'Start Your Project', fr: 'Démarrez Votre Projet' },
    category: 'contact'
  },
  {
    key: 'contact.form_description',
    translations: { 
      en: 'Fill out the form and we\'ll get back to you within 24 hours',
      fr: 'Remplissez le formulaire et nous vous répondrons dans les 24 heures'
    },
    category: 'contact'
  },
  {
    key: 'contact.full_name',
    translations: { en: 'Full Name', fr: 'Nom Complet' },
    category: 'contact'
  },
  {
    key: 'contact.email_address',
    translations: { en: 'Email Address', fr: 'Adresse Email' },
    category: 'contact'
  },
  {
    key: 'contact.company_organization',
    translations: { en: 'Company/Organization', fr: 'Entreprise/Organisation' },
    category: 'contact'
  },
  {
    key: 'contact.phone_number',
    translations: { en: 'Phone Number', fr: 'Numéro de Téléphone' },
    category: 'contact'
  },
  {
    key: 'contact.project_details',
    translations: { en: 'Project Details', fr: 'Détails du Projet' },
    category: 'contact'
  },
  {
    key: 'contact.service_interested',
    translations: { en: 'Service Interested In', fr: 'Service Intéressé' },
    category: 'contact'
  },
  {
    key: 'contact.project_type',
    translations: { en: 'Project Type', fr: 'Type de Projet' },
    category: 'contact'
  },
  {
    key: 'contact.estimated_budget',
    translations: { en: 'Estimated Budget', fr: 'Budget Estimé' },
    category: 'contact'
  },
  {
    key: 'contact.timeline',
    translations: { en: 'Timeline', fr: 'Calendrier' },
    category: 'contact'
  },
  {
    key: 'contact.project_description',
    translations: { en: 'Project Description', fr: 'Description du Projet' },
    category: 'contact'
  },
  {
    key: 'contact.send_message',
    translations: { en: 'Send Message', fr: 'Envoyer Message' },
    category: 'contact'
  },
  {
    key: 'contact.message_sent',
    translations: { en: 'Message Sent Successfully! 🎉', fr: 'Message Envoyé avec Succès ! 🎉' },
    category: 'contact'
  },
  {
    key: 'contact.thank_you',
    translations: { 
      en: 'Thank you for reaching out! Our team will review your project details and get back to you within 24 hours.',
      fr: 'Merci de nous avoir contactés ! Notre équipe examinera les détails de votre projet et vous répondra dans les 24 heures.'
    },
    category: 'contact'
  },
  {
    key: 'contact.expected_response',
    translations: { en: 'Expected response: Within 24 hours', fr: 'Réponse attendue : Dans les 24 heures' },
    category: 'contact'
  },

  // Placeholders
  {
    key: 'contact.placeholder.name',
    translations: { en: 'Enter your full name', fr: 'Entrez votre nom complet' },
    category: 'contact'
  },
  {
    key: 'contact.placeholder.email',
    translations: { en: 'your.email@example.com', fr: 'votre.email@exemple.com' },
    category: 'contact'
  },
  {
    key: 'contact.placeholder.company',
    translations: { en: 'Your company name', fr: 'Nom de votre entreprise' },
    category: 'contact'
  },
  {
    key: 'contact.placeholder.phone',
    translations: { en: '+212 661-234-567', fr: '+212 661-234-567' },
    category: 'contact'
  },
  {
    key: 'contact.placeholder.message',
    translations: { 
      en: 'Tell us more about your project requirements, goals, and any specific details that would help us provide you with the best solution...',
      fr: 'Parlez-nous davantage de vos exigences de projet, objectifs et détails spécifiques qui nous aideraient à vous fournir la meilleure solution...'
    },
    category: 'contact'
  },

  // Form Options
  {
    key: 'contact.select_service',
    translations: { en: 'Select a service', fr: 'Sélectionnez un service' },
    category: 'contact'
  },
  {
    key: 'contact.select_project_type',
    translations: { en: 'Select project type', fr: 'Sélectionnez le type de projet' },
    category: 'contact'
  },
  {
    key: 'contact.select_budget',
    translations: { en: 'Select budget range', fr: 'Sélectionnez la fourchette budgétaire' },
    category: 'contact'
  },
  {
    key: 'contact.select_timeline',
    translations: { en: 'Select timeline', fr: 'Sélectionnez le calendrier' },
    category: 'contact'
  },

  // Service Options
  {
    key: 'contact.service.architectural',
    translations: { en: 'Architectural Design', fr: 'Conception Architecturale' },
    category: 'contact'
  },
  {
    key: 'contact.service.project_mgmt',
    translations: { en: 'Project Management', fr: 'Gestion de Projet' },
    category: 'contact'
  },
  {
    key: 'contact.service.structural',
    translations: { en: 'Structural Engineering', fr: 'Ingénierie Structurelle' },
    category: 'contact'
  },
  {
    key: 'contact.service.machinery',
    translations: { en: 'Heavy Machinery & Logistics', fr: 'Machines Lourdes & Logistique' },
    category: 'contact'
  },
  {
    key: 'contact.service.quality',
    translations: { en: 'Quality Assurance', fr: 'Assurance Qualité' },
    category: 'contact'
  },
  {
    key: 'contact.service.green',
    translations: { en: 'Green Building Solutions', fr: 'Solutions de Construction Écologique' },
    category: 'contact'
  },

  // Project Types
  {
    key: 'contact.project.residential',
    translations: { en: 'Residential', fr: 'Résidentiel' },
    category: 'contact'
  },
  {
    key: 'contact.project.commercial',
    translations: { en: 'Commercial', fr: 'Commercial' },
    category: 'contact'
  },
  {
    key: 'contact.project.industrial',
    translations: { en: 'Industrial', fr: 'Industriel' },
    category: 'contact'
  },
  {
    key: 'contact.project.infrastructure',
    translations: { en: 'Infrastructure', fr: 'Infrastructure' },
    category: 'contact'
  },

  // Budget Options
  {
    key: 'contact.budget.under_500k',
    translations: { en: 'Under 500k MAD', fr: 'Moins de 500k MAD' },
    category: 'contact'
  },
  {
    key: 'contact.budget.500k_2m',
    translations: { en: '500k - 2M MAD', fr: '500k - 2M MAD' },
    category: 'contact'
  },
  {
    key: 'contact.budget.2m_5m',
    translations: { en: '2M - 5M MAD', fr: '2M - 5M MAD' },
    category: 'contact'
  },
  {
    key: 'contact.budget.5m_20m',
    translations: { en: '5M - 20M MAD', fr: '5M - 20M MAD' },
    category: 'contact'
  },
  {
    key: 'contact.budget.over_20m',
    translations: { en: 'Over 20M MAD', fr: 'Plus de 20M MAD' },
    category: 'contact'
  },

  // Timeline Options
  {
    key: 'contact.timeline.asap',
    translations: { en: 'ASAP', fr: 'Dès que possible' },
    category: 'contact'
  },
  {
    key: 'contact.timeline.1_3_months',
    translations: { en: '1-3 months', fr: '1-3 mois' },
    category: 'contact'
  },
  {
    key: 'contact.timeline.3_6_months',
    translations: { en: '3-6 months', fr: '3-6 mois' },
    category: 'contact'
  },
  {
    key: 'contact.timeline.6_12_months',
    translations: { en: '6-12 months', fr: '6-12 mois' },
    category: 'contact'
  },
  {
    key: 'contact.timeline.over_1_year',
    translations: { en: 'Over 1 year', fr: 'Plus d\'1 an' },
    category: 'contact'
  },

  // Map Section
  {
    key: 'contact.find_office',
    translations: { en: 'Find Our Office in Marrakech', fr: 'Trouvez Notre Bureau à Marrakech' },
    category: 'contact'
  },
  {
    key: 'contact.visit_description',
    translations: { 
      en: 'Visit us at our modern headquarters in the heart of Marrakech. We\'re located in the vibrant Gueliz district.',
      fr: 'Visitez-nous à notre siège moderne au cœur de Marrakech. Nous sommes situés dans le quartier animé de Gueliz.'
    },
    category: 'contact'
  },
  {
    key: 'contact.get_directions',
    translations: { en: 'Get Directions', fr: 'Obtenir l\'Itinéraire' },
    category: 'contact'
  },
  {
    key: 'contact.call_now',
    translations: { en: 'Call Now', fr: 'Appeler Maintenant' },
    category: 'contact'
  },
  {
    key: 'contact.loading_map',
    translations: { en: 'Loading interactive map...', fr: 'Chargement de la carte interactive...' },
    category: 'contact'
  },
  {
    key: 'contact.prime_location',
    translations: { en: 'Prime Location', fr: 'Emplacement de Choix' },
    category: 'contact'
  },
  {
    key: 'contact.prime_location_desc',
    translations: { 
      en: 'Located in Massira II, the modern business district of Marrakech',
      fr: 'Situé à Massira II, le quartier d\'affaires moderne de Marrakech'
    },
    category: 'contact'
  },
  {
    key: 'contact.easy_access',
    translations: { en: 'Easy Access', fr: 'Accès Facile' },
    category: 'contact'
  },
  {
    key: 'contact.easy_access_desc',
    translations: { 
      en: '5 minutes from Marrakech Railway Station and main transport hubs',
      fr: 'À 5 minutes de la gare de Marrakech et des principaux pôles de transport'
    },
    category: 'contact'
  },
  {
    key: 'contact.modern_facilities',
    translations: { en: 'Modern Facilities', fr: 'Installations Modernes' },
    category: 'contact'
  },
  {
    key: 'contact.modern_facilities_desc',
    translations: { 
      en: 'State-of-the-art office with meeting rooms and project showcase area',
      fr: 'Bureau de pointe avec salles de réunion et espace d\'exposition de projets'
    },
    category: 'contact'
  },

  // Edit Modal
  {
    key: 'contact.edit_section',
    translations: { en: 'Edit Contact Section', fr: 'Modifier la Section Contact' },
    category: 'contact'
  },
  {
    key: 'contact.basic_info',
    translations: { en: 'Basic Information', fr: 'Informations de Base' },
    category: 'contact'
  },
  {
    key: 'contact.badge_text',
    translations: { en: 'Badge Text', fr: 'Texte du Badge' },
    category: 'contact'
  },
  {
    key: 'contact.main_heading',
    translations: { en: 'Main Heading', fr: 'Titre Principal' },
    category: 'contact'
  },
  {
    key: 'contact.description_text',
    translations: { en: 'Description', fr: 'Description' },
    category: 'contact'
  },
  {
    key: 'contact.contact_info',
    translations: { en: 'Contact Information', fr: 'Informations de Contact' },
    category: 'contact'
  },
  {
    key: 'contact.add_contact',
    translations: { en: 'Add Contact', fr: 'Ajouter Contact' },
    category: 'contact'
  },
  {
    key: 'contact.contact_item',
    translations: { en: 'Contact Item', fr: 'Élément de Contact' },
    category: 'contact'
  },
  {
    key: 'contact.icon_type',
    translations: { en: 'Icon Type', fr: 'Type d\'Icône' },
    category: 'contact'
  },
  {
    key: 'contact.title',
    translations: { en: 'Title', fr: 'Titre' },
    category: 'contact'
  },
  {
    key: 'contact.details',
    translations: { en: 'Details', fr: 'Détails' },
    category: 'contact'
  },
  {
    key: 'contact.add_detail',
    translations: { en: 'Add Detail', fr: 'Ajouter Détail' },
    category: 'contact'
  },
  {
    key: 'contact.accent_style',
    translations: { en: 'Accent Style (Highlighted)', fr: 'Style Accentué (Mis en Évidence)' },
    category: 'contact'
  },
  {
    key: 'contact.save_changes',
    translations: { en: 'Save Changes', fr: 'Enregistrer les Modifications' },
    category: 'contact'
  },
  {
    key: 'contact.updated_success',
    translations: { en: 'Contact information updated successfully', fr: 'Informations de contact mises à jour avec succès' },
    category: 'contact'
  },
  {
    key: 'contact.update_failed',
    translations: { en: 'Failed to save contact information', fr: 'Échec de l\'enregistrement des informations de contact' },
    category: 'contact'
  },

  // Contact Info Defaults
  {
    key: 'contact.info.visit_atelier',
    translations: { en: 'Visit Our Atelier', fr: 'Visitez Notre Atelier' },
    category: 'contact'
  },
  {
    key: 'contact.info.call_us',
    translations: { en: 'Call Us', fr: 'Appelez-Nous' },
    category: 'contact'
  },
  {
    key: 'contact.info.email_us',
    translations: { en: 'Email Us', fr: 'Envoyez-Nous un Email' },
    category: 'contact'
  },
  {
    key: 'contact.info.business_hours',
    translations: { en: 'Business Hours', fr: 'Heures d\'Ouverture' },
    category: 'contact'
  },
  {
    key: 'contact.info.hours_detail',
    translations: { en: 'Mon - Sat: 9:00 AM - 6:00 PM', fr: 'Lun - Sam : 9h00 - 18h00' },
    category: 'contact'
  },
  {
    key: 'contact.info.sunday_closed',
    translations: { en: 'Sunday: Closed', fr: 'Dimanche : Fermé' },
    category: 'contact'
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