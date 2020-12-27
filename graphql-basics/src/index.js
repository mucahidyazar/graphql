import { GraphQLServer } from "graphql-yoga";
import database from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
  },
  context: {
    db: database,
  },
});

server.start((server) => {
  const { port } = server;

  console.log("====================================");
  console.log(`Graphql Yoga Server was started on ${port}!`);
  console.log("====================================");
});
