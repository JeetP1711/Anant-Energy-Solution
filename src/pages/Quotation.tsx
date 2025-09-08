import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useApp } from '../context/AppContext';
import { PersonalDetails, SystemConfiguration, Project } from '../types';
import { calculateSystemMetrics, formatCurrency } from '../utils/calculations';
import { 
  User, 
  Settings, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Zap,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const personalDetailsSchema = yup.object({
  name: yup.string().required('Name is required'),
  phone: yup.string().required('Phone is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
});

const systemConfigSchema = yup.object({
  make: yup.string().required('Make is required'),
  wattPeak: yup.number().positive('Watt Peak must be positive').required('Watt Peak is required'),
  numberOfPanels: yup.number().positive('Number of panels must be positive').required('Number of panels is required'),
  basePricePerKw: yup.number().positive('Base price must be positive').required('Base price is required'),
  gstPercentage: yup.number().min(0).max(100).required('GST percentage is required'),
  cleaningCharges: yup.number().min(0).required('Cleaning charges is required'),
  subsidy: yup.number().min(0).required('Subsidy is required'),
});

type PersonalDetailsForm = yup.InferType<typeof personalDetailsSchema>;
type SystemConfigForm = yup.InferType<typeof systemConfigSchema>;

const Quotation: React.FC = () => {
  const navigate = useNavigate();
  const { addProject, settings } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration | null>(null);

  const personalForm = useForm<PersonalDetailsForm>({
    resolver: yupResolver(personalDetailsSchema),
  });

  const systemForm = useForm<SystemConfigForm>({
    resolver: yupResolver(systemConfigSchema),
    defaultValues: {
      basePricePerKw: settings.defaultBasePricePerKw,
      gstPercentage: settings.defaultGstPercentage,
      cleaningCharges: 0,
      subsidy: 0,
    },
  });

  const watchedSystemConfig = systemForm.watch();
  const calculations = systemConfig || watchedSystemConfig ? 
    calculateSystemMetrics(systemConfig || watchedSystemConfig as SystemConfiguration) : null;

  const handlePersonalDetailsSubmit = (data: PersonalDetailsForm) => {
    setPersonalDetails(data);
    setCurrentStep(2);
  };

  const handleSystemConfigSubmit = (data: SystemConfigForm) => {
    setSystemConfig(data);
    setCurrentStep(3);
  };

  const handleFinalSubmit = () => {
    if (!personalDetails || !systemConfig) return;

    const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
      personalDetails,
      systemConfiguration: systemConfig,
      calculations: calculateSystemMetrics(systemConfig),
      images: [],
      status: 'draft',
    };

    const projectId = addProject(projectData);
    toast.success('Quotation created successfully!');
    navigate(`/project/${projectId}`);
  };

  const steps = [
    { number: 1, title: 'Personal Details', icon: User },
    { number: 2, title: 'System Configuration', icon: Settings },
    { number: 3, title: 'Review & Generate', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quotation</h1>
          <p className="text-gray-600">Generate professional solar installation quotations</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-orange-500 text-white' 
                      : isCompleted 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-white text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                    <span className="font-medium hidden sm:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className={`h-5 w-5 ${isCompleted ? 'text-green-400' : 'text-gray-300'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Step 1: Personal Details */}
              {currentStep === 1 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
                  </div>

                  <form onSubmit={personalForm.handleSubmit(handlePersonalDetailsSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          {...personalForm.register('name')}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            personalForm.formState.errors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter full name"
                        />
                        {personalForm.formState.errors.name && (
                          <p className="mt-2 text-sm text-red-600">{personalForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          {...personalForm.register('phone')}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            personalForm.formState.errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter phone number"
                        />
                        {personalForm.formState.errors.phone && (
                          <p className="mt-2 text-sm text-red-600">{personalForm.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        {...personalForm.register('email')}
                        type="email"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          personalForm.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                      />
                      {personalForm.formState.errors.email && (
                        <p className="mt-2 text-sm text-red-600">{personalForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Installation Address
                      </label>
                      <textarea
                        {...personalForm.register('address')}
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          personalForm.formState.errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter installation address"
                      />
                      {personalForm.formState.errors.address && (
                        <p className="mt-2 text-sm text-red-600">{personalForm.formState.errors.address.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      Continue to System Configuration
                      <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
              )}

              {/* Step 2: System Configuration */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Settings className="h-6 w-6 text-orange-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
                  </div>

                  <form onSubmit={systemForm.handleSubmit(handleSystemConfigSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Panel Make
                        </label>
                        <input
                          {...systemForm.register('make')}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.make ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., Trina Solar, Jinko Solar"
                        />
                        {systemForm.formState.errors.make && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.make.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Watt Peak (W)
                        </label>
                        <input
                          {...systemForm.register('wattPeak', { valueAsNumber: true })}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.wattPeak ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 540"
                        />
                        {systemForm.formState.errors.wattPeak && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.wattPeak.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Panels
                        </label>
                        <input
                          {...systemForm.register('numberOfPanels', { valueAsNumber: true })}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.numberOfPanels ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 20"
                        />
                        {systemForm.formState.errors.numberOfPanels && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.numberOfPanels.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Base Price per kW (₹)
                        </label>
                        <input
                          {...systemForm.register('basePricePerKw', { valueAsNumber: true })}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.basePricePerKw ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 50000"
                        />
                        {systemForm.formState.errors.basePricePerKw && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.basePricePerKw.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Percentage (%)
                        </label>
                        <input
                          {...systemForm.register('gstPercentage', { valueAsNumber: true })}
                          type="number"
                          step="0.1"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.gstPercentage ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 13.8"
                        />
                        {systemForm.formState.errors.gstPercentage && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.gstPercentage.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cleaning Charges (₹)
                        </label>
                        <input
                          {...systemForm.register('cleaningCharges', { valueAsNumber: true })}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.cleaningCharges ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 5000"
                        />
                        {systemForm.formState.errors.cleaningCharges && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.cleaningCharges.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subsidy (₹)
                        </label>
                        <input
                          {...systemForm.register('subsidy', { valueAsNumber: true })}
                          type="number"
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            systemForm.formState.errors.subsidy ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 10000"
                        />
                        {systemForm.formState.errors.subsidy && (
                          <p className="mt-2 text-sm text-red-600">{systemForm.formState.errors.subsidy.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                      >
                        <ArrowLeft size={20} />
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        Review & Generate
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && personalDetails && systemConfig && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Review & Generate</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User size={18} />
                        Client Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{personalDetails.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Phone:</span>
                          <span className="ml-2 font-medium">{personalDetails.phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">{personalDetails.email}</span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-600">Address:</span>
                          <span className="ml-2 font-medium">{personalDetails.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings size={18} />
                        System Configuration
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Make:</span>
                          <span className="ml-2 font-medium">{systemConfig.make}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Watt Peak:</span>
                          <span className="ml-2 font-medium">{systemConfig.wattPeak}W</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Number of Panels:</span>
                          <span className="ml-2 font-medium">{systemConfig.numberOfPanels}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">System Size:</span>
                          <span className="ml-2 font-medium">{calculations?.systemSize} kW</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                      >
                        <ArrowLeft size={20} />
                        Back
                      </button>
                      <button
                        onClick={handleFinalSubmit}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-green-600 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Generate Quotation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                Live Preview
              </h3>

              {calculations && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">System Size</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{calculations.systemSize} kW</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Base Price:</span>
                      <span className="font-medium">{formatCurrency(calculations.totalBasePrice)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">GST:</span>
                      <span className="font-medium">{formatCurrency(calculations.gstAmount)}</span>
                    </div>
                    {systemConfig?.cleaningCharges > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Cleaning Charges:</span>
                        <span className="font-medium">{formatCurrency(systemConfig.cleaningCharges)}</span>
                      </div>
                    )}
                    {systemConfig?.subsidy > 0 && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-600">Subsidy:</span>
                        <span className="font-medium text-green-600">-{formatCurrency(systemConfig.subsidy)}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Total Payable</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(calculations.totalPayableAmount)}
                    </p>
                  </div>
                </div>
              )}

              {!calculations && (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Fill in the system configuration to see live calculations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotation;