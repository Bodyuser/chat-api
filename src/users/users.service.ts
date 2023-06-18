import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserEntity } from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { returnUserProfile } from './returnUserObject'
import { AuthService } from 'src/auth/auth.service'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		private authService: AuthService
	) {}

	async getProfile(username: string) {
		const user = await this.userRepository.findOne({
			where: { username },
			...returnUserProfile,
		})
		if (!user)
			throw new UnauthorizedException('User not found or you are not logged in')

		const tokens = await this.authService.issueToken(user.id)

		return {
			user,
			tokens,
		}
	}

	async deleteProfile(username: string) {
		const user = await this.userRepository.findOne({
			where: { username },
		})
		if (!user)
			throw new UnauthorizedException('User not found or you are not logged in')

		await this.userRepository.delete({ username })

		return {
			message: 'User deleted successfully',
		}
	}

	async updateSocketId(
		type: 'set' | 'remove',
		socketId: string,
		online: boolean,
		client: Socket,
		id?: number
	) {
		const where =
			type === 'set'
				? {
						id,
				  }
				: {
						socketId,
				  }
		const user = await this.userRepository.findOne({
			where,
			...returnUserProfile,
		})
		if (!user) client.disconnect()
		else {
			if (type === 'set') {
				user.socketId = socketId
			} else {
				user.socketId = null
			}
			user.online = online
			await this.userRepository.save(user)

			return user
		}
	}
}
