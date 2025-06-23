import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';

interface ForgotPasswordProps {
    isOpen: boolean;
    onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Add your password reset logic here
            // Example API call:
            // await api.sendPasswordResetEmail(email);

            toast.success("Password reset link sent to your email");
            onClose();
        } catch (err) {
            setError(err.message || "Failed to send reset link");
            toast.error("Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Forgot Password" size="md"    >
            <div className="text-center mb-6">
                <p className="mt-2 text-sm text-gray-600">
                    Enter your email to receive a password reset link
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={isLoading}
                >
                    Send Reset Link
                </Button>
            </form>
        </Modal>
    );
};

export default ForgotPassword;