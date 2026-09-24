import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  MapPin,
  Compass,
  Phone,
  Mail,
  CreditCard,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Save,
  LogOut,
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Alert from '../components/common/Alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import { useCivilianAuth } from '../context/CivilianAuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry'
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useCivilianAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [state, setState] = useState('Gujarat');
  const [district, setDistrict] = useState('');
  const [subDistrict, setSubDistrict] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setMobile(user.mobile || '');
      setEmail(user.email || '');
      setAddress(user.address || '');
      setPincode(user.pincode || '');
      setState(user.state || 'Gujarat');
      setDistrict(user.district || '');
      setSubDistrict(user.subDistrict || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);

    try {
      await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        address: address.trim(),
        pincode: pincode.trim(),
        state: state.trim(),
        district: district.trim(),
        sub_district: subDistrict.trim() || null,
      });

      setMessage('Profile and geographic location coordinates updated successfully! Projects within 25 km have been refreshed.');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="pb-20">
      <PageHeader
        title="Civilian Profile & Location Settings"
        subtitle="Manage your identity, residential address, and geographic discovery center."
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Profile' }]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>
            <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
              Logout
            </Button>
          </div>
        }
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="error">{error}</Alert>}

        {/* Identity & Aadhaar Protection Card */}
        <Card>
          <CardHeader>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                UIDAI Protected Credential
              </span>
              <CardTitle>Aadhaar Identity Verification</CardTitle>
            </div>
            <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">Masked Aadhaar Number</span>
                <span className="font-mono text-base font-bold text-slate-900 bg-white px-3 py-1 rounded border border-slate-200 inline-block">
                  {user.maskedAadhaar || 'XXXX-XXXX-XXXX'}
                </span>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Encrypted At Rest
                </span>
                <p className="text-[11px] text-slate-400">
                  Full 12-digit number is never stored in plain text or exposed in API.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  Civilian Account
                </span>
                <CardTitle>Personal Details</CardTitle>
              </div>
              <User className="w-4 h-4 text-slate-400" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Username"
                  value={user.username}
                  disabled
                  helperText="Username cannot be altered"
                />
                <Input
                  label="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Location & Address */}
          <Card>
            <CardHeader>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Geospatial Discovery
                </span>
                <CardTitle>Residential Address & Discovery Center</CardTitle>
              </div>
              <MapPin className="w-4 h-4 text-amber-600" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="info">
                Changing your Address, District, or State automatically recalculates your geographic latitude/longitude ({user.latitude?.toFixed(4)}° N, {user.longitude?.toFixed(4)}° E) and updates all 25 km nearby project results.
              </Alert>

              <Input
                label="Street Address / Neighborhood"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />

                <Select
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  options={INDIAN_STATES.map((s) => ({ value: s, label: s }))}
                  required
                />

                <Input
                  label="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Sub-District / Taluka (Optional)"
                value={subDistrict}
                onChange={(e) => setSubDistrict(e.target.value)}
              />

              {/* Coordinates Display */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Active Geospatial Coordinates:
                </span>
                <span className="font-bold text-blue-900">
                  {user.latitude}° N, {user.longitude}° E
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="accent"
                size="md"
                isLoading={isSaving}
                icon={Save}
                iconPosition="right"
              >
                Save & Update Location
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

