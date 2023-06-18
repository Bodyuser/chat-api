import {
	Injectable,
	NotFoundException,
	Inject,
	forwardRef,
} from '@nestjs/common'
import { MessageEntity } from './entities/message.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'
import { UserEntity } from 'src/users/entities/user.entity'
import { LeaveMessageDto } from './dtos/leaveMessage.dto'
import { DialogEntity } from 'src/dialogs/entities/dialog.entity'
import { SocketsGateway } from 'src/sockets/sockets.gateway'

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(MessageEntity)
		private messageRepository: Repository<MessageEntity>,
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(DialogEntity)
		private dialogRepository: Repository<DialogEntity>,
		private socketGateway: SocketsGateway
	) {}

	async leaveMessage(
		leaveMessageDto: LeaveMessageDto,
		userId: number,
		dialogId: number
	) {
		const user = await this.userRepository.findOne({ where: { id: userId } })
		if (!user) throw new NotFoundException('User not found')

		const dialog = await this.dialogRepository.findOne({
			where: { id: dialogId },
			relations: {
				members: true,
				messages: {
					user: true,
				},
			},
		})
		if (!dialog) throw new NotFoundException('Dialog not found')

		const message = this.messageRepository.create({
			...leaveMessageDto,
			user,
			dialog,
		})

		await this.messageRepository.save(message)

		this.socketGateway.server.to(`${dialog.id}`).emit('message', message)
		this.socketGateway.server
			.in(dialog.members.filter(member => member.id !== user.id)[0].socketId)
			.emit('notification', message)

		return message
	}

	async deleteMessage(id: number, userId: number) {
		const message = await this.messageRepository.findOne({
			relations: { user: true },
			where: { id, user: { id: userId } },
		})

		if (!message) throw new NotFoundException('Message not found')

		await this.messageRepository.delete(message.id)

		return message
	}

	async readAllMessages(dialogId: number, userId: number) {
		const messages = await this.messageRepository.find({
			relations: {
				dialog: true,
				user: true,
			},
			where: {
				dialog: {
					id: dialogId,
				},
				user: {
					id: Not(userId),
				},
				read: false,
			},
		})

		if (!messages.length) {
			return
		}
		messages.map(message => {
			message.read = true
		})

		await this.messageRepository.save(messages)

		if (messages[0].user?.socketId) {
			this.socketGateway.server
				.to(messages[0].user?.socketId)
				.emit('read', messages[0].dialog.id)
		}

		return messages
	}
}
