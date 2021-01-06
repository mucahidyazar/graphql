import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "THISISMYSUPERSECRETPASSWORD",
  fragmentReplacements,
});

export default prisma;

// prisma.query
// prisma.mutation
// prisma.subscription
// prisma.exists

// prisma.query.users(null, "{ id name email }").then((data) => {
//   console.log(data);
// });

// prisma.exists.User({
//     id: "abc123",
//   })
//   .then((data) => {
//     console.log(data); // false
//   });
// prisma.exists.User({
//     id: "ckjczlg8800730967meyy3wjl",
//   })
//   .then((data) => {
//     console.log(data); // true
//   });

// prisma.exists.Post({
//     id: "ckjd1h9w800ry0967pxo9oxr1",
//     author: {
//       id: "ckjczlg8800730967meyy3wjl",
//     },
//   })
//   .then((data) => {
//     console.log(data); // true
//   });

// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({ id: authorId });

//   if (!userExists) {
//     throw new Error("User not found!");
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId,
//           },
//         },
//       },
//     },
//     "{ author { id name email posts { id title published } } }"
//   );

//   return post.author;
// };
// createPostForUser("ckjczlg8800730967meyy3wjl", {
//   title: "Mucahids new post",
//   body: "This is a test",
//   published: false,
// })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   }).catch((error) => {
//     console.log(error.message);
//   })

// const updatePostForUser = async (postId, data) => {
//   const postExists = await prisma.exists.Post({ id: postId });

//   if (!postExists) {
//     throw new Error("User not found!");
//   }

//   const post = await prisma.mutation.updatePost(
//     { where: { id: postId }, data },
//     "{ author { id name email posts { id body title } } }"
//   );

//   return user.author;
// };
// updatePostForUser("ckjdyjdgc01u40967m6thqi76", {
//   body: "Deneme body bu olacak",
//   title: "THIS",
//   published: true,
// })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((error) => {
//     console.log(error.message);
//   });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "My new Graphql post is live",
//         body: "You can find the new course!",
//         published: true,
//         author: {
//           connect: {
//             id: "ckjczlg8800730967meyy3wjl",
//           },
//         },
//       },
//     },
//     "{ id body title published author { id name email } }"
//   )
//   .then((data) => {
//     console.log(data);
//     return prisma.query.users(null, "{ id name posts { id title } }");
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         body: "Updated body is now live!",
//       },
//       where: {
//         id: "ckjdxk7tb01qf09670f1dt7tg",
//       },
//     },
//     "{ id title }"
//   )
//   .then((data) => {
//     console.log(data);
//     return prisma.query.posts(null, "{ id body title published }");
//   })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });
