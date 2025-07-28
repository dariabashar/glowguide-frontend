"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { 
  User, 
  Settings, 
  Heart, 
  Camera, 
  Search, 
  Palette,
  ArrowLeft,
  Edit,
  Save,
  X,
  LogOut,
  Sparkles,
  AlertCircle,
  Loader2,
  Trash2
} from "lucide-react";

// Interfaces
interface SavedResult {
  id: string;
  type: 'generate-look' | 'try-on' | 'ingredients';
  title: string;
  image_url?: string;
  prompt?: string;
  spec?: any;
  created_at: string;
}

interface UserProfile {
  username: string;
  email?: string;
  created_at: string;
}

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // User data
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editedUsername, setEditedUsername] = useState("");
  
  // Saved results
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'saved'>('profile');

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    fetchUserProfile();
    fetchSavedResults();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setEditedUsername(userData.username);
      } else {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedResults = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-results`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const results = await response.json();
        setSavedResults(results);
      }
    } catch (error) {
      console.error('Error fetching saved results:', error);
    }
  };

  const updateUsername = async () => {
    if (!editedUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: editedUsername
        })
      });

      if (response.ok) {
        setUser(prev => prev ? { ...prev, username: editedUsername } : null);
        setSuccess('Username updated successfully!');
        setIsEditing(false);
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to update username');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSavedResult = async (resultId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved-results/${resultId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSavedResults(prev => prev.filter(result => result.id !== resultId));
        setSuccess('Result deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting result:', error);
      setError('Failed to delete result');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    window.location.href = '/';
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'generate-look': return <Sparkles className="h-4 w-4" />;
      case 'try-on': return <Camera className="h-4 w-4" />;
      case 'ingredients': return <Search className="h-4 w-4" />;
      default: return <Palette className="h-4 w-4" />;
    }
  };

  const getResultTypeLabel = (type: string) => {
    switch (type) {
      case 'generate-look': return 'AI Look';
      case 'try-on': return 'Virtual Try-On';
      case 'ingredients': return 'Ingredients Check';
      default: return 'Result';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" style={{ color: 'var(--btn-color)' }} />
          <p style={{ color: 'var(--text-dark)' }}>Loading your account...</p>
        </div>
      </div>
    );
  }

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
            My Account
          </h1>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 transition-colors font-light hover:opacity-70"
            style={{ color: 'var(--text-dark)' }}
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--bg-medium)' }}>
              <User className="h-10 w-10" style={{ color: 'var(--btn-color)' }} />
            </div>
            <h1 className="text-3xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>
              Welcome back, {user?.username}!
            </h1>
            <p className="text-lg font-light" style={{ color: 'var(--text-dark)' }}>
              Manage your profile and view your saved results
            </p>
          </motion.div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-green-500" />
                <p className="text-green-600">{success}</p>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-1 bg-white rounded-full p-1 shadow-sm">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'profile' 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'profile' ? 'var(--btn-color)' : 'transparent'
                }}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === 'saved' 
                    ? 'text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ 
                  backgroundColor: activeTab === 'saved' ? 'var(--btn-color)' : 'transparent'
                }}
              >
                Saved Results ({savedResults.length})
              </button>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-0 shadow-lg rounded-3xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Username Section */}
                    <div>
                      <label className="block font-medium text-sm mb-2" style={{ color: 'var(--text-dark)' }}>
                        Username
                      </label>
                      <div className="flex items-center space-x-3">
                        {isEditing ? (
                          <>
                            <Input
                              type="text"
                              value={editedUsername}
                              onChange={(e) => setEditedUsername(e.target.value)}
                              className="flex-1 rounded-full"
                              style={{ 
                                borderColor: 'var(--bg-medium)', 
                                backgroundColor: 'var(--bg-light)',
                                color: 'var(--text-dark)'
                              }}
                            />
                            <Button
                              onClick={updateUsername}
                              disabled={isLoading}
                              size="sm"
                              className="rounded-full border-0"
                              style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                            >
                              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </Button>
                            <Button
                              onClick={() => {
                                setIsEditing(false);
                                setEditedUsername(user?.username || '');
                              }}
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              style={{ 
                                borderColor: 'var(--bg-medium)', 
                                color: 'var(--text-dark)'
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--bg-medium)' }}>
                              <span style={{ color: 'var(--text-dark)' }}>{user?.username}</span>
                            </div>
                            <Button
                              onClick={() => setIsEditing(true)}
                              size="sm"
                              variant="outline"
                              className="rounded-full"
                              style={{ 
                                borderColor: 'var(--bg-medium)', 
                                color: 'var(--text-dark)'
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>



                    {/* Quick Actions */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg" style={{ color: 'var(--text-dark)' }}>
                        Quick Actions
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/generate-look">
                          <Button
                            variant="outline"
                            className="w-full rounded-full h-12"
                            style={{ 
                              borderColor: 'var(--bg-medium)', 
                              color: 'var(--text-dark)'
                            }}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Look
                          </Button>
                        </Link>
                        
                        <Link href="/try-on">
                          <Button
                            variant="outline"
                            className="w-full rounded-full h-12"
                            style={{ 
                              borderColor: 'var(--bg-medium)', 
                              color: 'var(--text-dark)'
                            }}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Try Makeup
                          </Button>
                        </Link>
                        
                        <Link href="/check-ingredients">
                          <Button
                            variant="outline"
                            className="w-full rounded-full h-12"
                            style={{ 
                              borderColor: 'var(--bg-medium)', 
                              color: 'var(--text-dark)'
                            }}
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Check Ingredients
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Saved Results Tab */}
          {activeTab === 'saved' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {savedResults.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 mx-auto mb-4 opacity-50" style={{ color: 'var(--btn-color)' }} />
                  <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
                    No saved results yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start using our AI features to save your favorite results here!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link href="/generate-look">
                      <Button className="rounded-full" style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Look
                      </Button>
                    </Link>
                    <Link href="/try-on">
                      <Button variant="outline" className="rounded-full" style={{ borderColor: 'var(--bg-medium)', color: 'var(--text-dark)' }}>
                        <Camera className="h-4 w-4 mr-2" />
                        Try Makeup
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedResults.map((result) => (
                    <Card key={result.id} className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                      <CardContent className="p-0">
                        {result.image_url && (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={result.image_url}
                              alt={result.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="rounded-full text-xs" style={{ backgroundColor: 'rgba(217, 183, 131, 0.9)', color: 'var(--text-dark)' }}>
                                {getResultIcon(result.type)}
                                <span className="ml-1">{getResultTypeLabel(result.type)}</span>
                              </Badge>
                            </div>
                            <button
                              onClick={() => deleteSavedResult(result.id)}
                              className="absolute top-2 left-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        )}
                        
                        <div className="p-4">
                          <h3 className="font-semibold mb-2" style={{ color: 'var(--text-dark)' }}>
                            {result.title}
                          </h3>
                          
                          {result.prompt && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {result.prompt}
                            </p>
                          )}
                          
                          <p className="text-xs text-gray-500">
                            {new Date(result.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 