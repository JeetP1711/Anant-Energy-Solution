import { SystemConfiguration } from '../types';

export const calculateSystemMetrics = (config: SystemConfiguration) => {
  const systemSize = (config.wattPeak * config.numberOfPanels) / 1000; // kW
  const totalBasePrice = systemSize * config.basePricePerKw;
  const gstAmount = (totalBasePrice * config.gstPercentage) / 100;
  const totalPayableAmount = totalBasePrice + gstAmount + config.cleaningCharges - config.subsidy;

  return {
    systemSize: Math.round(systemSize * 100) / 100,
    totalBasePrice: Math.round(totalBasePrice),
    gstAmount: Math.round(gstAmount),
    totalPayableAmount: Math.round(totalPayableAmount),
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};