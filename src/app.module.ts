import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { MessageModule } from './message/message.module'
import { DialogsModule } from './dialogs/dialogs.module'
import { path } from 'app-root-path'
import { ServeStaticModule } from '@nestjs/serve-static'
import { dataSourceOptions } from './ormconfig'
import { SocketsModule } from './sockets/sockets.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot(dataSourceOptions),
		SocketsModule,
		AuthModule,
		UsersModule,
		MessageModule,
		DialogsModule,
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads',
		}),
	],
})
export class AppModule {}
