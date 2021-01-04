import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const { name, email, age, firstName, lastName } = args.data;
    const emailTaken = db.users.some((user) => user.email === email);

    if (emailTaken) {
      throw new Error("This email taken.");
    }

    const newUser = {
      id: uuidv4(),
      name,
      email,
      age,
      firstName,
      lastName,
    };
    db.users.push(newUser);
    return newUser;
  },
  deleteUser(parent, args, { db }, info) {
    const { id } = args;
    const userIndex = db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error("User not found!");
    }

    const deletedUsers = db.users.splice(userIndex, 1);
    //return deletedUsers[0]

    db.posts = db.posts.filter((post) => {
      const match = post.author === id;

      if (match) {
        comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.author !== id);

    return deletedUsers[0];
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found!");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken!");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof !data.age === "undefined") {
      user.age = data.age;
    }

    if (typeof data.firstName === "string") {
      user.firstName = data.firstName;
    }

    if (typeof data.lastName === "string") {
      user.lastName = data.lastName;
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const { title, body, published, author } = args.data;
    const userExists = db.users.some((user) => user.id === author);

    if (!userExists) {
      throw new Error("User not found!");
    }

    const newPost = {
      id: uuidv4(),
      title,
      body,
      published,
      author,
    };

    db.posts.push(newPost);

    if (published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: newPost,
        },
      });
    }
    return newPost;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const { id } = args;
    const postIndex = db.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      throw new Error("Post not found!");
    }

    const deletedPosts = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== id);

    if (deletedPosts[0].published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletedPosts[0],
        },
      });
    }
    return deletedPosts[0];
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found!");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        //deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        //created
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      // updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const { text, author, post } = args.data;

    const userExists = db.users.some((user) => user.id === author);
    if (!userExists) {
      throw new Error("User not found!");
    }

    const postExistsAndPublished = db.posts.some((p) => {
      return p.id === post && p.published;
    });
    if (!postExistsAndPublished) {
      throw new Error("Post not found or not published!");
    }

    const newComment = {
      id: uuidv4(),
      text,
      author,
      post,
    };

    db.comments.push(newComment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: newComment,
      },
    });

    return newComment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const { id } = args;

    const commentIndex = db.comments.findIndex((comment) => comment.id === id);

    if (commentIndex === -1) {
      throw new Error("Comment not found!");
    }

    const deletedComments = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComments[0].post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComments[0],
      },
    });

    return deletedComments[0];
  },
  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;

    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found!");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export default Mutation;
