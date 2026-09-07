import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Save, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    platformName: 'BlueBus Logistics Platform',
    supportEmail: 'operations@bluebus.com',
    supportPhone: '+91 1800 200 4567',
    serviceFee: '50',
    gstRate: '5',
    maxHoldMinutes: '10',
    smsNotifications: true,
    emailNotifications: true,
    autoDispatchSchedules: true,
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('System configuration saved successfully');
    }, 600);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-primary w-6 h-6" />
            System & Fleet Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure global platform variables, tax rates, fee structures, and notifications.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Platform Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            General Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Platform Brand Name"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Operations Support Email"
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Toll-free Hotline"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="Seat Hold Expiry (Minutes)"
              type="number"
              value={settings.maxHoldMinutes}
              onChange={(e) => setSettings({ ...settings, maxHoldMinutes: e.target.value })}
              required
              min="3"
              max="30"
              fullWidth
            />
          </div>
        </div>

        {/* Commercial & Tax Structure */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Commercial & Tax Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Standard Convenience Fee (₹)"
              type="number"
              value={settings.serviceFee}
              onChange={(e) => setSettings({ ...settings, serviceFee: e.target.value })}
              required
              fullWidth
            />
            <Input
              label="GST / VAT Rate (%)"
              type="number"
              value={settings.gstRate}
              onChange={(e) => setSettings({ ...settings, gstRate: e.target.value })}
              required
              fullWidth
            />
          </div>
        </div>

        {/* Notification Switches */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Operational Alerts
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-gray-900">SMS Passenger Ticket Dispatch</p>
                <p className="text-xs text-gray-500">Send automated booking SMS with bus and conductor contact</p>
              </div>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Confirmation & PDF Attachment</p>
                <p className="text-xs text-gray-500">Send complete digital invoice and boarding pass to traveler email</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
            leftIcon={<Save size={16} />}
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
