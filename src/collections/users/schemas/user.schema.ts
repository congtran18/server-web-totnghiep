import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

@Schema()
export class User extends Document {
  @ApiProperty()
  @Prop({ required: true, unique: true })
  uid: string;

  @ApiProperty()
  @Prop({ unique: true })
  email: string;

  @Prop()
  password?: string;

  @ApiProperty()
  @Prop()
  fullName?: string;

  @ApiProperty()
  @Prop({ default: "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png" })
  imageUrl?: string;

  @ApiProperty()
  @Prop({ default: false })
  track: boolean;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty()
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  constructor(doc: any, uid: string, email: string, password: string, fullName: string, imageUrl: string, track: boolean, createdAt: Date, updatedAt: Date) {
    super(doc);
    this.uid = uid;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.imageUrl = imageUrl;
    this.track = track;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
