import { Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards, Patch } from '@nestjs/common';
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
import { RolesGuard } from '../auth/roles.guard';
import { JwtPayload } from "../auth/jwt.payload";
import { User } from "./schemas/user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserMinutesDto } from "./dto/update-minutes.dto";
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
  // @ApiImplicitQuery({ name: 'input', required: false })
  // @ApiImplicitQuery({ name: 'from', required: false })
  // @ApiImplicitQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'track', required: false })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Search by username. Leave empty to get all.' })
  @Get('search')
  // @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('email') email: string,
    @Query('role') role: string,
    @Query('sort') sort: string,
    @Query('track') track: string,
    @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User[]>> {
    const response: BaseResponse<User[]> = {}
    response.data = await this.usersService.getUsers(page, limit, email, role, sort, track);
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
  @ApiQuery({ name: 'image', required: false })
  async getUserInfo2(@Query('email') email: string, @Query('name') name: string, @Query('image') image: string, @AuthJwt() payload: JwtPayload): Promise<any> {
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
      const createUser = await this.usersService.createUser({ "email": email, "fullName": name, "password": "1234", "imageUrl": image });
      if (createUser) {
        const dataLogin = await this.authService.login({ "email": email, "password": "1234" });
        if (dataLogin) {
          const response = { "role": dataLogin.role, "accessToken": dataLogin.accessToken, "daysleft": createUser.daysleft, "uid": createUser.uid };
          return response;
        }
      }
    }
    const response = { "role": roleUser, "accessToken": accessToken, "daysleft": existUser?.daysleft, "uid": existUser?.uid, "online": existUser?.online }
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
      if (!exist) {
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


  @ApiOperation({ summary: 'Update callinng user use to test' })
  // @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update callinng user',
  })
  @Get('/update-test-calling/:id')
  // @UseGuards(JwtAuthGuard)
  async updateCallinngTestUser(@Param('id') id: string): Promise<BaseResponse<any>> {
    const response: BaseResponse<any> = {}
    response.data = await this.usersService.updateCallingUser(id);
    return response;
  }

  @ApiOperation({ summary: 'Update callinng user' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update callinng user',
  })
  @Patch('/update/update-calling/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCallingUser(@AuthJwt() payload: JwtPayload, @Param('id') id: string): Promise<any> {
    const response: BaseResponse<any> = {}
    console.log("payload.uid", payload.uid, id)
    console.log("payload.uid", payload.uid, id)
    response.data = await this.usersService.updateCallingUser(payload.uid, id , false);
    return response;
  }


  @ApiOkResponse({
    description: 'Check exist user minutes',
  })
  @ApiOperation({ summary: 'Check exist user minutes' })
  @Get('/check-minutes/:id')
  async checkMinutes(
    @Param('id') id: string,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    const data = await this.usersService.checkUserMinutesLeft(id)
    response.data = { minutes: data.minutes, daysleft: data.daysleft }

    return response;
  }

  @ApiOkResponse({
    description: 'User info',
    type: User,
  })
  @ApiBody({ type: UpdateUserMinutesDto })
  // @ApiBearerAuth()
  @ApiOperation({ summary: 'Update minutes left' })
  @Patch('/update-user-minutes/:id')
  // @UseGuards(JwtAuthGuard)
  async updateMinutesLeft(@Param('id') id: string, @Body() updateUserMinutesDto: UpdateUserMinutesDto): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<any> = {};

    // Username is available
    try {
      const user = await this.usersService.updateUserMinutesLeft(id, parseInt(updateUserMinutesDto.value));
      response.data = user;
    } catch {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: "username is not available."
      }
    }

    return response;
  }



}

