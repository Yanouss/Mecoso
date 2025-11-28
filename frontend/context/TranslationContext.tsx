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
    // 'hero.heading': 'Leading Industrial Solutions in Morocco',
    // 'hero.description': 'MECOSO is your trusted partner for comprehensive boilermaking and structural steelwork solutions. Since 2005, we\'ve been delivering excellence in metal structure design, manufacturing, and assembly across all industries.',
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
    'common.show_more': 'Show More',
    'common.update': 'Update',
    
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
    'services.delete_success_message': '{serviceName} has been removed from your services.',
    'services.access_denied_add': 'You need moderator or admin privileges to add services.',
    'services.access_denied_manage': 'You need moderator or admin privileges to manage services.',

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
    'services.no_services_available': 'There are currently no services to display.',
    
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
    'about.our_story_content': 'Our Story Content',
    'about.values_title': 'Why Choose MECOSO?',



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


    // Machines Page
    'machines.badge': 'Our Equipment',
    'machines.heading': 'Industrial Machinery Fleet',
    'machines.description': 'MECOSO operates state-of-the-art industrial machinery for manufacturing, fabrication, and assembly operations. Our equipment fleet ensures precision, efficiency, and reliability in every project we undertake.',

    // Stats
    'machines.stats.active_machines': 'Active Machines',
    'machines.stats.uptime_rate': 'Uptime Rate',
    'machines.stats.years_service': 'Years Service',
    'machines.stats.operations': 'Operations',

    // Categories
    'machines.categories.all': 'All',
    'machines.categories.cutting': 'Cutting',
    'machines.categories.forming': 'Forming',
    'machines.categories.handling': 'Handling',
    'machines.categories.welding': 'Welding',
    'machines.categories.assembly': 'Assembly',
    'machines.categories.testing': 'Testing',
    'machines.categories.other': 'Other',

    // Status
    'machines.status.available': 'Available',
    'machines.status.in_use': 'In Use',
    'machines.status.maintenance': 'Maintenance',

    // UI Text
    'machines.no_machines': 'No machines available',
    'machines.no_machines_category': 'No machines found in the "{category}" category.',
    'machines.no_machines_added': 'No machines have been added yet.',
    'machines.view_details': 'View Details',
    'machines.show_more': 'Show More Machines',
    'machines.show_less': 'Show Less',
    'machines.loading': 'Loading machines...',
    'machines.specifications': 'Specifications',
    'machines.capacity': 'Capacity',
    'machines.power_requirement': 'Power Requirement',
    'machines.model': 'Model',
    'machines.year_manufactured': 'Year Manufactured',
    'machines.status': 'Status',
    'machines.technical_specifications': 'Technical Specifications',
    'machines.request_access': 'Request Access',

    // Edit Modal
    'machines.edit_page': 'Edit Machines Page',
    'machines.edit_machine': 'Edit Machine',
    'machines.general': 'General',
    'machines.statistics': 'Statistics',
    'machines.machines_list': 'Machines',
    'machines.badge_text': 'Badge Text',
    'machines.main_heading': 'Main Heading',
    'machines.description_text': 'Description',
    'machines.add_stat': 'Add Stat',
    'machines.stat_number': 'Number/Value',
    'machines.stat_label': 'Label',
    'machines.add_machine': 'Add Machine',
    'machines.machine_title': 'Title',
    'machines.machine_category': 'Category',
    'machines.machine_description': 'Description',
    'machines.machine_image': 'Machine Image',
    'machines.upload_image': 'Upload',
    'machines.add_spec': 'Add Spec',
    'machines.specification': 'Specification',

    // Placeholders
    'machines.placeholder.badge': 'Enter badge text...',
    'machines.placeholder.heading': 'Enter main heading...',
    'machines.placeholder.description': 'Enter description...',
    'machines.placeholder.stat_number': 'e.g., 25+, 99.5%, 24/7',
    'machines.placeholder.stat_label': 'e.g., Active Machines, Uptime Rate',
    'machines.placeholder.machine_title': 'Machine title...',
    'machines.placeholder.machine_description': 'Machine description...',
    'machines.placeholder.image_url': 'https://example.com/image.jpg or upload a file',
    'machines.placeholder.model': 'Model number...',
    'machines.placeholder.year': 'YYYY',
    'machines.placeholder.capacity': 'e.g., 200mm max thickness',
    'machines.placeholder.power': 'e.g., 380V, 200A',
    'machines.placeholder.specification': 'Specification...',
    // Machines Edit Modal - All keys needed
    'machines.uploading': 'Uploading...',
    'machines.click_to_upload': 'Click to upload or drag and drop',
    'machines.image_formats': 'PNG, JPG, GIF up to 5MB',
    'machines.current_image': 'Current image',
    'machines.remove_image': 'Remove image',
    'machines.enter_url': 'Or enter image URL...',
    'machines.title_placeholder': 'Enter machine title...',
    'machines.description_placeholder': 'Enter machine description...',
    'machines.select_category': 'Select category',
    'machines.select_status': 'Select status',
    'machines.model_placeholder': 'Enter model number...',
    'machines.year_placeholder': 'Enter year (YYYY)...',
    'machines.capacity_placeholder': 'Enter capacity (e.g., 200mm max thickness)...',
    'machines.power_placeholder': 'Enter power requirement (e.g., 380V, 200A)...',
    'machines.spec_placeholder': 'Enter specification...',
    'machines.remove_spec': 'Remove specification',
    
    
    // Form labels that might be missing
    'machines.required_field': 'Required field',
    'machines.optional_field': 'Optional',



    // Contact Page
    'contact.badge': 'Get In Touch',
    'contact.heading': 'Let\'s Build Something Amazing Together',
    'contact.description': 'Ready to start your next construction project? Our expert team is here to turn your vision into reality with professional consultation and tailored solutions.',
    'contact.start_project': 'Start Your Project',
    'contact.form_description': 'Fill out the form and we\'ll get back to you within 24 hours',
    'contact.full_name': 'Full Name',
    'contact.email_address': 'Email Address',
    'contact.company_organization': 'Company/Organization',
    'contact.phone_number': 'Phone Number',
    'contact.project_details': 'Project Details',
    'contact.service_interested': 'Service Interested In',
    'contact.project_type': 'Project Type',
    'contact.estimated_budget': 'Estimated Budget',
    'contact.timeline': 'Timeline',
    'contact.project_description': 'Project Description',
    'contact.send_message': 'Send Message',
    'contact.message_sent': 'Message Sent Successfully! 🎉',
    'contact.thank_you': 'Thank you for reaching out! Our team will review your project details and get back to you within 24 hours.',
    'contact.expected_response': 'Expected response: Within 24 hours',

    // Placeholders
    'contact.placeholder.name': 'Enter your full name',
    'contact.placeholder.email': 'your.email@example.com',
    'contact.placeholder.company': 'Your company name',
    'contact.placeholder.phone': '+212 661-234-567',
    'contact.placeholder.message': 'Tell us more about your project requirements, goals, and any specific details that would help us provide you with the best solution...',

    // Form Options
    'contact.select_service': 'Select a service',
    'contact.select_project_type': 'Select project type',
    'contact.select_budget': 'Select budget range',
    'contact.select_timeline': 'Select timeline',

    // Service Options
    'contact.service.architectural': 'Architectural Design',
    'contact.service.project_mgmt': 'Project Management',
    'contact.service.structural': 'Structural Engineering',
    'contact.service.machinery': 'Heavy Machinery & Logistics',
    'contact.service.quality': 'Quality Assurance',
    'contact.service.green': 'Green Building Solutions',

    // Project Types
    'contact.project.residential': 'Residential',
    'contact.project.commercial': 'Commercial',
    'contact.project.industrial': 'Industrial',
    'contact.project.infrastructure': 'Infrastructure',

    // Budget Options
    'contact.budget.under_500k': 'Under 500k MAD',
    'contact.budget.500k_2m': '500k - 2M MAD',
    'contact.budget.2m_5m': '2M - 5M MAD',
    'contact.budget.5m_20m': '5M - 20M MAD',
    'contact.budget.over_20m': 'Over 20M MAD',

    // Timeline Options
    'contact.timeline.asap': 'ASAP',
    'contact.timeline.1_3_months': '1-3 months',
    'contact.timeline.3_6_months': '3-6 months',
    'contact.timeline.6_12_months': '6-12 months',
    'contact.timeline.over_1_year': 'Over 1 year',

    // Map Section
    'contact.find_office': 'Find Our Office in Marrakech',
    'contact.visit_description': 'Visit us at our modern headquarters in the heart of Marrakech. We\'re located in the vibrant Gueliz district.',
    'contact.get_directions': 'Get Directions',
    'contact.call_now': 'Call Now',
    'contact.loading_map': 'Loading interactive map...',
    'contact.prime_location': 'Prime Location',
    'contact.prime_location_desc': 'Located in Massira II, the modern business district of Marrakech',
    'contact.easy_access': 'Easy Access',
    'contact.easy_access_desc': '5 minutes from Marrakech Railway Station and main transport hubs',
    'contact.modern_facilities': 'Modern Facilities',
    'contact.modern_facilities_desc': 'State-of-the-art office with meeting rooms and project showcase area',

    // Edit Modal
    'contact.edit_section': 'Edit Contact Section',
    'contact.basic_info': 'Basic Information',
    'contact.badge_text': 'Badge Text',
    'contact.main_heading': 'Main Heading',
    'contact.description_text': 'Description',
    'contact.contact_info': 'Contact Information',
    'contact.add_contact': 'Add Contact',
    'contact.contact_item': 'Contact Item',
    'contact.icon_type': 'Icon Type',
    'contact.title': 'Title',
    'contact.details': 'Details',
    'contact.add_detail': 'Add Detail',
    'contact.accent_style': 'Accent Style (Highlighted)',
    'contact.save_changes': 'Save Changes',
    'contact.updated_success': 'Contact information updated successfully',
    'contact.update_failed': 'Failed to save contact information',

    // Contact Info Defaults
    'contact.info.visit_atelier': 'Visit Our Atelier',
    'contact.info.call_us': 'Call Us',
    'contact.info.email_us': 'Email Us',
    'contact.info.business_hours': 'Business Hours',
    'contact.info.hours_detail': 'Mon - Sat: 9:00 AM - 6:00 PM',
    'contact.info.sunday_closed': 'Sunday: Closed',
    'contact.required_fields': 'Please fill in all required fields',
    'contact.message_sent_success': 'Your message has been sent successfully!',
    'contact.submission_failed': 'Failed to send message. Please try again.',
    'contact.sending': 'Sending...',


    // Delete Modal
    'machines.delete.confirm': 'Confirm Deletion',
    'machines.delete.message': 'Are you sure you want to delete {name}? This action cannot be undone.',

    // Error Messages
    'machines.error.load_failed': 'Failed to load machines data',
    'machines.error.upload_failed': 'Upload failed',
    'machines.error.auth_required': 'Authentication required',
    'machines.error.unauthorized': 'Unauthorized: Admin access required',
    'machines.error.token_not_found': 'Authentication token not found',
    'machines.error.update_failed': 'Failed to update machines page',
    'machines.error.machine_update_failed': 'Failed to update machine',
    'machines.error.machine_delete_failed': 'Failed to delete machine',
    'machines.error.max_stats': 'Maximum 10 stats allowed',
    'machines.error.min_stats': 'At least one stat is required',
    'machines.error.required_fields': 'Badge, heading, and description are required',
    'machines.error.stat_required': 'Stat {number} must have both number and label',
    'machines.error.machine_required': 'Machine {number}: Title and Category are required',
    'machines.error.specs_required': 'Machine {number} must have at least one specification',
    'machines.error.spec_required': 'At least one specification is required',
    'machines.error.invalid_file_type': 'Please select an image file',
    'machines.error.file_too_large': 'File size must be less than 5MB',

    // Success Messages
    'machines.success.upload': 'Image uploaded successfully',
    'machines.success.update': 'Machines page updated successfully',
    'machines.success.machine_update': 'Machine updated successfully',
    'machines.success.machine_delete': 'Machine deleted successfully',

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
    // 'hero.heading': 'Solutions Industrielles de Pointe au Maroc',
    // 'hero.description': 'MECOSO est votre partenaire de confiance pour des solutions complètes de chaudronnerie et de structures métalliques. Depuis 2005, nous offrons l\'excellence dans la conception, la fabrication et l\'assemblage de structures métalliques pour toutes les industries.',
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
    'common.show_more': 'Afficher Plus',
    'common.update': 'Mise à Jour',
    
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
    'services.delete_success_message': '{serviceName} a été supprimé de vos services.',
    'services.access_denied_add': 'Vous avez besoin de privilèges modérateur ou admin pour ajouter des services.',
  'services.access_denied_manage': 'Vous avez besoin de privilèges modérateur ou admin pour gérer les services.',

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
    'services.no_services_available': 'Il n\'y a actuellement aucun service à afficher.',
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
    'about.our_story_content': 'Contenu de Notre Histoire',


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


    // Machines Page
    'machines.badge': 'Notre Équipement',
    'machines.heading': 'Parc de Machines Industrielles',
    'machines.description': 'MECOSO exploite des machines industrielles de pointe pour les opérations de fabrication, d\'usinage et d\'assemblage. Notre parc d\'équipements garantit précision, efficacité et fiabilité dans chaque projet que nous entreprenons.',

    // Stats
    'machines.stats.active_machines': 'Machines Actives',
    'machines.stats.uptime_rate': 'Taux de Fonctionnement',
    'machines.stats.years_service': 'Années de Service',
    'machines.stats.operations': 'Opérations',

    // Categories
    'machines.categories.all': 'Tout',
    'machines.categories.cutting': 'Découpe',
    'machines.categories.forming': 'Formage',
    'machines.categories.handling': 'Manutention',
    'machines.categories.welding': 'Soudage',
    'machines.categories.assembly': 'Assemblage',
    'machines.categories.testing': 'Test',
    'machines.categories.other': 'Autre',

    // Status
    'machines.status.available': 'Disponible',
    'machines.status.in_use': 'En Utilisation',
    'machines.status.maintenance': 'Maintenance',

    // UI Text
    'machines.no_machines': 'Aucune machine disponible',
    'machines.no_machines_category': 'Aucune machine trouvée dans la catégorie "{category}".',
    'machines.no_machines_added': 'Aucune machine n\'a été ajoutée pour le moment.',
    'machines.view_details': 'Voir les Détails',
    'machines.show_more': 'Afficher Plus de Machines',
    'machines.show_less': 'Afficher Moins',
    'machines.loading': 'Chargement des machines...',
    'machines.specifications': 'Spécifications',
    'machines.capacity': 'Capacité',
    'machines.power_requirement': 'Besoins en Énergie',
    'machines.model': 'Modèle',
    'machines.year_manufactured': 'Année de Fabrication',
    'machines.status': 'Statut',
    'machines.technical_specifications': 'Spécifications Techniques',
    'machines.request_access': 'Demander l\'Accès',

    // Edit Modal
    'machines.edit_page': 'Modifier la Page des Machines',
    'machines.edit_machine': 'Modifier la Machine',
    'machines.general': 'Général',
    'machines.statistics': 'Statistiques',
    'machines.machines_list': 'Machines',
    'machines.badge_text': 'Texte du Badge',
    'machines.main_heading': 'Titre Principal',
    'machines.description_text': 'Description',
    'machines.add_stat': 'Ajouter Statistique',
    'machines.stat_number': 'Nombre/Valeur',
    'machines.stat_label': 'Étiquette',
    'machines.add_machine': 'Ajouter Machine',
    'machines.machine_title': 'Titre',
    'machines.machine_category': 'Catégorie',
    'machines.machine_description': 'Description',
    'machines.machine_image': 'Image de la Machine',
    'machines.upload_image': 'Télécharger',
    'machines.add_spec': 'Ajouter Spécification',
    'machines.specification': 'Spécification',

    // Placeholders
    'machines.placeholder.badge': 'Entrez le texte du badge...',
    'machines.placeholder.heading': 'Entrez le titre principal...',
    'machines.placeholder.description': 'Entrez la description...',
    'machines.placeholder.stat_number': 'ex. : 25+, 99.5%, 24/7',
    'machines.placeholder.stat_label': 'ex. : Machines Actives, Taux de Fonctionnement',
    'machines.placeholder.machine_title': 'Titre de la machine...',
    'machines.placeholder.machine_description': 'Description de la machine...',
    'machines.placeholder.image_url': 'https://exemple.com/image.jpg ou télécharger un fichier',
    'machines.placeholder.model': 'Numéro de modèle...',
    'machines.placeholder.year': 'AAAA',
    'machines.placeholder.capacity': 'ex. : épaisseur max 200mm',
    'machines.placeholder.power': 'ex. : 380V, 200A',
    'machines.placeholder.specification': 'Spécification...',

    // Delete Modal
    'machines.delete.confirm': 'Confirmer la Suppression',
    'machines.delete.message': 'Êtes-vous sûr de vouloir supprimer {name} ? Cette action ne peut pas être annulée.',

    // Error Messages
    'machines.error.load_failed': 'Échec du chargement des données des machines',
    'machines.error.upload_failed': 'Échec du téléchargement',
    'machines.error.auth_required': 'Authentification requise',
    'machines.error.unauthorized': 'Non autorisé : Accès administrateur requis',
    'machines.error.token_not_found': 'Jeton d\'authentification non trouvé',
    'machines.error.update_failed': 'Échec de la mise à jour de la page des machines',
    'machines.error.machine_update_failed': 'Échec de la mise à jour de la machine',
    'machines.error.machine_delete_failed': 'Échec de la suppression de la machine',
    'machines.error.max_stats': 'Maximum 10 statistiques autorisées',
    'machines.error.min_stats': 'Au moins une statistique est requise',
    'machines.error.required_fields': 'Le badge, le titre et la description sont requis',
    'machines.error.stat_required': 'La statistique {number} doit avoir un nombre et une étiquette',
    'machines.error.machine_required': 'Machine {number} : Le titre et la catégorie sont requis',
    'machines.error.specs_required': 'La machine {number} doit avoir au moins une spécification',
    'machines.error.spec_required': 'Au moins une spécification est requise',
    'machines.error.invalid_file_type': 'Veuillez sélectionner un fichier image',
    'machines.error.file_too_large': 'La taille du fichier doit être inférieure à 5MB',

    // Success Messages
    'machines.success.upload': 'Image téléchargée avec succès',
    'machines.success.update': 'Page des machines mise à jour avec succès',
    'machines.success.machine_update': 'Machine mise à jour avec succès',
    'machines.success.machine_delete': 'Machine supprimée avec succès',
    // Machines Edit Modal - All keys needed
    'machines.uploading': 'Téléchargement...',
    'machines.click_to_upload': 'Cliquer pour télécharger ou glisser-déposer',
    'machines.image_formats': 'PNG, JPG, GIF jusqu\'à 5MB',
    'machines.current_image': 'Image actuelle',
    'machines.remove_image': 'Supprimer l\'image',
    'machines.enter_url': 'Ou entrer l\'URL de l\'image...',
    'machines.title_placeholder': 'Entrez le titre de la machine...',
    'machines.description_placeholder': 'Entrez la description de la machine...',
    'machines.select_category': 'Sélectionner une catégorie',
    'machines.select_status': 'Sélectionner un statut',
    'machines.model_placeholder': 'Entrez le numéro de modèle...',
    'machines.year_placeholder': 'Entrez l\'année (AAAA)...',
    'machines.capacity_placeholder': 'Entrez la capacité (ex. : épaisseur max 200mm)...',
    'machines.power_placeholder': 'Entrez les besoins en énergie (ex. : 380V, 200A)...',
    'machines.spec_placeholder': 'Entrez la spécification...',
    'machines.remove_spec': 'Supprimer la spécification',
    
    // Form labels that might be missing
    'machines.required_field': 'Champ requis',
    'machines.optional_field': 'Optionnel',


    // Contact Page
    'contact.badge': 'Entrer en contact',
    'contact.heading': 'Construisons quelque chose d’incroyable ensemble',
    'contact.description': 'Prêt à démarrer votre prochain projet de construction ? Notre équipe d’experts est là pour transformer votre vision en réalité grâce à une consultation professionnelle et des solutions sur mesure.',
    'contact.start_project': 'Démarrer votre projet',
    'contact.form_description': 'Remplissez le formulaire et nous vous répondrons dans les 24 heures',
    'contact.full_name': 'Nom complet',
    'contact.email_address': 'Adresse e-mail',
    'contact.company_organization': 'Entreprise/Organisation',
    'contact.phone_number': 'Numéro de téléphone',
    'contact.project_details': 'Détails du projet',
    'contact.service_interested': 'Service qui vous intéresse',
    'contact.project_type': 'Type de projet',
    'contact.estimated_budget': 'Budget estimé',
    'contact.timeline': 'Délai',
    'contact.project_description': 'Description du projet',
    'contact.send_message': 'Envoyer le message',
    'contact.message_sent': 'Message envoyé avec succès ! 🎉',
    'contact.thank_you': 'Merci de nous avoir contactés ! Notre équipe examinera les détails de votre projet et reviendra vers vous dans les 24 heures.',
    'contact.expected_response': 'Réponse attendue : sous 24 heures',

    // Placeholders
    'contact.placeholder.name': 'Entrez votre nom complet',
    'contact.placeholder.email': 'votre.email@exemple.com',
    'contact.placeholder.company': 'Nom de votre entreprise',
    'contact.placeholder.phone': '+212 661-234-567',
    'contact.placeholder.message': 'Parlez-nous davantage de votre projet, de vos objectifs et de tout détail spécifique qui nous aidera à vous fournir la meilleure solution...',

    // Form Options
    'contact.select_service': 'Sélectionnez un service',
    'contact.select_project_type': 'Sélectionnez un type de projet',
    'contact.select_budget': 'Sélectionnez une tranche budgétaire',
    'contact.select_timeline': 'Sélectionnez un délai',

    // Service Options
    'contact.service.architectural': 'Conception architecturale',
    'contact.service.project_mgmt': 'Gestion de projet',
    'contact.service.structural': 'Ingénierie structurelle',
    'contact.service.machinery': 'Machinerie lourde & logistique',
    'contact.service.quality': 'Assurance qualité',
    'contact.service.green': 'Solutions de construction écologique',

    // Project Types
    'contact.project.residential': 'Résidentiel',
    'contact.project.commercial': 'Commercial',
    'contact.project.industrial': 'Industriel',
    'contact.project.infrastructure': 'Infrastructures',

    // Budget Options
    'contact.budget.under_500k': 'Moins de 500k MAD',
    'contact.budget.500k_2m': '500k - 2M MAD',
    'contact.budget.2m_5m': '2M - 5M MAD',
    'contact.budget.5m_20m': '5M - 20M MAD',
    'contact.budget.over_20m': 'Plus de 20M MAD',

    // Timeline Options
    'contact.timeline.asap': 'Dès que possible',
    'contact.timeline.1_3_months': '1-3 mois',
    'contact.timeline.3_6_months': '3-6 mois',
    'contact.timeline.6_12_months': '6-12 mois',
    'contact.timeline.over_1_year': 'Plus d’un an',

    // Map Section
    'contact.find_office': 'Trouvez notre bureau à Marrakech',
    'contact.visit_description': 'Venez nous rendre visite dans notre siège moderne au cœur de Marrakech. Nous sommes situés dans le quartier animé de Guéliz.',
    'contact.get_directions': 'Obtenir l’itinéraire',
    'contact.call_now': 'Appeler maintenant',
    'contact.loading_map': 'Chargement de la carte interactive...',
    'contact.prime_location': 'Emplacement privilégié',
    'contact.prime_location_desc': 'Situé à Massira II, le quartier des affaires moderne de Marrakech',
    'contact.easy_access': 'Accès facile',
    'contact.easy_access_desc': 'À 5 minutes de la gare de Marrakech et des principaux axes de transport',
    'contact.modern_facilities': 'Installations modernes',
    'contact.modern_facilities_desc': 'Bureaux ultramodernes avec salles de réunion et espace d’exposition de projets',

    // Edit Modal
    'contact.edit_section': 'Modifier la section Contact',
    'contact.basic_info': 'Informations de base',
    'contact.badge_text': 'Texte du badge',
    'contact.main_heading': 'Titre principal',
    'contact.description_text': 'Description',
    'contact.contact_info': 'Informations de contact',
    'contact.add_contact': 'Ajouter un contact',
    'contact.contact_item': 'Élément de contact',
    'contact.icon_type': 'Type d’icône',
    'contact.title': 'Titre',
    'contact.details': 'Détails',
    'contact.add_detail': 'Ajouter un détail',
    'contact.accent_style': 'Style accentué (mis en évidence)',
    'contact.save_changes': 'Enregistrer les modifications',
    'contact.updated_success': 'Informations de contact mises à jour avec succès',
    'contact.update_failed': 'Échec de la sauvegarde des informations de contact',

    // Contact Info Defaults
    'contact.info.visit_atelier': 'Visitez notre atelier',
    'contact.info.call_us': 'Appelez-nous',
    'contact.info.email_us': 'Écrivez-nous',
    'contact.info.business_hours': 'Horaires d’ouverture',
    'contact.info.hours_detail': 'Lun - Sam : 9h00 - 18h00',
    'contact.info.sunday_closed': 'Dimanche : Fermé',
    'contact.required_fields': 'Veuillez remplir tous les champs obligatoires',
    'contact.message_sent_success': 'Votre message a été envoyé avec succès!',
    'contact.submission_failed': 'Échec de l\'envoi du message. Veuillez réessayer.',
    'contact.sending': 'Envoi en cours...',

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