import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Comment } from "./entity/Comment"
import { Post } from "./entity/Post"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User, Post, Comment],
    migrations: [],
    subscribers: [],
})
