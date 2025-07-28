"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { 
  Mail, 
  Lock, 
  ArrowLeft,
  Eye,
  EyeOff,
  Heart,
  Sparkles,
  CheckCircle,
  User,
  AlertCircle,
  Loader2
} from "lucide-react";

// Interface for API response
interface LoginResponse {
  access_token: string;
  token_type: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem('access_token', data.access_token);
        // Redirect to dashboard
        window.location.href = '/';
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to connect to the login service. Please try again.');
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
      <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-3" style={{ backgroundColor: 'rgba(243, 237, 229, 0.95)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 transition-colors" style={{ color: 'var(--text-dark)' }}>
            <ArrowLeft className="h-5 w-5" />
            <span className="font-light">Back</span>
          </Link>
          
          <h1 className="text-2xl font-light tracking-wider" style={{ color: 'var(--text-dark)' }}>
            GlowGuide
          </h1>
          
          <Link href="/register" className="transition-colors font-light" style={{ color: 'var(--text-dark)' }}>
            Sign Up
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
                Welcome Back to 
                <span className="block font-extralight italic" style={{ color: 'var(--btn-color)' }}>
                  GlowGuide
                </span>
              </h1>
              <p className="text-xl font-light leading-relaxed" style={{ color: 'var(--text-dark)' }}>
                Sign in to access your personalized beauty recommendations
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 gap-4 mt-8">
                {[
                  "Access your saved looks",
                  "Personalized recommendations",
                  "Virtual try-on history",
                  "Ingredient check alerts"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--btn-color)' }} />
                    <span className="font-light" style={{ color: 'var(--text-dark)' }}>{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="max-w-md mx-auto w-full"
            >
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden" style={{ backgroundColor: 'var(--bg-light)' }}>
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

                {/* Username */}
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

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      className="rounded"
                      style={{ 
                        borderColor: 'var(--bg-medium)',
                        accentColor: 'var(--btn-color)'
                      }}
                    />
                    <label htmlFor="remember" className="text-sm font-light" style={{ color: 'var(--text-dark)' }}>
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm font-light hover:underline" style={{ color: 'var(--btn-color)' }}>
                    Forgot password?
                  </Link>
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Sign In
                    </>
                  )}
                </Button>
              </form>



              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="font-light" style={{ color: 'var(--text-dark)' }}>
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--btn-color)' }}>
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
            </motion.div>
          </div>
        </div>
      </div>


    </div>
  );
} 