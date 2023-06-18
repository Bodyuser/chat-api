import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
	port: 5432,
	type: 'postgres',
	host: 'dpg-ci7gom18g3nfuc95rni0-a',
	username: 'user',
	password: 'T1qnzg9PWSVy2oC1QzNVCGsYYIofpBzu',
	database: 'chat_6unv',
	synchronize: false,
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
