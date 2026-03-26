export interface IActivityLogFilters {
  page?: string;
  limit?: string;
  actorId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export interface IPurgeLogsPayload {
  days: number;
}
