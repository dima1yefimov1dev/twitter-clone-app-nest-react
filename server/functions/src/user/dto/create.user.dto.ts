import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  @MaxLength(13)
  displayName: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  @MaxLength(23)
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  photoURL?: string;
}
