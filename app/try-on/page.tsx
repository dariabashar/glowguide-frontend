"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  Palette,
  CheckCircle,
  Mail,
  Phone,
  MessageCircle,
  X,
  AlertCircle
} from "lucide-react";

// Interface for API response
interface TryOnResult {
  image_url: string;
  prompt_used: string;
}

export default function TryOnPage() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [makeupPhoto, setMakeupPhoto] = useState<string | null>(null);
  const [makeupFile, setMakeupFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(true);
  const [hasHovered, setHasHovered] = useState(false);

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

  const handleUserPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('User photo file size too large. Please choose a file under 10MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for user photo.');
        return;
      }

      setError(null);
      setUserFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMakeupPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Makeup reference file size too large. Please choose a file under 10MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for makeup reference.');
        return;
      }

      setError(null);
      setMakeupFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setMakeupPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startTryOn = async () => {
    if (!userFile || !makeupFile) {
      setError('Please upload both user photo and makeup reference.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('user_photo', userFile);
      formData.append('makeup_reference', makeupFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/try-on`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        const errorData = await response.json();
        setError(`Try-on failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during try-on:', error);
      setError('Failed to connect to the try-on service. Please try again.');
    } finally {
      setIsProcessing(false);
    }
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

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-light)' }}>
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4" style={{ backgroundColor: 'rgba(243, 237, 229, 0.95)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 transition-colors font-light" style={{ color: 'var(--text-dark)' }}>
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          
          <h1 className="text-2xl font-light tracking-wider" style={{ color: 'var(--text-dark)' }}>
            GlowGuide
          </h1>
          
          <div className="w-32"></div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="grid lg:grid-cols-2 gap-12 items-start"
          >
            {/* Left Column - Content */}
            <motion.div variants={fadeInLeft} className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-light leading-tight mb-6" style={{ color: 'var(--text-dark)' }}>
                  Virtual Makeup 
                  <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                    Try-On
                  </span>
                </h1>
                <p className="text-lg leading-relaxed mb-8 font-light" style={{ color: 'var(--text-dark)' }}>
                  Upload your photo and a makeup reference to see how different looks will appear on you instantly.
                </p>
              </div>

              {!result && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
                    Why Choose Virtual Try-On?
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "See makeup looks before purchasing",
                      "Try unlimited styles instantly", 
                      "Save time and money on shopping",
                      "Perfect for special occasions",
                      "AI-powered realistic results"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--btn-color)' }} />
                        <span className="font-light" style={{ color: 'var(--text-dark)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
                    Perfect Match!
                  </h2>
                  <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-dark)' }}>
                    Your virtual makeup try-on is complete. The look has been perfectly adapted to your facial features using AI technology.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      className="rounded-full px-6 py-2 font-light border-0"
                      style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full px-6 py-2 font-light"
                      style={{ borderColor: 'var(--btn-color)', color: 'var(--btn-color)' }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Interactive Area */}
            <motion.div variants={fadeInRight} className="space-y-4">
              {!result && !isProcessing && (
                <>
                  {/* Photo Upload Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    {/* User Photo Upload */}
                    <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-light mb-4 text-center" style={{ color: 'var(--text-dark)' }}>
                          Your Photo
                        </h3>
                        {!userPhoto ? (
                          <div 
                            className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                            style={{ borderColor: 'var(--btn-color)', opacity: 0.3 }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
                            onClick={() => document.getElementById('user-photo-upload')?.click()}
                          >
                            <Camera className="h-12 w-12 mb-3" style={{ color: 'var(--btn-color)' }} />
                            <p className="text-sm font-light mb-3" style={{ color: 'var(--text-dark)' }}>
                              Upload your selfie
                            </p>
                            <Button 
                              size="sm"
                              className="rounded-full px-4 py-1 text-sm font-light border-0"
                              style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Choose
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="aspect-video relative rounded-xl overflow-hidden">
                              <Image
                                src={userPhoto}
                                alt="User photo"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button 
                              onClick={() => {
                                setUserPhoto(null);
                                setUserFile(null);
                                setError(null);
                              }}
                              variant="outline" 
                              size="sm"
                              className="w-full rounded-full text-sm font-light"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Replace
                            </Button>
                          </div>
                        )}
                        <input
                          id="user-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleUserPhotoUpload}
                          className="hidden"
                        />
                      </CardContent>
                    </Card>

                    {/* Makeup Photo Upload */}
                    <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="p-4">
                        <h3 className="text-lg font-light mb-4 text-center" style={{ color: 'var(--text-dark)' }}>
                          Makeup Reference
                        </h3>
                        {!makeupPhoto ? (
                          <div 
                            className="aspect-video border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                            style={{ borderColor: 'var(--btn-color)', opacity: 0.3 }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.3'}
                            onClick={() => document.getElementById('makeup-photo-upload')?.click()}
                          >
                            <Palette className="h-12 w-12 mb-3" style={{ color: 'var(--btn-color)' }} />
                            <p className="text-sm font-light mb-3" style={{ color: 'var(--text-dark)' }}>
                              Upload makeup look
                            </p>
                            <Button 
                              size="sm"
                              className="rounded-full px-4 py-1 text-sm font-light border-0"
                              style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Choose
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="aspect-video relative rounded-xl overflow-hidden">
                              <Image
                                src={makeupPhoto}
                                alt="Makeup reference"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button 
                              onClick={() => {
                                setMakeupPhoto(null);
                                setMakeupFile(null);
                                setError(null);
                              }}
                              variant="outline" 
                              size="sm"
                              className="w-full rounded-full text-sm font-light"
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Replace
                            </Button>
                          </div>
                        )}
                        <input
                          id="makeup-photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleMakeupPhotoUpload}
                          className="hidden"
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-red-600 mb-2">{error}</p>
                          <p className="text-sm text-red-500">
                            AI can sometimes have issues. Try again or upload different photos.
                          </p>
                          <Button 
                            onClick={startTryOn}
                            disabled={isProcessing}
                            size="sm"
                            className="mt-2 rounded-full px-3 py-1 text-xs font-light border-0 disabled:opacity-50"
                            style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Try Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Try On Button */}
                  {userPhoto && makeupPhoto && (
                    <div className="text-center space-y-3">
                      {/* Info Note */}
                      <div className="rounded-lg p-3" style={{ backgroundColor: 'rgba(217, 183, 131, 0.1)', border: '1px solid rgba(217, 183, 131, 0.3)' }}>
                        <div className="flex items-start space-x-2">
                          <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--btn-color)' }} />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                              AI Tip
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                              If generation fails on the first try, try again. AI can sometimes have issues with complex images.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={startTryOn}
                        disabled={!userFile || !makeupFile || isProcessing}
                        size="lg"
                        className="rounded-full px-8 py-3 text-lg font-light border-0 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        {isProcessing ? 'Processing...' : 'Try Makeup'}
                      </Button>
                    </div>
                  )}


                </>
              )}

              {/* Processing Animation */}
              {isProcessing && (
                <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-20 h-20 mx-auto mb-6"
                    >
                      <Sparkles className="h-20 w-20" style={{ color: 'var(--btn-color)' }} />
                    </motion.div>
                    <h3 className="text-xl font-light mb-3" style={{ color: 'var(--text-dark)' }}>
                      Applying Makeup...
                    </h3>
                    <p className="text-sm font-light" style={{ color: 'var(--text-dark)' }}>
                      AI is analyzing your features
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Result */}
              {result && (
                <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-light mb-4 text-center" style={{ color: 'var(--text-dark)' }}>
                      Your Result
                    </h3>
                    <div className="aspect-square relative rounded-xl overflow-hidden mb-4">
                      <Image
                        src={result.image_url}
                        alt="Try-on result"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => {
                          setUserPhoto(null);
                          setUserFile(null);
                          setMakeupPhoto(null);
                          setMakeupFile(null);
                          setResult(null);
                          setError(null);
                        }}
                        variant="outline" 
                        size="sm"
                        className="rounded-full text-sm font-light"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Try Again
                      </Button>
                      <Link href="/generate-look">
                        <Button 
                          size="sm"
                          className="w-full rounded-full text-sm font-light border-0"
                          style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Get Recommendations
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                    <Phone className="h-4 w-4" style={{ color: '#9A5151' }} />
                  </div>
                  <span className="text-gray-600 font-light">+7 (777) 209 66 32</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                    <Mail className="h-4 w-4" style={{ color: '#9A5151' }} />
                  </div>
                  <span className="text-gray-600 font-light">d.bashar@inbox.ru</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-rose-200 mt-12 pt-8 text-center text-gray-500 font-light">
            <p>&copy; 2024 GlowGuide. All rights reserved.</p>
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
          className="fixed z-40 bg-white rounded-2xl shadow-2xl w-80 h-96 overflow-hidden"
          style={{
            left: `${typeof window !== 'undefined' ? Math.max(20, Math.min(window.innerWidth - 340, chatPosition.x - 160)) : chatPosition.x - 160}px`,
            top: `${typeof window !== 'undefined' ? Math.max(20, Math.min(window.innerHeight - 420, chatPosition.y - 210)) : chatPosition.y - 210}px`
          }}
        >
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
          <div className="p-4 h-64 overflow-y-auto" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                Hi! Need help with virtual try-on? I can assist with uploading photos, choosing looks, and getting the best results!
              </p>
            </div>
          </div>
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about virtual try-on..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <Button size="sm" className="rounded-full px-4 border-0 font-light" style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}>
                Send
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 