import { v4 as uuidv4 } from 'uuid';
import { Provider } from '@nestjs/common';
import {
    REDIS_CLIENT,
    REDIS_MODULE_OPTIONS,
} from './redis.constants';
import {
    Redis,
    RedisModuleAsyncOptions,
    RedisModuleOptions,
} from './redis.interface';
import * as redis from 'redis';
import * as _ from 'lodash';

export class RedisClientError extends Error {}
export interface RedisClient {
  defaultKey: string;
  clients: Map<string, Redis>;
  size: number;
}

async function getClient(options: RedisModuleOptions): Promise<Redis> {
    const {
        url,
        onClientReady: clientReadyHandler = _.noop,
        ...basicOptions
    } = options;

    const client = url
        ? redis.createClient({ url })
        : redis.createClient(basicOptions);

    await client.connect();
    await clientReadyHandler(client);

    return client;
}

export const createClient = (): Provider => ({
    provide: REDIS_CLIENT,
    useFactory: async (options: RedisModuleOptions | RedisModuleOptions[]): Promise<RedisClient> => {
        const clients = new Map<string, Redis>();
        let defaultKey = uuidv4();

        if (Array.isArray(options)) {
            await Promise.all(
                options.map(async (option) => {
                    const key = option.name || defaultKey;
                    if (clients.has(key)) {
                        throw new RedisClientError(`${option.name || 'default'} client is exists`);
                    }
                    clients.set(key, await getClient(option));
                }),
            );
        } else {
            if (options.name && options.name.length !== 0) {
                defaultKey = options.name;
            }
            clients.set(defaultKey, await getClient(options));
        }

        return {
            defaultKey,
            clients,
            size: clients.size,
        };
    },
    inject: [REDIS_MODULE_OPTIONS],
});

export const createAsyncClientOptions = (options: RedisModuleAsyncOptions) => ({
    provide: REDIS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
