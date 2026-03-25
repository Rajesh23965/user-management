import { Sequelize, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const config: Options = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: parseInt(process.env.DB_POOL_MAX || '10'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000')
    },
    define: {
        timestamps: true,
        underscored: true,
        paranoid: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    timezone: '+00:00'
};

export const sequelize = new Sequelize(config);

export const connectDB = async (): Promise<void> => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Unable to connect to database:', error);
        process.exit(1);
    }
};

export default sequelize;