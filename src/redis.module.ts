import {
    DynamicModule,
    Module,
} from '@nestjs/common';
import {
    RedisModuleAsyncOptions,
    RedisModuleOptions,
} from './redis.interface';
import { RedisCoreModule } from './redis-core.module';

@Module({})
export class RedisModule {
    public static register(
        options: RedisModuleOptions | RedisModuleOptions[],
    ): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.register(options)],
        };
    }

    public static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
        return {
            module: RedisModule,
            imports: [RedisCoreModule.forRootAsync(options)],
        };
    }
}
