import jwt from "jsonwebtoken";

export default (req, resp, next) => {
  let token;
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, "j#ghf#jdhsfk#33");
      req.userID = decoded._id;
      next();
    } catch (err) {}
  } else {
    return resp.status(403).json({
      message: "немаэ доступу",
    });
  }
};
