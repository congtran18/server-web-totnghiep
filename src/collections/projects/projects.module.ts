import { forwardRef, Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema }
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})

// @Module({
//   imports: [
//     MongooseModule.forFeatureAsync([
//       // { name: Project.name, schema: ProjectSchema },
//       {
//         name: Project.name,
//         useFactory: async () => {
//           const schema = ProjectSchema;
//           schema.pre('findOneAndUpdate', async function () { 
//             const project = this;
//             console.log(project)

//            });
//           return schema;
//         },
//       },
//       {
//         name: SignWallet.name,
//         useFactory: async () => {
//           const schema = SignWalletSchema;
//           // schema.pre('save', function () { console.log('Hello from pre save') });
//           return SignWalletSchema;
//         },
//       },
//     ]),
//     forwardRef(() => AuthModule),
//   ],
//   controllers: [ProjectsController],
//   providers: [ProjectsService],
//   exports: [ProjectsService],
// })
export class ProjectsModule {}