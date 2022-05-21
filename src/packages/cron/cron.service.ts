import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from "src/collections/users/users.service";

@Injectable()
export class CronService  {
  logger = new Logger(CronService.name);

  constructor(private readonly usersService: UsersService) {

  }

  async processing(): Promise<void> {
    this.logger.debug(`CronBscService@processing@start`);
    await this.usersService.updateTimeLeftCoureUser("tranvanthanhcooonng@gmail.com", -1)
  }

  // Called every minutes
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(CronExpression.EVERY_10_MINUTES)
  // Only refresh contract data to deal with user update lock outside FE UI Lock
  @Cron(CronExpression.EVERY_30_SECONDS)
  async crawlingContractDataDaily(): Promise<void> {
    this.logger.debug('crawlingContractDataDaily');
    return this.processing();
  }

}
