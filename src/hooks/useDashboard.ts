import { useEffect, useState } from 'react';

export interface DashboardData {
  balance: number;
  currency: string;
  pendingRequests: number;
  devices: POSDevice[];
}

export interface POSDevice {
  id: string;
  serialNumber: string;
  model: string;
  addressName?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'offline';
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Mock API call - replace with actual API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockData: DashboardData = {
          balance: 15420.50,
          currency: 'LYD',
          pendingRequests: 12,
          devices: [
            {
              id: 'POS-001',
              serialNumber: 'SN123456789',
              model: 'A75 Pro',
              addressName: 'Store #5, Downtown',
              status: 'active',
            },
            {
              id: 'POS-002',
              serialNumber: 'SN987654321',
              model: 'C500',
              addressName: 'Store #12, Mall',
              status: 'active',
            },
            {
              id: 'POS-003',
              serialNumber: 'SN555666777',
              model: 'A75 Pro',
              addressName: 'Store #8, Uptown',
              status: 'active',
            },
            {
              id: 'POS-004',
              serialNumber: 'SN111222333',
              model: 'C500',
              addressName: 'Store #8, Uptown',
              status: 'inactive',
            },
          ],
        };
        
        setData(mockData);
      } catch {
        setError('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, isLoading, error };
};