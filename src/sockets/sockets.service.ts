import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DialogEntity } from 'src/dialogs/entities/dialog.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SocketsService {
	constructor(
		@InjectRepository(DialogEntity)
		private dialogRepository: Repository<DialogEntity>,
		@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
	) {}
	async typing(dialogId: number, userId: number) {
		const dialog = await this.dialogRepository.findOne({
			where: { id: dialogId },
			relations: { members: true, messages: true },
		})
		if (!dialog) throw new NotFoundException('Dialog not found')

		const partner = dialog.members.filter(member => member.id !== userId)[0]

		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: { dialogs: true, messages: true },
		})
		if (!user) throw new NotFoundException('User not found')

		return {
			socket: partner.socketId,
			user,
		}
	}
}
