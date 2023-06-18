import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.use(cookieParser())
	app.setGlobalPrefix('api')
	// app.use((req, res, next) => {
	// 	res.header('Access-Control-Allow-Origin', '*')
	// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
	// 	res.header('Access-Control-Allow-Headers', '*')
	// 	next()
	// })
	app.enableCors({
		origin: true,
		// allowedHeaders: '*',
		// methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
		credentials: true,
	})
	await app.listen(3000)
}
bootstrap()
