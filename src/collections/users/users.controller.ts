import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards, } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiQuery
} from "@nestjs/swagger";
import { BaseResponse, ErrorResponseType } from "../../utils/base.response";
import { AuthJwt } from "../auth/auth.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { JwtPayload } from "../auth/jwt.payload";
import { User } from "./schemas/user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthService } from "../auth/auth.service";
import { AdminsService } from "../admins/admins.service";

@ApiTags('users')
@Controller('users')
export class UsersController {

  private logger: Logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly adminService: AdminsService,
  ) {
  }

  @ApiOkResponse({
    description: 'List of user',
    type: [User],
  })
  @ApiImplicitQuery({ name: 'input', required: false })
  @ApiImplicitQuery({ name: 'from', required: false })
  @ApiImplicitQuery({ name: 'to', required: false })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Search by username. Leave empty to get all.' })
  @Get('search')
  // @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query('input') input: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User[]>> {
    const response: BaseResponse<User[]> = {}
    response.data = await this.usersService.getUsers(input, from, to);
    return response;
  }

  @ApiOkResponse({
    description: 'User info',
    type: User,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get me' })
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMe(@AuthJwt() payload: JwtPayload): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<User | null> = {}
    response.data = await this.usersService.getUserByUid(payload.uid);
    return response;
  }

  @ApiOkResponse({
    description: 'Get user info',
    type: User,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user info' })
  @Get(':uid')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Param('uid') uid: string, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<User | null> = {}
    response.data = await this.usersService.getUserByUid(uid);
    return response;
  }

  @ApiOkResponse({
    description: 'Check exist user email',
    type: User,
  })
  @ApiOperation({ summary: 'Check exist user email' })
  @Get('/check-email/email')
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'name', required: false })
  async getUserInfo2(@Query('email') email: string, @Query('name') name: string, @AuthJwt() payload: JwtPayload): Promise<any> {
    const existUser = await this.usersService.getUserByEmail(email);
    let roleUser: any;
    let accessToken: any;
    if (existUser) {
      const uid = existUser.uid
      const getRoleUser = await this.adminService.getAdmin(uid)
      if (getRoleUser) {
        roleUser = getRoleUser.role
      }
      const getAccessToken = await this.authService.getAuthTokensByUidRaw(uid)
      if (getAccessToken) {
        accessToken = getAccessToken.accessToken
      }
    } else {
      const createUser = await this.usersService.createUser({ "email": email, "fullName": name, "password": "1234" });
      if (createUser) {
        const dataLogin = await this.authService.login({"email": email,  "password": "1234"});
        if(dataLogin){
          const response = { "role": dataLogin.role, "accessToken": dataLogin.accessToken }; 
          return response;
        }
      }
    }
    const response = { "role": roleUser, "accessToken": accessToken }; 
    return response;
  }


  // @ApiOkResponse({
  //   description: 'Check exist user email',
  //   type: User,
  // })
  // @ApiOperation({ summary: 'Check exist user email' })
  // @Get(':email')
  // async checkUserEmail(@Param('email') email: string, @AuthJwt() payload: JwtPayload): Promise<any> {
  //   const response: BaseResponse<User | null> = {}
  //   response.data = await this.usersService.getUserByUid(email);
  //   // let roleUser: any;
  //   // let accessToken: any;
  //   // if (existUser) {
  //   //   const uid = existUser?.uid
  //   //   roleUser = await this.adminService.getAdmin(uid)
  //   //   accessToken = await this.authService.getAuthTokensByUid(uid)
  //   // }
  //   // const response = {...existUser, roleUser, accessToken}
  //   return response;
  // }


  // @HttpCode(201)
  @ApiCreatedResponse({
    description: 'User info',
    type: User,
  })
  @ApiNotAcceptableResponse({
    description: 'User exist.',
    type: ErrorResponseType,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ErrorResponseType,
  })
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Create user' })
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<any> = {};

    // Check user available
    if (user.email) {
      const exist = await this.usersService.getUserByEmail(user.email);
      console.log("exist", exist)
      if (!exist) {
        console.log("exist", exist)
        response.data = await this.usersService.createUser(user);
      } else {
        response.error = {
          code: HttpStatus.NOT_ACCEPTABLE,
          message: "Email đã tồn tại!"
        }
      }
    } else {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: "username is empty"
      }
    }
    console.log("response",response)
    return response;
  }

  @ApiOkResponse({
    description: 'User info',
    type: User,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update me' })
  @Put()
  @UseGuards(JwtAuthGuard)
  async updateMe(@Body() userDto: UpdateUserDto, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<any> = {};
    const uid = payload.uid;

    // Username is available
    const userByUsername = await this.usersService.getUserByUid(uid);
    if (!userByUsername || userByUsername.uid === uid) {
      const user = await this.usersService.updateUser(uid, userDto);
      if (user && userDto.password) {
        await this.authService.deleteAuthTokens(uid);
      }
      response.data = user;
    } else {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: "username is not available."
      }
    }

    return response;
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'true or false',
    type: Boolean,
  })
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@AuthJwt() payload: JwtPayload): Promise<BaseResponse<boolean>> {
    const response: BaseResponse<boolean> = {}
    response.data = await this.usersService.deleteUser(payload.uid);
    return response;
  }

}
