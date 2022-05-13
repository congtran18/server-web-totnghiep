import {forwardRef, Module} from '@nestjs/common';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./schemas/user.schema";
import {Admin, AdminSchema} from "../admins/schemas/admin.schema";
import {AuthToken, AuthTokenSchema} from "../auth/schemas/auth-token.schema";
import {AuthModule} from "../auth/auth.module";
import {AdminsModule} from "../admins/admins.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Admin.name, schema: AdminSchema},
      {name: AuthToken.name, schema: AuthTokenSchema}
    ]),
    AdminsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {
}
