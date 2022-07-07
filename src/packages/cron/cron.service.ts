import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from "src/collections/users/users.service";

@Injectable()
export class CronService  {
  logger = new Logger(CronService.name);

  constructor(private readonly usersService: UsersService) {

  }

  async processingUpdateDayLeft(): Promise<void> {
    this.logger.debug(`Cron update date left user start`);
    await this.usersService.updateUserDayLeft()
  }

  async processingUpdateMinutesUser(): Promise<void> {
    this.logger.debug(`Cron update minutes left user start`);
    await this.usersService.updateAllUserMinutesLeft()
  }

  // Called every minutes
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(CronExpression.EVERY_10_MINUTES)
  // Only refresh contract data to deal with user update lock outside FE UI Lock
  // Update lại số ngày còn lại của người dùng
  @Cron(CronExpression.EVERY_MINUTE)
  async UpdateDayLeftUser(): Promise<void> {
    return this.processingUpdateDayLeft();
  }

  // Update lại số phút còn lại của người dùng
  @Cron(CronExpression.EVERY_30_MINUTES)
  async UpdateMinutesLeftUser(): Promise<void> {
    return this.processingUpdateMinutesUser();
  }

}
