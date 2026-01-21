import React, { useState } from 'react';
import { X, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

export default function PayoutReportModal({ isOpen, onClose, payouts }) {
  const [reportType, setReportType] = useState('summary');
  const [statusFilter, setStatusFilter] = useState('all');

  const generateReport = () => {
    const filtered = statusFilter === 'all' 
      ? payouts 
      : payouts.filter(p => p.status === statusFilter);

    if (reportType === 'summary') {
      const summary = {
        total_payouts: filtered.length,
        total_amount: filtered.reduce((sum, p) => sum + p.net_amount, 0),
        total_hours: filtered.reduce((sum, p) => sum + (p.total_hours || 0), 0),
        by_status: {
          pending: filtered.filter(p => p.status === 'pending').length,
          processing: filtered.filter(p => p.status === 'processing').length,
          paid: filtered.filter(p => p.status === 'paid').length,
          failed: filtered.filter(p => p.status === 'failed').length
        }
      };

      const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
      downloadFile(blob, 'payout-summary.json');
    } else {
      // Detailed CSV export
      const headers = 'Worker Name,Period Start,Period End,Hours,Rate,Gross,Tax,Other Deductions,Net,Status,Payment Date\n';
      const rows = filtered.map(p => 
        `${p.worker_name},${p.period_start},${p.period_end},${p.total_hours},${p.hourly_rate},${p.gross_amount},${p.tax_deduction},${p.other_deductions},${p.net_amount},${p.status},${p.payment_date}`
      ).join('\n');
      
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      downloadFile(blob, 'payout-detailed.csv');
    }
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Generate Report</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary (JSON)</SelectItem>
                <SelectItem value="detailed">Detailed (CSV)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Filter by Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="processing">Processing Only</SelectItem>
                <SelectItem value="paid">Paid Only</SelectItem>
                <SelectItem value="failed">Failed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
            <FileText className="w-4 h-4 inline mr-2" />
            {reportType === 'summary' 
              ? 'Summary report includes totals and statistics'
              : 'Detailed report includes all payout records in CSV format'
            }
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={generateReport} className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500">
              <Download className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}