import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [state, setState] = useState({
    email: '',
    password: '',
    error: '',
    isLoading: false,
    showPassword: false,
  })

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: '' }));
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // For demo, use these emails with any password:
      // customer@example.com, agent@example.com, admin@example.com
      const user = await login(state.email, state.password);

      const userData = localStorage.getItem('busBookingUser');
      if (!userData) {
        throw new Error('Authentication failed');
      }

      const { role } = JSON.parse(userData);

      // Role-based navigation
      // switch (role.toLowerCase()) {
      //   case 'admin':
      //     navigate('/admin');
      //     break;
      //   case 'driver':
      //     navigate('/driver/dashboard');
      //     break;
      //   case 'customer':
      //     navigate('/');
      //     break;
      //   default:
      //     navigate('/');
      // }
      window.location.reload();

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      setState((prev) => ({ ...prev, error: error.message }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Email"
          type="email"
          value={state.email}
          onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
          required
          fullWidth
          placeholder="Enter your email address"
          leftIcon={<Mail size={16} className="text-gray-500" />}
        />
      </div>

      <div>
        <Input
          label="Password"
          type={state.showPassword ? "text" : "password"}
          value={state.password}
          onChange={(e) => setState((prev) => ({ ...prev, password: e.target.value }))}
          required
          fullWidth
          placeholder="Enter your password"
          leftIcon={<Lock size={16} className="text-gray-500" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setState((prev) => ({ ...prev, showPassword: (!state.showPassword) }))}
              className="text-gray-500 focus:outline-none"
            >
              {state.showPassword ? (
                <Eye className='h-4 w-4' />
              ) : (
                <EyeOff className='h-4 w-4' />
              )}
            </button>
          }
          helperText={
            <span className="text-right block w-full">
              <a href="#" className="text-primary hover:underline text-sm">
                Forgot password?
              </a>
            </span>
          }
        />
      </div>

      {state.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <div>
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={state.isLoading}
        >
          Sign In
        </Button>
      </div>

      {/* <p className="text-center text-sm text-gray-600">
        Don't have an account yet?{' '}
        <a 
          href="/register" 
          className="text-primary hover:underline font-medium"
          onClick={(e) => {
            e.preventDefault();
            navigate('/register');
          }}
        >
          Sign up
        </a>
      </p> */}
    </form>
  );
};

export default LoginForm;