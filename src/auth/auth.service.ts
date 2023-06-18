import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
	NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { LoginDto } from './dtos/login.dto'
import { compare, genSalt, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { RegisterDto } from './dtos/register.dto'
import { UserEntity } from 'src/users/entities/user.entity'
import { returnProfile } from 'src/utils/returnProfile'
import { generateUsername } from 'src/utils/generateUsername'

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private jwtService: JwtService
	) {}

	async login(loginDto: LoginDto) {
		const user = await this.validateUser(loginDto)

		const tokens = await this.issueToken(user.id)
		return {
			user: user.returnProfile(),
			tokens,
		}
	}

	async register(registerDto: RegisterDto) {
		const existEmail = await this.userRepository.findOne({
			where: { email: registerDto.email },
		})
		if (existEmail) throw new BadRequestException('Email already exists')

		const salt = await genSalt(10)

		const user = this.userRepository.create({
			...registerDto,
			username: generateUsername(registerDto.name, registerDto.email),
			password: await hash(registerDto.password, salt),
		})

		await this.userRepository.save(user)
		const tokens = await this.issueToken(user.id)

		await this.userRepository.save(user)

		return {
			user: user.returnProfile(),
			tokens,
		}
	}

	async getNewTokens(refreshToken: string) {
		if (!refreshToken)
			throw new UnauthorizedException(
				'You are not registered or not logged in, please login'
			)

		const payload = await this.jwtService.verifyAsync(refreshToken)
		if (!payload.id)
			throw new UnauthorizedException(
				'The token has expired or the token is invalid'
			)

		const user = await this.userRepository.findOne({
			where: { id: payload.id },
		})
		if (!user)
			throw new NotFoundException('User with this email does not exist')

		const tokens = await this.issueToken(user.id)

		return {
			user: user.returnProfile(),
			tokens,
		}
	}

	async issueToken(userId: number) {
		const payload = {
			id: userId,
		}

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: '5m',
		})

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: '15d',
		})

		return {
			accessToken,
			refreshToken,
		}
	}

	private async validateUser(loginDto: LoginDto) {
		const user = await this.userRepository.findOne({
			where: { email: loginDto.email },
		})
		if (!user) throw new NotFoundException('User not found')

		const isValidPassword = await compare(loginDto.password, user.password)
		if (!isValidPassword)
			throw new BadRequestException('Invalid email or password')

		return user
	}
}
