import { DialogEntity } from 'src/dialogs/entities/dialog.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('messages')
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createdAt: string

	@Column()
	text: string

	@Column({ default: false })
	read: boolean

	@ManyToOne(() => UserEntity, user => user.messages)
	user: UserEntity

	@ManyToOne(() => DialogEntity, dialog => dialog.messages)
	dialog: DialogEntity
}
