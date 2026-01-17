import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function DocumentVerificationStep({ onNext, initialData }) {
  const [documents, setDocuments] = useState({
    id: initialData?.id || null,
    certification: initialData?.certification || null,
    background_check: initialData?.background_check || null
  });

  const [verificationStatus, setVerificationStatus] = useState({
    id: initialData?.id ? 'verified' : null,
    certification: initialData?.certification ? 'verified' : null,
    background_check: initialData?.background_check ? 'verified' : null
  });

  const [uploading, setUploading] = useState({});

  const documentTypes = [
    { 
      id: 'id', 
      label: 'Government ID', 
      description: 'Driver\'s license or state ID',
      required: true 
    },
    { 
      id: 'certification', 
      label: 'Healthcare Certifications', 
      description: 'CNA, HHA, or relevant certifications',
      required: false 
    },
    { 
      id: 'background_check', 
      label: 'Background Check', 
      description: 'CORI or equivalent (if available)',
      required: false 
    }
  ];

  const handleFileUpload = async (type, file) => {
    setUploading({ ...uploading, [type]: true });
    
    try {
      // Upload file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      // AI-powered verification
      setVerificationStatus({ ...verificationStatus, [type]: 'verifying' });
      
      const verificationResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this ${type.replace('_', ' ')} document. Check if it appears valid and extract key information.`,
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            is_valid: { type: 'boolean' },
            document_type: { type: 'string' },
            expiration_date: { type: 'string' },
            name_on_document: { type: 'string' },
            confidence_score: { type: 'number' }
          }
        }
      });

      if (verificationResult.is_valid && verificationResult.confidence_score > 0.7) {
        setDocuments({ ...documents, [type]: file_url });
        setVerificationStatus({ ...verificationStatus, [type]: 'verified' });
      } else {
        setVerificationStatus({ ...verificationStatus, [type]: 'failed' });
      }
    } catch (error) {
      setVerificationStatus({ ...verificationStatus, [type]: 'failed' });
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const canContinue = documents.id && verificationStatus.id === 'verified';

  const getStatusIcon = (status) => {
    if (status === 'verified') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'failed') return <AlertCircle className="w-5 h-5 text-red-600" />;
    if (status === 'verifying') return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">AI-Powered Verification</h3>
            <p className="text-sm text-blue-700 mt-1">
              We use advanced AI to verify your documents instantly and securely.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h2>
        
        <div className="space-y-4">
          {documentTypes.map(doc => (
            <div key={doc.id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{doc.label}</h4>
                    {doc.required && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                </div>
                {getStatusIcon(verificationStatus[doc.id])}
              </div>

              {!documents[doc.id] ? (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                    className="hidden"
                    disabled={uploading[doc.id]}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-teal-500 transition-colors">
                    {uploading[doc.id] ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    )}
                    <p className="text-sm text-gray-600">
                      {uploading[doc.id] ? 'Uploading...' : 'Click to upload or drag & drop'}
                    </p>
                  </div>
                </label>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Document uploaded</p>
                    {verificationStatus[doc.id] === 'verified' && (
                      <p className="text-xs text-green-600">✓ Verified successfully</p>
                    )}
                    {verificationStatus[doc.id] === 'failed' && (
                      <p className="text-xs text-red-600">✗ Verification failed. Please upload a clear photo.</p>
                    )}
                    {verificationStatus[doc.id] === 'verifying' && (
                      <p className="text-xs text-blue-600">Verifying with AI...</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setDocuments({ ...documents, [doc.id]: null });
                      setVerificationStatus({ ...verificationStatus, [doc.id]: null });
                    }}
                  >
                    Replace
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button 
        onClick={() => onNext({ documents })} 
        className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-700 hover:to-cyan-600"
        disabled={!canContinue}
      >
        Continue to Tutorial
      </Button>
    </div>
  );
}