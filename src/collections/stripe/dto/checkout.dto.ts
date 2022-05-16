import { IsNotEmpty, Max, IsNumber, IsString } from 'class-validator';

export class CheckoutDto {
    user_id?: string;
    realname!: string;
    cost!: number;
    qty: number = 0;
}