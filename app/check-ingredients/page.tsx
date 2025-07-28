"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Sparkles,
  Camera,
  Book,
  Heart,
  Info,
  MessageCircle,
  X,
  AlertCircle
} from "lucide-react";

// Interface for API response
interface IngredientNote {
  name: string;
  level?: number;
  description: string;
}

interface IngredientCheckResult {
  comedogenic: IngredientNote[];
  safe: IngredientNote[];
  unknown: IngredientNote[];
}

export default function CheckIngredientsPage() {
  const [ingredients, setIngredients] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<IngredientCheckResult | null>(null);
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

  const analyzeIngredients = async () => {
    if (!ingredients.trim()) {
      setError('Please enter ingredients to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-ingredients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input_text: ingredients.trim() 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        const errorData = await response.json();
        setError(`Analysis failed: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setError('Failed to connect to the analysis service. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const scanFromPhoto = () => {
    document.getElementById('photo-upload')?.click();
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
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
                  Ingredient 
                  <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                    Checker
                  </span>
                </h1>
                <p className="text-lg leading-relaxed mb-8 font-light" style={{ color: 'var(--text-dark)' }}>
                  Check if your cosmetic ingredients are safe. We analyze each component for comedogenicity and potential allergens.
                </p>
              </div>

              {!results && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
                    What We Check
                  </h2>
                  <ul className="space-y-4">
                    {[
                      "Safe ingredients for all skin types",
                      "Comedogenic analysis and pore-clogging risks", 
                      "Allergen identification and warnings",
                      "Skin sensitivity recommendations",
                      "Professional ingredient database"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--btn-color)' }} />
                        <span className="font-light" style={{ color: 'var(--text-dark)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
                    Analysis Complete!
                  </h2>
                  <p className="text-lg font-light leading-relaxed" style={{ color: 'var(--text-dark)' }}>
                    We've analyzed your ingredients and identified potential concerns and safe components.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => {
                        setIngredients("");
                        setResults(null);
                        setError(null);
                      }}
                      className="rounded-full px-6 py-2 font-light border-0"
                      style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Check Another
                    </Button>
                    <Button 
                      variant="outline" 
                      className="rounded-full px-6 py-2 font-light"
                      style={{ borderColor: 'var(--btn-color)', color: 'var(--btn-color)' }}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Save Results
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Interactive Area */}
            <motion.div variants={fadeInRight} className="space-y-4">
              {!results && !isAnalyzing && (
                <>
                  {/* Input Section */}
                  <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-light mb-4 text-center" style={{ color: 'var(--text-dark)' }}>
                        Enter Ingredients
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block font-light mb-2 text-sm" style={{ color: 'var(--text-dark)' }}>
                            Product Name (optional)
                          </label>
                          <Input 
                            placeholder="e.g., Moisturizing Face Cream"
                            className="rounded-full border-gray-200 focus:border-rose-400"
                          />
                        </div>
                        
                        <div>
                          <label className="block font-light mb-2 text-sm" style={{ color: 'var(--text-dark)' }}>
                            Ingredients List
                          </label>
                          <Textarea
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder="Copy the full ingredient list from the package or enter ingredients separated by commas..."
                            rows={4}
                            className="rounded-2xl border-gray-200 focus:border-rose-400 resize-none"
                          />
                        </div>
                        
                        {/* Error Display */}
                        {error && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <div className="flex items-start space-x-2">
                              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm text-red-600 mb-2">{error}</p>
                                <p className="text-sm text-red-500">
                                  AI can sometimes have issues. Try again or check your input.
                                </p>
                                <Button 
                                  onClick={analyzeIngredients}
                                  disabled={isAnalyzing}
                                  size="sm"
                                  className="mt-2 rounded-full px-3 py-1 text-xs font-light border-0 disabled:opacity-50"
                                  style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                                >
                                  <Search className="h-3 w-3 mr-1" />
                                  Try Again
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <Button 
                            onClick={analyzeIngredients}
                            disabled={!ingredients.trim() || isAnalyzing}
                            className="w-full rounded-full py-2 font-light border-0 disabled:opacity-50"
                            style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            {isAnalyzing ? "Analyzing..." : "Check Ingredients"}
                          </Button>
                          
                          <Button 
                            onClick={scanFromPhoto}
                            variant="outline"
                            className="w-full rounded-full py-2 font-light"
                            style={{ borderColor: 'var(--btn-color)', color: 'var(--btn-color)' }}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Scan from Photo
                          </Button>
                        </div>
                      </div>
                      
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </CardContent>
                  </Card>

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 gap-3">
                    <Card className="border-0 shadow-sm rounded-xl">
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--btn-color)' }} />
                        <h4 className="font-light text-sm mb-1" style={{ color: 'var(--text-dark)' }}>Safe Ingredients</h4>
                        <p className="text-xs font-light" style={{ color: 'var(--text-dark)' }}>
                          Non-comedogenic and suitable for all skin types
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm rounded-xl">
                      <CardContent className="p-4 text-center">
                        <AlertTriangle className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--btn-color)' }} />
                        <h4 className="font-light text-sm mb-1" style={{ color: 'var(--text-dark)' }}>Comedogenic</h4>
                        <p className="text-xs font-light" style={{ color: 'var(--text-dark)' }}>
                          May clog pores, especially for oily skin
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-0 shadow-sm rounded-xl">
                      <CardContent className="p-4 text-center">
                        <Info className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--btn-color)' }} />
                        <h4 className="font-light text-sm mb-1" style={{ color: 'var(--text-dark)' }}>Requires Attention</h4>
                        <p className="text-xs font-light" style={{ color: 'var(--text-dark)' }}>
                          May cause reactions in sensitive skin
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Analysis Animation */}
              {isAnalyzing && (
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
                      Analyzing Ingredients...
                    </h3>
                    <p className="text-sm font-light" style={{ color: 'var(--text-dark)' }}>
                      Checking each component for safety
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {results && (
                <div className="space-y-4">
                  {/* Comedogenic Ingredients */}
                  {results.comedogenic.length > 0 && (
                    <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <AlertTriangle className="h-5 w-5 mr-2" style={{ color: 'var(--btn-color)' }} />
                          <h3 className="text-lg font-light" style={{ color: 'var(--text-dark)' }}>
                            Comedogenic ({results.comedogenic.length})
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {results.comedogenic.map((ingredient: IngredientNote, index: number) => (
                            <div key={index} className="p-3 bg-rose-50 rounded-xl">
                              <h4 className="font-medium text-sm" style={{ color: 'var(--text-dark)' }}>{ingredient.name}</h4>
                              <p className="text-xs font-light mb-1" style={{ color: 'var(--text-dark)' }}>{ingredient.description}</p>
                              <span className="text-xs font-medium" style={{ color: 'var(--btn-color)' }}>
                                Level: {ingredient.level}/5
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Safe Ingredients */}
                  {results.safe.length > 0 && (
                    <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <CheckCircle className="h-5 w-5 mr-2" style={{ color: 'var(--btn-color)' }} />
                          <h3 className="text-lg font-light" style={{ color: 'var(--text-dark)' }}>
                            Safe ({results.safe.length})
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {results.safe.map((ingredient: IngredientNote, index: number) => (
                            <div key={index} className="p-3 bg-green-50 rounded-xl">
                              <h4 className="font-medium text-sm" style={{ color: 'var(--text-dark)' }}>{ingredient.name}</h4>
                              <p className="text-xs font-light" style={{ color: 'var(--text-dark)' }}>{ingredient.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Unknown/Caution Ingredients */}
                  {results.unknown.length > 0 && (
                    <Card className="border-0 shadow-md rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          <Info className="h-5 w-5 mr-2" style={{ color: 'var(--btn-color)' }} />
                          <h3 className="text-lg font-light" style={{ color: 'var(--text-dark)' }}>
                            Requires Attention ({results.unknown.length})
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {results.unknown.map((ingredient: IngredientNote, index: number) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-xl">
                              <h4 className="font-medium text-sm" style={{ color: 'var(--text-dark)' }}>{ingredient.name}</h4>
                              <p className="text-xs font-light" style={{ color: 'var(--text-dark)' }}>{ingredient.description}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <Link href="/about" className="font-light text-sm" style={{ color: 'var(--text-dark)' }}>
              About Us
            </Link>
            <a href="#contact" className="font-light text-sm" style={{ color: 'var(--text-dark)' }}>
              Contact
            </a>
            <div className="flex space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                <Heart className="h-4 w-4" style={{ color: 'var(--btn-color)' }} />
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                <Book className="h-4 w-4" style={{ color: 'var(--btn-color)' }} />
              </div>
            </div>
          </div>
          <p className="text-gray-500 font-light text-sm">&copy; 2024 GlowGuide. All rights reserved.</p>
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
                Hi! I can help you understand ingredient safety, check for comedogenic risks, and answer questions about cosmetic formulations.
              </p>
            </div>
          </div>
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask about ingredients..."
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