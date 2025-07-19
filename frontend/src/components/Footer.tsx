import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building className="h-8 w-8 text-[#fcbd0f]" />
              <span className="text-xl font-bold">BuildCorp</span>
            </div>
            <p className="text-gray-400 mb-4">
              Building excellence since 2003. Your trusted construction partner for all residential and commercial projects.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6 text-gray-400 hover:text-[#fcbd0f] cursor-pointer transition-colors" />
              <Twitter className="h-6 w-6 text-gray-400 hover:text-[#fcbd0f] cursor-pointer transition-colors" />
              <Instagram className="h-6 w-6 text-gray-400 hover:text-[#fcbd0f] cursor-pointer transition-colors" />
              <Linkedin className="h-6 w-6 text-gray-400 hover:text-[#fcbd0f] cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Services', 'Portfolio', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-[#fcbd0f] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {[
                'Commercial Construction',
                'Residential Building', 
                'Renovation Services',
                'Custom Carpentry',
                'Project Management'
              ].map((service) => (
                <li key={service}>
                  <a href="#" className="text-gray-400 hover:text-[#fcbd0f] transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-[#fcbd0f]" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-[#fcbd0f]" />
                <span className="text-gray-400">info@buildcorp.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-[#fcbd0f] mt-0.5" />
                <span className="text-gray-400">123 Construction Ave<br />Building City, BC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 BuildCorp. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer