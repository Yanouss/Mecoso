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
    'common.saving': 'Saving...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Services
    'services.badge': 'Our Services',
    'services.heading': 'Our Core Services',
    'services.description': 'MECOSO delivers complete industrial solutions. From design and fabrication to installation and maintenance. Serving the mining, energy, and heavy industry sectors with a focus on quality, safety, and innovation.',
    'services.our_services': 'Our Services',
    'services.all_categories': 'All',
    'services.view_details': 'View Details',
    'services.get_started': 'Get Started',
    'services.add_service': 'Add Service',
    'services.client_testimonials': 'Client Testimonials',
    'services.add_testimonial': 'Add Testimonial',
    'services.no_services': 'No services available',
    'services.no_testimonials_available': 'No testimonials available yet',
    'services.default_client_name': 'John Doe',
    'services.default_client_role': 'Client',
    'services.duration': 'Duration',
    'services.price': 'Price',
    'services.features': 'Features',
    'services.key_features': 'Key Features',
    'services.more': 'more',
    'services.projects_completed': 'Projects Completed',
    'services.iso_certified': 'ISO 9001 Certified',
    'services.years_experience': 'Years Experience',
    'services.expert_team': 'Expert Team',

    // Services Page - Error Messages
    'services.fetch_error': 'Failed to load services',
    'services.testimonials_fetch_error': 'Failed to load testimonials',
    'services.file_too_large': 'File size must be less than 200MB',
    'services.invalid_file_type': 'Please upload a valid image or video file',
    'services.file_upload_success': 'File uploaded successfully',
    'services.access_denied_edit': 'You need moderator or admin privileges to edit services',
    'services.access_denied_delete': 'You need moderator or admin privileges to delete services',
    'services.access_denied_edit_testimonials': 'You need moderator or admin privileges to edit testimonials',
    'services.access_denied_delete_testimonials': 'You need moderator or admin privileges to delete testimonials',
    'services.main_content_updated': 'Main content updated successfully',
    'services.service_updated': 'Service updated successfully',
    'services.service_added': 'Service added successfully',
    'services.service_deleted': 'Service deleted successfully',
    'services.testimonial_updated': 'Testimonial updated successfully',
    'services.testimonial_added': 'Testimonial added successfully',
    'services.testimonial_deleted': 'Testimonial deleted successfully',
    'services.save_service_error': 'Failed to save service',
    'services.delete_service_error': 'Failed to delete service',
    'services.save_testimonial_error': 'Failed to save testimonial',
    'services.delete_testimonial_error': 'Failed to delete testimonial',
    'services.session_expired': 'Session expired or insufficient permissions',

    // Services Page - Modal Content
    'services.edit_main_content': 'Edit Main Content',
    'services.badge_text': 'Badge Text',
    'services.heading_text': 'Heading Text',
    'services.description_text': 'Description Text',
    'services.edit_service': 'Edit Service',
    'services.add_new_service': 'Add New Service',
    'services.service_image': 'Service Image',
    'services.click_to_change': 'Click to change image',
    'services.drop_image_here': 'Drop image here or click to upload',
    'services.supported_formats': 'SVG, PNG, JPG, GIF, MP4, WebM, MOV, AVI, MKV',
    'services.max_file_size': 'Max file size: 200MB',
    'services.service_title': 'Service Title',
    'services.category': 'Category',
    'services.add_feature': 'Add Feature',
    'services.feature_placeholder': 'Enter feature description',
    'services.edit_testimonial': 'Edit Testimonial',
    'services.add_new_testimonial': 'Add New Testimonial',
    'services.client_photo': 'Client Photo',
    'services.click_to_change_photo': 'Click to change photo',
    'services.drop_photo_here': 'Drop photo here or click to upload',
    'services.supported_image_formats': 'SVG, PNG, JPG, GIF, WebP',
    'services.client_name': 'Client Name',
    'services.role': 'Role',
    'services.company': 'Company',
    'services.rating': 'Rating',
    'services.testimonial_content': 'Testimonial Content',
    'services.testimonial_placeholder': 'Enter testimonial content here...',

    // Services Page - Delete Confirmation
    'services.confirm_deletion': 'Confirm Deletion',
    'services.delete_confirmation_message': 'Are you sure you want to delete',
    'services.this_item': 'this item',
    'services.action_cannot_undone': 'This action cannot be undone.',

    // Services Page - CTA Section
    'services.ready_to_start': 'Ready to Start Your Project?',
    'services.cta_description': 'Contact us today to discuss your industrial needs and get a personalized solution from our expert team.',
    'services.get_in_touch': 'Get in Touch',
    'services.call_now': 'Call Now',
    'services.download_brochure': 'Download Brochure',

    
    // About Page - Additional keys
    'about.image': 'Company Image', // 'Image de l\'Entreprise'
    'about.hero_background': 'Hero Background', // 'Arrière-plan Hero'
    'about.story_section_image': 'Story Section Image', // 'Image Section Histoire'
    'about.click_learn_more': 'Click to learn more', // 'Cliquer pour en savoir plus'
    'about.edit_about_page': 'Edit About Page', // 'Modifier la Page À Propos'
    'about.general_info': 'General Info', // 'Informations Générales'
    'about.statistics': 'Statistics', // 'Statistiques'
    'about.company_values': 'Company Values', // 'Valeurs de l\'Entreprise'
    'about.partners': 'Partners', // 'Partenaires'
    'about.badge_text': 'Badge Text', // 'Texte du Badge'
    'about.main_heading': 'Main Heading', // 'Titre Principal'
    'about.description_text': 'Description Text', // 'Texte de Description'
    'about.company_story': 'Company Story', // 'Histoire de l\'Entreprise'
    'about.mission_statement': 'Mission Statement', // 'Déclaration de Mission'
    'about.vision_statement': 'Vision Statement', // 'Déclaration de Vision'
    'about.add_stat': 'Add Stat', // 'Ajouter Statistique'
    'about.statistic': 'Statistic', // 'Statistique'
    'about.number': 'Number', // 'Nombre'
    'about.label': 'Label', // 'Étiquette'
    'about.icon': 'Icon', // 'Icône'
    'about.background_image': 'Background Image', // 'Image d\'Arrière-plan'
    'about.popup_image': 'Popup Image', // 'Image Popup'
    'about.popup_title': 'Popup Title', // 'Titre Popup'
    'about.popup_description': 'Popup Description', // 'Description Popup'
    'about.add_value': 'Add Value', // 'Ajouter Valeur'
    'about.value': 'Value', // 'Valeur'
    'about.title': 'Title', // 'Titre'
    'about.description': 'Description', // 'Description'
    'about.video_optional': 'Video (Optional)', // 'Vidéo (Optionnel)'
    'about.add_partner': 'Add Partner', // 'Ajouter Partenaire'
    'about.partner': 'Partner', // 'Partenaire'
    'about.partner_name': 'Partner Name', // 'Nom du Partenaire'
    'about.logo': 'Logo', // 'Logo'
    'about.preview': 'Preview', // 'Aperçu'
    'about.no_partners_yet': 'No partners yet', // 'Aucun partenaire pour le moment'
    'about.get_started_first_partner': 'Get started by adding your first partner.', // 'Commencez par ajouter votre premier partenaire.'
    'about.about_page_updated': 'About page updated successfully!', // 'Page À propos mise à jour avec succès!'
    'about.access_denied': 'Access denied', // 'Accès refusé'
    'about.access_denied_description': 'You need moderator or admin privileges to edit the about page.', // 'Vous avez besoin de privilèges modérateur ou admin pour modifier la page à propos.'
    'about.failed_to_load_image': 'Failed to load image', // 'Échec du chargement de l\'image'
    'about.failed_to_load_video': 'Failed to load video', // 'Échec du chargement de la vidéo'
    'about.no_media_available': 'No media available', // 'Aucun média disponible'
    'about.current_image': 'Current image', // 'Image actuelle'
    'about.current_video': 'Current video', // 'Vidéo actuelle'
    'about.current_logo': 'Current logo', // 'Logo actuel'
    'about.click_drag_upload': 'Click to upload or drag and drop', // 'Cliquer pour télécharger ou glisser-déposer'
    'about.images_videos_200mb': 'Images or videos up to 200MB', // 'Images ou vidéos jusqu\'à 200MB'
    'about.videos_200mb': 'Videos up to 200MB', // 'Vidéos jusqu\'à 200MB'
    'about.click_drag_replace': 'Click or drag to replace', // 'Cliquer ou glisser pour remplacer'
    'about.enter_image_url': 'Or enter image URL...', // 'Ou entrer l\'URL de l\'image...'
    'about.enter_video_url': 'Or enter video URL...', // 'Ou entrer l\'URL de la vidéo...'
    'about.enter_logo_url': 'Or enter logo URL...', // 'Ou entrer l\'URL du logo...'
    'about.popup_description_placeholder': 'Detailed description for the popup...', // 'Description détaillée pour le popup...'
    'about.value_description_placeholder': 'Detailed description of this value...', // 'Description détaillée de cette valeur...'
    'about.save_changes': 'Save Changes', // 'Enregistrer les Modifications'
    'about.maximum_10_values': 'Maximum 10 values allowed', // 'Maximum 10 valeurs autorisées'
    'about.error_saving_data': 'Error saving data: ', // 'Erreur lors de l\'enregistrement des données: '
    'about.unknown_error': 'Unknown error', 
    'about.projects_completed': 'Projects Completed',
    'about.complete_solutions': 'Complete Solutions',


    // Gallery Page
    'gallery.badge': 'Our Portfolio',
    'gallery.heading': 'Project Gallery',
    'gallery.description': 'Explore our completed projects and industrial solutions. From mining equipment to steel structures, see the quality and precision that defines MECOSO\'s work across various industrial sectors.',
    'gallery.filter': 'Filter',
    'gallery.filter_projects': 'Filter Projects',
    'gallery.view_details': 'View Details',
    'gallery.show_more_projects': 'Show More Projects',
    'gallery.show_less_projects': 'Show Less Projects',
    'gallery.showing_projects': 'Showing {current} of {total} projects{category, select, null {} other { in {category}}}',
    'gallery.contact_about_project': 'Contact Us About This Project',

    // Gallery Edit Modal
    'gallery.edit_gallery_section': 'Edit Gallery Section',
    'gallery.header_information': 'Header Information',
    'gallery.badge_text': 'Badge Text',
    'gallery.badge_placeholder': 'Enter badge text...',
    'gallery.main_heading': 'Main Heading',
    'gallery.heading_placeholder': 'Enter main heading...',
    'gallery.description_placeholder': 'Enter description...',
    'gallery.gallery_items': 'Gallery Items',
    'gallery.add_item': 'Add Item',
    'gallery.item': 'Item',
    'gallery.edit_item': 'Edit item',
    'gallery.delete_item': 'Delete item',
    'gallery.no_image': 'No image',
    'gallery.save_changes': 'Save Changes',

    // Gallery Item Modal
    'gallery.edit_gallery_item': 'Edit Gallery Item',
    'gallery.add_new_gallery_item': 'Add New Gallery Item',
    'gallery.project_title': 'Project Title',
    'gallery.project_title_placeholder': 'Enter project title...',
    'gallery.category': 'Category',
    'gallery.category_placeholder': 'Enter category...',
    'gallery.project_description_placeholder': 'Enter project description...',
    'gallery.upload_image': 'Upload Image',
    'gallery.size': 'Size',
    'gallery.size_small': 'Small',
    'gallery.size_medium': 'Medium',
    'gallery.size_large': 'Large',
    'gallery.update_item': 'Update Item',

    // Error Messages
    'gallery.fetch_error': 'Failed to load gallery data',
    'gallery.login_required': 'You must be logged in to save changes',
    'gallery.token_not_found': 'Authentication token not found',
    'gallery.updated_success': 'Gallery updated successfully',
    'gallery.save_failed': 'Failed to save gallery changes',
    'gallery.upload_failed': 'Failed to upload image',


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

    // About Page
    'about.badge': 'About Our Company',
    'about.heading': 'Leading Industrial Solutions in Morocco',
    'about.main_description': 'MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we\'ve been delivering excellence in metal structure design, manufacturing, and assembly across all industries',
    'about.our_story': 'Our Story',
    'about.two_decades': 'Two Decades of Excellence',
    'about.our_mission': 'Our Mission',
    'about.our_vision': 'Our Vision',
    'about.our_values': 'Our Values',
    'about.values_subtitle': 'The Principles That Guide Us',
    'about.values_description': 'Every decision we make and every project we undertake is guided by these core values that define who we are.',
    'about.trusted_partnerships': 'Trusted Partnerships',
    'about.industry_leaders': 'Industry Leaders Choose Us',
    'about.partners_description': 'We proudly collaborate with Morocco\'s most prestigious organizations and international companies who trust us to deliver excellence in every project.',
    'about.join_network': 'Join Our Network of Partners',
    'about.learn_story': 'Learn Our Story',
    'about.show_more': 'Show More',
    'about.show_less': 'Show Less',
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
    'common.saving': 'Enregistrement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.confirm': 'Confirmer',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    
    // Services
    'services.badge': 'Nos Services',
    'services.heading': 'Nos Services Principaux',
    'services.description': 'MECOSO fournit des solutions industrielles complètes. De la conception et fabrication à l\'installation et maintenance. Au service des secteurs minier, énergétique et de l\'industrie lourde avec un focus sur la qualité, la sécurité et l\'innovation.',
    'services.our_services': 'Nos Services',
    'services.all_categories': 'Tout',
    'services.view_details': 'Voir Détails',
    'services.get_started': 'Commencer',
    'services.add_service': 'Ajouter Service',
    'services.client_testimonials': 'Témoignages Clients',
    'services.add_testimonial': 'Ajouter Témoignage',
    'services.no_services': 'Aucun service disponible',
    'services.no_testimonials_available': 'Aucun témoignage disponible pour le moment',
    'services.default_client_name': 'Jean Dupont',
    'services.default_client_role': 'Client',
    'services.duration': 'Durée',
    'services.price': 'Prix',
    'services.features': 'Caractéristiques',
    'services.key_features': 'Caractéristiques Clés',
    'services.more': 'plus',
    'services.projects_completed': 'Projets Terminés',
    'services.iso_certified': 'Certifié ISO 9001',
    'services.years_experience': 'Années d\'Expérience',
    'services.expert_team': 'Équipe Experte',

    // Services Page - Error Messages
    'services.fetch_error': 'Échec du chargement des services',
    'services.testimonials_fetch_error': 'Échec du chargement des témoignages',
    'services.file_too_large': 'La taille du fichier doit être inférieure à 200MB',
    'services.invalid_file_type': 'Veuillez télécharger un fichier image ou vidéo valide',
    'services.file_upload_success': 'Fichier téléchargé avec succès',
    'services.access_denied_edit': 'Vous avez besoin de privilèges modérateur ou admin pour modifier les services',
    'services.access_denied_delete': 'Vous avez besoin de privilèges modérateur ou admin pour supprimer les services',
    'services.access_denied_edit_testimonials': 'Vous avez besoin de privilèges modérateur ou admin pour modifier les témoignages',
    'services.access_denied_delete_testimonials': 'Vous avez besoin de privilèges modérateur ou admin pour supprimer les témoignages',
    'services.main_content_updated': 'Contenu principal mis à jour avec succès',
    'services.service_updated': 'Service mis à jour avec succès',
    'services.service_added': 'Service ajouté avec succès',
    'services.service_deleted': 'Service supprimé avec succès',
    'services.testimonial_updated': 'Témoignage mis à jour avec succès',
    'services.testimonial_added': 'Témoignage ajouté avec succès',
    'services.testimonial_deleted': 'Témoignage supprimé avec succès',
    'services.save_service_error': 'Échec de l\'enregistrement du service',
    'services.delete_service_error': 'Échec de la suppression du service',
    'services.save_testimonial_error': 'Échec de l\'enregistrement du témoignage',
    'services.delete_testimonial_error': 'Échec de la suppression du témoignage',
    'services.session_expired': 'Session expirée ou permissions insuffisantes',

    // Services Page - Modal Content
    'services.edit_main_content': 'Modifier le Contenu Principal',
    'services.badge_text': 'Texte du Badge',
    'services.heading_text': 'Texte du Titre',
    'services.description_text': 'Texte de Description',
    'services.edit_service': 'Modifier le Service',
    'services.add_new_service': 'Ajouter un Nouveau Service',
    'services.service_image': 'Image du Service',
    'services.click_to_change': 'Cliquer pour changer l\'image',
    'services.drop_image_here': 'Déposer l\'image ici ou cliquer pour télécharger',
    'services.supported_formats': 'SVG, PNG, JPG, GIF, MP4, WebM, MOV, AVI, MKV',
    'services.max_file_size': 'Taille max du fichier : 200MB',
    'services.service_title': 'Titre du Service',
    'services.category': 'Catégorie',
    'services.add_feature': 'Ajouter Caractéristique',
    'services.feature_placeholder': 'Entrer la description de la caractéristique',
    'services.edit_testimonial': 'Modifier le Témoignage',
    'services.add_new_testimonial': 'Ajouter un Nouveau Témoignage',
    'services.client_photo': 'Photo du Client',
    'services.click_to_change_photo': 'Cliquer pour changer la photo',
    'services.drop_photo_here': 'Déposer la photo ici ou cliquer pour télécharger',
    'services.supported_image_formats': 'SVG, PNG, JPG, GIF, WebP',
    'services.client_name': 'Nom du Client',
    'services.role': 'Rôle',
    'services.company': 'Entreprise',
    'services.rating': 'Note',
    'services.testimonial_content': 'Contenu du Témoignage',
    'services.testimonial_placeholder': 'Entrer le contenu du témoignage ici...',

    // Services Page - Delete Confirmation
    'services.confirm_deletion': 'Confirmer la Suppression',
    'services.delete_confirmation_message': 'Êtes-vous sûr de vouloir supprimer',
    'services.this_item': 'cet élément',
    'services.action_cannot_undone': 'Cette action ne peut pas être annulée.',

    // Services Page - CTA Section
    'services.ready_to_start': 'Prêt à Commencer Votre Projet ?',
    'services.cta_description': 'Contactez-nous dès aujourd\'hui pour discuter de vos besoins industriels et obtenir une solution personnalisée de notre équipe d\'experts.',
    'services.get_in_touch': 'Nous Contacter',
    'services.call_now': 'Appeler Maintenant',
    'services.download_brochure': 'Télécharger la Brochure',
    

    // About Page - Additional keys
    'about.image': 'Image de l’Entreprise',
    'about.hero_background': 'Arrière-plan Hero',
    'about.story_section_image': 'Image de la Section Histoire',
    'about.click_learn_more': 'Cliquer pour en savoir plus',
    'about.edit_about_page': 'Modifier la Page À Propos',
    'about.general_info': 'Informations Générales',
    'about.statistics': 'Statistiques',
    'about.company_values': 'Valeurs de l’Entreprise',
    'about.partners': 'Partenaires',
    'about.badge_text': 'Texte du Badge',
    'about.main_heading': 'Titre Principal',
    'about.description_text': 'Texte de Description',
    'about.company_story': 'Histoire de l’Entreprise',
    'about.mission_statement': 'Déclaration de Mission',
    'about.vision_statement': 'Déclaration de Vision',
    'about.add_stat': 'Ajouter Statistique',
    'about.statistic': 'Statistique',
    'about.number': 'Nombre',
    'about.label': 'Étiquette',
    'about.icon': 'Icône',
    'about.background_image': 'Image d’Arrière-plan',
    'about.popup_image': 'Image Popup',
    'about.popup_title': 'Titre du Popup',
    'about.popup_description': 'Description du Popup',
    'about.add_value': 'Ajouter Valeur',
    'about.value': 'Valeur',
    'about.title': 'Titre',
    'about.description': 'Description',
    'about.video_optional': 'Vidéo (Optionnel)',
    'about.add_partner': 'Ajouter Partenaire',
    'about.partner': 'Partenaire',
    'about.partner_name': 'Nom du Partenaire',
    'about.logo': 'Logo',
    'about.preview': 'Aperçu',
    'about.no_partners_yet': 'Aucun partenaire pour le moment',
    'about.get_started_first_partner': 'Commencez par ajouter votre premier partenaire.',
    'about.about_page_updated': 'Page À Propos mise à jour avec succès !',
    'about.access_denied': 'Accès refusé',
    'about.access_denied_description': 'Vous avez besoin de privilèges modérateur ou admin pour modifier la page À Propos.',
    'about.failed_to_load_image': 'Échec du chargement de l’image',
    'about.failed_to_load_video': 'Échec du chargement de la vidéo',
    'about.no_media_available': 'Aucun média disponible',
    'about.current_image': 'Image actuelle',
    'about.current_video': 'Vidéo actuelle',
    'about.current_logo': 'Logo actuel',
    'about.click_drag_upload': 'Cliquer pour télécharger ou glisser-déposer',
    'about.images_videos_200mb': 'Images ou vidéos jusqu’à 200 MB',
    'about.videos_200mb': 'Vidéos jusqu’à 200 MB',
    'about.click_drag_replace': 'Cliquer ou glisser pour remplacer',
    'about.enter_image_url': 'Ou entrer l’URL de l’image…',
    'about.enter_video_url': 'Ou entrer l’URL de la vidéo…',
    'about.enter_logo_url': 'Ou entrer l’URL du logo…',
    'about.popup_description_placeholder': 'Description détaillée pour le popup…',
    'about.value_description_placeholder': 'Description détaillée de cette valeur…',
    'about.save_changes': 'Enregistrer les Modifications',
    'about.maximum_10_values': 'Maximum 10 valeurs autorisées',
    'about.error_saving_data': 'Erreur lors de l’enregistrement des données : ',
    'about.unknown_error': 'Erreur inconnue',
    'about.projects_completed': 'Projets Terminés',
    'about.complete_solutions': 'Solutions Complètes',


    // Gallery Page
    'gallery.badge': 'Notre Portfolio',
    'gallery.heading': 'Galerie de Projets',
    'gallery.description': 'Découvrez nos projets réalisés et solutions industrielles. Des équipements miniers aux structures métalliques, découvrez la qualité et la précision qui définissent le travail de MECOSO dans divers secteurs industriels.',
    'gallery.filter': 'Filtrer',
    'gallery.filter_projects': 'Filtrer les Projets',
    'gallery.view_details': 'Voir les Détails',
    'gallery.show_more_projects': 'Afficher Plus de Projets',
    'gallery.show_less_projects': 'Afficher Moins de Projets',
    'gallery.showing_projects': 'Affichage de {current} sur {total} projets{category, select, null {} other { dans {category}}}',
    'gallery.contact_about_project': 'Nous Contacter À Propos de Ce Projet',

    // Gallery Edit Modal
    'gallery.edit_gallery_section': 'Modifier la Section Galerie',
    'gallery.header_information': 'Informations d\'En-tête',
    'gallery.badge_text': 'Texte du Badge',
    'gallery.badge_placeholder': 'Entrez le texte du badge...',
    'gallery.main_heading': 'Titre Principal',
    'gallery.heading_placeholder': 'Entrez le titre principal...',
    'gallery.description_placeholder': 'Entrez la description...',
    'gallery.gallery_items': 'Éléments de la Galerie',
    'gallery.add_item': 'Ajouter un Élément',
    'gallery.item': 'Élément',
    'gallery.edit_item': 'Modifier l\'élément',
    'gallery.delete_item': 'Supprimer l\'élément',
    'gallery.no_image': 'Aucune image',
    'gallery.save_changes': 'Enregistrer les Modifications',

    // Gallery Item Modal
    'gallery.edit_gallery_item': 'Modifier l\'Élément de la Galerie',
    'gallery.add_new_gallery_item': 'Ajouter un Nouvel Élément à la Galerie',
    'gallery.project_title': 'Titre du Projet',
    'gallery.project_title_placeholder': 'Entrez le titre du projet...',
    'gallery.category': 'Catégorie',
    'gallery.category_placeholder': 'Entrez la catégorie...',
    'gallery.project_description_placeholder': 'Entrez la description du projet...',
    'gallery.upload_image': 'Télécharger une Image',
    'gallery.size': 'Taille',
    'gallery.size_small': 'Petit',
    'gallery.size_medium': 'Moyen',
    'gallery.size_large': 'Grand',
    'gallery.update_item': 'Mettre à Jour l\'Élément',

    // Error Messages
    'gallery.fetch_error': 'Échec du chargement des données de la galerie',
    'gallery.login_required': 'Vous devez être connecté pour enregistrer les modifications',
    'gallery.token_not_found': 'Jeton d\'authentification non trouvé',
    'gallery.updated_success': 'Galerie mise à jour avec succès',
    'gallery.save_failed': 'Échec de l\'enregistrement des modifications de la galerie',
    'gallery.upload_failed': 'Échec du téléchargement de l\'image',


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

    // About Page
    'about.badge': 'À Propos de Notre Entreprise',
    'about.heading': 'Solutions Industrielles de Pointe au Maroc',
    'about.main_description': 'MECOSO est votre partenaire de confiance pour des solutions complètes de chaudronnerie et de structures métalliques. Depuis 2005, nous offrons l\'excellence dans la conception, la fabrication et l\'assemblage de structures métalliques pour toutes les industries',
    'about.our_story': 'Notre Histoire',
    'about.two_decades': 'Deux Décennies d\'Excellence',
    'about.our_mission': 'Notre Mission',
    'about.our_vision': 'Notre Vision',
    'about.our_values': 'Nos Valeurs',
    'about.values_subtitle': 'Les Principes Qui Nous Guident',
    'about.values_description': 'Chaque décision que nous prenons et chaque projet que nous entreprenons est guidé par ces valeurs fondamentales qui définissent qui nous sommes.',
    'about.trusted_partnerships': 'Partenariats de Confiance',
    'about.industry_leaders': 'Les Leaders de l\'Industrie Nous Choisissent',
    'about.partners_description': 'Nous collaborons fièrement avec les organisations les plus prestigieuses du Maroc et les entreprises internationales qui nous font confiance pour livrer l\'excellence dans chaque projet.',
    'about.join_network': 'Rejoignez Notre Réseau de Partenaires',
    'about.learn_story': 'Découvrez Notre Histoire',
    'about.show_more': 'Afficher Plus',
    'about.show_less': 'Afficher Moins',
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