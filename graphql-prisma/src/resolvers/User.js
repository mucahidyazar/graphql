const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => {
      return post.author === parent.id;
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments.filter((comment) => comment.id === parent.id);
  },
};

export default User;
