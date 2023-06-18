import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DialogEntity } from './entities/dialog.entity'
import { In, Not, Repository } from 'typeorm'
import { UserEntity } from 'src/users/entities/user.entity'
import { SocketsGateway } from 'src/sockets/sockets.gateway'

@Injectable()
export class DialogsService {
	constructor(
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		@InjectRepository(DialogEntity)
		private dialogRepository: Repository<DialogEntity>
	) {}

	async createOrGetDialog(id: number, userId: number) {
		const profile = await this.userRepository.findOne({
			where: { id },
			relations: { dialogs: true },
		})
		if (!profile) {
			throw new NotFoundException('Profile not found')
		}

		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: { dialogs: true },
		})
		if (!user) {
			throw new NotFoundException('User not found')
		}

		const exist = await this.dialogRepository.find({
			relations: {
				members: true,
				messages: true,
			},
			where: {
				members: {
					id: profile.id,
				},
			},
			relationLoadStrategy: 'query',
		})

		const existDialog = exist.find(
			dialog =>
				dialog.members.filter(member => member.id !== profile.id)[0].id ===
				user.id
		)

		if (existDialog) return existDialog

		const dialog = this.dialogRepository.create({
			messages: [],
			members: [],
		})

		dialog.members.push(profile)

		dialog.members.push(user)

		await this.dialogRepository.save(dialog)

		return dialog
	}

	async getMyDialogs(id: number) {
		const dialogs = await this.dialogRepository.find({
			where: {
				members: {
					id,
				},
			},
			relations: {
				members: true,
				messages: {
					user: true,
				},
			},

			relationLoadStrategy: 'query',
		})
		dialogs.sort(
			(a, b) =>
				b.messages[b.messages.length - 1].id -
				a.messages[a.messages.length - 1].id
		)
		const dialogsWithUnreadMessages = dialogs.map(dialog => {
			const unreadMessages = dialog.messages.filter(message => {
				if (message.user.id !== id && !message.read) {
					return true
				}
				return false
			})

			return {
				...dialog,
				unreadMessages,
			}
		})

		const userIds = dialogs.map(dialog => {
			const member = dialog.members.filter(member => member.id !== id)[0]

			return member.id
		})

		const where = userIds.length
			? {
					id: Not(In([...userIds, id])),
			  }
			: {
					id: Not(id),
			  }

		const users = await this.userRepository.find({
			where,
		})

		return {
			dialogs: dialogsWithUnreadMessages,
			users,
		}
	}
}
