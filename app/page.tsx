"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Search, 
  Star,
  MessageCircle,
  X,
  Send,
  Loader2,
  AlertCircle,
  User,
  LogOut,
  Palette,
  Heart,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';

export default function Home() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3 });
  const [servicesRef, servicesInView] = useInView({ threshold: 0.2 });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.2 });

  
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [showChat, setShowChat] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasHovered, setHasHovered] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
  }, []);

  // Initialize chat position on client side
  useEffect(() => {
    setChatPosition({ 
      x: window.innerWidth - 100, 
      y: window.innerHeight - 100 
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - chatPosition.x,
      y: e.clientY - chatPosition.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragOffset({
      x: touch.clientX - chatPosition.x,
      y: touch.clientY - chatPosition.y
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - 56, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 56, e.clientY - dragOffset.y));
      setChatPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging && e.touches[0]) {
      const touch = e.touches[0];
      const newX = Math.max(0, Math.min(window.innerWidth - 56, touch.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 56, touch.clientY - dragOffset.y));
      setChatPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove]);

  // Chat functions
  const sendChatMessage = async () => {
    if (!chatInput.trim() || isLoadingChat) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsLoadingChat(true);

    // Add user message to chat
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/beauty-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I cannot connect to the server. Please try again later.' }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 px-6 py-4"
        style={{ backgroundColor: 'rgba(243, 237, 229, 0.95)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Left Navigation */}
            <div className="hidden md:flex items-center space-x-12 text-sm">
              <Link href="/generate-look" className="transition-colors font-light" style={{ color: 'var(--text-dark)' }}>Face Analysis</Link>
              <Link href="/try-on" className="transition-colors font-light" style={{ color: 'var(--text-dark)' }}>Try On</Link>
              <Link href="/check-ingredients" className="transition-colors font-light" style={{ color: 'var(--text-dark)' }}>Ingredients</Link>
            </div>

            {/* Logo */}
            <div className="text-center">
              <h1 className="text-2xl font-light tracking-wider" style={{ color: 'var(--text-dark)' }}>
                GlowGuide
              </h1>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link href="/account" className="transition-colors text-sm font-light" style={{ color: 'var(--text-dark)' }}>My Account</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      setIsAuthenticated(false);
                      window.location.reload();
                    }}
                    className="transition-colors text-sm font-light" 
                    style={{ color: 'var(--text-dark)' }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="transition-colors text-sm font-light bot-signin" style={{ color: 'var(--text-dark)' } }>Sign In</Link>
                  <Link href="/register" className="transition-colors text-sm font-light bot-signup" style={{ color: 'var(--text-dark)' }}>Sign Up</Link>
                </>
              )}
              <a href="#contact" className="transition-colors text-sm font-light" style={{ color: 'var(--text-dark)' }}>Contact</a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/ChatGPT Image 24 июл. 2025 г., 17_54_41.png"
            alt="Beautiful makeup products"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h1 className="hero-title font-light leading-tight mb-8">
                Unleash Your Beauty Potential
              </h1>
              <p className="hero-subtitle max-w-3xl mx-auto leading-relaxed mb-12 font-light">
                Elevate your daily beauty routine with expertly crafted products designed to enhance and protect your natural appeal. Discover a range of skincare and cosmetic solutions that bring out the best in you, backed by science and tailored to meet diverse needs.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link href="/generate-look">
                <Button 
                  className="hero-btn"
                >
                  Try Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="services-title text-4xl lg:text-5xl font-light mb-6">
                How It Works?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                AI technology makes makeup accessible to everyone
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Smart Analysis",
                  description: "AI studies your facial features and determines the perfect color palette for your unique skin tone",
                  icon: Sparkles,
                  href: "/generate-look"
                },
                {
                  title: "Personalized Recommendations",
                  description: "Get a curated list of products and shades selected specifically for your unique features",
                  icon: Heart,
                  href: "/generate-look"
                },
                {
                  title: "Virtual Try-On", 
                  description: "Try different makeup looks online before purchasing to save time and money on perfect choices",
                  icon: Camera,
                  href: "/try-on"
                },
                {
                  title: "Safe Cosmetics",
                  description: "Check product ingredients for safety with your skin type and avoid potential allergens or irritants",
                  icon: CheckCircle,
                  href: "/check-ingredients"
                }
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Link href={item.href}>
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer group h-[320px]">
                      <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                            <item.icon className="h-8 w-8" style={{ color: '#9A5151' }} />
                          </div>
                          <h3 className="text-xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>{item.title}</h3>
                        </div>
                        <p className="font-light leading-relaxed text-center" style={{ color: 'var(--text-dark)' }}>{item.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>


          </motion.div>
        </div>
      </section>

      {/* AI Features Section */}
      <section ref={servicesRef} className="py-20 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerChildren}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="services-title text-4xl lg:text-5xl font-light mb-6">
                Why Choose GlowGuide?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Unique AI capabilities that help you look perfect every day
              </p>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              className="grid lg:grid-cols-2 gap-12 items-center mb-16"
            >
              <motion.div variants={fadeInUp}>
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  <Image
                    src="/Дизайн без названия.png"
                    alt="AI beauty analysis"
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-light mb-2">AI Analysis in 30 seconds</h3>
                    <p className="text-lg font-light opacity-90">Instant recommendations</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-8">
                {[
                  {
                    icon: Palette,
                    title: "Personal Approach",
                    description: "AI analyzes 127 facial points and selects makeup specifically for your features"
                  },
                  {
                    icon: Heart,
                    title: "Virtual Try-On",
                    description: "Try any look before purchasing — save time and money"
                  },
                  {
                    icon: CheckCircle,
                    title: "Ingredient Safety",
                    description: "We check every ingredient for comedogenicity and allergens"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                      <feature.icon className="h-8 w-8" style={{ color: '#9A5151' }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-light text-gray-800 mb-3">{feature.title}</h3>
                      <p className="text-lg text-gray-600 font-light leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Stats Section */}
            <motion.div variants={fadeInUp} className="grid md:grid-cols-4 gap-8">
              {[
                { number: "200+", label: "Analyses completed", icon: Palette },
                { number: "97%", label: "Matching accuracy", icon: Star },
                { number: "150+", label: "Happy users", icon: User },
                { number: "15 sec", label: "Average analysis time", icon: Sparkles }
              ].map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm rounded-2xl text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-4" style={{ color: '#9A5151' }} />
                    <div className="text-3xl font-light text-gray-800 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-light text-sm">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>


          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="social-title text-4xl lg:text-5xl font-light mb-6">
                Try It Right Now
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Choose a feature and test GlowGuide's capabilities
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: "AI Face Analysis",
                  description: "Upload a photo and get personalized makeup recommendations in 30 seconds",
                  features: ["Face shape detection", "Skin tone analysis", "Shade matching"],
                  buttonText: "Try Analysis",
                  buttonIcon: Camera,
                  href: "/generate-look",
                  color: "rose"
                },
                {
                  title: "Virtual Try-On", 
                  description: "See how any makeup will look on your face",
                  features: ["Makeup overlay", "Different looks", "Save results"],
                  buttonText: "Try Virtual Makeup",
                  buttonIcon: Sparkles,
                  href: "/try-on",
                  color: "purple"
                },
                {
                  title: "Ingredient Checker",
                  description: "Find out if your cosmetics ingredients are safe for your skin",
                  features: ["Comedogenic analysis", "Allergen check", "Recommendations"],
                  buttonText: "Check Ingredients",
                  buttonIcon: Search,
                  href: "/check-ingredients", 
                  color: "green"
                }
              ].map((demo, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden h-full">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="mb-6">
                        <h3 className="text-2xl font-light text-gray-800 mb-4">{demo.title}</h3>
                        <p className="text-gray-600 font-light leading-relaxed mb-6">{demo.description}</p>
                        
                        <ul className="space-y-3 mb-8">
                          {demo.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-3">
                              <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                              <span className="text-gray-600 font-light">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      

                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>


          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-6" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden relative">
                <Image
                  src="/qwerty.png"
                  alt="Natural beauty products with flowers"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-rose-400" />
              </div>
            </motion.div>

            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="services-title text-4xl lg:text-5xl font-light mb-6 leading-tight">
                  We're not just another 
                  <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                    beauty brand
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light mb-8">
                  We believe in creating beauty technology that helps you make your values part of your routine. 
                  Our mission is to empower every woman to express her natural beauty and confidence through innovative solutions.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-20 px-6" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="services-title text-4xl lg:text-5xl font-light mb-6">
                Get in 
                <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                  Touch
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Have questions, feedback, or suggestions? We'd love to hear from you!
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <motion.div variants={fadeInUp} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                    Contact Information
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                        <Phone className="h-6 w-6" style={{ color: '#9A5151' }} />
                      </div>
                      <div>
                        <p className="font-light text-gray-600 text-sm">Phone</p>
                        <p className="font-medium" style={{ color: 'var(--text-dark)' }}>+7 (777) 209 66 32</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                        <Mail className="h-6 w-6" style={{ color: '#9A5151' }} />
                      </div>
                      <div>
                        <p className="font-light text-gray-600 text-sm">Email</p>
                        <p className="font-medium" style={{ color: 'var(--text-dark)' }}>d.bashar@inbox.ru</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                        <User className="h-6 w-6" style={{ color: '#9A5151' }} />
                      </div>
                      <div>
                        <p className="font-light text-gray-600 text-sm">Social</p>
                        <p className="font-medium" style={{ color: 'var(--text-dark)' }}>@driabr</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div variants={fadeInUp}>
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-light mb-6 text-center" style={{ color: 'var(--text-dark)' }}>
                      Send us a Message
                    </h3>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                          Your Name
                        </label>
                        <Input 
                          placeholder="Enter your name"
                          className="rounded-full border-gray-200 focus:border-rose-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                          Email Address
                        </label>
                        <Input 
                          type="email"
                          placeholder="Enter your email"
                          className="rounded-full border-gray-200 focus:border-rose-400"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                          Message Type
                        </label>
                        <select className="w-full rounded-full border border-gray-200 focus:border-rose-400 px-4 py-2 text-sm">
                          <option>General Feedback</option>
                          <option>Bug Report</option>
                          <option>Feature Request</option>
                          <option>Business Inquiry</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                          Your Message
                        </label>
                        <textarea
                          rows={4}
                          placeholder="Tell us what's on your mind..."
                          className="w-full rounded-2xl border border-gray-200 focus:border-rose-400 px-4 py-3 text-sm resize-none"
                        />
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full rounded-full py-3 border-0"
                        style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-light text-gray-800">
                GlowGuide
              </h3>
              <p className="text-gray-600 leading-relaxed font-light">
                Personalized beauty solutions using AI technology for modern women.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-6">Product</h4>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><Link href="/generate-look" className="hover:text-rose-400 transition-colors">Face Analysis</Link></li>
                <li><Link href="/try-on" className="hover:text-rose-400 transition-colors">Virtual Try-On</Link></li>
                <li><Link href="/check-ingredients" className="hover:text-rose-400 transition-colors">Ingredient Check</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-6">Company</h4>
              <ul className="space-y-3 text-gray-600 font-light">
                <li><Link href="/about" className="hover:text-rose-400 transition-colors">About Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-6">Support</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-rose-400" />
                  <span className="text-gray-600 font-light">+7 (777) 209 66 32</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-rose-400" />
                  <span className="text-gray-600 font-light">d.bashar@inbox.ru</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-rose-200 mt-12 pt-8 text-center text-gray-500 font-light">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p>&copy; 2024 GlowGuide. All rights reserved.</p>
              <div className="flex space-x-4 mt-4 sm:mt-0">
                <button 
                  onClick={() => setShowTerms(true)}
                  className="hover:text-rose-400 transition-colors text-sm"
                >
                  Terms of Service
                </button>
                <button 
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-rose-400 transition-colors text-sm"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: showChat ? 0 : 1 }}
        transition={{ duration: 0.3, type: "spring" }}
        className="fixed z-50"
        style={{ 
          left: `${chatPosition.x}px`, 
          top: `${chatPosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'none',
          pointerEvents: showChat ? 'none' : 'auto'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseEnter={() => {
          if (!hasHovered) {
            setHasHovered(true);
            setTimeout(() => setShowTooltip(false), 3000);
          }
        }}
      >
        <Button
          onClick={(e) => {
            e.stopPropagation();
            setShowChat(!showChat);
          }}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 border-0 relative group"
          style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Pulse animation */}
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: 'var(--btn-color)' }}></div>
          
          {/* One-time tooltip */}
          {showTooltip && !hasHovered && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Drag to move
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
            </div>
          )}
          
          
        </Button>
      </motion.div>

      {/* Chat Widget */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed z-40 bg-white rounded-2xl shadow-2xl w-80 h-96 overflow-hidden"
          style={{
            left: `${typeof window !== 'undefined' ? Math.max(20, Math.min(window.innerWidth - 340, chatPosition.x - 160)) : chatPosition.x - 160}px`,
            top: `${typeof window !== 'undefined' ? Math.max(20, Math.min(window.innerHeight - 420, chatPosition.y - 210)) : chatPosition.y - 210}px`
          }}
        >
          {/* Chat Header */}
          <div 
            className="p-4 flex items-center justify-between cursor-move"
            style={{ backgroundColor: 'rgba(217, 183, 131, 0.3)' }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--btn-color)' }}>
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: 'var(--text-dark)' }}>AI Beauty Assistant</h3>
                <p className="text-xs text-gray-600">Online now • Drag to move</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChat(false);
              }}
              className="transition-colors hover:bg-white/20 rounded-full p-1"
              style={{ color: 'var(--text-dark)' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-64 overflow-y-auto" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="space-y-4">
              {/* Welcome Message (only if no chat messages) */}
              {chatMessages.length === 0 && (
                <>
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.3)' }}>
                      <Sparkles className="h-4 w-4" style={{ color: 'var(--btn-color)' }} />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[250px]">
                      <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                        Hi! I'm your AI beauty assistant. I can help you with:
                      </p>
                      <ul className="text-xs text-gray-600 mt-2 space-y-1">
                        <li>• Personalized makeup recommendations</li>
                        <li>• Ingredient safety analysis</li>
                        <li>• Virtual try-on guidance</li>
                        <li>• Skincare advice</li>
                      </ul>
                    </div>
                  </div>

                  {/* Welcome buttons */}
                  <div className="space-y-2 ml-10">
                    <Link href="/generate-look">
                      <Button
                        size="sm"
                        className="rounded-full text-xs border-0 w-full font-light"
                        style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)', color: 'var(--text-dark)' }}
                      >
                        🎨 Get Beauty Analysis
                      </Button>
                    </Link>
                    <Link href="/try-on">
                      <Button
                        size="sm"
                        className="rounded-full text-xs border-0 w-full font-light"
                        style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)', color: 'var(--text-dark)' }}
                      >
                        ✨ Try Virtual Makeup
                      </Button>
                    </Link>
                    <Link href="/check-ingredients">
                      <Button
                        size="sm"
                        className="rounded-full text-xs border-0 w-full font-light"
                        style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)', color: 'var(--text-dark)' }}
                      >
                        🔍 Check Ingredients
                      </Button>
                    </Link>
                  </div>
                </>
              )}

              {/* Chat History */}
              {chatMessages.map((message, index) => (
                <div key={index} className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-gray-100' 
                      : ''
                  }`} style={{ backgroundColor: message.role === 'assistant' ? 'rgba(217, 183, 131, 0.3)' : 'var(--bg-medium)' }}>
                    {message.role === 'assistant' ? (
                      <Sparkles className="h-4 w-4" style={{ color: 'var(--btn-color)' }} />
                    ) : (
                      <User className="h-4 w-4" style={{ color: 'var(--btn-color)' }} />
                    )}
                  </div>
                  <div className={`rounded-2xl p-3 shadow-sm max-w-[250px] ${
                    message.role === 'user' 
                      ? 'rounded-tr-sm' 
                      : 'bg-white rounded-tl-sm'
                  }`} style={{ backgroundColor: message.role === 'user' ? 'var(--btn-color)' : 'white' }}>
                    <p className="text-sm" style={{ color: message.role === 'user' ? 'white' : 'var(--text-dark)' }}>
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoadingChat && (
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.3)' }}>
                    <Sparkles className="h-4 w-4" style={{ color: 'var(--btn-color)' }} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
                placeholder="Ask me anything about beauty..."
                disabled={isLoadingChat}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-50"
              />
              <Button
                size="sm"
                onClick={sendChatMessage}
                disabled={isLoadingChat || !chatInput.trim()}
                className="rounded-full px-4 border-0 font-light disabled:opacity-50"
                style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
              >
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
