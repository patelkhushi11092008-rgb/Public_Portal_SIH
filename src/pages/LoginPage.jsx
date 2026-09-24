import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Shield, ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import { useCivilianAuth } from '../context/CivilianAuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useCivilianAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCivilian = () => {
    setUsername('aarav_shah');
    setPassword('CivilianPassword@123');
    setError('');
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="Civilian Citizen Login"
        subtitle="Sign in to your JanNirikshan account to access nearby infrastructure projects, submit ground observations, and track issues."
        breadcrumbs={[{ label: 'Login' }]}
      />

      <div className="max-w-md mx-auto px-4 mt-10 space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <CardHeader>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                JanNirikshan Portal
              </span>
              <CardTitle>Sign In as Civilian</CardTitle>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                  <span>Remember session</span>
                </label>
                <Link to="/forgot-password" className="text-blue-700 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="accent"
                  size="md"
                  className="w-full justify-center"
                  isLoading={isSubmitting}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Sign In to Dashboard
                </Button>
              </div>
            </form>

            {/* Quick Demo Login Option */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500 block mb-2">Quick Evaluation Demo:</span>
              <button
                type="button"
                onClick={handleFillDemoCivilian}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Fill Registered Demo Civilian (Aarav Shah)
              </button>
            </div>
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 text-xs text-slate-600">
            <span>Don't have a civilian account? </span>
            <Link to="/register" className="ml-1 text-blue-700 font-bold hover:underline">
              Register here
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

