const Query = {
  greeting(parent, args, { db }, info) {
    const { name, position } = args;

    // If string is not empty
    if (name && position) {
      return `Hello ${name}! You are my favoriate ${position}`;
    } else {
      return "Hello Anonymous";
    }
  },
  add(parent, args, { db }, info) {
    const { numbers } = args;

    if (numbers.length === 0) {
      return 0;
    }

    // [1, 5, 10, 2]
    return numbers.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
    });
  },
  grades(parent, args, { db }, info) {
    return [99, 80, 93];
  },
  me() {
    return {
      id: "2",
      name: "me",
      email: "mucahidyazar@gmail.com",
    };
  },
  users(parent, args, { db }, info) {
    const { query } = args;

    if (!query) {
      return db.users;
    }

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(query.toLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    const { query, published } = args;

    return db.posts.filter((post) => {
      if (!query && published) {
        return post.published === published;
      }
      if (query && !published) {
        return (
          post.title.toLowerCase().includes(query.toLowerCase()) &&
          post.body.toLowerCase().includes(query.toLowerCase())
        );
      }
      if (query && published) {
        return (
          post.title.toLowerCase().includes(query.toLowerCase()) &&
          post.body.toLowerCase().includes(query.toLowerCase()) &&
          post.published === published
        );
      }

      return db.posts;
    });

    return posts;
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export default Query;
