import { DataSource, DataSourceOptions } from 'typeorm'
import * as dotenv from 'dotenv'

dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
	port: 5432,
	type: 'postgres',
	host: 'snuffleupagus.db.elephantsql.com',
	username: 'bzvbxsnj',
	password: 'E1TclEA0sQQtfFr52rNMR93OpyjjmCgu',
	database: 'bzvbxsnj',
	synchronize: false,
	entities: ['dist/**/*.entity.js'],
	migrations: ['dist/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
