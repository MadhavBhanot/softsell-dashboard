import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { ThemeContext } from '../App';

// Hero component
const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isLowPerfDevice, setIsLowPerfDevice] = useState(false);
  const [vantaEnabled, setVantaEnabled] = useState(true);
  const [isInViewport, setIsInViewport] = useState(true); // Track if hero is in viewport
  const heroRef = useRef(null);
  const { isDark } = useContext(ThemeContext);
  
  // Light and dark mode colors - centralized for consistency
  const bgColors = {
    dark: '#12082e',
    light: '#eef2ff'
  };
  
  // Check device performance on component mount
  useEffect(() => {
    // Detect low-performance devices based on user agent or hardware concurrency
    const checkPerformance = () => {
      // Check if mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Check available CPU cores if supported
      const lowCPUCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
      
      // Set low performance mode if mobile or low CPU cores
      return isMobile || lowCPUCores;
    };
    
    setIsLowPerfDevice(checkPerformance());
    setIsVisible(true); // Show content immediately
  }, []);

  // Get Vanta effect configuration based on current theme and device
  const getVantaConfig = () => {
    return {
      el: heroRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 0.75,
      // Make colors more visible in light mode
      color: isDark ? 0x9900ff : 0x6366f1,  // Brighter color for light mode
      backgroundColor: isDark 
        ? parseInt(bgColors.dark.replace('#', '0x'), 16) 
        : parseInt(bgColors.light.replace('#', '0x'), 16),
      spacing: isLowPerfDevice ? 7.0 : 5.5,
      chaos: isLowPerfDevice ? 2.0 : 4.0,
      speed: isLowPerfDevice ? 0.4 : 0.6,
      showDots: false,
      forceAnimate: true,  // Force animation to ensure visibility
      material: {
        shininess: 0,
        wireframe: isLowPerfDevice,
        flatShading: isLowPerfDevice,
        // Adjust thickness based on theme to improve visibility in light mode
        thickness: isDark ? 1.0 : 1.5, // Thicker lines in light mode
        opacity: isDark ? 1.0 : 0.9    // Slightly more opaque in light mode
      }
    };
  };
  
  // Apply background color directly on the DOM element
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.style.backgroundColor = isDark ? bgColors.dark : bgColors.light;
    }
  }, [isDark, bgColors]);
  
  // Set up Intersection Observer to detect when Hero enters/exits viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
        
        // If we have a vanta effect, pause/resume based on visibility
        if (vantaEffect) {
          if (entry.isIntersecting) {
            // Resume animation when hero is visible
            console.log("Hero in viewport - resuming animation");
            if (vantaEffect.resumeAnimation) {
              vantaEffect.resumeAnimation();
            }
          } else {
            // Pause animation when hero is not visible
            console.log("Hero out of viewport - pausing animation");
            if (vantaEffect.pauseAnimation) {
              vantaEffect.pauseAnimation();
            }
          }
        }
      },
      { threshold: 0.1 } // Trigger when at least 10% of the element is visible
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, [vantaEffect]);
  
  // Handle Vanta.js effect creation and updates
  useEffect(() => {
    // Apply direct background color immediately
    if (heroRef.current) {
      heroRef.current.style.backgroundColor = isDark ? bgColors.dark : bgColors.light;
    }
    
    // Skip effect creation if vantaEnabled is false
    if (!vantaEnabled || !window.VANTA) {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
      return;
    }
    
    // Always destroy and recreate on theme change to ensure proper theme visualization
    if (vantaEffect) {
      vantaEffect.destroy();
      setVantaEffect(null);
    }
    
    // Create a new effect with theme-appropriate settings
    const config = getVantaConfig();
    
    // Small timeout to ensure DOM is ready
    setTimeout(() => {
      if (heroRef.current && window.VANTA) {
        const effect = window.VANTA.TRUNK(config);
        
        // Initially pause if not in viewport
        if (!isInViewport && effect.pauseAnimation) {
          effect.pauseAnimation();
        }
        
        setVantaEffect(effect);
      }
    }, 10);
    
    // Clean up effect when component unmounts or when dependencies change
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [isDark, vantaEnabled, isLowPerfDevice]);
  
  // Toggle Vanta effect for performance
  const handleToggleEffect = () => {
    setVantaEnabled(prev => !prev);
  };
  
  return (
    <div 
      ref={heroRef}
      id="top"
      className="relative min-h-screen pt-16 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isDark ? bgColors.dark : bgColors.light }}
    >
      {/* Performance toggle for users - Updated to handle light/dark mode */}
      {isLowPerfDevice && (
        <button
          onClick={handleToggleEffect}
          className={`absolute top-4 right-4 z-50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isDark 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-indigo-900/10 text-indigo-900 hover:bg-indigo-900/20'
          }`}
          aria-label={vantaEnabled ? 'Disable visual effects' : 'Enable visual effects'}
        >
          {vantaEnabled ? 'Disable Effects' : 'Enable Effects'}
        </button>
      )}
      
      {/* Background decorations - only shown when Vanta is disabled */}
      {!vantaEnabled && (
        <>
          <div className={`absolute top-20 left-40 w-80 h-80 rounded-full ${isDark ? 'bg-purple-600/20' : 'bg-purple-600/30'} blur-3xl`}></div>
          <div className={`absolute bottom-40 right-20 w-96 h-96 rounded-full ${isDark ? 'bg-blue-600/20' : 'bg-blue-600/30'} blur-3xl`}></div>
          <div className={`absolute top-1/3 right-1/3 w-64 h-64 rounded-full ${isDark ? 'bg-indigo-600/20' : 'bg-indigo-600/30'} blur-3xl`}></div>
        </>
      )}
      
      {/* Main content */}
      <div className="container mx-auto px-4 pt-32 pb-24 relative z-10">
        <div className={`text-center mb-16 transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className={`${isDark ? 'text-white' : 'text-indigo-900'}`}>Premium Software </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-600 font-black">Licenses</span>
            <span className={`${isDark ? 'text-white' : 'text-indigo-900'}`}> At Discounted Prices</span>
          </h1>
          <p className={`max-w-2xl mx-auto text-base md:text-lg mb-8 px-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            SoftSell offers authentic software licenses from top vendors at up to 70% off retail prices.
            All licenses are verified, guaranteed, and delivered instantly.
          </p>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              const pricingSection = document.getElementById('pricing');
              if (pricingSection) {
                window.scrollTo({
                  top: pricingSection.offsetTop - 70,
                  behavior: 'smooth'
                });
              }
            }}
            className="mt-6 md:mt-8 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-6 md:px-8 rounded-full transition-colors duration-300 shadow-lg hover:shadow-purple-500/20"
          >
            Browse Licenses
          </button>
        </div>
        
        {/* Hero cards - simplified animation */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto transition-opacity duration-700 ease-in-out delay-200 px-4 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className={`${isDark ? 'bg-[#1a123a]/60' : 'bg-white/80'} backdrop-blur-md border ${isDark ? 'border-purple-900/20' : 'border-purple-200'} rounded-2xl p-4 md:p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl`}>
            <div className={`${isDark ? 'bg-[#2c1d5b]' : 'bg-indigo-100'} w-12 md:w-14 h-12 md:h-14 rounded-xl flex items-center justify-center mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-blue-400">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53-1.872-1.872a.75.75 0 00-1.06 1.06l2.4 2.4a.75.75 0 001.12-.08l3.868-5.406z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-indigo-900'}`}>Verified Authenticity</h3>
            <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Every license is verified and guaranteed to be 100% authentic and authorized.</p>
          </div>
          
          <div className={`${isDark ? 'bg-[#1a123a]/60' : 'bg-white/80'} backdrop-blur-md border ${isDark ? 'border-purple-900/20' : 'border-purple-200'} rounded-2xl p-4 md:p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl`}>
            <div className={`${isDark ? 'bg-[#2c1d5b]' : 'bg-indigo-100'} w-12 md:w-14 h-12 md:h-14 rounded-xl flex items-center justify-center mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-green-400">
                <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-indigo-900'}`}>Save Up to 70%</h3>
            <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Get premium software licenses at a fraction of retail prices with significant discounts.</p>
          </div>
          
          <div className={`${isDark ? 'bg-[#1a123a]/60' : 'bg-white/80'} backdrop-blur-md border ${isDark ? 'border-purple-900/20' : 'border-purple-200'} rounded-2xl p-4 md:p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl`}>
            <div className={`${isDark ? 'bg-[#2c1d5b]' : 'bg-indigo-100'} w-12 md:w-14 h-12 md:h-14 rounded-xl flex items-center justify-center mb-4`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 md:w-7 md:h-7 text-yellow-400">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </div>
            <h3 className={`text-lg md:text-xl font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-indigo-900'}`}>Instant Delivery</h3>
            <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Receive your license keys immediately after purchase via email or dashboard.</p>
          </div>
        </div>
        
        {/* Company logos - simplified for performance */}
        <div className={`mt-20 text-center transition-opacity duration-700 ease-in-out delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className={`text-2xl font-semibold mb-8 ${isDark ? 'text-gray-200' : 'text-indigo-900'}`}>Trusted By Leading Companies</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <div className="w-24 h-12 flex items-center justify-center">
              <svg className={`w-full h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} viewBox="0 0 124 33" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.832 26.55C9.602 26.55 4.566 21.512 4.566 16.044C4.566 10.576 9.602 5.538 17.832 5.538C26.062 5.538 31.098 10.576 31.098 16.044C31.098 21.512 26.062 26.55 17.832 26.55ZM17.832 9.458C12.054 9.458 9.368 12.74 9.368 16.044C9.368 19.348 12.054 22.63 17.832 22.63C23.61 22.63 26.296 19.348 26.296 16.044C26.296 12.74 23.61 9.458 17.832 9.458Z" />
                <path d="M44.364 26.316C40.15 26.316 36.846 24.856 35.386 22.396L39.132 20.234C39.834 21.512 42.168 22.864 44.364 22.864C46.794 22.864 48.488 21.746 48.488 20.234C48.488 19.066 47.496 18.13 45.59 17.896L42.168 17.428C38.54 16.96 36.378 14.968 36.378 11.898C36.378 8.36 39.6 5.538 44.13 5.538C47.73 5.538 50.458 7.066 51.918 9.224L48.254 11.274C47.496 9.926 45.824 8.99 44.13 8.99C42.168 8.99 40.826 9.926 40.826 11.43C40.826 12.532 41.584 13.402 43.188 13.636L46.61 14.104C50.696 14.662 52.924 16.96 52.924 19.964C52.924 23.7 49.48 26.316 44.364 26.316Z" />
              </svg>
            </div>
            <div className="w-24 h-12 flex items-center justify-center">
              <svg className={`w-full h-7 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} viewBox="0 0 124 34" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.346 22.34C25.973 23.108 25.413 23.818 24.713 24.44C24.013 25.062 23.234 25.526 22.352 25.846C21.47 26.166 20.471 26.333 19.411 26.333C17.905 26.333 16.552 26.011 15.325 25.38C14.098 24.749 13.127 23.818 12.366 22.633C11.605 21.448 11.226 20.05 11.226 18.431C11.226 16.812 11.605 15.428 12.366 14.229C13.127 13.03 14.098 12.099 15.325 11.468C16.552 10.837 17.905 10.515 19.411 10.515C20.471 10.515 21.47 10.682 22.352 11.002C23.234 11.322 24.013 11.786 24.713 12.408C25.413 13.03 25.973 13.74 26.346 14.508L23.165 16.533C22.699 15.601 22.099 14.901 21.351 14.455C20.604 14.009 20.051 13.789 19.411 13.789C18.538 13.789 17.731 14.022 16.978 14.495C16.225 14.968 15.632 15.614 15.173 16.426C14.714 17.238 14.487 17.98 14.487 18.431C14.487 19.124 14.701 19.832 15.133 20.631C15.565 21.43 16.145 22.077 16.858 22.553C17.571 23.029 18.418 23.274 19.411 23.261C20.064 23.261 20.644 23.042 21.304 22.62C21.964 22.198 22.545 21.525 23.099 20.51L26.346 22.34Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated dots background - conditionally rendered for performance */}
      {!isLowPerfDevice && (
        <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
          <div className="absolute inset-0" style={{ 
            backgroundImage: `radial-gradient(${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(79, 70, 229, 0.15)'} 1px, transparent 1px)`, 
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0',
          }}></div>
        </div>
      )}
      
      {/* Wave decoration at bottom - simplified for low-perf devices */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className={`w-full h-24 ${isDark ? 'fill-[#240f54]' : 'fill-[#c7d2fe]'} opacity-50`} viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default React.memo(Hero); 