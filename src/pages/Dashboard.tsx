import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Zap, 
  FolderOpen, 
  Plus,
  Eye,
  Calendar,
  Download,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatNumber } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { projects, getDashboardStats } = useApp();
  const stats = getDashboardStats();

  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your solar projects.</p>
        </div>
        <Link
          to="/quotation"
          className="mt-4 lg:mt-0 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus size={20} />
          New Quotation
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalIncome)}
              </p>
              <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                <TrendingUp size={16} />
                +12% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total kW Installed</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.totalKwInstalled)} kW
              </p>
              <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                <Zap size={16} />
                Clean energy generated
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.totalProjects)}
              </p>
              <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                <FolderOpen size={16} />
                {projects.filter(p => p.status === 'completed').length} completed
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <FolderOpen className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Projects */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Monthly Performance Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Monthly Performance</h2>
            <div className="p-2 bg-gray-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666" 
                  fontSize={12}
                />
                <YAxis 
                  stroke="#666" 
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    background: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'income' ? formatCurrency(value) : value,
                    name === 'income' ? 'Income' : 'Projects'
                  ]}
                />
                <Bar 
                  dataKey="income" 
                  fill="url(#colorGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
            <Link 
              to="/projects" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All
              <Eye size={16} />
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No projects yet</p>
              <Link
                to="/quotation"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={16} />
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {project.personalDetails.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {project.calculations.systemSize} kW • {formatCurrency(project.calculations.totalPayableAmount)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(project.createdAt), 'MMM dd, yyyy')}
                      </span>
                      <span className={`px-2 py-1 rounded-full ${
                        project.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/project/${project.id}`}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;