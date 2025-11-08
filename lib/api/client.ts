/**
 * API Client - Centralized service for all backend API calls
 * This provides a consistent interface for frontend components to interact with the backend
 */

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_TIMEOUT = 30000; // 30 seconds

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic fetch wrapper with error handling
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout');
    }
    throw error;
  }
}

// Generic API call handler
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetchWithTimeout(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || errorData.message || 'API request failed',
        errorData
      );
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// Authentication API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return apiCall('/auth/logout', { method: 'POST' });
  },

  refreshToken: async () => {
    return apiCall('/auth/refresh', { method: 'POST' });
  },
};

// Verification API
export const verificationApi = {
  submitClaim: async (claimData: {
    claim: string;
    source?: string;
    context?: string;
    category?: string;
  }) => {
    return apiCall('/verification/submit', {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  },

  getVerificationResult: async (verificationId: string) => {
    return apiCall(`/verification/${verificationId}`);
  },

  getRecentVerifications: async (limit = 10) => {
    return apiCall(`/verification/recent?limit=${limit}`);
  },

  getTrendingClaims: async () => {
    return apiCall('/verification/trending');
  },
};

// Misinformation Reporting API
export const reportApi = {
  submitReport: async (reportData: {
    type: string;
    source: string;
    url?: string;
    description: string;
    impact: string;
    evidence?: string;
    anonymous: boolean;
    contact?: string;
  }) => {
    return apiCall('/reports/submit', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  getReportStatus: async (reportId: string) => {
    return apiCall(`/reports/${reportId}`);
  },

  getUserReports: async () => {
    return apiCall('/reports/user');
  },
};

// Contact/Support API
export const contactApi = {
  submitContactForm: async (contactData: {
    name: string;
    email: string;
    subject: string;
    category: string;
    message: string;
  }) => {
    return apiCall('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Analytics API
export const analyticsApi = {
  getOverview: async (timeRange = '7d') => {
    return apiCall(`/analytics/overview?timeRange=${timeRange}`);
  },

  getTimeSeriesData: async (timeRange = '7d') => {
    return apiCall(`/analytics/timeseries?timeRange=${timeRange}`);
  },

  getSourceDistribution: async () => {
    return apiCall('/analytics/sources');
  },

  getCategoryBreakdown: async () => {
    return apiCall('/analytics/categories');
  },

  getGeographicData: async () => {
    return apiCall('/analytics/geographic');
  },

  getTrendAnalysis: async () => {
    return apiCall('/analytics/trends');
  },

  exportReport: async (format: 'csv' | 'json' | 'pdf', filters?: any) => {
    return apiCall('/analytics/export', {
      method: 'POST',
      body: JSON.stringify({ format, filters }),
    });
  },
};

// User Settings API
export const settingsApi = {
  updateProfile: async (profileData: {
    name?: string;
    email?: string;
    role?: string;
    department?: string;
    phone?: string;
    timezone?: string;
    language?: string;
  }) => {
    return apiCall('/settings/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiCall('/settings/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  updateSecurity: async (securitySettings: {
    twoFactorEnabled?: boolean;
    sessionTimeout?: string;
    ipWhitelist?: boolean;
    auditLogging?: boolean;
  }) => {
    return apiCall('/settings/security', {
      method: 'PUT',
      body: JSON.stringify(securitySettings),
    });
  },

  updateNotifications: async (notificationSettings: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
    slack?: boolean;
  }) => {
    return apiCall('/settings/notifications', {
      method: 'PUT',
      body: JSON.stringify(notificationSettings),
    });
  },
};

// Alerts API
export const alertsApi = {
  getAlerts: async (filters?: {
    severity?: string;
    status?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(filters as any).toString();
    return apiCall(`/alerts?${params}`);
  },

  createAlert: async (alertData: {
    message: string;
    type: string;
    severity?: string;
  }) => {
    return apiCall('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  },

  updateAlertStatus: async (alertId: string, status: string) => {
    return apiCall(`/alerts/${alertId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  subscribeToAlerts: async (subscriptionData: {
    categories: string[];
    regions?: string[];
    severity?: string[];
    channels: string[];
  }) => {
    return apiCall('/alerts/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  },
};

// Monitoring/Feed API
export const feedApi = {
  getLiveFeed: async (filters?: {
    source?: string;
    riskLevel?: string;
    limit?: number;
  }) => {
    const params = new URLSearchParams(filters as any).toString();
    return apiCall(`/feed/live?${params}`);
  },

  getFeedItem: async (itemId: string) => {
    return apiCall(`/feed/${itemId}`);
  },
};

// Source Management API
export const sourceApi = {
  getSources: async () => {
    return apiCall('/sources');
  },

  updateSource: async (sourceId: string, sourceData: any) => {
    return apiCall(`/sources/${sourceId}`, {
      method: 'PUT',
      body: JSON.stringify(sourceData),
    });
  },

  testConnection: async (sourceId: string) => {
    return apiCall(`/sources/${sourceId}/test`, {
      method: 'POST',
    });
  },
};

// Verification Actions API (for moderators/admins)
export const verificationActionsApi = {
  approveClaim: async (claimId: number, reason: string) => {
    return apiCall(`/verification/claims/${claimId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  rejectClaim: async (claimId: number, reason: string) => {
    return apiCall(`/verification/claims/${claimId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  flagClaim: async (claimId: number, reason: string) => {
    return apiCall(`/verification/claims/${claimId}/flag`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  getPendingClaims: async () => {
    return apiCall('/verification/claims/pending');
  },
};

// Updates/Public Info API
export const updatesApi = {
  getLatestUpdates: async (filters?: {
    category?: string;
    credibility?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams(filters as any).toString();
    return apiCall(`/updates?${params}`);
  },

  getTrendingTopics: async () => {
    return apiCall('/updates/trending');
  },
};

// Export all APIs
export const api = {
  auth: authApi,
  verification: verificationApi,
  report: reportApi,
  contact: contactApi,
  analytics: analyticsApi,
  settings: settingsApi,
  alerts: alertsApi,
  feed: feedApi,
  source: sourceApi,
  verificationActions: verificationActionsApi,
  updates: updatesApi,
};

export default api;
