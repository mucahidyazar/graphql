import { GraphQLServer, PubSub } from "graphql-yoga";
import database from "./db";
import { resolvers, fragmentReplacements } from "./resolvers";
import prisma from "./prisma";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return {
      db: database,
      pubsub,
      prisma,
      request,
    };
  },
  fragmentReplacements,
});

server.start((server) => {
  const { port } = server;

  console.log("====================================");
  console.log(`Graphql Yoga Server was started on ${port}!`);
  console.log("====================================");
});
