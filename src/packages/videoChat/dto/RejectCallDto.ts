import { IsDefined, IsNotEmpty, IsString } from "class-validator";


export class RejectCallEventDto {
    @IsString()
    @IsNotEmpty()
    to: string

    @IsDefined()
    from: string

    constructor(to: string, from: string) {
        this.to = to;
        this.from = from;
    }
}