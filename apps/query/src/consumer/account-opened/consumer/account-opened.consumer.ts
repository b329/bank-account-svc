import { Controller, Inject, OnApplicationBootstrap } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { KafkaMessage } from 'kafkajs';
import { AccountOpenedEvent } from '@shared/events';
import { BANK_ACCOUNT_QUERY_SERVICE_NAME } from '@query/common/proto/bank-account-query.pb';

@Controller()
export class AccountConsumer implements OnApplicationBootstrap {
  @Inject(BANK_ACCOUNT_QUERY_SERVICE_NAME)
  public readonly client: ClientKafka;

  @Inject(EventBus)
  private readonly eventBus: EventBus;

  public async onApplicationBootstrap() {
    this.client.subscribeToResponseOf('AccountOpenedEvent');
    this.client.connect();
  }

  @MessagePattern('AccountOpenedEvent')
  private consume(@Payload() { value }: KafkaMessage): void {
    const event: AccountOpenedEvent = plainToClass(AccountOpenedEvent, value);

    this.eventBus.publish(event);
  }
}