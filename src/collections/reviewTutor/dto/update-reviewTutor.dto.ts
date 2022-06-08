import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewTutorDto } from './create-reviewTutor.dto';

export class UpdateReviewTutorDto extends PartialType(CreateReviewTutorDto) {}
