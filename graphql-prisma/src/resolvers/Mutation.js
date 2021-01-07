import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken";
import getUserId from "../utils/getUserId";
import hashPassword from "../utils/hashPassword";

// take in password
// validate password
// hash password
// generate auth token

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be at least 8 character.");
    }

    const hashedPassword = await hashPassword(args.data.password);

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    return {
      user,
      token,
    };
  },
  async login(parent, args, { prisma }, info) {
    const { email, password } = args.data;

    const user = await prisma.query.user({ where: { email } });

    if (!user) {
      throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login!");
    }

    const token = generateToken(user.id);

    return {
      user,
      token,
    };
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const user = await prisma.mutation.deleteUser(
      { where: { id: userId } },
      info
    );

    return user;
  },
  async updateUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const user = await prisma.mutation.updateUser(
      {
        where: { id: userId },
        data: {
          ...args.data,
          password: hashPassword(args.data.password),
        },
      },
      info
    );

    return user;
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const newPost = {
      ...args.data,
      author: {
        connect: {
          id: userId,
        },
      },
    };
    const post = await prisma.mutation.createPost({ data: newPost }, info);

    return post;
  },
  async deletePost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error("Unable to delete post!");
    }

    const post = await prisma.mutation.deletePost(
      { where: { id: args.id } },
      info
    );
    return post;
  },
  async updatePost(parent, args, { prisma, request }, info) {
    const { id, data } = args;
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: id,
      author: {
        id: userId,
      },
      published: false,
    });

    const isPublished = await prisma.exists.Post({ id });

    if (!postExists) {
      throw new Error("Unable to update post!");
    }

    if (isPublished && data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id: id,
          },
        },
      });
    }

    const post = await prisma.mutation.updatePost(
      { where: { id: id }, data: args.data },
      info
    );

    return post;
  },
  async createComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const { text, post } = args.data;

    const postExists = await prisma.exists.Oost({
      id: post,
      published: true,
    });

    if (!postExists) {
      throw new Error("Post is not published");
    }

    const newComment = {
      text,
      post: {
        connect: {
          id: post,
        },
      },
      author: {
        connect: {
          id: userId,
        },
      },
    };
    const comment = await prisma.mutation.createComment(
      { data: newComment },
      info
    );

    return comment;
  },
  async deleteComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const { id } = args;

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Unable to delete the comment!");
    }

    const comment = await prisma.mutation.deleteComment(
      { where: { id: id } },
      info
    );

    return comment;
  },
  async updateComment(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const { id, data } = args;

    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("Unable to update the comment!");
    }

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
