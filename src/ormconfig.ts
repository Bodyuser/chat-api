import { DataSource, DataSourceOptions } from 'typeorm'
// import * as dotenv from 'dotenv'

// dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
	port: 5432,
	type: 'postgres',
	url: 'postgres://koejsyje:Dxz6-3WW5AkOy_vfFCSA7ZctPY11sUyq@snuffleupagus.db.elephantsql.com/koejsyje',
	logging: true,
	synchronize: false,
	entities: ['dist/**/*.entity.js'],

	// host: 'snuffleupagus.db.elephantsql.com',
	// username: 'koejsyje',
	// password: 'Dxz6-3WW5AkOy_vfFCSA7ZctPY11sUyq',
	// database: 'koejsyje',

	// migrations: ['dist/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource
