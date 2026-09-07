import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Camera, ShieldCheck, CheckCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CustomerLayout from '../../components/layout/CustomerLayout';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePicture: user?.profilePicture || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData(prev => ({ ...prev, profilePicture: result }));
        updateUser({ profilePicture: result });
        toast.success('Profile picture updated');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateUser({
        name: formData.name,
        phone: formData.phone,
        profilePicture: formData.profilePicture,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="bg-gray-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account & Profile</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal contact details, preferences, and verified credentials.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Personal Profile</h2>
                <p className="text-xs text-blue-100 mt-0.5">
                  Role: {user?.role || 'CUSTOMER'}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-sm">
                <ShieldCheck size={14} /> Verified Member
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Profile Avatar */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt={formData.name || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-extrabold text-primary">
                        {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="h-10 w-10 text-primary" />}
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change profile photo"
                    className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-md hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Click camera icon to upload photo (PNG, JPG up to 2MB)</p>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  fullWidth
                  leftIcon={<User size={16} className="text-gray-400" />}
                />

                <Input
                  label="Email Address (Account ID)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  required
                  fullWidth
                  helperText="Registered email address cannot be changed."
                  leftIcon={<Mail size={16} className="text-gray-400" />}
                />

                <Input
                  label="Mobile Contact Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  fullWidth
                  leftIcon={<Phone size={16} className="text-gray-400" />}
                />

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                            profilePicture: user?.profilePicture || '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        leftIcon={<CheckCircle size={16} />}
                      >
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;