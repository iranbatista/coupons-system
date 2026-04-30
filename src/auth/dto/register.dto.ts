import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString({ message: 'A senha deve ser um texto' })
  @MinLength(4, { message: 'A senha deve ter no mínimo 4 caracteres' })
  password: string;
}
