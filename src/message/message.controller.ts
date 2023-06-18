import { Controller, Post, Body, Param, Delete, Patch } from '@nestjs/common'
import { MessageService } from './message.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { LeaveMessageDto } from './dtos/leaveMessage.dto'
import { User } from 'src/users/decorators/user.decorator'

@Controller('messages')
export class MessageController {
	constructor(private messageService: MessageService) {}

	@Auth()
	@Post('/:dialogId')
	async leaveMessage(
		@Body() leaveMessageDto: LeaveMessageDto,
		@User('id') id: number,
		@Param('dialogId') dialogId: string
	) {
		return await this.messageService.leaveMessage(
			leaveMessageDto,
			id,
			+dialogId
		)
	}

	@Auth()
	@Delete('/:id')
	async deleteMessage(@User('id') userId: number, @Param('id') id: string) {
		return await this.messageService.deleteMessage(+id, userId)
	}

	@Auth()
	@Patch('/:dialogId')
	async readAllMessages(
		@User('id') userId: number,
		@Param('dialogId') dialogId: string
	) {
		return await this.messageService.readAllMessages(+dialogId, userId)
	}
}
