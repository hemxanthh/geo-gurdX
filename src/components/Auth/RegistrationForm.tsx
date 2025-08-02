import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle, User, Mail, Lock, Check, X, Zap, Star, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

interface RegistrationFormProps {
  onSwitchToLogin: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const { register, login, isLoading } = useAuth();

  // Password strength validation
  const getPasswordStrength = (pwd: string) => {
    const checks = {
      length: pwd.length >= 6,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /\d/.test(pwd),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong' };
  };

  const passwordAnalysis = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const result = await register(email, password, username);

    if (!result.success) {
      setError(result.error || 'Registration failed');
    } else {
      setSuccess(true);
      
      // If auto-login is enabled, attempt to login immediately
      if (isAutoLogin) {
        // Wait a bit longer for profile creation and database sync
        setTimeout(async () => {
          try {
            const loginResult = await login(email, password);
            if (!loginResult.success) {
              console.error('Auto-login failed:', loginResult.error);
              setError('Registration successful but auto-login failed. Please login manually.');
              setSuccess(false);
            }
          } catch (error) {
            console.error('Auto-login error:', error);
            setError('Registration successful but auto-login failed. Please login manually.');
            setSuccess(false);
          }
        }, 2000); // Wait 2 seconds for profile creation
      } else {
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      }
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 text-center border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Geo Guard-X!</h2>
            <p className="text-gray-600 mb-6 text-lg">
              {isAutoLogin 
                ? 'Setting up your account and logging you in...' 
                : 'Your account has been created successfully! You can now access all features.'
              }
            </p>
            
            {isAutoLogin && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-center space-x-2 text-green-700 mb-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Auto-login in progress...</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            )}
            
            {!isAutoLogin && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 mb-1" />
                    <span className="text-gray-700 font-medium">Account Created</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-500 mb-1" />
                    <span className="text-gray-700 font-medium">Security Enabled</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-500 mb-1" />
                    <span className="text-gray-700 font-medium">Ready to Use</span>
                  </div>
                </div>
                
                <button
                  onClick={onSwitchToLogin}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  Continue to Sign In →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div className="w-full max-w-6xl flex items-center justify-center gap-16 relative z-10">
        {/* Left Side - Benefits & Social Proof */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 flex-1 max-w-lg">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Join Geo Guard-X</h1>
                <p className="text-purple-200 text-lg">Secure your vehicle with advanced tracking</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <div className="flex items-center space-x-3 text-white/90 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold">Defense-Grade Precision & Security</span>
                </div>
                <p className="text-white/70 text-sm">
                  Backed by Indian Regional Navigation Satellite System (IRNSS), encrypted GSM alerts, and high-reliability hardware — ensuring 99.9% uptime even in remote or signal-compromised areas.
                </p>
              </div>
              
              <div className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <div className="flex items-center space-x-3 text-white/90 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Plug-and-Track Simplicity</span>
                </div>
                <p className="text-white/70 text-sm">
                  Deploy within minutes using our DIY-friendly setup — no technical expertise needed. Track your vehicle live, monitor movement, and receive instant SMS alerts with zero subscription cost.
                </p>
              </div>
              
              <div className="p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
                <div className="flex items-center space-x-3 text-white/90 mb-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="font-semibold">Instant Setup</span>
                </div>
                <p className="text-white/70 text-sm">
                  Get started in minutes with our streamlined onboarding process.
                </p>
              </div>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="p-6 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="flex text-yellow-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-white/80 text-sm italic mb-3">
              "We finally feel in control. Our NavSecure-X unit not only sends alerts when the ignition is tampered with, but also lets us track our vehicle in real time. It's a lifesaver."
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MR</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Hemanth K</p>
                <p className="text-white/60 text-xs">Developer-GEO GUARD-X</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Your Account</h2>
              <p className="text-gray-600">Start securing your fleet today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                    placeholder="Choose a username"
                    required
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pl-12 pr-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            'h-full transition-all duration-300',
                            passwordAnalysis.strength === 'weak' && 'bg-red-400 w-1/3',
                            passwordAnalysis.strength === 'medium' && 'bg-yellow-400 w-2/3',
                            passwordAnalysis.strength === 'strong' && 'bg-green-400 w-full'
                          )}
                        />
                      </div>
                      <span className={clsx(
                        'text-xs font-medium',
                        passwordAnalysis.strength === 'weak' && 'text-red-600',
                        passwordAnalysis.strength === 'medium' && 'text-yellow-600',
                        passwordAnalysis.strength === 'strong' && 'text-green-600'
                      )}>
                        {passwordAnalysis.strength === 'weak' && 'Weak'}
                        {passwordAnalysis.strength === 'medium' && 'Good'}
                        {passwordAnalysis.strength === 'strong' && 'Strong'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(passwordAnalysis.checks).map(([key, passed]) => (
                        <div key={key} className="flex items-center space-x-1">
                          {passed ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <X className="w-3 h-3 text-gray-300" />
                          )}
                          <span className={passed ? 'text-green-600' : 'text-gray-400'}>
                            {key === 'length' && '6+ characters'}
                            {key === 'uppercase' && 'Uppercase'}
                            {key === 'lowercase' && 'Lowercase'}
                            {key === 'number' && 'Number'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={clsx(
                      'w-full px-4 py-3 pl-12 bg-gray-50/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300',
                      confirmPassword && password !== confirmPassword && 'border-red-300 bg-red-50/50',
                      confirmPassword && password === confirmPassword && 'border-green-300 bg-green-50/50'
                    )}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {confirmPassword && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {password === confirmPassword ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-login option */}
              <div className="flex items-center space-x-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <input
                  id="auto-login"
                  type="checkbox"
                  checked={isAutoLogin}
                  onChange={(e) => setIsAutoLogin(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="auto-login" className="text-sm text-gray-700 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-purple-500" />
                  <span>Automatically log me in after registration</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={clsx(
                  'w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform',
                  'bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white',
                  'focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]',
                  'shadow-lg hover:shadow-xl',
                  isLoading && 'animate-pulse'
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Already have an account?</p>
                <button 
                  onClick={onSwitchToLogin}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors hover:underline"
                  disabled={isLoading}
                >
                  ← Back to Sign In
                </button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-white/70 text-xs">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;