import { IsString, IsNotEmpty, IsEmail, IsDate } from 'class-validator';

export class GetUserQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserResponseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
