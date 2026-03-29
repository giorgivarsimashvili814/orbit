import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Required' })
  @MaxLength(80, { message: 'name must be at most 80 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Required' })
  @MinLength(3, { message: 'Too short, must be at least 3 characters' })
  @MaxLength(32, { message: 'Too long, cannot be more than 32 characters' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Invalid format, can only contain letters, numbers, and dashes',
  })
  slug: string;
}
