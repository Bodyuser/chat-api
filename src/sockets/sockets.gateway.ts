import {
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
	MessageBody,
	ConnectedSocket,
	OnGatewayInit,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { UsersService } from 'src/users/users.service'
import { SocketsService } from './sockets.service'

@WebSocketGateway({
	cors: {
		origin: true,
		credentials: true,
	},
})
export class SocketsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private usersService: UsersService,
		private socketsService: SocketsService
	) {}

	@WebSocketServer()
	server: Server

	afterInit(server: Server) {}
	async handleConnection(client: Socket, ...args: any[]) {
		console.log('connect')
	}
	async handleDisconnect(client: Socket) {
		if (client.handshake.auth.isAuth) {
			const user = await this.usersService.updateSocketId(
				'remove',
				client.id,

				false,
				client
			)
			this.server.emit('online', user)
		}
	}

	@SubscribeMessage('join')
	async join(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
		const user = await this.usersService.updateSocketId(
			'set',
			client.id,
			true,
			client,
			userId
		)

		this.server.emit('online', user)
		return user
	}

	@SubscribeMessage('join-dialog')
	async joinDialog(
		@MessageBody() dialogId: number,
		@ConnectedSocket() client: Socket
	) {
		client.join(String(dialogId))
	}

	@SubscribeMessage('leave-dialog')
	async leaveDialog(
		@MessageBody() dialogId: number,
		@ConnectedSocket() client: Socket
	) {
		client.leave(String(dialogId))
	}

	@SubscribeMessage('typed')
	async typing(
		@MessageBody()
		{
			isTyping,
			dialogId,
			userId,
		}: { isTyping: boolean; dialogId: number; userId: number },
		@ConnectedSocket() client: Socket
	) {
		const { socket, user } = await this.socketsService.typing(dialogId, userId)
		this.server.in(socket).emit('typing', {
			user,
			isTyping,
		})
	}
}
