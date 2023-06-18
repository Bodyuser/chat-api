import { Controller, Get, Res, Delete } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './decorators/user.decorator'
import { Response } from 'express'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Auth()
	@Get('profile')
	async getProfile(
		@User('username') username: string,
		@Res({ passthrough: true }) response: Response
	) {
		const result = await this.usersService.getProfile(username)

		response.cookie('refreshToken', result.tokens.refreshToken, {
			httpOnly: true,
			maxAge: 15 * 24 * 60 * 60 * 1000,
			path: '/api',
		})

		return {
			user: result.user,
			token: result.tokens.accessToken,
		}
	}

	@Auth()
	@Delete('profile')
	async deleteProfile(@User('username') username: string) {
		return await this.usersService.deleteProfile(username)
	}
}
