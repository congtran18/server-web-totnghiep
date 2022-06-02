import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CallUserEventDto {

    @IsString()
    @IsNotEmpty()
    user_to_call: string

    @IsDefined()
    signal: any

    @IsDefined()
    from: {
        socket_id: string,
        name: string
    }

    constructor(user_to_call: string, signal: any, from: { socket_id: string, name: string}) {
        this.user_to_call = user_to_call;
        this.signal = signal;
        this.from = from;
    }
}