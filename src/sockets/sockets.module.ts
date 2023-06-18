import { Module } from '@nestjs/common'
import { SocketsGateway } from './sockets.gateway'
import { UsersModule } from 'src/users/users.module'
import { SocketsService } from './sockets.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DialogEntity } from 'src/dialogs/entities/dialog.entity'
import { UserEntity } from 'src/users/entities/user.entity'

@Module({
	providers: [SocketsGateway, SocketsService],
	exports: [SocketsGateway, SocketsService],
	imports: [UsersModule, TypeOrmModule.forFeature([DialogEntity, UserEntity])],
})
export class SocketsModule {}
