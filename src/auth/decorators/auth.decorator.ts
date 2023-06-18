import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CheckAuthGuard } from 'src/guards/CheckAuth.guard'
import { CheckRoleGuard } from 'src/guards/CheckRole.guard'
import { UserRole } from 'src/users/enums/userRole.enum'
import { convertRole } from 'src/utils/convertRoleToNumber'

export const Auth = (role: UserRole = UserRole.USER) => {
	const numRole = convertRole(role)
	if (numRole === 1) {
		return applyDecorators(UseGuards(CheckAuthGuard))
	} else if (numRole >= 2) {
		return applyDecorators(
			SetMetadata('role', numRole),
			UseGuards(CheckAuthGuard, new CheckRoleGuard(new Reflector()))
		)
	}
}
