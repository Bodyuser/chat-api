import { UserEntity } from 'src/users/entities/user.entity'

export const returnProfile = (user: UserEntity) => {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		username: user.username,
		role: user.role,
		createdAt: user.createdAt,
		avatarPath: user.avatarPath,
		online: user.online,
	}
}
