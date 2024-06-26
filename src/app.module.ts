import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { LotsModule } from './features/lots/lots.module';
import { BidsModule } from './features/bids/bids.module';
import typeorm from './config/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersModule } from './features/orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    LotsModule,
    BidsModule,
    OrdersModule,
  ],
})
export class AppModule {}
