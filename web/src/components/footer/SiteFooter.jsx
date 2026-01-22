import React from 'react';
import { Star } from 'lucide-react';
import { brandConfig } from '../../config/brand';

export default function SiteFooter({ onReviewsClick }) {
  return (
    <footer className="bg-[#F7FBFF] border-t border-gray-100 py-8 px-4 mt-12 text-center">
      {/* Company Info */}
      <div className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto mb-6">
        <p className="font-semibold text-gray-900 mb-2">{brandConfig.appName}</p>
        <p>333 Swanson Dr, Suite 114</p>
        <p>Lawrenceville, GA 30043, United States</p>
        <p className="mt-1 font-medium text-gray-900">{brandConfig.contactPhone}</p>
        <p className="mt-1">
          Email:{' '}
          <a 
            href="mailto:bhh@icholding.cloud" 
            className="font-semibold text-blue-600 hover:underline"
          >
            bhh@icholding.cloud
          </a>
        </p>
      </div>

      {/* Reviews Button */}
      <button
        onClick={onReviewsClick}
        className="w-full max-w-md mx-auto rounded-2xl p-4 border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
      >
        <div className="flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
          <span className="font-bold text-gray-900">4.9</span>
          <span className="text-gray-500">—</span>
          <span className="font-semibold text-blue-600">Read Our Reviews</span>
        </div>
      </button>

      {/* Copyright */}
      <div className="text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} {brandConfig.appName}. All rights reserved.
      </div>
    </footer>
  );
}
