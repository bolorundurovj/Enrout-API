import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { FirebaseModule } from '@nhogs/nestjs-firebase';
import { I18nModule } from 'nestjs-i18n';
import path from 'path';

import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import { MailModule } from './mail/mail.module';
import { MailConfigService } from './mail/mail-config.service';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { DepartmentModule } from './modules/department/department.module';
import { DocumentModule } from './modules/document/document.module';
import { GroupModule } from './modules/group/group.module';
import { GroupRoleModule } from './modules/group-role/group-role.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { PostModule } from './modules/post/post.module';
import { StaffModule } from './modules/staff/staff.module';
import { StudentModule } from './modules/student/student.module';
import { UserModule } from './modules/user/user.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, mailConfig],
    }),
    FirebaseModule.forRoot({
      apiKey: process.env.FIREBASE_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID!,
      storageBucket: process.env.FIREBASE_BUCKET,
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    MailerModule.forRootAsync({
      useClass: MailConfigService,
    }),
    HealthCheckerModule,
    MailModule,
    GroupModule,
    DepartmentModule,
    WorkflowModule,
    StudentModule,
    StaffModule,
    GroupRoleModule,
    DocumentModule,
    AdminModule,
    AuthModule,
    UserModule,
    PostModule,
  ],
  providers: [],
})
export class AppModule {}
