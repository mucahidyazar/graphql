import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// take in password
// validate password
// hash password
// generate auth token

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be at least 8 character.");
    }

    const hashedPassword = await bcrypt.hash(args.data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, "thisisasecret");

    return {
      user,
      token,
    };
  },
  async login(parent, args, { prisma }, info) {
    console.log(args);
    const { email, password } = args.data;

    const user = await prisma.query.user({ where: { email } });

    if (!user) {
      throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login!");
    }

    const token = jwt.sign({ userId: user.id }, "thisisasecret");

    return {
      user,
      token,
    };
  },
  async deleteUser(parent, args, { prisma }, info) {
    const user = await prisma.mutation.deleteUser(
      { where: { id: args.id } },
      info
    );

    return user;
  },
  async updateUser(parent, args, { prisma }, info) {
    const user = await prisma.mutation.updateUser(
      {
        where: { id: args.id },
        data: args.data,
      },
      info
    );

    return user;
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    const newPost = {
      ...args.data,
      author: {
        connect: {
          id: args.data.author,
        },
      },
    };
    const post = await prisma.mutation.createPost({ data: newPost }, info);

    return post;
  },
  async deletePost(parent, args, { prisma, pubsub }, info) {
    const post = await prisma.mutation.deletePost(
      { where: { id: args.id } },
      info
    );
    return post;
  },
  async updatePost(parent, args, { prisma, pubsub }, info) {
    const { id, data } = args;
    const post = await prisma.mutation.updatePost(
      { where: { id: id }, data: args.data },
      info
    );

    return post;
  },
  async createComment(parent, args, { prisma, pubsub }, info) {
    const { text, author, post } = args.data;

    const newComment = {
      ...args.data,
      post: {
        connect: {
          id: post,
        },
      },
      author: {
        connect: {
          id: author,
        },
      },
    };
    const comment = await prisma.mutation.createComment(
      { data: newComment },
      info
    );

    return comment;
  },
  async deleteComment(parent, args, { prisma, pubsub }, info) {
    const { id } = args;

    const comment = await prisma.mutation.deleteComment(
      { where: { id: id } },
      info
    );

    return comment;
  },
  async updateComment(parent, args, { prisma, pubsub }, info) {
    const { id, data } = args;

    const comment = prisma.mutation.updateComment(
      {
        where: { id: id },
        data: data,
      },
      info
    );

    return comment;
  },
};

export default Mutation;
