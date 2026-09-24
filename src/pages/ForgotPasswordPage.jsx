import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Shield } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/common/Card';
import { forgotPassword } from '../services/civilianApi';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your registered username, email, or mobile number.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await forgotPassword(identifier.trim());
      setMessage(res.message || 'Password reset instructions have been dispatched.');
    } catch (err) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      <PageHeader
        title="Reset Password"
        subtitle="Recover access to your JanNirikshan civilian account."
        breadcrumbs={[{ label: 'Login', path: '/login' }, { label: 'Forgot Password' }]}
      />

      <div className="max-w-md mx-auto px-4 mt-10 space-y-6">
        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <CardHeader>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                Account Recovery
              </span>
              <CardTitle>Civilian Password Reset</CardTitle>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            {message ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Request Received</h3>
                <p className="text-xs text-slate-600">{message}</p>
                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="primary" size="sm">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Username, Email, or Mobile"
                  placeholder="e.g. aarav_shah or aarav@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  autoFocus
                  helperText="We will verify your civilian account credentials"
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="accent"
                    size="md"
                    className="w-full justify-center"
                    isLoading={isSubmitting}
                  >
                    Send Reset Instructions
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="justify-center border-t border-slate-100 text-xs text-slate-600">
            <Link to="/login" className="flex items-center gap-1 text-blue-700 font-semibold hover:underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

