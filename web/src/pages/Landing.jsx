import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Car, Home, Users, Shield, Clock, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteFooter from '@/components/footer/SiteFooter';
import ReviewsSlideDrawer from '@/components/reviews/ReviewsSlideDrawer';
import { brandConfig } from '../config/brand';

export default function Landing() {
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const services = [
    { icon: Heart, title: 'Personal Care', desc: 'Compassionate assistance' },
    { icon: Car, title: 'Transportation', desc: 'Safe, reliable rides' },
    { icon: Home, title: 'Home Services', desc: 'Support at home' },
    { icon: Users, title: 'Companion Care', desc: 'Meaningful connection' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-end">
          <Link to={createPageUrl('Auth')}>
            <Button size="sm" className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-5 shadow-sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Trusted Healthcare Partner
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            On-Demand Healthcare
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Support & Services
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Trusted help at home and in the community. Quality care when you need it most.
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link to={createPageUrl('Register')}>
              <Button className="w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg shadow-blue-500/25">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to={createPageUrl('Auth')}>
              <Button className="w-full h-14 text-lg font-semibold rounded-2xl bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm">
                Welcome Back
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="px-4 pb-12">
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">Our Services</h2>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-3">
                <service.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{service.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="px-4 pb-12">
        <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-6 text-white text-center max-w-md mx-auto">
          <div className="flex justify-center gap-8 mb-4">
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-white/80">Clients Served</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.9</p>
              <p className="text-sm text-white/80">Average Rating</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-sm text-white/80">Support</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="w-4 h-4" />
            Available when you need us
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 pb-12">
        <div className="max-w-md mx-auto">
          <a 
            href={`tel:${brandConfig.contactPhone.replace(/\D/g, '')}`}
            className="flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                <Phone className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-500 mb-0.5">Contact Support</p>
                <p className="text-lg font-bold text-gray-900">{brandConfig.contactPhone}</p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter onReviewsClick={() => setReviewsOpen(true)} />
      
      {/* Reviews Drawer */}
      <ReviewsSlideDrawer open={reviewsOpen} onClose={() => setReviewsOpen(false)} />
    </div>
  );
}
