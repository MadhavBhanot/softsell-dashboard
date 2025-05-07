import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../App';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark } = useContext(ThemeContext);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Smooth scroll to section function
  const scrollToSection = (sectionId) => (e) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70, // Account for navbar height
        behavior: 'smooth'
      });
      // Close mobile menu after navigation
      setMobileMenuOpen(false);
    }
  };

  // Logo component with gradient
  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 md:w-6 md:h-6 text-white">
          <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
        </svg>
      </div>
      <span className={`text-lg md:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>SoftSell</span>
    </div>
  );

  // Define navigation items with section IDs
  const navItems = [
    { name: 'Home', id: null }, // Scroll to top
    { name: 'Features', id: 'features' },
    { name: 'Process', id: 'process' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled || mobileMenuOpen
        ? isDark
           ? 'bg-[#12082e]/90 backdrop-blur-md shadow-lg' 
           : 'bg-white/90 backdrop-blur-md shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <a href="#" onClick={scrollToSection('top')} className="cursor-pointer">
            <Logo />
          </a>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.id ? `#${item.id}` : '#'}
                  onClick={scrollToSection(item.id || 'top')}
                  className={`${
                    isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  } px-1 py-2 text-sm font-medium transition-colors relative group cursor-pointer`}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>
          
          {/* CTA Button - hidden on smallest screens */}
          <div className="hidden sm:flex items-center">
            <button 
              onClick={scrollToSection('contact')}
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-2 px-4 md:px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-purple-500/20 text-sm md:text-base">
              Get Started Now
            </button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} focus:outline-none p-2`}
              aria-expanded={mobileMenuOpen}
            >
              {!mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen 
          ? 'max-h-96 opacity-100 border-b' 
          : 'max-h-0 opacity-0 overflow-hidden'
      } ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.id ? `#${item.id}` : '#'}
              onClick={scrollToSection(item.id || 'top')}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isDark
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </a>
          ))}
          <div className="pt-2 pb-1">
            <button
              onClick={scrollToSection('contact')}
              className="w-full text-center bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-2 px-6 rounded-md"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 