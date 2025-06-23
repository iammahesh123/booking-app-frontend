// components/ui/Modal.tsx
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, size = 'md', className = '' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg'
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}>
            <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} relative animate-fadeIn ${className}`}
                onClick={(e) => e.stopPropagation()}>

                {title && (
                    <div className="flex items-center justify-between border-b p-4 pb-4">
                        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
                            <X size={24} />
                        </button>
                    </div>
                )}

                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;