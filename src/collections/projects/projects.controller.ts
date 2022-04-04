import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { BaseResponse } from '../../utils/base.response';
import { Project } from './schemas/project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { S3 } from 'aws-sdk';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtPayload } from '../auth/jwt.payload';
import { RolesGuard } from '../auth/roles.guard';


@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  private logger: Logger = new Logger(ProjectsController.name);

  constructor(private readonly projectsService: ProjectsService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get detail by address project' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'filter', required: false })
  @ApiQuery({ name: 'sort', required: false })
  @ApiQuery({ name: 'search', required: true, allowEmptyValue: true })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'size', required: false })
  async getAllProjects(
    // @Query('options') options: { foo },
    // @Query('network') network: string,
    @Query('filter') filter: string,
    @Query('sort') sort: string,
    @Query('search') search: string,
    // @Query('contractOwner') contractOwner: string,
    // @Query('setup') setup: string,
    // @Query('chainId') chainId: string,
    @Query('page') page: string,
    @Query('size') size: string,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const data = await this.projectsService.filterProject(
        // options,
        // network,
        filter,
        sort,
        search,
        // contractOwner,
        // setup,
        // chainId,
        page,
        size,
      );
      return data;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create project' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createNewProject(@Body() project: CreateProjectDto): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const rs = await this.projectsService.insertNewProject(project);
      return rs;
    } catch (error) {
      console.log(error);
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get project' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getProject(@Param('id') projectId: string): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const rs = await this.projectsService.getSingleProject(projectId);
      return rs;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete project' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteProject(@Param('id') projectId: string): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const result = await this.projectsService.removeProject(projectId);
      return result;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete project' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateSmartContract(
    @Param('id') id: string,
    @Body() toUpdate: CreateProjectDto,
  ): Promise<any> {
    const response: BaseResponse<any> = {};
    try {
      const rs = await this.projectsService.editProject(id, toUpdate);
      return rs;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }

  // @Get('/overview/:chainId')
  // async getOverviewByChainId(@Param('chainId') chainId: string): Promise<any> {
  //   const response: BaseResponse<any> = {};
  //   try {
  //     const rs = await this.projectsService.getOverview(chainId);
  //     return rs;
  //   } catch (error) {
  //     response.error = {
  //       code: HttpStatus.NOT_ACCEPTABLE,
  //       message: 'Something is missing',
  //     };
  //     return response;
  //   }
  // }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get detail by address project' })
  @Get('/detail-address/:address')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getDetailByAddress(
    @Param('address') address: string,
    @Query('chainId') chainId: string,
  ) {
    const response: BaseResponse<any> = {};
    try {
      const rs = await this.projectsService.getDetail(address, chainId);
      return rs;
    } catch (error) {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: 'Something is missing',
      };
      return response;
    }
  }
}
