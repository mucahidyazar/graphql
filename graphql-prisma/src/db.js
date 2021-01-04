const users = [
  {
    id: "1",
    email: "andrewmead@example.com",
    name: "andrewmead",
    age: 27,
  },
  {
    id: "2",
    email: "mucahidyazar@example.com",
    name: "mucahidyazar",
    age: 29,
  },
  {
    id: "3",
    email: "sarah@example.com",
    name: "sarah",
  },
  {
    id: "4",
    email: "mikejohn@example.com",
    name: "mikejohn",
  },
];

const posts = [
  {
    id: "1",
    title: "Post Title 1",
    body:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut, aliquam!",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Post Title 2",
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe adipisci doloribus quae aliquam recusandae quidem voluptas dolore animi, illum vitae.",
    published: false,
    author: "2",
  },
  {
    id: "3",
    title: "Post Title 3",
    body:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe adipisci doloribus quae aliquam recusandae quidem voluptas dolore animi, illum vitae.",
    published: false,
    author: "2",
  },
];

const comments = [
  {
    id: "1",
    text:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut, aliquam!",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe adipisci doloribus quae aliquam recusandae quidem voluptas dolore animi, illum vitae.",
    author: "1",
    post: "1",
  },
  {
    id: "3",
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe adipisci doloribus quae aliquam recusandae quidem voluptas dolore animi, illum vitae.",
    author: "1",
    post: "1",
  },
  {
    id: "4",
    text:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe adipisci doloribus quae aliquam recusandae quidem voluptas dolore animi, illum vitae.",
    author: "3",
    post: "1",
  },
];

const db = {
  users,
  posts,
  comments,
};

export default db;
