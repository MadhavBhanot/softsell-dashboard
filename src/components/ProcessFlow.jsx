import React, { useState, useEffect, useRef, useContext, useCallback, memo } from 'react';
import { ThemeContext } from '../App';

const ProcessFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);
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
    
    // Simple fade-in animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set up auto-rotation for steps
  useEffect(() => {
    // Only use auto-rotation if not a low-performance device
    if (!isLowPerfDevice) {
      intervalRef.current = setInterval(() => {
        setActiveStep(prev => (prev + 1) % 3);
      }, 5000);
    }
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isLowPerfDevice]);
  
  // Handle step selection
  const handleStepClick = useCallback((index) => {
    // Clear any existing auto-rotation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setActiveStep(index);
    
    // Restart auto-rotation after user interaction (if not low-perf device)
    if (!isLowPerfDevice) {
      intervalRef.current = setInterval(() => {
        setActiveStep(prev => (prev + 1) % 3);
      }, 5000);
    }
  }, [isLowPerfDevice]);
  
  // Update the intersection observer logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setInViewport(isVisible);
        
        // Update pause state based on visibility and device performance
        setIsPaused(!isVisible || isLowPerfDevice);
        
        // Optional: Log animation state changes
        console.log(`ProcessFlow animation ${!isVisible ? 'paused' : 'running'}`);
      },
      { threshold: 0.1 } // Trigger when at least 10% is visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isLowPerfDevice]);
  
  // Update the interval effect to respect the pause state
  useEffect(() => {
    // Only auto-rotate steps if not paused
    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Start the auto-rotation when not paused
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);
  
  const steps = [
    {
      id: 1,
      title: "1. Browse Available Licenses",
      description: 
        "Explore our extensive catalog of software licenses from top vendors. Filter by category, price, or vendor to find exactly what you need.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "2. Secure Purchase",
      description: 
        "Complete your purchase through our secure payment gateway. We support multiple payment methods for your convenience.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "3. Instant Delivery",
      description: 
        "Receive your license key and download instructions instantly via email. Our automated system ensures immediate delivery.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3" />
        </svg>
      )
    },
    {
      id: 4,
      title: "4. Start Using Your Software",
      description: 
        "Download and activate your software using the provided license key. Our support team is available if you need any assistance.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      )
    },
  ];
  
  return (
    <section 
      id="process" 
      ref={sectionRef}
      className={`py-16 px-4 sm:px-6 md:py-24 lg:px-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              How It Works
            </span>
          </h2>
          <p className="max-w-2xl mx-auto text-base md:text-lg opacity-80">
            Our streamlined process makes it easy to purchase and start using your software licenses in minutes.
          </p>
        </div>

        {/* Mobile process steps - visible only on small screens */}
        <div className="md:hidden">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700"></div>
            
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative mb-8 pl-12 transition-all duration-300 ${
                  activeStep === index ? 'opacity-100' : 'opacity-70'
                }`}
              >
                {/* Step indicator */}
                <div 
                  className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    activeStep === index 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                      : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-800/80 hover:bg-gray-800' : 'bg-white/80 hover:bg-white shadow-sm'
                }`}>
                  <div className={`w-12 h-12 mb-3 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile step selector */}
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 transform scale-125'
                    : isDark ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop process flow - hidden on mobile */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative transition-all duration-500 ${
                  activeStep === index ? 'opacity-100 transform scale-105' : 'opacity-70'
                }`}
              >
                {/* Step number indicator */}
                <div className={`w-12 h-12 mx-auto mb-6 rounded-full flex items-center justify-center font-bold text-lg z-10 relative transition-all duration-300 ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg'
                    : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                
                <div className={`p-6 rounded-xl text-center h-full ${
                  isDark ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white/80 hover:bg-white shadow-sm'
                }`}>
                  <div className={`w-16 h-16 mx-auto mb-4 ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop step selector - hidden on mobile */}
        <div className="hidden md:flex justify-center mt-10 space-x-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 mt-10 ${
                activeStep === index 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium'
                  : isDark
                  ? 'bg-gray-800 text-gray-400 hover:text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              Step {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(ProcessFlow); 