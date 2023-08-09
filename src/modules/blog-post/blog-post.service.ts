import {Injectable} from "@nestjs/common";
import {BaseService} from "../baseModule/base.service";
import {BlogPost} from "./entities/blog-post.entity";
import {BlogPostRepository} from "./repositories/blogPost.repository";


@Injectable()
export class BlogPostService extends BaseService<BlogPost> {
  constructor(
      private blogPostRepository: BlogPostRepository,
  ) {
    super(blogPostRepository);
  }
}
