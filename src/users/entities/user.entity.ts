import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	OneToMany,
	ManyToMany,
	JoinTable,
} from 'typeorm'
import { UserRole } from '../enums/userRole.enum'
import { MessageEntity } from 'src/message/entities/message.entity'
import { DialogEntity } from 'src/dialogs/entities/dialog.entity'

@Entity('users')
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ unique: true })
	email: string

	@Column({ unique: true })
	username: string

	@Column({ default: true })
	online: boolean

	@Column()
	password: string

	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole

	@CreateDateColumn({ name: 'created_at' })
	createdAt: string

	@Column({ name: 'avatar_path', default: '/uploads/user.png' })
	avatarPath: string

	@Column({ default: null })
	socketId: string

	@OneToMany(() => MessageEntity, message => message.user)
	messages: MessageEntity[]

	@ManyToMany(() => DialogEntity, dialog => dialog.members)
	@JoinTable({
		name: 'member_dialog',
		joinColumn: {
			name: 'member_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'dialog_id',
			referencedColumnName: 'id',
		},
	})
	dialogs?: DialogEntity[]

	returnProfile() {
		const { password, returnProfile, ...profile } = this
		return {
			...profile,
		}
	}
}
