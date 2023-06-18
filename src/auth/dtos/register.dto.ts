import { IsEmail, IsString, IsStrongPassword } from 'class-validator'

export class RegisterDto {
	@IsEmail({}, { message: 'Email должен быть валидным' })
	email: string

	@IsString({ message: 'Имя должен быть строкой' })
	name: string

	@IsStrongPassword(
		{
			minLength: 8,
			minNumbers: 2,
			minUppercase: 1,
			minLowercase: 3,
			minSymbols: 1,
		},
		{
			message: 'Пароль должен быть трудным',
		}
	)
	password: string
}
