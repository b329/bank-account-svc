import { Body, Controller, HttpStatus, Inject, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { OpenAccountDto } from './open-account.dto';
import { OpenAccountCommand } from '../commands/open-account.command';
import { BANK_ACCOUNT_COMMAND_SERVICE_NAME, OpenAccountResponse } from '@command/common/proto/bank-account-command.pb';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class OpenAccountController {
  @Inject(CommandBus)
  private readonly commandBus: CommandBus;

  @GrpcMethod(BANK_ACCOUNT_COMMAND_SERVICE_NAME, 'OpenAccount')
  public async openAccount(@Body() payload: OpenAccountDto): Promise<OpenAccountResponse> {
    const command: OpenAccountCommand = new OpenAccountCommand(payload);

    await this.commandBus.execute(command);

    return { status: HttpStatus.OK, data: command.getId(), error: null };
  }
}
