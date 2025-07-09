import { Module } from '@nestjs/common';
import { AdminModule } from '@adminjs/nestjs';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Database, Resource } from '@adminjs/prisma';
import AdminJS from 'adminjs';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CommonModule } from './common/common.module.js';
import { ServeStaticModule } from '@nestjs/serve-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import provider from './admin/auth-provider.js';
import options from './admin/options.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

AdminJS.registerAdapter({ Database, Resource });

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: true,
        sortSchema: true,
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    AdminModule.createAdminAsync({
      imports: [],
      inject: [],
      useFactory: async () => {
        return {
          adminJsOptions: options,
          // auth: {
          //   provider,
          //   cookiePassword: process.env.COOKIE_SECRET,
          //   cookieName: 'adminjs',
          // },
          // sessionOptions: {
          //   resave: true,
          //   saveUninitialized: true,
          //   secret: process.env.COOKIE_SECRET,
          // },
        };
      },
    }),
    PrismaModule,
    CommonModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
