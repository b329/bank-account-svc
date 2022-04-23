import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AccountEventProducer } from '@command/common/account-event.producer';
import { AccountClosedEvent } from '@shared/events/account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedHandler implements IEventHandler {
  @Inject(AccountEventProducer)
  private eventProducer: AccountEventProducer;

  public async handle(event: AccountClosedEvent) {
    console.log('AccountClosedHandler/handle PUBLISH');
    const { constructor }: AccountClosedEvent = Object.getPrototypeOf(event);

    this.eventProducer.produce(constructor.name, event);
  }
}
