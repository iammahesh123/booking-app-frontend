import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldAlert, Ban, RefreshCw } from 'lucide-react';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'available'
  | 'booked'
  | 'blocked';

interface StatusBadgeProps {
  status: string | StatusType;
  size?: 'sm' | 'md';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const normalized = (status || '').toLowerCase();

  const getStatusConfig = () => {
    switch (normalized) {
      case 'active':
      case 'confirmed':
      case 'completed':
      case 'available':
      case 'paid':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
        };
      case 'pending':
      case 'processing':
      case 'waiting':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          dot: 'bg-amber-500',
          icon: <Clock className="w-3.5 h-3.5" />,
          label: 'Pending',
        };
      case 'cancelled':
      case 'failed':
      case 'rejected':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          dot: 'bg-red-500',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
        };
      case 'refunded':
        return {
          bg: 'bg-blue-50 border-blue-200 text-blue-700',
          dot: 'bg-blue-500',
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          label: 'Refunded',
        };
      case 'blocked':
        return {
          bg: 'bg-orange-50 border-orange-200 text-orange-700',
          dot: 'bg-orange-500',
          icon: <Ban className="w-3.5 h-3.5" />,
          label: 'Blocked',
        };
      case 'inactive':
      default:
        return {
          bg: 'bg-gray-50 border-gray-200 text-gray-600',
          dot: 'bg-gray-400',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          label: normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Unknown',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${sizeClasses} ${className}`}
    >
      {showIcon ? (
        <span className="flex-shrink-0">{config.icon}</span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
