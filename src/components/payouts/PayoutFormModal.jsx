import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function PayoutFormModal({ isOpen, onClose, editingPayout }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(editingPayout || {
    worker_name: '',
    period_start: '',
    period_end: '',
    total_hours: '',
    hourly_rate: '',
    gross_amount: '',
    tax_deduction: '',
    other_deductions: '',
    net_amount: '',
    payment_date: '',
    payment_method: 'direct_deposit',
    status: 'pending',
    notes: ''
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Payout.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Payout.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payouts'] });
      onClose();
    }
  });

  const calculateAmounts = (hours, rate) => {
    const gross = parseFloat(hours || 0) * parseFloat(rate || 0);
    const tax = gross * 0.15; // 15% tax
    const other = gross * 0.05; // 5% other deductions
    const net = gross - tax - other;
    
    setFormData({
      ...formData,
      total_hours: hours,
      hourly_rate: rate,
      gross_amount: gross.toFixed(2),
      tax_deduction: tax.toFixed(2),
      other_deductions: other.toFixed(2),
      net_amount: net.toFixed(2)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPayout) {
      updateMutation.mutate({ id: editingPayout.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingPayout ? 'Edit Payout' : 'Create Payout'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label>Worker Name *</Label>
            <Input
              required
              value={formData.worker_name}
              onChange={(e) => setFormData({ ...formData, worker_name: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Period Start *</Label>
              <Input
                required
                type="date"
                value={formData.period_start}
                onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
              />
            </div>
            <div>
              <Label>Period End *</Label>
              <Input
                required
                type="date"
                value={formData.period_end}
                onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Total Hours *</Label>
              <Input
                required
                type="number"
                step="0.5"
                value={formData.total_hours}
                onChange={(e) => calculateAmounts(e.target.value, formData.hourly_rate)}
                placeholder="40"
              />
            </div>
            <div>
              <Label>Hourly Rate *</Label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => calculateAmounts(formData.total_hours, e.target.value)}
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Gross Amount:</span>
              <span className="font-semibold text-gray-900">${formData.gross_amount || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax Deduction (15%):</span>
              <span className="font-semibold text-red-600">-${formData.tax_deduction || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Other Deductions (5%):</span>
              <span className="font-semibold text-red-600">-${formData.other_deductions || '0.00'}</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-gray-200">
              <span className="font-semibold text-gray-900">Net Amount:</span>
              <span className="font-bold text-green-600">${formData.net_amount || '0.00'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Payment Date *</Label>
              <Input
                required
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Payment Method *</Label>
              <Select value={formData.payment_method} onValueChange={(v) => setFormData({ ...formData, payment_method: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct_deposit">Direct Deposit</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Status *</Label>
            <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500">
              {editingPayout ? 'Update' : 'Create'} Payout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}