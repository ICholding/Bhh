import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, DollarSign, Calendar, TrendingUp, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import TopHeader from '@/components/branding/TopHeader';

export default function WorkerPayouts() {
  const navigate = useNavigate();
  const [expandedPayout, setExpandedPayout] = useState(null);

  // In production, filter by current user's worker_id
  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ['payouts'],
    queryFn: () => base44.entities.Payout.list('-payment_date')
  });

  const upcomingPayouts = payouts.filter(p => p.status === 'pending' || p.status === 'processing');
  const paidPayouts = payouts.filter(p => p.status === 'paid');

  const totalEarnings = paidPayouts.reduce((sum, p) => sum + p.net_amount, 0);
  const pendingAmount = upcomingPayouts.reduce((sum, p) => sum + p.net_amount, 0);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <TopHeader 
        showBack 
        onBack={() => navigate(createPageUrl('EmployeeDashboard'))}
        title="Payouts"
      />

      {/* Summary Cards */}
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Earned</p>
            <p className="text-2xl font-bold">${totalEarnings.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Pending</p>
            <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Payouts */}
      {upcomingPayouts.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Payments</h2>
          <div className="space-y-3">
            {upcomingPayouts.map(payout => (
              <PayoutCard
                key={payout.id}
                payout={payout}
                isExpanded={expandedPayout === payout.id}
                onToggle={() => setExpandedPayout(expandedPayout === payout.id ? null : payout.id)}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : paidPayouts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No payment history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {paidPayouts.map(payout => (
              <PayoutCard
                key={payout.id}
                payout={payout}
                isExpanded={expandedPayout === payout.id}
                onToggle={() => setExpandedPayout(expandedPayout === payout.id ? null : payout.id)}
                getStatusColor={getStatusColor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PayoutCard({ payout, isExpanded, onToggle, getStatusColor }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-semibold text-gray-900">
              {format(new Date(payout.period_start), 'MMM d')} - {format(new Date(payout.period_end), 'MMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-500 mt-1">{payout.total_hours} hours worked</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">${payout.net_amount.toFixed(2)}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payout.status)}`}>
              {payout.status}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            <Calendar className="w-3 h-3 inline mr-1" />
            {payout.payment_date && format(new Date(payout.payment_date), 'MMM d, yyyy')}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Gross Amount</p>
              <p className="font-semibold text-gray-900">${payout.gross_amount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500">Hourly Rate</p>
              <p className="font-semibold text-gray-900">${payout.hourly_rate?.toFixed(2) || '0.00'}/hr</p>
            </div>
            <div>
              <p className="text-gray-500">Tax Deductions</p>
              <p className="font-semibold text-red-600">-${payout.tax_deduction?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-500">Other Deductions</p>
              <p className="font-semibold text-red-600">-${payout.other_deductions?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          {payout.services && payout.services.length > 0 && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-2">Services Included</p>
              <div className="space-y-2">
                {payout.services.map((service, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <div>
                      <p className="text-gray-900">{service.client}</p>
                      <p className="text-gray-500">{service.service_type} • {service.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900">{service.hours}h</p>
                      <p className="text-gray-500">${service.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payout.payment_method && (
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{payout.payment_method.replace('_', ' ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}