import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MaxLength(13)
  displayName: string;

  @IsString()
  @IsOptional()
  photoURL: string;
}
