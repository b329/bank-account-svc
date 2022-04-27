import { Controller, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { Account } from '@query/common/entity/account.entity';
import { BANK_ACCOUNT_QUERY_SERVICE_NAME, FindAccountResponse } from '@query/common/proto/bank-account-query.pb';
import { FindAccountQuery } from '../query/find-account.query';
import { FindAccountDto } from './find-account.dto';

@Controller()
export class FindAccountController {
  @Inject(QueryBus)
  private readonly queryBus: QueryBus;

  @GrpcMethod(BANK_ACCOUNT_QUERY_SERVICE_NAME, 'FindAccount')
  private async findAccount(@Payload() payload: FindAccountDto): Promise<FindAccountResponse> {
    console.log('findAccount', { payload });
    const query: FindAccountQuery = new FindAccountQuery(payload);
    const data: Account = await this.queryBus.execute(query);
    console.log({ data });

    if (!data) {
      throw new HttpException('No account found!', HttpStatus.NO_CONTENT);
    }

    return { data, status: HttpStatus.OK, error: null };
  }
}
