import React, { useRef } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';


interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'register';
  onSwitchType: (type: 'login' | 'register') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type, onSwitchType }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
  //       onClose();
  //     }
  //   };

  //   // if (isOpen) {
  //   //   document.addEventListener('mousedown', handleClickOutside);
  //   // }

  //   // return () => {
  //   //   document.removeEventListener('mousedown', handleClickOutside);
  //   // };
  // }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn"
      >
        <div className="absolute right-0 top-0 p-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {type === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {type === 'login'
                ? "Don't have an account?"
                : "Already have an account?"}
              {' '}
              <button
                onClick={() => onSwitchType(type === 'login' ? 'register' : 'login')}
                className="text-primary hover:text-primary-dark font-medium"
              >
                {type === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {type === 'login' ? (
            <LoginForm onLoginSuccess={onClose} />
          ) : (
            <RegisterForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;