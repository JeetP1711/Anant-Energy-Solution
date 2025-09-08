export interface User {
  id: string;
  email: string;
  role: 'admin';
  name: string;
  createdAt: string;
}

export interface PersonalDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface SystemConfiguration {
  make: string;
  wattPeak: number;
  numberOfPanels: number;
  basePricePerKw: number;
  gstPercentage: number;
  cleaningCharges: number;
  subsidy: number;
}

export interface Project {
  id: string;
  personalDetails: PersonalDetails;
  systemConfiguration: SystemConfiguration;
  calculations: {
    systemSize: number;
    totalBasePrice: number;
    gstAmount: number;
    totalPayableAmount: number;
  };
  images: string[];
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  defaultGstPercentage: number;
  defaultBasePricePerKw: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalKwInstalled: number;
  totalProjects: number;
  monthlyData: Array<{
    month: string;
    income: number;
    projects: number;
  }>;
}