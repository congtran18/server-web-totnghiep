import { ApiProperty } from "@nestjs/swagger";

export class CheckoutOrderDto {

    @ApiProperty()
    items: {
        idProduct: string,
        realname: string,
        mainImage: string,
        type: string,
        category: string,
        cost: number,
        quantity: number,
    }[];
    @ApiProperty()
    email!: string;

    constructor(
        email: string,
        items: {
            idProduct: string,
            realname: string,
            mainImage: string,
            type: string,
            category: string,
            cost: number,
            quantity: number,
        }[]
    ) {
        this.email = email;
        this.items = items;
    }
}
