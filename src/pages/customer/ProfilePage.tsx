import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, Camera } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CustomerLayout from '../../components/layout/CustomerLayout';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' +error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-primary">
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
              <p className="mt-1 text-sm text-white/80">
                Manage your account information
              </p>
            </div>

            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      label="Full Name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      fullWidth
                      leftIcon={<User size={16} className="text-gray-500" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      fullWidth
                      leftIcon={<Mail size={16} className="text-gray-500" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      fullWidth
                      leftIcon={<Phone size={16} className="text-gray-500" />}
                    />
                  </div>

                  {message.text && (
                    <div className={`rounded-md p-4 ${
                      message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isLoading}
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
      </div>
    </CustomerLayout>
  );
};

export default ProfilePage;