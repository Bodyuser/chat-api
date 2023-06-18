import {DataSource, DataSourceOptions} from "typeorm"
import * as dotenv from "dotenv"

dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
    port: 5432,
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    entities: ["dist/**/*.entity.js"],
    migrations: ["dist/migrations/*.js"]
}

const dataSource = new DataSource(dataSourceOptions)

export default dataSource