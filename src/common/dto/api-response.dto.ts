export class ApiResponseDto<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;

  static ok<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return { success: true, data, message };
  }

  static fail(message: string, error?: string): ApiResponseDto {
    return { success: false, message, error };
  }
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 0,
  };
}
