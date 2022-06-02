import { IsDefined, IsNotEmpty, IsString } from "class-validator";


export class RejectCallEventDto {
    @IsString()
    @IsNotEmpty()
    to: string

    @IsDefined()
    from: {
        socket_id: string
        name: string
    }

    constructor(to: string, from: { socket_id: string, name: string}) {
        this.to = to;
        this.from = from;
    }
}