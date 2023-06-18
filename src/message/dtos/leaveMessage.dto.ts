import { IsString } from 'class-validator'

export class LeaveMessageDto {
	@IsString()
	text: string
}
