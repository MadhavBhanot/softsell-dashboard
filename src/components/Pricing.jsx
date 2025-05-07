import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useAnimationControls, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';
import { ThemeContext } from '../App';

// Purple gradient background image URL
const purpleGradientBg = "public/image.png";

const Pricing = () => {
  const { isDark } = useContext(ThemeContext);
  const [isVisible, setIsVisible] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  
  // Detect mobile device for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Mouse position for interactive gradient - only on desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smoothed mouse values with better damping for smoother movement
  const smoothMouseX = useSpring(mouseX, { damping: 50, stiffness: 90 });
  const smoothMouseY = useSpring(mouseY, { damping: 50, stiffness: 90 });
  
  // Animation control values - reduced for better performance, especially on mobile
  const blobPositions = Array(isMobile ? 2 : 4).fill(0).map(() => ({
    x: useMotionValue(Math.random() * 100 - 50),
    y: useMotionValue(Math.random() * 100 - 50),
    scale: useMotionValue(0.8 + Math.random() * 0.4),
    rotation: useMotionValue(Math.random() * 360),
  }));
  
  // Trail effect values - reduced number and optimized for smoothness
  const trailPositions = Array(isMobile ? 0 : 6).fill(0).map(() => ({
    x: useMotionValue(0),
    y: useMotionValue(0),
    opacity: useMotionValue(0),
    scale: useMotionValue(0.1),
  }));
  
  // Handle intersection observer to trigger animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Add/remove mouse movement listener with throttling for better performance
  useEffect(() => {
    // Skip on mobile for better performance
    if (isMobile) return;
    
    let lastUpdate = 0;
    const throttleAmount = 20; // ms - higher = smoother but less responsive
    
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to viewport center
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const centerX = windowWidth / 2;
      const centerY = windowHeight / 2;
      
      // Get normalized position (-1 to 1 range)
      const normalizedX = (e.clientX - centerX) / centerX;
      const normalizedY = (e.clientY - centerY) / centerY;
      
      // Update mouse position with more gentle effect
      mouseX.set(normalizedX * 30);
      mouseY.set(normalizedY * 30);
    };
    
    const throttledMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate > throttleAmount) {
        handleMouseMove(e);
        lastUpdate = now;
      }
    };
    
    window.addEventListener('mousemove', throttledMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
    };
  }, [isMobile, mouseX, mouseY]);
  
  // Animate blobs when visible - with improved timing for smoothness
  useEffect(() => {
    if (isVisible && blobPositions.length > 0) {
      // Slower animation on mobile
      const speedMultiplier = isMobile ? 1.5 : 1;
      
      // Animate each blob independently but with smoother transitions
      blobPositions.forEach((blob, index) => {
        const speed = (20 + (index * 5)) * speedMultiplier; // Slower, more deliberate movement
        
        // More gentle, predictable patterns for smoother appearance
        animate(blob.x, [
          (index % 2 === 0 ? 30 : -30),
          (index % 2 === 0 ? -20 : 20),
          (index % 2 === 0 ? 10 : -10),
          (index % 2 === 0 ? -30 : 30),
        ], {
          duration: speed,
          repeat: Infinity,
          repeatType: "mirror",
          ease: [0.22, 0.03, 0.26, 1] // Custom cubic bezier for smoother motion
        });
        
        animate(blob.y, [
          (index % 2 === 0 ? -25 : 25),
          (index % 2 === 0 ? 15 : -15),
          (index % 2 === 0 ? -15 : 15),
          (index % 2 === 0 ? 25 : -25),
        ], {
          duration: speed + 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: [0.22, 0.03, 0.26, 1]
        });
        
        // More gradual scale changes
        animate(blob.scale, [
          0.9,
          1.05,
          0.95,
          1.1,
          0.9
        ], {
          duration: speed + 15,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        });
        
        // Very slow rotation for subtle effect
        animate(blob.rotation, [
          0,
          index % 2 === 0 ? 15 : -15,
          0,
          index % 2 === 0 ? -15 : 15,
          0
        ], {
          duration: speed + 30,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear"
        });
      });
    }
  }, [isVisible, blobPositions, isMobile]);
  
  // Create animated trail effect - moved to separate useEffect to maintain hook order consistency
  useEffect(() => {
    // Skip on mobile for performance
    if (isMobile || !isVisible || trailPositions.length === 0) return;
    
    const trailInterval = setInterval(() => {
      // Shift all trail positions
      for (let i = trailPositions.length - 1; i > 0; i--) {
        const current = trailPositions[i];
        const prev = trailPositions[i - 1];
        
        current.x.set(prev.x.get());
        current.y.set(prev.y.get());
        current.opacity.set(Math.max(0, prev.opacity.get() - 0.1));
        current.scale.set(prev.scale.get() * 0.95);
      }
      
      // Update the first position with current mouse position - more subtle
      if (trailPositions[0]) {
        trailPositions[0].x.set(smoothMouseX.get() * 0.3);
        trailPositions[0].y.set(smoothMouseY.get() * 0.3);
        trailPositions[0].opacity.set(0.6);
        trailPositions[0].scale.set(0.3 + Math.random() * 0.2);
      }
    }, 100); // Slower update for smoother appearance
    
    return () => {
      clearInterval(trailInterval);
    };
  }, [isVisible, isMobile, trailPositions, smoothMouseX, smoothMouseY]);
  
  // Price calculation based on billing cycle
  const getPrice = (monthlyPrice, annually = false) => {
    if (billingCycle === 'annually') {
      const annualPrice = (monthlyPrice * 10).toFixed(2);
      return { price: annualPrice, period: '/year' };
    }
    return { price: monthlyPrice.toFixed(2), period: '/month' };
  };
  
  // Animation variants - with smoother transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1],
      }
    }
  };
  
  // Simplified fluid shapes component for mobile
  const FluidShapes = ({ isHovered, className }) => {
    // Skip rendering complex effects on mobile
    if (isMobile) {
      return (
        <div className={`absolute inset-0 ${className}`}>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl bg-purple-600/20"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl bg-blue-600/20"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className={`absolute inset-0 ${className}`}>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {blobPositions.map((blob, index) => (
            <motion.div
              key={index}
              className={`absolute w-64 h-64 rounded-full mix-blend-lighten filter blur-3xl ${
                index % 2 === 0 ? 'bg-purple-600/15' : 'bg-blue-600/15'
              }`}
              style={{
                x: blob.x,
                y: blob.y,
                scale: blob.scale,
                rotate: blob.rotation,
              }}
            />
          ))}
          
          {!isMobile && trailPositions.map((trail, index) => (
            <motion.div
              key={`trail-${index}`}
              className="absolute w-8 h-8 rounded-full bg-white mix-blend-overlay filter blur-md"
              style={{
                x: trail.x,
                y: trail.y,
                opacity: trail.opacity,
                scale: trail.scale,
              }}
            />
          ))}
        </div>
      </div>
    );
  };
  
  // Price cards
  const priceCards = [
    {
      id: "basic",
      title: "Basic",
      description: "For freelancers and small businesses",
      monthly: 29,
      annually: 290,
      features: [
        "Up to 25 licenses",
        "Basic license management",
        "License transfer tools",
        "Email support"
      ],
      cta: "Start with Basic",
      highlight: false
    },
    {
      id: "pro",
      title: "Professional",
      description: "For growing businesses",
      monthly: 79,
      annually: 790,
      features: [
        "Up to 100 licenses",
        "Advanced management dashboard",
        "Compliance tracking",
        "License optimization tools",
        "Priority support",
        "Team collaboration (up to 5)"
      ],
      cta: "Upgrade to Pro",
      highlight: true
    },
    {
      id: "enterprise",
      title: "Enterprise",
      description: "For large organizations",
      monthly: 199,
      annually: 1990,
      features: [
        "Unlimited licenses",
        "Full compliance suite",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "Team collaboration (unlimited)",
        "SLA guarantees",
        "API access"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];
  
  return (
    <section 
      id="pricing" 
      ref={sectionRef} 
      className={`relative px-4 py-16 sm:px-6 sm:py-24 overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-indigo-50 text-gray-900'
      }`}
    >
      {/* Optimized background effect */}
      <FluidShapes className="opacity-70" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Simple, Transparent Pricing
            </span>
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Choose the plan that fits your business needs. All plans include core features with no hidden fees.
          </p>
          
          {/* Billing cycle toggle */}
          <div className="mt-6">
            <div className="inline-flex items-center p-1 bg-opacity-10 bg-white backdrop-blur-sm rounded-full mx-auto border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`py-2 px-4 sm:px-8 rounded-full text-sm sm:text-base font-medium transition-all ${
                  billingCycle === 'monthly' 
                    ? 'bg-white dark:bg-gray-800 shadow-md text-purple-700 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`py-2 px-4 sm:px-8 rounded-full text-sm sm:text-base font-medium transition-all ${
                  billingCycle === 'annually' 
                    ? 'bg-white dark:bg-gray-800 shadow-md text-purple-700 dark:text-purple-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Annually
                <span className="ml-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Pricing cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-12"
        >
          {priceCards.map((card) => {
            const { price, period } = getPrice(card.monthly, billingCycle === 'annually');
            const isHovered = hoveredCard === card.id;
            
            return (
              <motion.div
                key={card.id}
                variants={itemVariants}
                className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-gray-800/70 backdrop-blur-md border border-gray-700' 
                    : 'bg-white/90 backdrop-blur-md border border-indigo-100 shadow-xl'
                } ${
                  card.highlight ? 'md:-mt-4 md:mb-4' : ''
                } ${
                  isHovered ? 'transform md:-translate-y-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {card.highlight && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 text-center text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-500">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-6 sm:p-8 ${card.highlight ? 'pt-10' : ''}`}>
                  <h3 className="text-xl sm:text-2xl font-bold">{card.title}</h3>
                  <p className={`mt-2 text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>{card.description}</p>
                  
                  <div className="mt-5 flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-extrabold">${price}</span>
                    <span className={`ml-1 text-sm font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{period}</span>
                  </div>
                  
                  {billingCycle === 'annually' && (
                    <p className="mt-1 text-sm text-green-500">
                      Save ${(card.monthly * 2).toFixed(2)} per year
                    </p>
                  )}
                  
                  <ul className="mt-6 space-y-3">
                    {card.features.map((feature, idx) => (
                      <li key={idx} className="flex text-sm">
                        <svg 
                          className={`h-5 w-5 flex-shrink-0 ${
                            isDark ? 'text-purple-400' : 'text-purple-500'
                          }`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor" 
                          aria-hidden="true"
                        >
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8">
                    <button
                      className={`w-full py-3 px-4 rounded-lg text-center text-sm sm:text-base font-medium transition-all ${
                        card.highlight
                          ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/20'
                          : isDark
                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    >
                      {card.cta}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8">Frequently Asked Questions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/70' : 'bg-white/80 shadow-md'}`}>
              <h4 className="text-lg font-semibold mb-2">Do you offer a free trial?</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Yes, all plans come with a 14-day free trial. No credit card required until you decide to continue.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/70' : 'bg-white/80 shadow-md'}`}>
              <h4 className="text-lg font-semibold mb-2">Can I change plans later?</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Yes, you can upgrade or downgrade your plan at any time. Upgrades apply immediately, while downgrades take effect at the end of your billing cycle.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/70' : 'bg-white/80 shadow-md'}`}>
              <h4 className="text-lg font-semibold mb-2">How secure is my license data?</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We use enterprise-grade encryption and security practices to protect your data. Our platform is SOC 2 compliant and we perform regular security audits.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/70' : 'bg-white/80 shadow-md'}`}>
              <h4 className="text-lg font-semibold mb-2">Do you offer refunds?</h4>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;