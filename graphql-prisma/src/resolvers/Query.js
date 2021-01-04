const Query = {
  users(parent, args, { prisma }, info) {
    const opArgs = {};

    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }

    //nothing(null) - string('id name') - object(info)
    return prisma.query.users(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const { query } = args;

    const opsArgs = {};

    if (query) {
      opsArgs.where = {
        OR: [{ title_contains: query }, { body_contains: query }],
      };
    }

    // return posts;
    return prisma.query.posts(opsArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
};

export default Query;
