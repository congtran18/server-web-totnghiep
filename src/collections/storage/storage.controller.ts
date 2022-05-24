import { Controller, Get, Post, Delete, Param, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiMultiFile } from './ApiMultiFile'
import { StorageService } from './storage.service';
import { Express } from "express";
import { ApiProperty, ApiBody, ApiConsumes, ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';


@ApiTags('storage')
@Controller('storage')
export class StorageController {

  constructor(private readonly storageService: StorageService) { }

  @Post('single')
  @ApiProperty()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async single(
    @UploadedFile() file: Express.Multer.File
  ) {
    // return this.storageService.uploadFile(file);
    const res: any = await this.storageService.uploadFile(file)
    return { "data": res };
  }

  @ApiProperty()
  @ApiOperation({ summary: 'delete storage' })
  @Delete(':id')
  async deleteFile(@Param('id') params: string): Promise<any> {
    return this.storageService.deleteFile(params);
  }

  @Post('multiple')
  @ApiProperty()
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return this.storageService.uploadFiles(files);
  }


}
