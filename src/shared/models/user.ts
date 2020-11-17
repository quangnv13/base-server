export class UserDto {
  userId: string;
  username: string;
  password: string;
  email: string;
  fullname: string;
  isActive: boolean;
  isDelete: boolean;
  isAdmin: boolean;
  createTime: number;
  updateTime: number;
}

export class UserInfoDto extends UserDto {}
