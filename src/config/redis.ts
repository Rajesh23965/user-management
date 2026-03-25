import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

class RedisConnection {
    private static instance: RedisConnection;
    private client: RedisClientType | null = null;
    private isConnecting = false;

    private constructor() { }

    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }

    public async connect(): Promise<void> {
        if (this.client?.isOpen) {
            return;
        }

        if (this.isConnecting) {

            await new Promise(resolve => setTimeout(resolve, 100));
            return;
        }

        this.isConnecting = true;

        try {
            this.client = createClient({
                socket: {
                    host: process.env.REDIS_HOST || 'localhost',
                    port: parseInt(process.env.REDIS_PORT || '6379')
                },
                password: process.env.REDIS_PASSWORD,
                database: parseInt(process.env.REDIS_DB || '0')
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err.message);

            });

            this.client.on('connect', () => {
                console.log('Redis Connected');
            });

            await this.client.connect();
        } catch (error) {
            console.error('Failed to connect to Redis:', error);
            this.client = null;
        } finally {
            this.isConnecting = false;
        }
    }

    public getClient(): RedisClientType | null {
        return this.client;
    }

    public async disconnect(): Promise<void> {
        if (this.client?.isOpen) {
            await this.client.quit();
            this.client = null;
        }
    }

    public async set(key: string, value: any, ttl?: number): Promise<void> {
        if (!this.client?.isOpen) {
            return;
        }

        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            if (ttl) {
                await this.client.setEx(key, ttl, stringValue);
            } else {
                await this.client.set(key, stringValue);
            }
        } catch (error) {
            console.error('Redis set error:', error);
        }
    }

    public async get<T = any>(key: string): Promise<T | null> {
        if (!this.client?.isOpen) {
            return null;
        }

        try {
            const data = await this.client.get(key);
            if (!data) return null;
            try {
                return JSON.parse(data) as T;
            } catch {
                return data as T;
            }
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    public async del(key: string): Promise<void> {
        if (!this.client?.isOpen) {
            return;
        }

        try {
            await this.client.del(key);
        } catch (error) {
            console.error('Redis del error:', error);
        }
    }

    public async keys(pattern: string): Promise<string[]> {
        if (!this.client?.isOpen) {
            return [];
        }

        try {
            return await this.client.keys(pattern);
        } catch (error) {
            console.error('Redis keys error:', error);
            return [];
        }
    }

    public async flushAll(): Promise<void> {
        if (!this.client?.isOpen) {
            return;
        }

        try {
            await this.client.flushAll();
        } catch (error) {
            console.error('Redis flushAll error:', error);
        }
    }
}

export const redis = RedisConnection.getInstance();
export default redis;