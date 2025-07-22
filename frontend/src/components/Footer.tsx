import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Send,
  Award,
  Shield,
  Zap
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hours: string;
}

interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterProps {
  logo?: {
    src: string;
    alt: string;
    title: string;
  };
  description?: string;
  sections?: FooterSection[];
  contact?: ContactInfo;
  socialLinks?: SocialLink[];
  newsletterTitle?: string;
  newsletterDescription?: string;
  certifications?: Array<{
    name: string;
    icon: React.ReactNode;
  }>;
  copyrightText?: string;
}

const Footer = ({
  logo = {
    src: "images/Mecoso.png",
    alt: "Company Logo",
    title: "Mecoso"
  },
  description = "Leading construction company delivering innovative, sustainable, and high-quality building solutions across the region. Building tomorrow's infrastructure today.",
  sections = [
    {
      title: "Services",
      links: [
        { label: "Architectural Design", href: "#" },
        { label: "Project Management", href: "#" },
        { label: "Structural Engineering", href: "#" },
        { label: "Green Building", href: "#" },
        { label: "Quality Assurance", href: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#" },
        { label: "Our Team", href: "#" },
        { label: "Careers", href: "#" },
        { label: "News & Media", href: "#" },
        { label: "Sustainability", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { label: "Project Gallery", href: "#" },
        { label: "Case Studies", href: "#" },
        { label: "Downloads", href: "#" },
        { label: "Safety Guidelines", href: "#" },
        { label: "FAQs", href: "#" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Contact Us", href: "#" },
        { label: "Get Quote", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" }
      ]
    }
  ],
  contact = {
    address: "1234 Construction Ave, Building District, City 12345",
    phone: "+1 (555) 123-4567",
    email: "info@buildcorp.com",
    hours: "Mon-Fri: 8:00 AM - 6:00 PM"
  },
  socialLinks = [
    {
      platform: "Facebook",
      href: "#",
      icon: <Facebook className="size-5" />
    },
    {
      platform: "Twitter",
      href: "#",
      icon: <Twitter className="size-5" />
    },
    {
      platform: "Instagram",
      href: "#",
      icon: <Instagram className="size-5" />
    },
    {
      platform: "LinkedIn",
      href: "#",
      icon: <Linkedin className="size-5" />
    },
    {
      platform: "YouTube",
      href: "#",
      icon: <Youtube className="size-5" />
    }
  ],
  newsletterTitle = "Stay Updated",
  newsletterDescription = "Get the latest news about our projects, industry insights, and construction innovations delivered to your inbox.",
  certifications = [
    {
      name: "ISO Certified",
      icon: <Award className="size-6" />
    },
    {
      name: "Safety First",
      icon: <Shield className="size-6" />
    },
    {
      name: "Green Building",
      icon: <Zap className="size-6" />
    }
  ],
  copyrightText = "BuildCorp Construction. All rights reserved."
}: FooterProps) => {

  const handleNewsletterSubmit = () => {
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      
      {/* Newsletter Section */}
      <div className="relative z-10 border-b border-gray-700/50">
        <div className="container px-6 mx-auto py-16">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-gray-700/30">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {newsletterTitle}
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {newsletterDescription}
                </p>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    />
                  </div>
                  <button
                    onClick={handleNewsletterSubmit}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center gap-2 group whitespace-nowrap"
                  >
                    Subscribe
                    <Send className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  No spam, unsubscribe at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 container px-6 mx-auto py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-4">
            <div className="mb-8">
              <a href="#" className="flex items-center gap-3 mb-6 group">
                <img src={logo.src} className="h-20 w-20" alt={logo.alt} />
                <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {logo.title}
                </span>
              </a>
              <p className="text-gray-300 leading-relaxed mb-8">
                {description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                  <MapPin className="size-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Address</div>
                  <div className="text-gray-300 text-sm">{contact.address}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors duration-300">
                  <Phone className="size-5 text-green-400" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Phone</div>
                  <div className="text-gray-300 text-sm">{contact.phone}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300">
                  <Mail className="size-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Email</div>
                  <div className="text-gray-300 text-sm">{contact.email}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="p-2 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors duration-300">
                  <Clock className="size-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-white font-medium mb-1">Hours</div>
                  <div className="text-gray-300 text-sm">{contact.hours}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-3 bg-gray-800/50 rounded-xl text-gray-400 hover:text-white hover:bg-blue-500/20 hover:scale-110 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/30"
                  aria-label={social.platform}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-4 gap-8">
              {sections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-white text-lg font-bold mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-300 inline-flex items-center gap-2 group"
                        >
                          <ArrowRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Bottom Bar */}
      <div className="relative z-10 border-t border-gray-700/50">
        <div className="container px-6 mx-auto py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            
            {/* Certifications */}
            <div className="flex items-center gap-8">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                    {cert.icon}
                  </div>
                  <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">
                    {cert.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center lg:text-right">
              <p>&copy; {new Date().getFullYear()} {copyrightText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;