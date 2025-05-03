import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    general: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validate = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
      valid = false;
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      
      navigate('/');
    }  finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
          placeholder="Enter your full name"
          leftIcon={<User size={16} className="text-gray-500" />}
          error={errors.name}
        />
      </div>
      
      <div>
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          fullWidth
          placeholder="Enter your email address"
          leftIcon={<Mail size={16} className="text-gray-500" />}
          error={errors.email}
        />
      </div>
      
      <div>
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          placeholder="Enter your phone number (optional)"
          leftIcon={<Phone size={16} className="text-gray-500" />}
          error={errors.phone}
        />
      </div>
      
      <div>
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          fullWidth
          placeholder="Create a password"
          leftIcon={<Lock size={16} className="text-gray-500" />}
          error={errors.password}
          helperText="Password must be at least 6 characters"
        />
      </div>
      
      <div>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          fullWidth
          placeholder="Confirm your password"
          leftIcon={<Lock size={16} className="text-gray-500" />}
          error={errors.confirmPassword}
        />
      </div>
      
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
      
      <div className="pt-2">
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </div>
      
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a 
          href="/login" 
          className="text-primary hover:underline font-medium"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
        >
          Sign in
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;