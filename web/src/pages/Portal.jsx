import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Shield, Briefcase, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { brandConfig } from '../config/brand';

export default function Portal() {
  const portals = [
    {
      id: 'admin',
      title: 'Admin Chat',
      desc: 'Operations & analytics assistant',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      route: 'ChatAdmin'
    },
    {
      id: 'worker',
      title: 'Worker Chat',
      desc: 'Job assignments & shift support',
      icon: Briefcase,
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      route: 'ChatWorker'
    },
    {
      id: 'customer',
      title: 'Customer Chat',
      desc: 'Service requests & care support',
      icon: Heart,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      route: 'ChatCustomer'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="px-4 pt-8 pb-6 text-center">
        <img 
          src={brandConfig.logos.md}
          alt={brandConfig.appName}
          className="w-14 h-14 rounded-xl mx-auto mb-4"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Portal
          </h1>
          <p className="text-gray-600">Choose your assistance portal</p>
        </motion.div>
      </header>

      {/* Portal Cards */}
      <div className="px-4 pb-12 space-y-4 max-w-md mx-auto">
        {portals.map((portal, index) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={createPageUrl(portal.route)}>
              <div className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${portal.bgColor} border-2 border-gray-200 hover:border-gray-300 transition-all hover:shadow-lg group`}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    <portal.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{portal.title}</h3>
                    <p className="text-sm text-gray-600">{portal.desc}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Sparkle decoration */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <Sparkles className={`w-8 h-8 bg-gradient-to-br ${portal.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="px-4 pb-12 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center"
        >
          <Sparkles className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Assistance</h3>
          <p className="text-sm text-gray-600">
            Each portal is equipped with a specialized AI assistant designed to help you with role-specific tasks and requests.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
