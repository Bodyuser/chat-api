import { Module } from '@nestjs/common'
import { DialogsService } from './dialogs.service'
import { DialogsController } from './dialogs.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DialogEntity } from './entities/dialog.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { SocketsModule } from 'src/sockets/sockets.module'

@Module({
	controllers: [DialogsController],
	providers: [DialogsService],
	imports: [
		TypeOrmModule.forFeature([DialogEntity, UserEntity]),
		SocketsModule,
	],
})
export class DialogsModule {}
