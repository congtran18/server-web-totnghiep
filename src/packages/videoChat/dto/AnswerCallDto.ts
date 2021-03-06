import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class AnswerCallDto {

    @IsString()
    @IsNotEmpty()
    to: string

    @IsDefined()
    signal: any

    constructor(to: string, signal: any) {
        this.to = to;
        this.signal = signal;
    }
}
