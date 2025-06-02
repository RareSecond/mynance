export class GetUserQueryDto {
  email: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
