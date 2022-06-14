import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserTimesDto {

    @ApiProperty()
    minutes: string;

    @ApiProperty()
    daysleft: string;

    constructor(minutes: string, daysleft: string) {
        this.minutes = minutes;
        this.daysleft = daysleft;
    }
}
