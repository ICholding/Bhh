import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, MapPin, Shield, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { brandConfig } from '../config/brand';

export default function Welcome() {

  const features = [
    { icon: Heart, title: 'Compassionate Care', desc: 'Personalized support' },
    { icon: Users, title: 'Trusted Team', desc: 'Vetted professionals' },
    { icon: Shield, title: 'Safe & Secure', desc: 'Licensed & insured' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 overflow-x-hidden">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <img 
          src={brandConfig.logos.sm}
          alt={brandConfig.appName}
          className="w-12 h-12 rounded-xl mx-auto"
        />
      </header>

      {/* Hero */}
      <section className="px-6 pt-8 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            Blessed Hope
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Healthcare Services
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            On-demand healthcare support and services powered by AI assistance
          </p>

          <Link to={createPageUrl('Apply')}>
            <Button className="w-full max-w-xs h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 shadow-lg shadow-blue-500/25">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 pb-12">
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-2">
                <feature.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="px-4 pb-12">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-md mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">We're Here to Help</h2>
            <p className="text-sm text-gray-600">Available 24/7 for support</p>
          </div>
          
          <div className="space-y-3">
            <a 
              href={`tel:${brandConfig.contactPhone.replace(/\D/g, '')}`}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Phone Support</p>
                <p className="text-base font-bold text-gray-900">{brandConfig.contactPhone}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </a>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Office Location</p>
                <p className="text-sm font-semibold text-gray-900">Lawrenceville, GA</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
