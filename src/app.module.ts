import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { AppConfigModule } from './config/appConfig.module';
import { DatabaseModuleDep } from './database/database.module.dep';
import { BlogModule } from './modules/blog/blog.module';
import { UserModule } from './modules/user/user.module';
import { BlogPostModule } from './modules/blog-post/blog-post.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    AuthModule,
    AppConfigModule,
    DatabaseModuleDep,
    DatabaseModule,
    BlogModule,
    UserModule,
    BlogPostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
