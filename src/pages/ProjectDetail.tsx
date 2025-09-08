import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { generateQuotationPDF } from '../utils/pdfGenerator';
import {
  ArrowLeft,
  Download,
  Edit,
  Camera,
  User,
  Settings,
  Calculator,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Zap,
  DollarSign,
  FileText,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProject, updateProject } = useApp();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const project = id ? getProject(id) : null;

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateQuotationPDF(project);
      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleStatusChange = (status: 'draft' | 'completed') => {
    updateProject(project.id, { status });
    toast.success(`Project marked as ${status}!`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Simulate image upload (in real app, upload to cloud storage)
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      updateProject(project.id, { 
        images: [...project.images, ...newImages] 
      });
      toast.success(`${files.length} image(s) uploaded successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all duration-200"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project.personalDetails.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
                <span className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar size={16} />
                  Created {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
            >
              <Download size={20} />
              {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
            </button>
            
            <button
              onClick={() => navigate(`/quotation?edit=${project.id}`)}
              className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-lg"
            >
              <Edit size={20} />
              Edit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* Client Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Client Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{project.personalDetails.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{project.personalDetails.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{project.personalDetails.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Installation Address</p>
                    <p className="font-medium text-gray-900">{project.personalDetails.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Configuration */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-gray-600">System Size</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {project.calculations.systemSize} kW
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">Number of Panels</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {project.systemConfiguration.numberOfPanels}
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    <span className="text-sm text-gray-600">Watt Peak</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {project.systemConfiguration.wattPeak}W
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Technical Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Panel Make:</span>
                    <span className="ml-2 font-medium">{project.systemConfiguration.make}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Base Price per kW:</span>
                    <span className="ml-2 font-medium">{formatCurrency(project.systemConfiguration.basePricePerKw)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">GST Rate:</span>
                    <span className="ml-2 font-medium">{project.systemConfiguration.gstPercentage}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Cleaning Charges:</span>
                    <span className="ml-2 font-medium">{formatCurrency(project.systemConfiguration.cleaningCharges)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Images */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Camera className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Images</h2>
                </div>
                
                <label className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:from-purple-700 hover:to-purple-600 transition-all duration-200 cursor-pointer">
                  <Camera size={20} />
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {project.images.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
                  <Camera className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No images uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-2">Upload project images to document the installation</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Project image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-8">
            {/* Financial Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calculator className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Financial Summary</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Base Price:</span>
                  <span className="font-medium">{formatCurrency(project.calculations.totalBasePrice)}</span>
                </div>
                
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">GST ({project.systemConfiguration.gstPercentage}%):</span>
                  <span className="font-medium">{formatCurrency(project.calculations.gstAmount)}</span>
                </div>
                
                {project.systemConfiguration.cleaningCharges > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Cleaning Charges:</span>
                    <span className="font-medium">{formatCurrency(project.systemConfiguration.cleaningCharges)}</span>
                  </div>
                )}
                
                {project.systemConfiguration.subsidy > 0 && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Subsidy:</span>
                    <span className="font-medium text-green-600">-{formatCurrency(project.systemConfiguration.subsidy)}</span>
                  </div>
                )}
                
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">Total Payable</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(project.calculations.totalPayableAmount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Project Status */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Project Status</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleStatusChange('draft')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    project.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Clock size={20} />
                  <span className="font-medium">Draft</span>
                </button>
                
                <button
                  onClick={() => handleStatusChange('completed')}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <CheckCircle size={20} />
                  <span className="font-medium">Completed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;