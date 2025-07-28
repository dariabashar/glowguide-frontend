"use client";

import { useState } from "react";
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
  CheckCircle,
  Heart,
  AlertCircle,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Loader2
} from "lucide-react";

// Interface for API response
interface AnalysisResult {
  image_url: string;
  prompt: string;
  spec: {
    foundation?: string | { tone: string; undertone: string; coverage: string };
    concealer?: string | { shade: string; coverage: string };
    powder?: string | { type: string; finish: string };
    blush?: string | { shade: string; placement: string };
    bronzer?: string | { shade: string; placement: string };
    highlighter?: string | { shade: string; placement: string };
    eyeshadow?: string | { colors: string; style: string };
    eyeliner?: string | { type: string; style: string };
    mascara?: string | { type: string; effect: string };
    lipstick?: string | { shade: string; finish: string };
    lip_liner?: string | { shade: string };
    eyebrow?: string | { product: string; style: string };
  };
}

export default function GenerateLookPage() {
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size too large. Please choose a file under 10MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }

      setError(null);
      setUploadedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!uploadedFile) {
      setError('Please upload a photo first.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('lang', 'en'); // Default language

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-look`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResults(data);
        setShowResults(true);
        setIsSaved(false); // Reset saved state for new result
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

  const saveResult = async () => {
    if (!analysisResults) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('Please sign in to save results');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/save-result`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'generate-look',
          title: 'AI Generated Look',
          image_url: analysisResults.image_url,
          prompt: analysisResults.prompt,
          spec: analysisResults.spec
        })
      });

      if (response.ok) {
        setIsSaved(true);
        setError(null);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to save result');
      }
    } catch (error) {
      console.error('Error saving result:', error);
      setError('Failed to save result');
    } finally {
      setIsSaving(false);
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
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" style={{ color: 'var(--text-dark)' }} />
            <span className="font-light" style={{ color: 'var(--text-dark)' }}>Back to Home</span>
          </Link>
          
          <h1 className="text-2xl font-light tracking-wider" style={{ color: 'var(--text-dark)' }}>
            GlowGuide
          </h1>
          
          <div className="w-32"></div>
        </div>
      </nav>

      {/* Main Content - Two Column Layout */}
      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]"
          >
            {/* Left Column - Text Content */}
            <motion.div variants={fadeInLeft} className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-6xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                  AI Face 
                  <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                    Analysis
                  </span>
                </h1>
                <p className="text-xl text-gray-600 font-light leading-relaxed mb-8">
                  Upload your photo and get personalized makeup recommendations based on AI analysis 
                  of your unique facial features and skin tone.
                </p>
              </div>

              {!showResults && (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.3)' }}>
                      <Camera className="h-4 w-4" style={{ color: '#9A5151' }} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2" style={{ color: 'var(--text-dark)' }}>Smart Photo Analysis</h3>
                      <p className="text-gray-600 font-light">Our AI analyzes 127+ facial features to determine your perfect color palette</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.3)' }}>
                      <Sparkles className="h-4 w-4" style={{ color: '#9A5151' }} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2" style={{ color: 'var(--text-dark)' }}>Personalized Recommendations</h3>
                      <p className="text-gray-600 font-light">Get curated product suggestions that match your skin tone and style preferences</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.3)' }}>
                      <Heart className="h-4 w-4" style={{ color: '#9A5151' }} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2" style={{ color: 'var(--text-dark)' }}>Instant Results</h3>
                      <p className="text-gray-600 font-light">Receive your personalized makeup look in under 30 seconds</p>
                    </div>
                  </div>
                </div>
              )}

              {showResults && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <CheckCircle className="h-8 w-8" style={{ color: '#9A5151' }} />
                    <h2 className="text-2xl font-light" style={{ color: 'var(--text-dark)' }}>
                      Your Perfect Look is Ready!
                    </h2>
                  </div>
                  <p className="text-gray-600 font-light mb-6">
                    We&apos;ve analyzed your features and curated the perfect makeup recommendations for you.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>✨ Foundation: Warm Beige</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>🌸 Blush: Peach Coral</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>💋 Lipstick: Nude Pink</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Interactive Area */}
            <motion.div variants={fadeInRight} className="flex items-center justify-center">
              {!uploadedPhoto && !isAnalyzing && !showResults && (
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden w-full max-w-md">
                  <CardContent className="p-8">
                    <div 
                      className="aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center hover:opacity-80 transition-opacity cursor-pointer"
                      style={{ borderColor: 'rgba(217, 183, 131, 0.5)' }}
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Camera className="h-16 w-16 mb-4" style={{ color: '#9A5151' }} />
                      <h3 className="text-lg font-light mb-2" style={{ color: 'var(--text-dark)' }}>Upload Your Photo</h3>
                      <p className="text-sm font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                        Take a selfie in good lighting without makeup
                      </p>
                      <Button 
                        className="rounded-full px-8 border-0"
                        style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Photo
                      </Button>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              )}

              {uploadedPhoto && !isAnalyzing && !showResults && (
                <Card className="border-0 shadow-lg rounded-3xl overflow-hidden w-full max-w-md">
                  <CardContent className="p-0">
                    <div className="aspect-square relative">
                      <Image
                        src={uploadedPhoto}
                        alt="Uploaded photo"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 text-center">
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-red-600 mb-2">{error}</p>
                              <p className="text-sm text-red-500">
                                AI can sometimes have issues. Try again or upload a different photo.
                              </p>
                              <Button 
                                onClick={startAnalysis}
                                disabled={isAnalyzing}
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
                      <h3 className="text-lg font-light mb-4" style={{ color: 'var(--text-dark)' }}>Perfect Photo!</h3>
                      
                      {/* Info Note */}
                      <div className="rounded-lg p-3 mb-4" style={{ backgroundColor: 'rgba(217, 183, 131, 0.1)', border: '1px solid rgba(217, 183, 131, 0.3)' }}>
                        <div className="flex items-start space-x-2">
                          <Sparkles className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--btn-color)' }} />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                              AI Tip
                            </p>
                            <p className="text-sm" style={{ color: 'var(--text-dark)' }}>
                              If analysis fails on the first try, try again. AI can sometimes have issues with photo quality.
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={startAnalysis}
                        disabled={!uploadedFile}
                        className="w-full rounded-full py-3 border-0 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Look
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isAnalyzing && (
                <div className="text-center w-full max-w-md">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 mx-auto mb-6"
                  >
                    <Sparkles className="h-20 w-20" style={{ color: '#9A5151' }} />
                  </motion.div>
                  <h3 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
                    Analyzing Your Features
                  </h3>
                  <p className="text-gray-600 font-light">
                    Please wait while our AI analyzes your skin tone and facial features...
                  </p>
                </div>
              )}

              {showResults && analysisResults && (
                <div className="w-full max-w-md space-y-4">
                  {/* Generated AI Image */}
                  <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative">
                        <Image
                          src={analysisResults.image_url}
                          alt="AI Generated Look"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                          Your AI Generated Look
                        </h3>
                        <p className="text-sm text-gray-600">
                          Personalized makeup based on your features
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Makeup Specifications */}
                  {analysisResults.spec && (
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50">
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-3 flex items-center" style={{ color: 'var(--text-dark)' }}>
                          <Sparkles className="h-4 w-4 mr-2" style={{ color: 'var(--btn-color)' }} />
                          Makeup Specifications
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>Foundation</h4>
                            <span className="text-sm text-gray-600">
                              {typeof analysisResults.spec.foundation === 'string' 
                                ? analysisResults.spec.foundation 
                                : `${analysisResults.spec.foundation?.tone || ''} ${analysisResults.spec.foundation?.undertone || ''} ${analysisResults.spec.foundation?.coverage || ''}`.trim()
                              }
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>Blush</h4>
                            <span className="text-sm text-gray-600">
                              {typeof analysisResults.spec.blush === 'string' 
                                ? analysisResults.spec.blush 
                                : `${analysisResults.spec.blush?.shade || ''} (${analysisResults.spec.blush?.placement || ''})`.trim()
                              }
                            </span>
                          </div>

                          {analysisResults.spec.lipstick && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--text-dark)' }}>Lipstick:</span>
                              <span style={{ color: '#9A5151' }}>
                                {typeof analysisResults.spec.lipstick === 'string' 
                                  ? analysisResults.spec.lipstick 
                                  : `${analysisResults.spec.lipstick.shade || ''} ${analysisResults.spec.lipstick.finish || ''}`.trim()
                                }
                              </span>
                            </div>
                          )}
                          {analysisResults.spec.eyeshadow && (
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--text-dark)' }}>Eyeshadow:</span>
                              <span style={{ color: '#9A5151' }}>
                                {typeof analysisResults.spec.eyeshadow === 'string' 
                                  ? analysisResults.spec.eyeshadow 
                                  : `${analysisResults.spec.eyeshadow.colors || ''} ${analysisResults.spec.eyeshadow.style || ''}`.trim()
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={saveResult}
                      disabled={isSaving || isSaved}
                      className="w-full rounded-full py-3 border-0 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : isSaved ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save Result
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        setShowResults(false);
                        setUploadedPhoto(null);
                        setUploadedFile(null);
                        setAnalysisResults(null);
                        setError(null);
                        setIsSaved(false);
                      }}
                      className="w-full rounded-full py-3 border border-gray-300 bg-white hover:bg-gray-50"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      Try Another Photo
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 