import { IsNotEmpty, Max, IsNumber, IsString } from 'class-validator';

export class CheckoutDto {
    user_id?: string;
    realname!: string;
    cost!: number;
    qty: number = 0;
}

// import { IsNotEmpty, Max, IsNumber, IsString } from 'class-validator';
// import { ApiProperty } from "@nestjs/swagger";

// export class CheckoutDto {
    
//     @ApiProperty()
//     user_id?: string;
//     @ApiProperty()
//     realname!: string;
//     @ApiProperty()
//     cost!: number;
//     @ApiProperty()
//     qty: number = 0;

//     constructor(email: string, password: string, fullName: string, imageUrl: string) {
//         this.email = email;
//         this.password = password;
//         this.fullName = fullName;
//         this.imageUrl = imageUrl;
//     }
// }