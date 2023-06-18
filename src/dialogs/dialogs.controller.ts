import { Controller, Post, Param, Get } from '@nestjs/common'
import { DialogsService } from './dialogs.service'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { User } from 'src/users/decorators/user.decorator'

@Controller('dialogs')
export class DialogsController {
	constructor(private readonly dialogsService: DialogsService) {}

	@Auth()
	@Post('/:userId')
	async createOrGetDialog(
		@User('id') id: number,
		@Param('userId') userId: string
	) {
		return await this.dialogsService.createOrGetDialog(id, +userId)
	}

	@Auth()
	@Get('my')
	async getMyDialogs(@User('id') id: number) {
		return await this.dialogsService.getMyDialogs(id)
	}
}
