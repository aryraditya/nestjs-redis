import {
    Injectable,
    Inject,
} from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import {
    RedisClient,
    RedisClientError,
} from './redis-client.provider';
import { Redis } from './redis.interface';

@Injectable()
export class RedisService {
    public constructor(
        @Inject(REDIS_CLIENT)
        private readonly redisClient: RedisClient,
    ) {}

    public getClient(name?: string): Redis {
        let clientName = name;

        if (!clientName) {
            clientName = this.redisClient.defaultKey;
        }
        if (!this.redisClient.clients.has(clientName)) {
            throw new RedisClientError(`client ${clientName} does not exist`);
        }
        return this.redisClient.clients.get(clientName);
    }

    public getClients(): Map<string, Redis> {
        return this.redisClient.clients;
    }
}
