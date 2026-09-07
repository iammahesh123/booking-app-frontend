import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, UserPlus, Mail, Phone, ShieldCheck, UserCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import DataTable, { ColumnDef } from '../../components/ui/DataTable';
import { User } from '../../data/types';
import { mockUsers } from '../../data/MockData';
import toast from 'react-hot-toast';

type RoleFilter = 'ALL' | 'CUSTOMER' | 'AGENT' | 'ADMIN';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [activeRoleFilter, setActiveRoleFilter] = useState<RoleFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CUSTOMER' as 'CUSTOMER' | 'AGENT' | 'ADMIN'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'CUSTOMER'
    });
    setEditingUser(null);
  };

  const handleOpenAddUser = (role: 'CUSTOMER' | 'AGENT' = 'CUSTOMER') => {
    resetForm();
    setFormData(prev => ({ ...prev, role }));
    setShowModal(true);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    if (editingUser) {
      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
      toast.success('User updated successfully');
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        ...formData
      };
      setUsers(prev => [newUser, ...prev]);
      toast.success(`${formData.role === 'AGENT' ? 'Agent' : 'User'} registered successfully`);
    }

    setShowModal(false);
    resetForm();
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    toast.success(`User ${deleteTarget.name} deleted`);
    setDeleteTarget(null);
  };

  const filteredUsers = useMemo(() => {
    let result = users;
    if (activeRoleFilter !== 'ALL') {
      result = result.filter(u => u.role === activeRoleFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.phone && u.phone.toLowerCase().includes(q))
      );
    }
    return result;
  }, [users, activeRoleFilter, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, page, pageSize]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      customer: users.filter(u => u.role === 'CUSTOMER').length,
      agent: users.filter(u => u.role === 'AGENT').length,
      admin: users.filter(u => u.role === 'ADMIN').length
    };
  }, [users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldCheck size={12} />
            Administrator
          </span>
        );
      case 'AGENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <UserCheck size={12} />
            Travel Agent
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Passenger
          </span>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const columns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'User / Identity',
      sortable: true,
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-blue-500 text-white font-semibold flex items-center justify-center text-xs shadow-sm flex-shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <div className="font-medium text-gray-900 leading-tight">{user.name}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Mail size={12} /> {user.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: 'Phone Number',
      sortable: true,
      render: (user: User) => (
        <span className="text-sm text-gray-600 flex items-center gap-1.5">
          {user.phone ? (
            <>
              <Phone size={13} className="text-gray-400" />
              {user.phone}
            </>
          ) : (
            <span className="text-gray-400 italic font-mono text-xs">—</span>
          )}
        </span>
      )
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: (user: User) => getRoleBadge(user.role)
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (user: User) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => handleOpenEditUser(user)}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
            title="Edit User"
            aria-label="Edit User"
          >
            <Edit size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(user)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete User"
            aria-label="Delete User"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Users & Access Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Oversee system administrators, registered booking agents, and retail customers.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => handleOpenAddUser('AGENT')}
            leftIcon={<UserPlus size={16} />}
          >
            Add Agent
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpenAddUser('CUSTOMER')}
            leftIcon={<Plus size={16} />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'ALL', label: 'All Users', count: counts.all },
          { id: 'CUSTOMER', label: 'Customers', count: counts.customer },
          { id: 'AGENT', label: 'Agents', count: counts.agent },
          { id: 'ADMIN', label: 'Admins', count: counts.admin }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveRoleFilter(tab.id as RoleFilter);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeRoleFilter === tab.id
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeRoleFilter === tab.id ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Data Table */}
      <DataTable
        columns={columns}
        data={paginatedUsers}
        totalRecords={filteredUsers.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        searchTerm={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        keyExtractor={(item: User) => item.id}
        searchPlaceholder="Search by name, email, or role..."
        emptyMessage="No users matching current filters."
      />

      {/* Add / Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingUser ? `Edit ${editingUser.name}` : `Create New ${formData.role === 'AGENT' ? 'Agent' : 'User'}`}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Legal Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Sharma"
            required
            fullWidth
          />
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@example.com"
            required
            fullWidth
          />
          <Input
            label="Contact Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Account Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="CUSTOMER">Customer (Passenger booking tickets)</option>
              <option value="AGENT">Travel Agent (Commercial bookings)</option>
              <option value="ADMIN">System Administrator (Full dispatch control)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? 'Update Account' : 'Register User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Revoke & Delete User"
        message={`Are you sure you want to permanently delete ${deleteTarget?.name} (${deleteTarget?.email})? This action cannot be undone.`}
        confirmText="Delete User"
        variant="danger"
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default UsersPage;