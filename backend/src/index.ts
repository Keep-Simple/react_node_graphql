import "reflect-metadata"
import {MikroORM} from "@mikro-orm/core"
import mikroConfig from "./mikro-orm.config"
import express from "express"
import redis from 'redis';
import session from "express-session";
import connectRedis from 'connect-redis';
import {ApolloServer} from 'apollo-server-express'
import {buildSchema} from 'type-graphql'
import {HelloResolver} from "./resolvers/hello"
import {PostResolver} from "./resolvers/post"
import {UserResolver} from "./resolvers/user";
import {__prod__} from "./constants";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig)
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    await orm.getMigrator().up()

    const app = express()

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
                httpOnly: true,
                sameSite: 'lax', // csrf
                secure: __prod__ // only works in https in prod
            },
            secret: "98jldfgj14kjoasdfjasldk3",
            saveUninitialized: false,
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}) => ({ em: orm.em, req, res })
    })

    apolloServer.applyMiddleware({app})

    app.listen(4000, () => console.log('server started on localhost:4000'))
}
main()