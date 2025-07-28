"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  User, 
  Lock, 
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  X,
  Sparkles
} from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setError('Please agree to Terms of Service and Privacy Policy.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('access_token', data.access_token);
        setSuccess('Account created successfully! Redirecting to dashboard...');
        // Reset form
        setFormData({
          username: "",
          password: "",
          agreeToTerms: false
        });
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setError(data.detail || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Failed to connect to the registration service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-light)' }}>
            {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-3"  style={{ backgroundColor: 'rgba(243, 237, 229, 0.95)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
                      <Link href="/" className="flex items-center space-x-2 transition-colors" style={{ color: 'var(--text-dark)' }}>
              <ArrowLeft className="h-5 w-5" />
              <span className="font-light">Back</span>
            </Link>
            
            <h1 className="text-2xl font-light tracking-wider" style={{ color: 'var(--text-dark)' }}>
              GlowGuide
            </h1>
          
          <Link href="/login" className="transition-colors font-light" style={{ color: 'var(--text-dark)' }}>
            Sign In
          </Link>
        </div>
      </nav>

      <div className="min-h-screen flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Hero Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="space-y-8"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
                <Sparkles className="h-8 w-8" style={{ color: 'var(--btn-color)' }} />
              </div>
              <h1 className="text-4xl lg:text-6xl font-light" style={{ color: 'var(--text-dark)' }}>
                Welcome to 
                <span className="block font-extralight italic" style={{ color: 'var(--btn-color)' }}>
                  GlowGuide
                </span>
              </h1>
              <p className="text-xl font-light leading-relaxed" style={{ color: 'var(--text-dark)' }}>
                Create an account and get access to personalized beauty recommendations
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 gap-4 mt-8">
                {[
                  "Personalized makeup recommendations",
                  "Virtual try-on of looks", 
                  "Product ingredient checking",
                  "Save your favorite looks"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--btn-color)' }} />
                    <span className="font-light" style={{ color: 'var(--text-dark)' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-md mx-auto w-full"
            >
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Success Display */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <p className="text-sm text-green-600">{success}</p>
                    </div>
                  </div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <label className="block font-light text-sm" style={{ color: 'var(--text-dark)' }}>
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-dark)' }} />
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="rounded-full pl-10"
                      style={{ 
                        borderColor: 'var(--bg-medium)', 
                        backgroundColor: 'var(--bg-light)',
                        color: 'var(--text-dark)'
                      }}
                      placeholder="annasmith"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block font-light text-sm" style={{ color: 'var(--text-dark)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-dark)' }} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="rounded-full pl-10 pr-10"
                      style={{ 
                        borderColor: 'var(--bg-medium)', 
                        backgroundColor: 'var(--bg-light)',
                        color: 'var(--text-dark)'
                      }}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70"
                      style={{ color: 'var(--text-dark)' }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>



                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                    className="mt-1 rounded"
                    style={{ 
                      borderColor: 'var(--bg-medium)',
                      accentColor: 'var(--btn-color)'
                    }}
                    required
                  />
                  <label htmlFor="terms" className="text-sm font-light leading-relaxed" style={{ color: 'var(--text-dark)' }}>
                    I agree to{" "}
                    <button 
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="underline hover:no-underline" 
                      style={{ color: 'var(--btn-color)' }}
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button 
                      type="button"
                      onClick={() => setShowPrivacy(true)}
                      className="underline hover:no-underline" 
                      style={{ color: 'var(--btn-color)' }}
                    >
                      Privacy Policy
                    </button>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full py-3 text-lg font-light border-0 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>



              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="font-light" style={{ color: 'var(--text-dark)' }}>
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--btn-color)' }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" style={{ color: 'var(--btn-color)' }} />
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-dark)' }}>
                  Terms of Service
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                  className="px-3 py-1 rounded-full text-sm border"
                  style={{ 
                    borderColor: 'var(--bg-medium)', 
                    color: 'var(--text-dark)',
                    backgroundColor: 'var(--bg-light)'
                  }}
                >
                  {language === 'en' ? 'RU' : 'EN'}
                </button>
                <button
                  onClick={() => setShowTerms(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" style={{ color: 'var(--text-dark)' }} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {language === 'en' ? (
                <div className="space-y-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                  <h3 className="font-semibold text-lg">Terms of Service</h3>
                  <p>Welcome to GlowGuide. By using our service, you agree to these terms.</p>
                  
                  <h4 className="font-semibold">1. Service Description</h4>
                  <p>GlowGuide provides AI-powered beauty analysis, virtual try-on, and ingredient checking services.</p>
                  
                  <h4 className="font-semibold">2. User Responsibilities</h4>
                  <p>You are responsible for providing accurate information and using the service appropriately.</p>
                  
                  <h4 className="font-semibold">3. Privacy</h4>
                  <p>Your privacy is important to us. Please review our Privacy Policy for details on data handling.</p>
                  
                  <h4 className="font-semibold">4. Limitations</h4>
                  <p>AI results are for entertainment purposes and should not replace professional advice.</p>
                  
                  <h4 className="font-semibold">5. Changes</h4>
                  <p>We may update these terms. Continued use constitutes acceptance of changes.</p>
                </div>
              ) : (
                <div className="space-y-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                  <h3 className="font-semibold text-lg">Условия использования</h3>
                  <p>Добро пожаловать в GlowGuide. Используя наш сервис, вы соглашаетесь с этими условиями.</p>
                  
                  <h4 className="font-semibold">1. Описание сервиса</h4>
                  <p>GlowGuide предоставляет услуги анализа красоты на основе ИИ, виртуальной примерки и проверки ингредиентов.</p>
                  
                  <h4 className="font-semibold">2. Обязанности пользователя</h4>
                  <p>Вы несете ответственность за предоставление точной информации и соответствующее использование сервиса.</p>
                  
                  <h4 className="font-semibold">3. Конфиденциальность</h4>
                  <p>Ваша конфиденциальность важна для нас. Пожалуйста, ознакомьтесь с нашей Политикой конфиденциальности.</p>
                  
                  <h4 className="font-semibold">4. Ограничения</h4>
                  <p>Результаты ИИ предназначены для развлекательных целей и не должны заменять профессиональную консультацию.</p>
                  
                  <h4 className="font-semibold">5. Изменения</h4>
                  <p>Мы можем обновлять эти условия. Продолжение использования означает принятие изменений.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5" style={{ color: 'var(--btn-color)' }} />
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-dark)' }}>
                  Privacy Policy
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
                  className="px-3 py-1 rounded-full text-sm border"
                  style={{ 
                    borderColor: 'var(--bg-medium)', 
                    color: 'var(--text-dark)',
                    backgroundColor: 'var(--bg-light)'
                  }}
                >
                  {language === 'en' ? 'RU' : 'EN'}
                </button>
                <button
                  onClick={() => setShowPrivacy(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" style={{ color: 'var(--text-dark)' }} />
                </button>
              </div>
            </div>
            <div className="p-6">
              {language === 'en' ? (
                <div className="space-y-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                  <h3 className="font-semibold text-lg">Privacy Policy</h3>
                  <p>This policy describes how we collect, use, and protect your information.</p>
                  
                  <h4 className="font-semibold">1. Information We Collect</h4>
                  <p>We collect photos you upload, account information, and usage data to provide our services.</p>
                  
                  <h4 className="font-semibold">2. How We Use Information</h4>
                  <p>Your information is used to provide AI analysis, improve our services, and ensure security.</p>
                  
                  <h4 className="font-semibold">3. Data Protection</h4>
                  <p>We implement security measures to protect your data from unauthorized access.</p>
                  
                  <h4 className="font-semibold">4. Data Sharing</h4>
                  <p>We do not sell your personal information. Data may be shared with service providers under strict conditions.</p>
                  
                  <h4 className="font-semibold">5. Your Rights</h4>
                  <p>You can request access, correction, or deletion of your personal information.</p>
                </div>
              ) : (
                <div className="space-y-4 text-sm" style={{ color: 'var(--text-dark)' }}>
                  <h3 className="font-semibold text-lg">Политика конфиденциальности</h3>
                  <p>Эта политика описывает, как мы собираем, используем и защищаем вашу информацию.</p>
                  
                  <h4 className="font-semibold">1. Информация, которую мы собираем</h4>
                  <p>Мы собираем загруженные вами фотографии, информацию об аккаунте и данные об использовании.</p>
                  
                  <h4 className="font-semibold">2. Как мы используем информацию</h4>
                  <p>Ваша информация используется для предоставления ИИ-анализа, улучшения наших услуг и обеспечения безопасности.</p>
                  
                  <h4 className="font-semibold">3. Защита данных</h4>
                  <p>Мы применяем меры безопасности для защиты ваших данных от несанкционированного доступа.</p>
                  
                  <h4 className="font-semibold">4. Передача данных</h4>
                  <p>Мы не продаем вашу личную информацию. Данные могут передаваться поставщикам услуг на строгих условиях.</p>
                  
                  <h4 className="font-semibold">5. Ваши права</h4>
                  <p>Вы можете запросить доступ, исправление или удаление вашей личной информации.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 