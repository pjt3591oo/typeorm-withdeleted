import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";
import { Comment } from "./entity/Comment";

// https://github.com/typeorm/typeorm/issues/6265

async function userFactory(id: number, name: string, age: number): Promise<User> {
  const user = new User();
  user.id = id;
  user.name = name;
  user.age = age;
  return await AppDataSource.manager.save(user);
}

async function postFactory(id: number, title: string, content: string, user: User): Promise<Post> {
  const post = new Post();
  post.id = id;
  post.title = title;
  post.content = content;
  post.user = user;

  return await AppDataSource.manager.save(post);
}

async function commentFactory(id: number, content: string, post: Post): Promise<Comment> {
  const comment = new Comment();
  comment.id = id;
  comment.content = content;
  comment.post = post;

  return await AppDataSource.manager.save(comment);
}

async function seedData() {
  console.log('========= 데이터 생성 시작 =============');

  // 유저생성
  const users: User[] = await Promise.all([
    userFactory(1, 'A', 30),
    userFactory(2, 'B', 30),
    userFactory(3, 'C', 30)
  ]);

  // 포스트 생성
  const posts: PromiseSettledResult<Post>[] = await Promise.allSettled([
    postFactory(1, 't1', 'content1', users[0]),
    postFactory(2, 't2', 'content2', users[0]),
    postFactory(3, 't3', 'content3', users[0]),
    postFactory(4, 't4', 'content4', users[1]),
  ])

  const post1: Post = posts[0].status === 'fulfilled' && posts[0].value;
  const post2: Post = posts[1].status === 'fulfilled' && posts[1].value;
  const post3: Post = posts[2].status === 'fulfilled' && posts[2].value;
  const post4: Post = posts[3].status === 'fulfilled' && posts[3].value;
  
  // 댓글 생성
  const comments: PromiseSettledResult<Comment>[] = await Promise.allSettled([
    commentFactory(1, 'content1', post1),
    commentFactory(2, 'content2', post1),
    commentFactory(3, 'content3', post1),
    commentFactory(4, 'content4', post2),
    commentFactory(5, 'content5', post2),
    commentFactory(6, 'content6', post4),
    commentFactory(7, 'content7', post4),
    commentFactory(8, 'content8', post4),
  ])
  console.log('========= 데이터 생성 완료 =============');
}
 
async function findOneComment(id: number): Promise<Comment> {
  return await AppDataSource.manager.findOne(Comment, {
    where: {
      id,
    },
    withDeleted: true,
  })
}

async function findOnePost(id: number): Promise<Post> {
  return await AppDataSource.manager.findOne(Post, {
    where: {
      id,
    },
    withDeleted: true,
  })
}

async function findOneUser(id: number): Promise<User> {
  return await AppDataSource.manager.findOne(User, {
    where: {
      id,
    },
    withDeleted: true,
  })
}

async function main() {
  await AppDataSource.initialize()
  console.log('========== start ==========')

  await seedData();

  const user2 = await findOneUser(2);
  const post1 = await findOnePost(1);
  const comment4 = await findOneComment(4);
  const comment5 = await findOneComment(5);
  
  await AppDataSource.manager.softDelete(User, {id: user2.id})
  await AppDataSource.manager.softDelete(Post, {id: post1.id})
  await AppDataSource.manager.softDelete(Comment, {id: comment4.id})
  await AppDataSource.manager.softDelete(Comment, {id: comment5.id})
  
  const rst0 = await AppDataSource.createQueryBuilder(User, 'user')
    .withDeleted()
    .leftJoinAndSelect('user.posts', 'posts')
    .leftJoinAndSelect('posts.comments', 'comments')
    .getMany();

  console.log(JSON.stringify(rst0, null, 2))
  
  const rst1 = await AppDataSource.createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.posts', 'posts')
    .withDeleted()
    .leftJoinAndSelect('posts.comments', 'comments')
    .getMany();

  console.log(JSON.stringify(rst1, null, 2))
  
  const rst2 = await AppDataSource.createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.posts', 'posts')
    .leftJoinAndSelect('posts.comments', 'comments')
    .withDeleted()
    .getMany();

  console.log(JSON.stringify(rst2, null, 2))
  
  const rst3 = await AppDataSource.createQueryBuilder(User, 'user')
    .leftJoinAndSelect('user.posts', 'posts')
    .leftJoinAndSelect('posts.comments', 'comments')
    .getMany();

  console.log(JSON.stringify(rst3, null, 2))
  
  process.exit();
}  

main();