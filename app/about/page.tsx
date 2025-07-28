"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft,
  Sparkles,
  Heart,
  Users,
  Target,
  Award,
  Palette
} from "lucide-react";

export default function AboutPage() {
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

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h1 className="text-5xl lg:text-6xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                About 
                <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                  GlowGuide
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                                 We&apos;re revolutionizing the beauty industry through AI technology, 
                making personalized makeup recommendations accessible to everyone.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div variants={fadeInUp}>
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  <Image
                    src="/social1.png"
                    alt="Our mission"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} className="space-y-8">
                <div>
                  <h2 className="text-4xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                    Our Mission
                  </h2>
                  <p className="text-lg text-gray-600 font-light leading-relaxed mb-6">
                    At GlowGuide, we believe that everyone deserves to feel confident and beautiful. 
                    Our AI-powered platform analyzes your unique features to provide personalized 
                    makeup recommendations that enhance your natural beauty.
                  </p>
                  <p className="text-lg text-gray-600 font-light leading-relaxed">
                                         We&apos;re not just another beauty brand – we&apos;re a technology company dedicated to 
                    democratizing beauty expertise and making it accessible to women everywhere.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                Our Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Inclusivity",
                  description: "Beauty comes in all forms. Our AI is trained to understand and celebrate diverse skin tones, face shapes, and beauty preferences."
                },
                {
                  icon: Sparkles,
                  title: "Innovation",
                  description: "We leverage cutting-edge AI technology to provide accurate, personalized recommendations that evolve with beauty trends."
                },
                {
                  icon: Users,
                  title: "Community",
                  description: "We build tools that connect people and help them share their beauty journey with confidence and authenticity."
                }
              ].map((value, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl h-full">
                    <CardContent className="p-8 text-center h-full flex flex-col">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                        <value.icon className="h-8 w-8" style={{ color: '#9A5151' }} />
                      </div>
                      <h3 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
                        {value.title}
                      </h3>
                      <p className="text-gray-600 font-light leading-relaxed flex-grow">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                Our Impact
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
                Real numbers that show our commitment to helping you look and feel amazing
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                { number: "200+", label: "Analyses completed", icon: Palette },
                { number: "97%", label: "User satisfaction", icon: Heart },
                { number: "150+", label: "Happy customers", icon: Users },
                { number: "24/7", label: "AI availability", icon: Sparkles }
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="border-0 shadow-sm rounded-2xl text-center">
                    <CardContent className="p-8">
                      <stat.icon className="h-12 w-12 mx-auto mb-4" style={{ color: '#9A5151' }} />
                      <div className="text-4xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                        {stat.number}
                      </div>
                      <div className="text-gray-600 font-light">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerChildren}
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
                Our Story
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                GlowGuide was born from a simple idea: everyone deserves access to personalized beauty expertise. 
                Our team of AI engineers, beauty experts, and design professionals came together to create a platform 
                that understands your unique features and helps you express your individual style.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                    <Target className="h-6 w-6" style={{ color: '#9A5151' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                      Founded in 2024
                    </h3>
                    <p className="text-gray-600 font-light">
                      Started with a vision to make beauty technology accessible and inclusive for everyone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                    <Award className="h-6 w-6" style={{ color: '#9A5151' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                      AI-Powered Technology
                    </h3>
                    <p className="text-gray-600 font-light">
                      Our advanced algorithms analyze facial features and skin tones to provide accurate recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(217, 183, 131, 0.2)' }}>
                    <Heart className="h-6 w-6" style={{ color: '#9A5151' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light mb-2" style={{ color: 'var(--text-dark)' }}>
                      Community Focused
                    </h3>
                    <p className="text-gray-600 font-light">
                      Building a supportive community where everyone can discover and celebrate their unique beauty.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="/Дизайн без названия.png"
                  alt="Our team"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ backgroundColor: 'var(--bg-medium)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeInUp}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-light mb-6" style={{ color: 'var(--text-dark)' }}>
              Ready to Discover Your 
              <span className="block italic font-extralight" style={{ color: 'var(--btn-color)' }}>
                Perfect Look?
              </span>
            </h2>
            <p className="text-lg text-gray-600 mb-12 font-light leading-relaxed">
              Join thousands of users who have already discovered their ideal makeup with our AI-powered recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/generate-look">
                <Button 
                  size="lg"
                  className="rounded-full px-12 py-4 text-lg font-light border-0"
                  style={{ backgroundColor: 'var(--btn-color)', color: 'var(--bg-light)' }}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Try AI Analysis
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-12 py-4 text-lg font-light"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: 'var(--bg-light)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-light mb-4" style={{ color: 'var(--text-dark)' }}>
              GlowGuide
            </h3>
            <p className="text-gray-600 font-light mb-8">
              Personalized beauty solutions using AI technology for modern women.
            </p>
            <div className="border-t border-gray-200 pt-8">
              <p className="text-gray-500 font-light">&copy; 2024 GlowGuide. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 