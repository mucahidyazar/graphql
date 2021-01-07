import jwt from "jsonwebtoken";

const getUserId = (request, requireAuth = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  // Burada bulunan deger sadece Query ve Mutation isteklerinde bulunuyor
  //subscriptionda bu bulunmuyor
  //!request.request.headers.authorization;

  // Buda sadece Subscription isteklerinde bulunuyor Query ve Mutationlarda bulunmuyor
  //Yani bunun Subscriptionda yukaridakini Query ve Mutationlarda kullanacagiz.
  //!request.connection.context.Authorization

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, "thisisasecret");
    return decoded.userId;
  }

  if (requireAuth) {
    throw new Error("Authentication required!");
  }

  return null;
};

export default getUserId;
