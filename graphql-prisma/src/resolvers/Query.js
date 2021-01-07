import getUserId from "../utils/getUserId";

const Query = {
  users(parent, args, { prisma }, info) {
    const { first, skip, after, orderBy } = args;
    const opArgs = {
      first,
      skip,
      after,
      orderBy,
    };

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }],
      };
    }

    //nothing(null) - string('id name') - object(info)
    return prisma.query.users(opArgs, info);
  },
  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const me = await prisma.query.user({ where: { id: userId } });

    return me;
  },
  async posts(parent, args, { prisma }, info) {
    const { query, first, skip, after, orderBy } = args.query;

    const opsArgs = {
      where: {
        published: true,
      },
      first,
      skip,
      after,
      orderBy,
    };

    if (args.query) {
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
    }

    // return posts;
    return prisma.query.posts(opsArgs, info);
  },
  async myPosts(parent, args, { prisma, request }, info) {
    const { query, first, skip, after, orderBy } = args;
    const userId = getUserId(request);

    const opsArgs = {
      where: { author: { id: userId } },
      first,
      skip,
      after,
      orderBy,
    };

    if (query) {
      opArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
    }

    return prisma.query.posts(opsArgs, info);
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false);

    //Burada 1 tane posts'u posts'da aramamizin sebebi posts querysinde OR AND gibi cok yararli arama faktorleri var. post query sinde sadece id ile arama yapabiliyoruz.
    const posts = await prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [{ published: true }, { author: { id: userId } }],
        },
      },
      info
    );

    if (posts.length === 0) {
      throw new Error("Post not found!");
    }

    return posts[0];
  },
  comments(parent, args, { prisma }, info) {
    const { first, skip, after, orderBy } = args;
    return prisma.query.comments(
      {
        first,
        skip,
        after,
        orderBy,
      },
      info
    );
  },
};

export default Query;
