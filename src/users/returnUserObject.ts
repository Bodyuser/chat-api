import { FindOptionsSelect, FindOptionsSelectByString } from 'typeorm'
import { UserEntity } from './entities/user.entity'

export const returnUserProfileObject:
	| FindOptionsSelect<UserEntity>
	| FindOptionsSelectByString<UserEntity> = {
	id: true,
	email: true,
	name: true,
	username: true,
	role: true,
	createdAt: true,
	avatarPath: true,
	online: true,
	socketId: true
}

export const returnGlobalUserObject:
	| FindOptionsSelect<UserEntity>
	| FindOptionsSelectByString<UserEntity> = {
	id: true,
	name: true,
	username: true,
	role: true,
	createdAt: true,
	avatarPath: true,
	online: true,
	socketId: true
}

const returnUserRelations = {
	relations: {
		messages: true,
		dialogs: true,
	},
}

export const returnUserProfile = {
	...returnUserRelations,
	select: {
		...returnUserProfileObject,
	},
}

export const returnGlobalUser = {
	select: {
		...returnGlobalUserObject,
	},
}
