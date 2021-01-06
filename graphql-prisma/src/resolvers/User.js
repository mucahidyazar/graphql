import prisma from "../prisma";
import getUserId from "../utils/getUserId";

const User = {
  //Burayi olusturmamdaki amac userslari birisi sorguladiginda sadece kendi emailini gorebilsin ve digerlerini goremesin.
  //Fakat bu cozumde bir sorun var birisi userslari sorgularken kullanicinin id sini gondermezse burada userId ele alamayacagimzi icin authenticate olmus userin idsi ile karsilastiramayacagiz ve geriye kesin olarak herkes icin null donecektir.
  // email(parent, args, { request }, info) {
  //   const userId = getUserId(request);

  //   if (userId && parent.id === userId) {
  //     return parent.email;
  //   } else {
  //     return null;
  //   }
  // },
  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request);

      if (userId && parent.id === userId) {
        return parent.email;
      } else {
        return null;
      }
    },
  },
  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request);

      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id,
          },
        },
      });
    },
  },
};

export default User;
