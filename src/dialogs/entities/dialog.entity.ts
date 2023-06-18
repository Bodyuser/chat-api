import { MessageEntity } from 'src/message/entities/message.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import {
	CreateDateColumn,
	Entity,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity('dialogs')
export class DialogEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createdAt: string

	@OneToMany(() => MessageEntity, message => message.dialog)
	messages: MessageEntity[]

	@ManyToMany(() => UserEntity, user => user.dialogs, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE',
	})
	members?: UserEntity[]
}
