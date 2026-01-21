import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Shield, Briefcase, Users, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const roleOptions = [
  { value: 'client', label: 'Client', icon: Heart, route: 'ServicePortal' },
  { value: 'worker', label: 'Worker', icon: Briefcase, route: 'EmployeeDashboard' },
  { value: 'employee', label: 'Employee (Apply)', icon: Users, route: 'EmployeeSignup' },
  { value: 'admin', label: 'Admin', icon: Shield, route: 'AdminDashboard' }
];

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [selectedRole, setSelectedRole] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if user is already signed in
    const storedRole = localStorage.getItem('userRole');
    const isSignedIn = localStorage.getItem('isSignedIn');
    
    if (isSignedIn === 'true' && storedRole) {
      const roleConfig = roleOptions.find(r => r.value === storedRole);
      if (roleConfig) {
        navigate(createPageUrl(roleConfig.route));
      }
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Store sign-in state and role
    localStorage.setItem('isSignedIn', 'true');
    localStorage.setItem('userRole', selectedRole);
    
    // Navigate based on selected role
    const roleConfig = roleOptions.find(r => r.value === selectedRole);
    if (roleConfig) {
      navigate(createPageUrl(roleConfig.route));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('Landing'))}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="px-6 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to continue</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-sm text-gray-600 mb-3 block">Sign in as</Label>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selectedRole === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <role.icon className={`w-5 h-5 ${
                    selectedRole === role.value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedRole === role.value ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label className="text-sm text-gray-600 mb-1.5 block">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="h-14 pl-12 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600 mb-1.5 block">Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-14 pl-12 pr-12 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          {selectedRole === 'client' && (
            <p className="text-center mt-8 text-gray-600">
              Don't have an account?{' '}
              <Link 
                to={createPageUrl('Register')}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign Up
              </Link>
            </p>
          )}
          
          {selectedRole === 'employee' && (
            <p className="text-center mt-8 text-gray-600 text-sm">
              Employee applications are reviewed within 48 hours
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}