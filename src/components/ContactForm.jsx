import React, { useState, useEffect, useRef, useContext, useCallback, memo } from 'react';
import { ThemeContext } from '../App';
import Toast from './Toast';
import { motion } from 'framer-motion';

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    licenseType: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const sectionRef = useRef(null);
  const { isDark } = useContext(ThemeContext);
  
  // Check device performance
  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const lowCPUCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      return isMobile || lowCPUCores;
    };
    
    setIsLowPerfDevice(checkPerformance());
    
    // Simple timeout to show content with animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Memoize license types to prevent unnecessary re-creation
  const licenseTypes = React.useMemo(() => [
    { value: 'individual', label: 'Individual License' },
    { value: 'business', label: 'Business License' },
    { value: 'enterprise', label: 'Enterprise License' },
    { value: 'educational', label: 'Educational License' },
    { value: 'non-profit', label: 'Non-Profit Organization' }
  ], []);
  
  // Optimize form change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  // Memoized form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Check required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // Optimized form submission with debouncing
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate form submission (would be an API call in a real app)
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setIsSubmitting(false);
        
        // Show success toast
        setToastMessage('Your message has been sent successfully! We\'ll get back to you soon.');
        setShowToast(true);
        
        // Reset form after submission
        setFormData({
          name: '',
          email: '',
          company: '',
          licenseType: '',
          message: ''
        });
      }, 1000);
    }
  }, [formData, validateForm, isSubmitting]);
  
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const inputVariants = {
    focus: { scale: 1.02, boxShadow: `0 0 0 2px ${isDark ? '#a855f7' : '#6366f1'}` },
    blur: { scale: 1, boxShadow: "0 0 0 0 transparent" }
  };
  
  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className={`relative py-20 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0c061d]' : 'bg-white'
      }`}
    >
      {/* Toast notification */}
      {showToast && (
        <Toast 
          message={toastMessage} 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}
      
      {/* Background decorations - conditionally rendered for better performance */}
      {!isLowPerfDevice && (
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-purple-900/20' : 'bg-indigo-100'
          }`}></div>
          <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-blue-900/20' : 'bg-blue-100/70'
          }`}></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 transition-opacity duration-700 ease-in-out" style={{ opacity: isVisible ? 1 : 0 }}>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-indigo-900'}`}>Get in <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Touch</span></h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Have questions about our services or need a custom license solution? 
              Fill out the form below and our team will get back to you promptly.
            </p>
          </div>
          
          <div className={`${
            isDark ? 'bg-[#1a123a]/60' : 'bg-white/80'
          } backdrop-blur-md border ${
            isDark ? 'border-purple-900/20' : 'border-indigo-100'
          } rounded-xl p-8 shadow-lg transition-all duration-700 ease-in-out`} 
            style={{ 
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
            }}
          >
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Your Name *</label>
                  <motion.input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#1a123a]/60 border-purple-900/30 text-white focus:border-purple-500' 
                        : 'bg-indigo-50/50 border-indigo-100 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none`}
                    aria-invalid={errors.name ? "true" : "false"}
                    whileFocus="focus"
                    whileBlur="blur"
                    variants={inputVariants}
                  />
                  {errors.name && <p className="text-red-500 mt-1 text-sm">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address *</label>
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#1a123a]/60 border-purple-900/30 text-white focus:border-purple-500' 
                        : 'bg-indigo-50/50 border-indigo-100 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none`}
                    aria-invalid={errors.email ? "true" : "false"}
                    whileFocus="focus"
                    whileBlur="blur"
                    variants={inputVariants}
                  />
                  {errors.email && <p className="text-red-500 mt-1 text-sm">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="company" className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company (Optional)</label>
                  <motion.input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#1a123a]/60 border-purple-900/30 text-white focus:border-purple-500' 
                        : 'bg-indigo-50/50 border-indigo-100 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none`}
                    whileFocus="focus"
                    whileBlur="blur"
                    variants={inputVariants}
                  />
                </div>
                
                <div>
                  <label htmlFor="licenseType" className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>License Type (Optional)</label>
                  <select
                    id="licenseType"
                    name="licenseType"
                    value={formData.licenseType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                      isDark 
                        ? 'bg-[#1a123a]/60 border-purple-900/30 text-white focus:border-purple-500' 
                        : 'bg-indigo-50/50 border-indigo-100 text-gray-900 focus:border-indigo-500'
                    } focus:outline-none`}
                  >
                    <option value="">Select a license type</option>
                    {licenseTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className={`block mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Your Message *</label>
                <motion.textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 ${
                    isDark 
                      ? 'bg-[#1a123a]/60 border-purple-900/30 text-white focus:border-purple-500' 
                      : 'bg-indigo-50/50 border-indigo-100 text-gray-900 focus:border-indigo-500'
                  } focus:outline-none`}
                  aria-invalid={errors.message ? "true" : "false"}
                  whileFocus="focus"
                  whileBlur="blur"
                  variants={inputVariants}
                ></motion.textarea>
                {errors.message && <p className="text-red-500 mt-1 text-sm">{errors.message}</p>}
              </div>
              
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-purple-500/20'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(ContactForm); 