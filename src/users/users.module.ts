import { ConfigModule, ConfigService } from '@nestjs/config'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UserEntity } from './entities/user.entity'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from 'src/strategies/jwt.strategy'
import { connectJWT } from 'src/configs/connectJWT.config'
import { AuthModule } from 'src/auth/auth.module'

@Module({
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy],
	imports: [
		ConfigModule,
		TypeOrmModule.forFeature([UserEntity]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: connectJWT,
		}),
		AuthModule,
	],
	exports: [UsersService],
})
export class UsersModule {}
