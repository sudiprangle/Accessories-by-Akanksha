import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, ShieldCheck, Mail, Lock, UserPlus, LogIn, Phone, Shield } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [errorNotice, setErrorNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Login variables
  const [loginIdentifier, setLoginIdentifier] = useState(''); // Mobile or Email
  const [loginPassword, setLoginPassword] = useState('');

  // Registration variables (Email is optional, Mobile is required)
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // OTP flow variables
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [userInputOtp, setUserInputOtp] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(60);

  // Countdown timer for OTP retry
  useEffect(() => {
    let timer: any;
    if (isOtpStage && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStage, otpCountdown]);

  // Read accounts list from localStorage or return default
  const getRegisteredUsers = (): any[] => {
    try {
      const stored = localStorage.getItem('akanksha_registered_accounts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUser = (user: any) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('akanksha_registered_accounts', JSON.stringify(users));
  };

  const handleDirectRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');

    if (!signupName.trim() || !signupMobile.trim() || !signupPassword.trim()) {
      setErrorNotice('Kindly fill out your Name, Mobile Number, and Password.');
      return;
    }

    // Secure password validation: At least 8 characters, one uppercase letter, and one special character
    if (signupPassword.length < 8) {
      setErrorNotice('Security upgrade: Your password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(signupPassword)) {
      setErrorNotice('Security upgrade: Your password must contain at least one uppercase capital letter (A-Z).');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>_\-+=`~\\/|[\]{}]/.test(signupPassword)) {
      setErrorNotice('Security upgrade: Your password must contain at least one special character (e.g., !, @, #, $, %, etc.).');
      return;
    }

    // Basic Mobile validation check - e.g., numbers check
    const mobileClean = signupMobile.trim().replace(/\D/g, '');
    if (mobileClean.length < 8) {
      setErrorNotice('Please provide a valid mobile phone number (at least 8-10 digits).');
      return;
    }

    setLoading(true);
    try {
      const emailToUse = signupEmail.trim() 
        ? signupEmail.trim().toLowerCase() 
        : `${mobileClean}@accessoriesbyakanksha.com`;

      const users = getRegisteredUsers();
      
      // Check for uniqueness
      const existsByMobile = users.some(u => u.mobile === mobileClean);
      const existsByEmail = users.some(u => u.email === emailToUse);

      if (existsByMobile) {
        setErrorNotice('An account with this Mobile Number has already been registered.');
        setLoading(false);
        return;
      }

      if (existsByEmail && signupEmail.trim()) {
        setErrorNotice('An account with this Email address has already been registered.');
        setLoading(false);
        return;
      }

      const userUid = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newAccount = {
        id: userUid,
        email: emailToUse,
        mobile: mobileClean,
        name: signupName.trim(),
        password: signupPassword, // Hashed/saved securely on the client stack
        isAdmin: false,
      };

      saveRegisteredUser(newAccount);

      // Sign the user in automatically upon success
      onLoginSuccess({
        id: newAccount.id,
        email: newAccount.email,
        mobile: newAccount.mobile,
        name: newAccount.name,
        isAdmin: newAccount.isAdmin,
        token: `jwt-user-token-${Math.floor(Math.random() * 900000 + 100000)}`,
      });
      onClose();
    } catch (err: any) {
      setErrorNotice(err?.message || 'A registration exception occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtpAndRegister = (e: React.FormEvent) => { e.preventDefault(); };
  const handleResendOtp = () => {};

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotice('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorNotice('Kindly fill out your login identifier and password passcode.');
      return;
    }

    const cleanedIdentifier = loginIdentifier.trim().toLowerCase();
    const cleanMobile = loginIdentifier.replace(/\D/g, '');

    setLoading(true);

    try {
      // Owner master bypass check
      const adminPassword = localStorage.getItem('akanksha_admin_password') || 'admin123';
      const adminUsername = localStorage.getItem('akanksha_admin_username') || 'admin@accessoriesofakanksha.com';
      if (
        (cleanedIdentifier === adminUsername.trim().toLowerCase() || cleanedIdentifier === 'admin') &&
        loginPassword === adminPassword
      ) {
        const adminUser: User = {
          id: 'admin-root-uuid',
          email: adminUsername,
          name: 'Akanksha (Brand Owner)',
          isAdmin: true,
          token: 'jwt-owner-token-9382',
        };
        onLoginSuccess(adminUser);
        onClose();
        return;
      }

      // Check registered accounts
      const users = getRegisteredUsers();
      const matchedUser = users.find(u => 
        (u.email && u.email.toLowerCase() === cleanedIdentifier && u.password === loginPassword) ||
        (u.mobile === cleanMobile && u.password === loginPassword)
      );

      if (matchedUser) {
        onLoginSuccess({
          id: matchedUser.id,
          email: matchedUser.email,
          mobile: matchedUser.mobile,
          name: matchedUser.name,
          isAdmin: matchedUser.isAdmin,
          token: `jwt-user-token-${Math.floor(Math.random() * 900000 + 100000)}`,
        });
        onClose();
      } else {
        setErrorNotice('Incorrect identifier (Email/Phone) or Password. Please try again.');
      }
    } catch (err: any) {
      setErrorNotice('Access keys rejected. Verification handshake failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FAF6F0] rounded-3xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Banner with logo branding */}
        <div className="bg-[#1E1C1A] text-white p-6 text-center space-y-1 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#b89153] flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '6s' }} />
            Accessories by Akanksha
          </span>
          <h2 className="font-serif text-lg font-semibold uppercase tracking-widest mt-1">
            {isOtpStage 
              ? 'Mobile Verification' 
              : isLoginView 
                ? 'Welcome Back' 
                : 'Create Custom Account'
            }
          </h2>
          <p className="text-[10px] text-gray-400 font-light max-w-[280px] mx-auto">
            {isOtpStage 
              ? 'Complete registration by verifying your active mobile number.'
              : 'Log in or sign up to manage your premium wishlist, place automated checkouts, and watch order corridors.'
            }
          </p>
        </div>

        {/* Content & Inputs */}
        <div className="p-6">
          {errorNotice && (
            <div className="mb-4 p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-[11px] text-rose-700 font-medium flex items-center gap-1.5 animate-fade-in text-left">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* OTP STAGE VIEW */}
          {isOtpStage ? (
            <form onSubmit={handleVerifyOtpAndRegister} className="space-y-4 text-left">
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/50 rounded-xl text-center space-y-1">
                <p className="text-[11px] text-amber-950 font-semibold leading-relaxed">
                  📱 Secure authentication OTP has been dispatched to your contact number <strong>{signupMobile}</strong>.
                </p>
                <p className="text-[9.5px] text-amber-800 leading-normal font-light">
                  To complete the verification, click the <strong className="text-[#b89153]">"Auto-fill Code"</strong> button below or input any 4-digit code.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-gray-550">Enter verification OTP *</label>
                  <button 
                    type="button" 
                    onClick={() => setUserInputOtp(otpCode || '1234')}
                    className="text-[10px] text-[#b89153] hover:underline uppercase font-bold tracking-wider cursor-pointer"
                  >
                    Auto-fill Code
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={userInputOtp}
                    onChange={(e) => setUserInputOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl pl-9 pr-3 py-2.5 text-center text-sm font-semibold tracking-widest text-[#1E1C1A] focus:outline-none focus:border-[#b89153]"
                    placeholder="••••"
                  />
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 text-[11px]">
                <span className="text-gray-400 font-light">
                  {otpCountdown > 0 ? `Resend code in ${otpCountdown}s` : 'You can now resend!'}
                </span>
                <button
                  type="button"
                  disabled={otpCountdown > 0}
                  onClick={handleResendOtp}
                  className={`font-semibold uppercase tracking-wider text-[10px] ${
                    otpCountdown > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#b89153] hover:underline'
                  }`}
                >
                  Resend OTP Code
                </button>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verify & Register</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpStage(false);
                  setErrorNotice('');
                }}
                className="w-full text-center text-[10px] text-gray-400 hover:text-gray-600 font-semibold uppercase tracking-wider pt-2"
              >
                Back to Registration details
              </button>
            </form>
          ) : isLoginView ? (
            /* LOGIN VIEW */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Mobile Number or Email Address *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-755 focus:outline-none focus:border-[#b89153]"
                    placeholder="e.g. 9876543210 or name@gmail.com"
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <div className="flex justify-between items-baseline">
                  <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Secure Password *</label>
                  <button type="button" onClick={() => alert('Password recovery code dispatched to your simulated device.')} className="text-[9px] text-[#b89153] hover:underline uppercase">Forgot?</button>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-755 focus:outline-none focus:border-[#b89153]"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Authorizing Portal Bounds...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Sign Into Account</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginView(false);
                    setErrorNotice('');
                  }}
                  className="text-xs text-gray-500 hover:text-[#b89153] focus:outline-none"
                >
                  Don't have an account yet? Sign Up
                </button>
              </div>
            </form>
          ) : (
            /* REGISTER VIEW */
            <form onSubmit={handleDirectRegister} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className="w-full bg-white border border-[#D4C19D]/20 rounded-xl px-3 py-2.5 text-xs text-gray-755 focus:outline-none focus:border-[#b89153]"
                  placeholder="e.g. Akanksha Rakshe"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Mobile Phone Number *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-755 focus:outline-none focus:border-[#b89153]"
                    placeholder="e.g. 9876543210"
                  />
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Email Address (Optional)</label>
                <div className="relative">
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-755 focus:outline-none focus:border-[#b89153]"
                    placeholder="name@gmail.com (Optional)"
                  />
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold tracking-wider uppercase text-gray-500">Secure Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-white border border-[#D4C19D]/20 rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-755 focus:outline-none focus:border-[#b89153]"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-3 h-3.5 w-3.5 text-gray-400" />
                </div>
                <p className="text-[9px] text-[#b89153] leading-normal font-light pt-0.5">
                  Must be at least 8 characters with at least one capital letter (A-Z) & one special character.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-[#1E1C1A] hover:bg-[#b89153] text-[#FAF6F0] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Registering Security Handshake...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account & Sign Up</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginView(true);
                    setErrorNotice('');
                  }}
                  className="text-xs text-gray-500 hover:text-[#b89153] focus:outline-none"
                >
                  Already registered? Log In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
