import { ApiProperty } from "@nestjs/swagger";

export class CheckoutCourseDto {


    @ApiProperty()
    email!: string;
    @ApiProperty()
    cost: number;
    @ApiProperty()
    type: string;

    constructor(
        email: string,
        cost: number,
        type: string,
    ) {
        this.email = email;
        this.cost = cost;
        this.type = type;
    }
}
