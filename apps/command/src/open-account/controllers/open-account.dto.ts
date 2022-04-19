import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { AccountType } from '../../common/enums/account-type.enum';

export class OpenAccountDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsEnum(AccountType)
  public type: AccountType;

  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  public openingBalance: number;
}