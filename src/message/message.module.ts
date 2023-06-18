import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MessageEntity } from './entities/message.entity'
import { UserEntity } from 'src/users/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { connectJWT } from 'src/configs/connectJWT.config'
import { JwtStrategy } from 'src/strategies/jwt.strategy'
import { MessageService } from './message.service'
import { DialogEntity } from 'src/dialogs/entities/dialog.entity'
import { MessageController } from './message.controller'
import { SocketsModule } from 'src/sockets/sockets.module'

@Module({
	providers: [JwtStrategy, MessageService],
	imports: [
		TypeOrmModule.forFeature([MessageEntity, UserEntity, DialogEntity]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: connectJWT,
		}),
		SocketsModule,
	],
	controllers: [MessageController],
})
export class MessageModule {}
