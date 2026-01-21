import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, DollarSign, Plus, Download, Filter, Search, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import TopHeader from '@/components/branding/TopHeader';
import PayoutFormModal from '@/components/payouts/PayoutFormModal';
import PayoutReportModal from '@/components/payouts/PayoutReportModal';

export default function AdminPayouts() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingPayout, setEditingPayout] = useState(null);

  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ['admin-payouts'],
    queryFn: () => base44.entities.Payout.list('-created_date')
  });

  const updatePayoutMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Payout.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
    }
  });

  const filteredPayouts = payouts.filter(p => {
    const matchesSearch = p.worker_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: payouts.reduce((sum, p) => sum + p.net_amount, 0),
    pending: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.net_amount, 0),
    paid: payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.net_amount, 0),
    processing: payouts.filter(p => p.status === 'processing').length
  };

  const handleStatusChange = async (payoutId, newStatus) => {
    await updatePayoutMutation.mutateAsync({
      id: payoutId,
      data: { status: newStatus }
    });
  };

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
        onBack={() => navigate(createPageUrl('AdminDashboard'))}
        title="Payout Management"
      />

      {/* Stats */}
      <div className="px-4 pt-4 pb-6">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Total Payouts</p>
            <p className="text-2xl font-bold">${stats.total.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 text-white">
            <p className="text-sm opacity-90 mb-1">Paid Out</p>
            <p className="text-2xl font-bold">${stats.paid.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-xl font-bold text-yellow-600">${stats.pending.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Processing</p>
            <p className="text-xl font-bold text-blue-600">{stats.processing}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-4 flex gap-2">
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Payout
        </Button>
        <Button 
          onClick={() => setShowReportModal(true)}
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <div className="px-4 mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by worker name..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'processing', 'paid', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Payouts List */}
      <div className="px-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : filteredPayouts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No payouts found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayouts.map(payout => (
              <div key={payout.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{payout.worker_name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(payout.period_start), 'MMM d')} - {format(new Date(payout.period_end), 'MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{payout.total_hours}h @ ${payout.hourly_rate?.toFixed(2) || '0'}/hr</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${payout.net_amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {payout.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(payout.id, 'processing')}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Start Processing
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingPayout(payout);
                          setShowCreateModal(true);
                        }}
                        className="flex-1"
                      >
                        Edit
                      </Button>
                    </>
                  )}
                  {payout.status === 'processing' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(payout.id, 'paid')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Mark as Paid
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(payout.id, 'failed')}
                        className="flex-1 text-red-600"
                      >
                        Mark Failed
                      </Button>
                    </>
                  )}
                  {payout.status === 'paid' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingPayout(payout);
                        setShowCreateModal(true);
                      }}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PayoutFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingPayout(null);
        }}
        editingPayout={editingPayout}
      />

      <PayoutReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        payouts={payouts}
      />
    </div>
  );
}