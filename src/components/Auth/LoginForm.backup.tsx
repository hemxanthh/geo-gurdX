import React, { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, Car, MapPin, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';

const LoginForm: React.FC<{ onSwitchToRegister: () => void }> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials and try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>
  
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
  
      <div className="w-full max-w-6xl flex items-center justify-center gap-16 relative z-10">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 flex-1 max-w-lg">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-2xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Geo Guard-X</h1>
                <p className="text-blue-200 text-lg">Advanced Vehicle Security & Tracking</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-white/90">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Real-time GPS Tracking</h3>
                  <p className="text-white/70 text-sm">Monitor your fleet with precision location data</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-white/90">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Remote Vehicle Control</h3>
                  <p className="text-white/70 text-sm">Start, stop, and control your vehicles remotely</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-white/90">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Instant Alerts</h3>
                  <p className="text-white/70 text-sm">Get notified of any security events immediately</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <p className="text-white/80 text-sm italic">
              "Geo Guard-X has revolutionized the society in theft management. The real-time tracking and security features give us complete peace of mind."
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
              <div>
                <p className="text-white font-medium text-sm">hemxanthh</p>
                <p className="text-white/60 text-xs">Developer</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Right Side - Login Form */}
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
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
                    className="w-full px-4 py-3 pr-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
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
                  'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white',
                  'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none',
                  'disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]',
                  'shadow-lg hover:shadow-xl',
                  isLoading && 'animate-pulse'
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
  
            {/* Switch to Register */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">Don't have an account?</p>
                <button 
                  onClick={onSwitchToRegister} 
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors hover:underline"
                >
                  Create Account →
                </button>
              </div>
            </div>
          </div>
  
          {/* Features Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-white/70 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Remote Control</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Instant Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
  
export default LoginForm;
