import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class LinkUserDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
