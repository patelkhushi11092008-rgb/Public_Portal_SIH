import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  Phone,
  Mail,
  CreditCard,
  MapPin,
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import { registerCivilian } from '../services/civilianApi';
import { useCivilianAuth } from '../context/CivilianAuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useCivilianAuth();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Multi-step Wizard Step: 1, 2, 3, 4, 5 (5 = Success)
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Personal Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Step 2: Identity (Aadhaar)
  const [aadhaar, setAadhaar] = useState('');

  // Step 3: Location / Address
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Gujarat');
  const [district, setDistrict] = useState('Ahmedabad');
  const [subDistrict, setSubDistrict] = useState('');
  const [coords, setCoords] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState('');

  // Step 4: Account Credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Validation Errors & Submission State
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  // Clean Aadhaar Digits
  const rawAadhaarDigits = aadhaar.replace(/\D/g, '');
  const maskedAadhaarPreview =
    rawAadhaarDigits.length >= 4
      ? `XXXX-XXXX-${rawAadhaarDigits.slice(-4)}`
      : 'XXXX-XXXX-XXXX';

  // Geolocation detector
  const handleDetectGPS = () => {
    setGeoLoading(true);
    setGeoMessage('');
    if (!navigator.geolocation) {
      setGeoMessage('Geolocation is not supported by your browser.');
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const detected = {
          latitude: parseFloat(pos.coords.latitude.toFixed(4)),
          longitude: parseFloat(pos.coords.longitude.toFixed(4)),
        };
        setCoords(detected);
        setGeoMessage(`GPS Fixed: ${detected.latitude}° N, ${detected.longitude}° E`);
        setGeoLoading(false);
      },
      (err) => {
        setGeoMessage('GPS signal unavailable. Coordinates will automatically be resolved from your District/Address.');
        setGeoLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Step 1 Validation
  const validateStep1 = () => {
    const errs = {};
    if (!firstName.trim()) errs.firstName = 'First name is required.';
    if (!lastName.trim()) errs.lastName = 'Last name is required.';
    if (!mobile.trim() || !/^[6-9]\d{9}$/.test(mobile.trim())) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs = {};
    if (rawAadhaarDigits.length !== 12) {
      errs.aadhaar = 'Aadhaar number must consist of exactly 12 numeric digits.';
    } else if (rawAadhaarDigits.startsWith('0') || rawAadhaarDigits.startsWith('1')) {
      errs.aadhaar = 'Aadhaar number format invalid: UIDAI numbers cannot begin with 0 or 1.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    const errs = {};
    if (!address.trim()) errs.address = 'Residential address is required.';
    if (!pincode.trim() || !/^\d{6}$/.test(pincode.trim())) {
      errs.pincode = 'Enter a valid 6-digit postal pincode.';
    }
    if (!state.trim()) errs.state = 'State is required.';
    if (!district.trim()) errs.district = 'District is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 4 Validation
  const validateStep4 = () => {
    const errs = {};
    if (!username.trim() || username.trim().length < 3) {
      errs.username = 'Username must be at least 3 characters.';
    }
    if (!password || password.length < 8) {
      errs.password = 'Password must be at least 8 characters long.';
    } else {
      if (!/[A-Z]/.test(password)) errs.password = 'Password must contain at least one uppercase letter (A-Z).';
      else if (!/[a-z]/.test(password)) errs.password = 'Password must contain at least one lowercase letter (a-z).';
      else if (!/\d/.test(password)) errs.password = 'Password must contain at least one numeric digit (0-9).';
      else if (!/[^A-Za-z0-9]/.test(password)) errs.password = 'Password must contain at least one special character.';
    }
    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step Navigation Handlers
  const handleNextStep = (e) => {
    e.preventDefault();
    setServerError('');

    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    setServerError('');
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Registration Submission (Step 4)
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateStep4()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        aadhaar: rawAadhaarDigits,
        username: username.trim(),
        password,
        confirm_password: confirmPassword,
        address: address.trim(),
        pincode: pincode.trim(),
        state: state.trim(),
        district: district.trim(),
        sub_district: subDistrict.trim() || null,
        latitude: coords?.latitude || null,
        longitude: coords?.longitude || null,
      };

      const res = await registerCivilian(payload);
      setRegisteredUser(res.user);
      setCurrentStep(5); // Show success screen
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please review your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24">
      <PageHeader
        title="Civilian Registration"
        subtitle="Create your verified citizen account to monitor public infrastructure within 25 km of your neighborhood."
        breadcrumbs={[{ label: 'Register' }]}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {/* Step Progress Wizard Bar (Steps 1 to 4) */}
        {currentStep <= 4 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="text-blue-700 font-extrabold uppercase tracking-wider">
                Step {currentStep} of 4
              </span>
              <span className="text-slate-500">
                {currentStep === 1 && 'Personal Information'}
                {currentStep === 2 && 'Identity Verification'}
                {currentStep === 3 && 'Residential Location'}
                {currentStep === 4 && 'Create Login'}
              </span>
            </div>

            {/* Visual Step Progress Indicator */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="space-y-1">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentStep >= stepNum
                        ? 'bg-blue-600'
                        : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[10px] block text-center font-semibold ${
                      currentStep === stepNum
                        ? 'text-blue-700'
                        : currentStep > stepNum
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {stepNum === 1 && 'Details'}
                    {stepNum === 2 && 'Identity'}
                    {stepNum === 3 && 'Location'}
                    {stepNum === 4 && 'Login'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {serverError && <Alert variant="error">{serverError}</Alert>}

        {/* ========================================================================= */}
        {/* STEP 1: PERSONAL DETAILS */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Step 1 of 4
                </span>
                <CardTitle>Create Your Account</CardTitle>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="e.g. Aarav"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    error={errors.firstName}
                    autoFocus
                  />
                  <Input
                    label="Last Name"
                    placeholder="e.g. Shah"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    error={errors.lastName}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Mobile Number"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    error={errors.mobile}
                    helperText="10-digit Indian mobile number"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. aarav.shah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    error={errors.email}
                    helperText="For verified audit & project alerts"
                  />
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Already registered?{' '}
                    <Link to="/login" className="text-blue-700 font-bold hover:underline">
                      Login here
                    </Link>
                  </span>
                  <Button
                    type="submit"
                    variant="accent"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: IDENTITY VERIFICATION (AADHAAR) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Step 2 of 4
                </span>
                <CardTitle>Identity Verification</CardTitle>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-5">
                {/* Security Guarantee Notice */}
                <div className="p-3.5 bg-slate-900 text-slate-200 rounded-lg text-xs space-y-1 border border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    Protected Storage Guarantee
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Your Aadhaar number is encrypted at rest (AES-128/Fernet) and never stored in plain text.
                    It is never exposed in browser storage or return APIs, and will only display as <strong>XXXX-XXXX-LAST4</strong>.
                  </p>
                </div>

                <Input
                  label="12-Digit Aadhaar Number"
                  type="text"
                  placeholder="Enter 12 digits (e.g. 4567 8901 2345)"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  required
                  error={errors.aadhaar}
                  helperText="Enter exactly 12 numeric digits without spaces or dashes"
                  autoFocus
                />

                {/* Masked Preview */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Public Safe Masked Preview:</span>
                  <span className="font-mono font-bold text-blue-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                    {maskedAadhaarPreview}
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handlePrevStep}
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: RESIDENTIAL LOCATION (25 KM RADIUS CENTER) */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  Step 3 of 4
                </span>
                <CardTitle>Your Location</CardTitle>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNextStep} className="space-y-4">
                <Alert variant="info">
                  Your address determines the center of your <strong>25 KM nearby project discovery zone</strong>.
                  Coordinates are resolved automatically from your district and address.
                </Alert>

                <Input
                  label="Street Address / Neighborhood / Colony"
                  placeholder="e.g. 101 Ellis Bridge, Ashram Road"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  error={errors.address}
                  autoFocus
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Pincode (6 Digits)"
                    placeholder="e.g. 380006"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    error={errors.pincode}
                  />

                  <Select
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                    required
                    error={errors.state}
                  />

                  <Input
                    label="District"
                    placeholder="e.g. Ahmedabad"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    error={errors.district}
                  />
                </div>

                <Input
                  label="Sub-District / Taluka (Optional)"
                  placeholder="e.g. Ahmedabad City / Daskroi"
                  value={subDistrict}
                  onChange={(e) => setSubDistrict(e.target.value)}
                  helperText="Optional finer administrative jurisdiction"
                />

                {/* GPS Location Option */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-blue-700" />
                      Automatic Coordinate Resolution
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {coords
                        ? `GPS Fixed: ${coords.latitude}° N, ${coords.longitude}° E`
                        : geoMessage || 'Coordinates auto-calculated from your District/Pincode'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDetectGPS}
                    isLoading={geoLoading}
                    icon={Compass}
                  >
                    Detect My GPS
                  </Button>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handlePrevStep}
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: ACCOUNT CREDENTIALS (SUBMISSION) */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                  Step 4 of 4
                </span>
                <CardTitle>Create Login</CardTitle>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <Input
                  label="Username"
                  placeholder="e.g. aarav_shah"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  required
                  error={errors.username}
                  helperText="Lowercase letters, numbers, underscores (min 3 chars)"
                  autoFocus
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 chars (Aa1@)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      error={errors.password}
                      helperText="Must include upper, lower, number, and special character"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <Input
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    error={errors.confirmPassword}
                  />
                </div>

                {/* Account Role Notice */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Account Privilege Role: <strong>CIVILIAN</strong></span>
                  </div>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-blue-200 font-bold text-blue-800">
                    Public Transparency Access
                  </span>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    icon={ArrowLeft}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={CheckCircle2}
                    iconPosition="right"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: REGISTRATION SUCCESS SCREEN */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="p-8 bg-white border-2 border-emerald-400 rounded-2xl shadow-md text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Registration Complete
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Account created successfully.
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                Welcome, <strong>{registeredUser?.fullName || firstName}</strong>! Your civilian citizen account is active with role <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">CIVILIAN</span> and discovery center at <strong>{district}, {state}</strong>.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">Username:</span>
                <span className="font-mono font-bold text-slate-900">{registeredUser?.username || username}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                <span className="text-slate-500">Masked Aadhaar:</span>
                <span className="font-mono font-semibold text-slate-900">{registeredUser?.maskedAadhaar || maskedAadhaarPreview}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">25 KM Discovery Location:</span>
                <span className="font-medium text-slate-900">{district}, {state}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/login">
                <Button variant="accent" size="lg" icon={ArrowRight} iconPosition="right">
                  Login Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
