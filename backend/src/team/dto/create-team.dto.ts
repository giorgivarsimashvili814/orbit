import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty({ message: 'Required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(45, { message: 'Name must be at most 45 characters long' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Required' })
  @MaxLength(5, { message: 'Key must be at most 5 characters long' })
  @Matches(/^[A-Z]+$/, { message: 'Key must be uppercase letters only' })
  key: string;
}
