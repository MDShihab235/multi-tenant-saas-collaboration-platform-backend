export interface INotificationFilters {
  page?: string;
  limit?: string;
  type?: string;
}

export interface INotificationResponse {
  notifications: any[]; // Replace with generated Notification type if available
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
