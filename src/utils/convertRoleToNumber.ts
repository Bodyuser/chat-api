import { UserRole } from 'src/users/enums/userRole.enum'

export const convertRole = (userRole: UserRole) => {
	return userRole === UserRole.OWNER
		? 3
		: userRole === UserRole.ADMIN
		? 2
		: userRole === UserRole.USER
		? 1
		: 0
}
