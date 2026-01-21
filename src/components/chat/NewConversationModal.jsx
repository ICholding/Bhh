import React, { useState } from 'react';
import { X, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function NewConversationModal({ isOpen, onClose, currentUserId, currentUserName, currentUserRole }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock users - in production, fetch from User entity
  const availableUsers = [
    { id: 'admin1', name: 'Admin Support', role: 'admin' },
    { id: 'worker1', name: 'Sarah Johnson', role: 'worker' },
    { id: 'worker2', name: 'Michael Chen', role: 'worker' },
    { id: 'client1', name: 'Maria Johnson', role: 'client' }
  ].filter(u => u.id !== currentUserId);

  const filteredUsers = availableUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createConversationMutation = useMutation({
    mutationFn: async (userData) => {
      const conversation = await base44.entities.Conversation.create({
        participants: [
          { user_id: currentUserId, name: currentUserName, role: currentUserRole },
          { user_id: userData.id, name: userData.name, role: userData.role }
        ],
        conversation_type: 'direct',
        unread_count: {}
      });
      return conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onClose();
    }
  });

  const handleStartConversation = () => {
    if (selectedUser) {
      createConversationMutation.mutate(selectedUser);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="border-b border-gray-100 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">New Message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="pl-9"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {filteredUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedUser?.id === user.id
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'worker' ? 'bg-teal-100 text-teal-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleStartConversation}
              disabled={!selectedUser}
              className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-500"
            >
              Start Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}