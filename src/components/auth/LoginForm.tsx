import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // For demo, use these emails with any password:
      // customer@example.com, agent@example.com, admin@example.com
      await login(email, password);
      
      // Redirect based on role
      if (email === 'admin@example.com') {
        navigate('/admin');
      } else if (email === 'agent@example.com') {
        navigate('/agent');
      } else {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          placeholder="Enter your email address"
          leftIcon={<Mail size={16} className="text-gray-500" />}
        />
      </div>
      
      <div>
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          placeholder="Enter your password"
          leftIcon={<Lock size={16} className="text-gray-500" />}
          helperText={
            <span className="text-right block w-full">
              <a href="#" className="text-primary hover:underline text-sm">
                Forgot password?
              </a>
            </span>
          }
        />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <div>
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-600">
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
      </p>
    </form>
  );
};

export default LoginForm;