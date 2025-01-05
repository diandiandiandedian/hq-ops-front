export interface UserInfo {
  phoneNumber: string;
  profilePictureUrl: string;
  username: string;
}

export interface LoginProps {
  token: string;
  userInfo: UserInfo;
}

export interface BasePage<T> {
  records: T[];
  total: number;
  size: number;
  page: number;
  extraData: any;
  isFirstPage: boolean;
  isLastPage: boolean;
}
