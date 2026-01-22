import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TopHeader from '@/components/branding/TopHeader';
import StepProgress from '@/components/ui-custom/StepProgress';
import HelpBanner from '@/components/ui-custom/HelpBanner';
import { supabase } from '@/lib/supabaseClient';
import { SITE_URL } from '@/lib/siteUrl';


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

const membershipPlans = [
  { id: 'basic', name: 'Basic', price: '$29', period: '/month', features: ['Up to 5 service requests', 'Standard support', 'Basic coverage'] },
  { id: 'plus', name: 'Plus', price: '$59', period: '/month', features: ['Up to 15 service requests', 'Priority support', 'Extended coverage'], popular: true },
  { id: 'premium', name: 'Premium', price: '$99', period: '/month', features: ['Unlimited requests', '24/7 premium support', 'Full coverage'] },
];

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    accountType: 'client',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    registeringFor: 'myself',
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    selectedPlan: 'plus'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    setError('');
    
    // Validate passwords on step 1
    if (step === 1 && formData.accountType === 'client') {
      if (!formData.password) {
        setError('Password is required');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    // If Employee type is selected on Step 1, route to Employee Sign-Up
    if (step === 1 && formData.accountType === 'employee') {
      // Store account data for pre-filling
      localStorage.setItem('employeeSignupData', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        birthMonth: formData.birthMonth,
        birthDay: formData.birthDay,
        birthYear: formData.birthYear
      }));
      navigate(createPageUrl('EmployeeSignup'));
      return;
    }

    // Client flow continues normally
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete registration with Supabase
      setIsLoading(true);
      try {
        // Sign up user with Supabase
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: SITE_URL,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              phone: formData.phone
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.user) {
          // Update profile with selected role
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: formData.accountType || 'client' })
            .eq('id', data.user.id);

          if (profileError) {
            console.error('Error updating profile role:', profileError);
          }

          // Store for backwards compatibility with actual role
          localStorage.setItem('isSignedIn', 'true');
          localStorage.setItem('userRole', formData.accountType || 'client');
          
          // Navigate to service portal
          navigate(createPageUrl('ServicePortal'));
        }
      } catch (err) {
        console.error('Signup error:', err);
        setError(err.message || 'Failed to create account. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate(createPageUrl('Landing'));
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-full overflow-x-hidden">
      <TopHeader 
        showBack 
        onBack={handleBack}
        title="Create Account"
      />

      <StepProgress currentStep={step} />
      
      <HelpBanner />

      <div className="max-w-[480px] mx-auto px-4">
        <AnimatePresence mode="wait">
          {/* Step 1: Account */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pb-28 pt-3"
            >
            {/* Account Type Selection */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 mb-4 border border-blue-100">
              <Label className="text-sm font-semibold text-[#1F3A5F] mb-3 block">Account Type *</Label>
              <RadioGroup
                value={formData.accountType}
                onValueChange={(v) => updateForm('accountType', v)}
                className="space-y-3"
              >
                <div className={`flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.accountType === 'client'
                    ? 'border-blue-500 bg-white shadow-sm'
                    : 'border-gray-200 bg-white/50'
                }`}>
                  <RadioGroupItem value="client" id="client" className="mt-0.5" />
                  <Label htmlFor="client" className="ml-3 cursor-pointer flex-1">
                    <span className="font-semibold text-[#1F3A5F] block">Client</span>
                    <span className="text-sm text-[#5F7D95]">Sign up to receive care services</span>
                  </Label>
                </div>
                <div className={`flex items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formData.accountType === 'employee'
                    ? 'border-teal-500 bg-white shadow-sm'
                    : 'border-gray-200 bg-white/50'
                }`}>
                  <RadioGroupItem value="employee" id="employee" className="mt-0.5" />
                  <Label htmlFor="employee" className="ml-3 cursor-pointer flex-1">
                    <span className="font-semibold text-[#1F3A5F] block">Employee</span>
                    <span className="text-sm text-[#5F7D95]">Apply to work with Blessed Hope Healthcare</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-[#1F3A5F] mb-6">Account Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-[#5F7D95] mb-1.5 block">First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateForm('firstName', e.target.value)}
                      placeholder="John"
                      className="h-12 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#5F7D95] mb-1.5 block">Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateForm('lastName', e.target.value)}
                      placeholder="Doe"
                      className="h-12 rounded-xl w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Mobile Phone *</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    className="h-12 rounded-xl w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    placeholder="john@example.com"
                    className="h-12 rounded-xl w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Password *</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Confirm Password *</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateForm('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl w-full"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Birthday</Label>
                  <div className="flex flex-col gap-3">
                    <Select value={formData.birthMonth} onValueChange={(v) => updateForm('birthMonth', v)}>
                      <SelectTrigger className="h-12 rounded-xl w-full">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month, i) => (
                          <SelectItem key={month} value={String(i + 1)}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={formData.birthDay} onValueChange={(v) => updateForm('birthDay', v)}>
                      <SelectTrigger className="h-12 rounded-xl w-full">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(day => (
                          <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={formData.birthYear} onValueChange={(v) => updateForm('birthYear', v)}>
                      <SelectTrigger className="h-12 rounded-xl w-full">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-3 block">I am registering for:</Label>
                  <RadioGroup
                    value={formData.registeringFor}
                    onValueChange={(v) => updateForm('registeringFor', v)}
                    className="flex flex-col gap-3"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 min-h-[48px] cursor-pointer hover:border-blue-300 transition-colors">
                      <RadioGroupItem value="myself" id="myself" />
                      <Label htmlFor="myself" className="cursor-pointer flex-1">Myself</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-xl border-2 border-gray-200 min-h-[48px] cursor-pointer hover:border-blue-300 transition-colors">
                      <RadioGroupItem value="lovedone" id="lovedone" />
                      <Label htmlFor="lovedone" className="cursor-pointer flex-1">A Loved One</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            </motion.div>
          )}

          {/* Step 2: Billing */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pb-28 pt-3"
            >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-[#1F3A5F] mb-6">Billing Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Billing Name</Label>
                  <Input
                    value={formData.billingName}
                    onChange={(e) => updateForm('billingName', e.target.value)}
                    placeholder="Full name on card"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">Billing Address</Label>
                  <Input
                    value={formData.billingAddress}
                    onChange={(e) => updateForm('billingAddress', e.target.value)}
                    placeholder="Street address"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-[#5F7D95] mb-1.5 block">City</Label>
                    <Input
                      value={formData.billingCity}
                      onChange={(e) => updateForm('billingCity', e.target.value)}
                      placeholder="City"
                      className="h-12 rounded-xl w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-[#5F7D95] mb-1.5 block">State</Label>
                    <Input
                      value={formData.billingState}
                      onChange={(e) => updateForm('billingState', e.target.value)}
                      placeholder="State"
                      className="h-12 rounded-xl w-full"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-[#5F7D95] mb-1.5 block">ZIP Code</Label>
                  <Input
                    value={formData.billingZip}
                    onChange={(e) => updateForm('billingZip', e.target.value)}
                    placeholder="12345"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="pt-4">
                  <Label className="text-sm text-[#5F7D95] mb-3 block">Payment Method</Label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Payment details will be collected securely</p>
                    <p className="text-xs text-gray-400 mt-1">Powered by secure payment processing</p>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          )}

          {/* Step 3: Membership */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="pb-28 pt-3"
            >
            <h2 className="text-xl font-semibold text-[#1F3A5F] mb-4 text-center">Choose Your Plan</h2>
            
            <div className="space-y-3">
              {membershipPlans.map(plan => (
                <button
                  key={plan.id}
                  onClick={() => updateForm('selectedPlan', plan.id)}
                  className={`w-full text-left rounded-2xl p-5 border-2 transition-all ${
                    formData.selectedPlan === plan.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#1F3A5F]">{plan.name}</span>
                        {plan.popular && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Popular</span>
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-2xl font-bold text-[#1F3A5F]">{plan.price}</span>
                        <span className="text-[#5F7D95] text-sm">{plan.period}</span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.selectedPlan === plan.id
                        ? 'border-[#2F80ED] bg-[#2F80ED]'
                        : 'border-[#C7DDF2]'
                    }`}>
                      {formData.selectedPlan === plan.id && (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-[#5F7D95]">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30 max-w-[480px] mx-auto w-full">
        <div className="max-w-full px-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-3">
              {error}
            </div>
          )}
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full max-w-full h-14 text-lg font-semibold rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              step === 3 ? 'Complete Registration' : `Proceed to Step ${step + 1}`
            )}
          </Button>
        </div>
      </div>


    </div>
  );
}