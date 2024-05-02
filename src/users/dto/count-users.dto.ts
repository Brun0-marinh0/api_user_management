export interface ICountUsersRepositoryResponseDto {
  total_users: number;
  total_activated: number;
  total_deactivated: number;
  admin_activated: number;
  admin_deactivated: number;
  common_activated: number;
  common_deactivated: number;
}

interface ITotalPerRole {
  role: string;
  totalActivated: number;
  totalDeactivated: number;
}

export interface ICountUsersResponse {
  totalUsers: number;
  totalActivated: number;
  totalDeactivated: number;
  totalPerRole: ITotalPerRole[];
}
