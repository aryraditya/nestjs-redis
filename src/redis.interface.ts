import {
    ModuleMetadata,
} from '@nestjs/common/interfaces';
import {
    RedisScripts,
    RedisClientType,
    RedisModules,
    RedisClientOptions,
} from 'redis';

export type Redis = RedisClientType<any, RedisScripts>;

export type RedisClientReadyHandler = (client: Redis) => Promise<void>;
export type RedisErrorHandler = (error: Error) => Promise<void>;

export type RedisModuleOptions = RedisClientOptions<RedisModules, RedisScripts> & {
    name?: string;
    onClientReady?(client: Redis): Promise<void>;
};

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) =>
        | RedisModuleOptions
        | RedisModuleOptions[]
        | Promise<RedisModuleOptions>
        | Promise<RedisModuleOptions[]>;
    inject?: any[];
}
