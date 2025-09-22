const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DashboardMetrics {
  totalUsers: number;
  trainingCompleted: number;
  simulationsRun: number;
  riskScore: string;
  userGrowth: number;
  trainingGrowth: number;
  simulationGrowth: number;
  riskImprovement: number;
}

export interface UserGroup {
  id: string;
  name: string;
  count: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  lastTraining: string;
  status: 'active' | 'pending' | 'inactive';
  department?: string;
}

export interface RecentEnrollment {
  id: string;
  name: string;
  department: string;
  role: string;
  enrolledAt: string;
  status: 'completed' | 'in_progress' | 'pending';
  email: string;
}

export interface SecurityAlert {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  description: string;
  time: string;
  status: 'active' | 'resolved' | 'pending' | 'investigating';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  campaignId?: string;
}

export interface TrainingProgram {
  id: string;
  name: string;
  progress: number;
  participants: number;
  completed: number;
  nextSession: string;
  status: 'active' | 'completed' | 'paused' | 'draft';
  type: string;
  level: string;
}

export interface SimulationData {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  participants: number;
  clickRate: number;
  lastRun: string;
  nextRun: string;
  description: string;
  vulnerabilityScore: number;
}

export interface ReportData {
  id: string;
  name: string;
  type: string;
  period: string;
  status: 'ready' | 'generating' | 'error';
  lastGenerated: string;
  fileUrl?: string;
  metrics: {
    totalSent?: number;
    totalOpened?: number;
    totalClicked?: number;
    totalReported?: number;
    vulnerabilityScore?: number;
  };
}

export interface ActivityLog {
  id: string;
  type: 'training' | 'simulation' | 'login' | 'alert' | 'system';
  user: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'error';
  details?: any;
}

export interface KeyMetrics {
  name: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  color: string;
}

export interface SystemStatus {
  database: string;
  emailService: string;
  simulationEngine: string;
  reportingEngine: string;
  lastCheck: string;
  uptime: string;
  activeSimulations: number;
  activeUsers: number;
  alertsToday: number;
}

class AdminService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      // Temporarily disable auth for testing
      // 'Authorization': `Bearer ${token}`,
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || data;
  }

  // Dashboard Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.makeRequest<DashboardMetrics>('/admin/dashboard/metrics');
  }

  // User Management
  async getUserGroups(): Promise<UserGroup[]> {
    return this.makeRequest<UserGroup[]>('/admin/users/groups');
  }

  async getRecentEnrollments(): Promise<RecentEnrollment[]> {
    return this.makeRequest<RecentEnrollment[]>('/admin/users/enrollments');
  }

  async createUserGroup(groupData: Partial<UserGroup>): Promise<UserGroup> {
    return this.makeRequest<UserGroup>('/admin/users/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async addUserToGroup(userId: string, groupId: string): Promise<void> {
    return this.makeRequest<void>('/admin/users/groups/add', {
      method: 'POST',
      body: JSON.stringify({ userId, groupId }),
    });
  }

  async removeUserFromGroup(userId: string, groupId: string): Promise<void> {
    return this.makeRequest<void>('/admin/users/groups/remove', {
      method: 'POST',
      body: JSON.stringify({ userId, groupId }),
    });
  }

  // Security Alerts
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    return this.makeRequest<SecurityAlert[]>('/admin/security/alerts');
  }

  async updateAlertStatus(alertId: string, status: SecurityAlert['status']): Promise<void> {
    return this.makeRequest<void>(`/api/admin/security/alerts/${alertId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Training Programs
  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    return this.makeRequest<TrainingProgram[]>('/admin/training/programs');
  }

  async createTrainingProgram(programData: Partial<TrainingProgram>): Promise<TrainingProgram> {
    return this.makeRequest<TrainingProgram>('/admin/training/programs', {
      method: 'POST',
      body: JSON.stringify(programData),
    });
  }

  async updateTrainingProgram(programId: string, updateData: Partial<TrainingProgram>): Promise<void> {
    return this.makeRequest<void>(`/api/admin/training/programs/${programId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  // Simulations
  async getSimulations(): Promise<SimulationData[]> {
    return this.makeRequest<SimulationData[]>('/admin/simulations');
  }

  async startSimulation(simulationId: string): Promise<void> {
    return this.makeRequest<void>(`/api/admin/simulations/${simulationId}/start`, {
      method: 'POST',
    });
  }

  async pauseSimulation(simulationId: string): Promise<void> {
    return this.makeRequest<void>(`/api/admin/simulations/${simulationId}/pause`, {
      method: 'POST',
    });
  }

  async configureSimulation(simulationId: string, configData: any): Promise<void> {
    return this.makeRequest<void>(`/api/admin/simulations/${simulationId}/configure`, {
      method: 'PUT',
      body: JSON.stringify(configData),
    });
  }

  // Reporting & Analytics
  async getKeyMetrics(): Promise<KeyMetrics[]> {
    return this.makeRequest<KeyMetrics[]>('/admin/reports/metrics');
  }

  async getReports(): Promise<ReportData[]> {
    return this.makeRequest<ReportData[]>('/admin/reports');
  }

  async generateReport(reportType: string, period: string, filters?: any): Promise<{ id: string; status: string }> {
    return this.makeRequest<{ id: string; status: string }>('/admin/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ reportType, period, filters }),
    });
  }

  async downloadReport(reportId: string): Promise<{ downloadUrl: string; expiresAt: string }> {
    return this.makeRequest<{ downloadUrl: string; expiresAt: string }>(`/api/admin/reports/${reportId}/download`);
  }

  // Activity
  async getRecentActivity(): Promise<ActivityLog[]> {
    return this.makeRequest<ActivityLog[]>('/admin/activity/recent');
  }

  async getActivityLog(page: number = 1, limit: number = 50, filters?: any): Promise<{
    activities: ActivityLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.makeRequest(`/api/admin/activity/log?${params}`);
  }

  // System Status
  async getSystemStatus(): Promise<SystemStatus> {
    return this.makeRequest<SystemStatus>('/admin/system/status');
  }
}

export const adminService = new AdminService();
