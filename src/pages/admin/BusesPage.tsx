import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Bus } from '../../types';
import { mockBuses } from '../../components/utils/MockData';

const BusesPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    busNumber: '',
    busType: 'AC',
    totalSeats: 40,
    amenities: [] as string[],
    operator: ''
  });

  const filteredBuses = buses.filter(bus => 
    bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.operator.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddBus = () => {
    const newBus: Bus = {
      id: `bus${Date.now()}`,
      ...formData
    };
    setBuses([...buses, newBus]);
    setShowAddModal(false);
    setFormData({
      name: '',
      busNumber: '',
      busType: 'AC',
      totalSeats: 40,
      amenities: [],
      operator: ''
    });
  };

  const handleDeleteBus = (busId: string) => {
    setBuses(buses.filter(bus => bus.id !== busId));
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Buses Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your fleet of buses, their details, and amenities
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus size={20} />}
          >
            Add Bus
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Input
          type="text"
          placeholder="Search buses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={20} />}
          fullWidth
        />
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Bus Details
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Seats
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Operator
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Amenities
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredBuses.map((bus) => (
                    <tr key={bus.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="font-medium text-gray-900">{bus.name}</div>
                        <div className="text-gray-500">{bus.busNumber}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {bus.busType}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {bus.totalSeats}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {bus.operator}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {bus.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedBus(bus)}
                            className="text-primary hover:text-primary-dark"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBus(bus.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">
              {selectedBus ? 'Edit Bus' : 'Add New Bus'}
            </h3>
            <form className="space-y-4">
              <Input
                label="Bus Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <Input
                label="Bus Number"
                value={formData.busNumber}
                onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                required
                fullWidth
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">Bus Type</label>
                <select
                  value={formData.busType}
                  onChange={(e) => setFormData({ ...formData, busType: e.target.value as any })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Sleeper">Sleeper</option>
                  <option value="Semi-Sleeper">Semi-Sleeper</option>
                </select>
              </div>
              <Input
                label="Total Seats"
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) })}
                required
                fullWidth
              />
              <Input
                label="Operator"
                value={formData.operator}
                onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                required
                fullWidth
              />
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddBus}
                >
                  {selectedBus ? 'Save Changes' : 'Add Bus'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusesPage;