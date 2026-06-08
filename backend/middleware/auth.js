const jwt = require("jsonwebtoken");

module.exports = (

  req,
  res,
  next

) => {

  try {

    /*
    ====================================
    GET AUTH HEADER
    ====================================
    */

    const authHeader =
      req.header(
        "authorization"
      );

    /*
    ====================================
    NO TOKEN
    ====================================
    */

    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message:
          "Access denied"
      });
    }

    /*
    ====================================
    REMOVE BEARER
    ====================================
    */

    const token =
      authHeader.startsWith(
        "Bearer "
      )

      ?

      authHeader.split(" ")[1]

      :

      authHeader;

    /*
    ====================================
    VERIFY TOKEN
    ====================================
    */

    const verified =
      jwt.verify(

        token,

        process.env.JWT_SECRET
      );

    const verified =
  jwt.verify(
    token,
    process.env.JWT_SECRET
  );

console.log(
  "TOKEN USER:",
  verified
);

    /*
    ====================================
    SAVE USER
    ====================================
    */

    req.user = verified;

    next();

  } catch (error) {

    console.error(error);

    res.status(401).json({

      success: false,

      message:
        "Invalid token"
    });
  }
};