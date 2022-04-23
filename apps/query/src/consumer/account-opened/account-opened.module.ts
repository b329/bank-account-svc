import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaConfigService } from '@query/common/services/kafka.service';
import { BANK_ACCOUNT_QUERY_SERVICE_NAME } from '@query/common/proto/bank-account-query.pb';
import { AccountConsumer } from './consumer/account-opened.consumer';
import { AccountOpenedHandler } from './event/account-opened.handler';
import { AccountRepository } from '../../common/repository/account.repository';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.registerAsync([{ name: BANK_ACCOUNT_QUERY_SERVICE_NAME, useClass: KafkaConfigService }]),
    TypeOrmModule.forFeature([AccountRepository]),
  ],
  controllers: [AccountConsumer],
  providers: [AccountOpenedHandler],
})
export class AccountOpenedModule {}