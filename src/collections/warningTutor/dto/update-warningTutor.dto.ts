import { PartialType } from '@nestjs/mapped-types';
import { CreateWarningTutorDto } from './create-warningTutor.dto';

export class UpdateWarningTutorDto extends PartialType(CreateWarningTutorDto) {}
