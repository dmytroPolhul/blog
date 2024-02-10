import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BlogModule } from './modules/blog/blog.module';
import { UserModule } from './modules/user/user.module';
import { BlogPostModule } from './modules/blog-post/blog-post.module';
import { AuthModule } from './modules/auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      context: ({ req, reply }) => ({ req, reply }),
    }),
    UserModule,
    AuthModule,
    BlogModule,
    BlogPostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
