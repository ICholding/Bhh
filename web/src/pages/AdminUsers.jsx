import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Search,
  User,
  Briefcase,
  Mail,
  MoreVertical,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';

const users = [
  { id: 1, name: 'Maria Johnson', email: 'maria@email.com', phone: '(555) 123-4567', type: 'customer', status: 'active' },
  { id: 2, name: 'Robert Smith', email: 'robert@email.com', phone: '(555) 234-5678', type: 'customer', status: 'active' },
  { id: 3, name: 'Sarah Miller', email: 'sarah@bhh.com', phone: '(555) 345-6789', type: 'employee', status: 'active', role: 'Caregiver' },
  { id: 4, name: 'James Taylor', email: 'james@bhh.com', phone: '(555) 456-7890', type: 'employee', status: 'active', role: 'Driver' },
  { id: 5, name: 'Linda Davis', email: 'linda@email.com', phone: '(555) 567-8901', type: 'customer', status: 'inactive' },
  { id: 6, name: 'Michael Brown', email: 'michael@bhh.com', phone: '(555) 678-9012', type: 'employee', status: 'active', role: 'Caregiver' },
];

export default function AdminUsers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || user.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAIAnalysis = async (user) => {
    setSelectedUser(user);
    setLoadingAI(true);
    
    try {
      const prompt = `Analyze this user profile for BHH healthcare platform and provide:
1. Suggested optimal role based on their current type (${user.type}) and status (${user.status})
2. Any potential issues or flags that need admin attention
3. A brief activity summary and recommended follow-up actions

User: ${user.name}
Type: ${user.type}
Role: ${user.role || 'Customer'}
Status: ${user.status}

Provide structured JSON response with: suggestedRole, flags (array), activitySummary, recommendedActions (array)`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestedRole: { type: "string" },
            flags: { 
              type: "array",
              items: { 
                type: "object",
                properties: {
                  type: { type: "string" },
                  message: { type: "string" }
                }
              }
            },
            activitySummary: { type: "string" },
            recommendedActions: { 
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAiInsights(response);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* AI Insights Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
                    <p className="text-sm text-gray-500">{selectedUser.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedUser(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loadingAI ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">Analyzing user data...</p>
                  </div>
                ) : aiInsights ? (
                  <div className="space-y-6">
                    {/* Suggested Role */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Suggested Role</h3>
                      </div>
                      <p className="text-gray-700 text-lg font-medium">{aiInsights.suggestedRole}</p>
                    </div>

                    {/* Flags */}
                    {aiInsights.flags && aiInsights.flags.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          Flagged Items
                        </h3>
                        <div className="space-y-2">
                          {aiInsights.flags.map((flag, idx) => (
                            <div
                              key={idx}
                              className={`p-4 rounded-xl border ${
                                flag.type === 'warning'
                                  ? 'bg-orange-50 border-orange-200'
                                  : flag.type === 'info'
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-yellow-50 border-yellow-200'
                              }`}
                            >
                              <p className="text-sm font-medium text-gray-700">{flag.message}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Activity Summary */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{aiInsights.activitySummary}</p>
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        Recommended Actions
                      </h3>
                      <div className="space-y-2">
                        {aiInsights.recommendedActions.map((action, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-semibold text-green-700">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-gray-700 flex-1">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Modal Footer */}
              {!loadingAI && aiInsights && (
                <div className="p-6 border-t bg-gray-50">
                  <Button
                    onClick={() => setSelectedUser(null)}
                    className="w-full h-12 rounded-xl"
                  >
                    Close
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('AdminDashboard'))}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Manage Users</h1>
        </div>
        
        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 rounded-xl bg-gray-50"
            />
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-4 pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-gray-100">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="customer" className="flex-1">Customers</TabsTrigger>
              <TabsTrigger value="employee" className="flex-1">Employees</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* AI Insights Banner */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">AI-Powered User Insights</p>
                <p className="text-xs text-white/80 mt-0.5">Click any user for role suggestions, flagged issues, and activity summaries</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Users List */}
      <div className="px-4 pt-4">
        <div className="space-y-3">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleAIAnalysis(user)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  user.type === 'employee' 
                    ? 'bg-indigo-100' 
                    : 'bg-blue-100'
                }`}>
                  {user.type === 'employee' ? (
                    <Briefcase className={`w-5 h-5 ${user.type === 'employee' ? 'text-indigo-600' : 'text-blue-600'}`} />
                  ) : (
                    <User className="w-5 h-5 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                  {user.role && (
                    <p className="text-sm text-indigo-600 font-medium">{user.role}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1 truncate">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-lg">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">AI</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAIAnalysis(user); }}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Insights
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>View Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Edit User</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}