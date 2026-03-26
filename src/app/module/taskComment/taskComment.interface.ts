export interface ICreateCommentPayload {
  content: string;
}

export interface IUpdateCommentPayload {
  content: string;
}

export interface ICommentFilters {
  page?: string;
  limit?: string;
}
