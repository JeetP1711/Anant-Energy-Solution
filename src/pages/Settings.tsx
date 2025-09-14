import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  DollarSign, 
  Percent, 
  Download, 
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';

const schema = yup.object({
  defaultGstPercentage: yup.number().min(0).max(100).required('GST percentage is required'),
  defaultBasePricePerKw: yup.number().positive('Base price must be positive').required('Base price is required'),
});

type SettingsForm = yup.InferType<typeof schema>;

const Settings: React.FC = () => {
  const { settings, updateSettings, exportData, projects } = useApp();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<SettingsForm>({
    resolver: yupResolver(schema),
    defaultValues: settings,
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettings(data);
    toast.success('Settings updated successfully!');
  };

  const handleExportData = () => {
    exportData();
    toast.success('Data exported successfully!');
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600">Manage your system preferences and default values</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Default Values</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-gray-500" />
                      Default GST Percentage (%)
                    </div>
                  </label>
                  <input
                    {...register('defaultGstPercentage', { valueAsNumber: true })}
                    type="number"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.defaultGstPercentage ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 13.8"
                  />
                  {errors.defaultGstPercentage && (
                    <p className="mt-2 text-sm text-red-600">{errors.defaultGstPercentage.message}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    This GST percentage will be used as default for new quotations
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      Default Base Price per kW (₹)
                    </div>
                  </label>
                  <input
                    {...register('defaultBasePricePerKw', { valueAsNumber: true })}
                    type="number"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.defaultBasePricePerKw ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 50000"
                  />
                  {errors.defaultBasePricePerKw && (
                    <p className="mt-2 text-sm text-red-600">{errors.defaultBasePricePerKw.message}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    This price will be used as default for new quotations
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!isDirty}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  Save Settings
                </button>
              </form>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Data Management */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Data Management</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Export Data</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Download all your projects as a JSON file
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Export Projects ({projects.length})
                  </button>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-900">Danger Zone</span>
                  </div>
                  <p className="text-sm text-red-700 mb-3">
                    This will permanently delete all your data
                  </p>
                  <button
                    onClick={handleClearAllData}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">System Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Projects:</span>
                  <span className="font-medium">{projects.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Projects:</span>
                  <span className="font-medium text-green-600">
                    {projects.filter(p => p.status === 'completed').length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Draft Projects:</span>
                  <span className="font-medium text-yellow-600">
                    {projects.filter(p => p.status === 'draft').length}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team for assistance with your solar management system.
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <strong>Email:</strong> support@anantenergy.com
                </p>
                <p className="text-gray-600">
                  <strong>Phone:</strong> +91 97734 76431
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;