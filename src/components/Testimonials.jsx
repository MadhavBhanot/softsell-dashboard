import React, { useState, useEffect, useRef, useContext, memo } from 'react';
import { ThemeContext } from '../App';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);
  const { isDark } = useContext(ThemeContext);
  
  // Check device performance on component mount
  useEffect(() => {
    // Detect low-performance devices
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const lowCPUCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      return isMobile || lowCPUCores;
    };
    
    setIsLowPerfDevice(checkPerformance());
  }, []);
  
  // Simple timeout to trigger animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Pre-load images to prevent layout shifts
  useEffect(() => {
    let loadedCount = 0;
    const totalImages = testimonials.length;
    
    // Create image elements to preload
    testimonials.forEach((testimonial, index) => {
      const img = new Image();
      img.src = testimonial.image;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
        }
      };
      
      // Store refs to actual displayed images
      if (imageRefs.current[index]) {
        imageRefs.current[index].src = testimonial.image;
      }
    });
  }, []);
  
  // Memoize testimonials data to prevent unnecessary re-creation
  const testimonials = React.useMemo(() => [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "IT Director",
      company: "TechGlobal Solutions",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "SoftSell has transformed how we acquire software licenses for our company. Their verification process and competitive pricing have saved us thousands of dollars while ensuring we remain compliant."
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO",
      company: "Innovate Startup",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "As a startup, every dollar counts. SoftSell provided us with legitimate software licenses at a fraction of retail cost. Their customer support team was incredibly helpful throughout the entire process."
    }
  ], []);
  
  return (
    <section 
      id="testimonials" 
      ref={sectionRef} 
      className={`relative py-20 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#12082e]' : 'bg-indigo-50'
      }`}
    >
      {/* Background decorations - simplified for low-perf devices */}
      {!isLowPerfDevice && (
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className={`absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-purple-900/20' : 'bg-purple-200'
          }`}></div>
          <div className={`absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-blue-900/20' : 'bg-blue-200'
          }`}></div>
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Clients</span> Say</h2>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
            We've helped hundreds of businesses and individuals save money on their software needs. Here's what they have to say about our service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className={`${isDark 
                ? 'bg-[#1a123a]/60 border-purple-900/20' 
                : 'bg-white/80 border-indigo-100'
              } backdrop-blur-md border rounded-2xl p-8 transition-all duration-500 ease-out`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                opacity: (isVisible && imagesLoaded) ? 1 : 0,
                transform: (isVisible && imagesLoaded) ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              <div className="flex items-center mb-6">
                <img 
                  ref={el => imageRefs.current[index] = el}
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  loading="lazy"
                />
                <div>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-indigo-900'}`}>{testimonial.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
              <blockquote>
                <p className={`text-lg italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonial.quote}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Testimonials); 