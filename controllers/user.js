const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

/*Function signup*/
exports.signup = (req, res, next) => {
  // const hashedEmail = cryptojs
  //   .HmacSHA512(req.body.email, process.env.SECRET_CRYPTOJS_TOKEN)
  //   .toString(cryptojs.enc.Base64);
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      console.log(user);
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ error });
    });
};
/*Function login*/
exports.login = (req, res, next) => {
  // const hashedEmail = cryptojs
  //   .HmacSHA512(req.body.email, process.env.SECRET_CRYPTOJS_TOKEN)
  //   .toString(cryptojs.enc.Base64);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ error: "Paire identifiant/mot de passe incorrecte !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Paire identifiant/mot de passe incorrecte !" });
          } else {
            res.status(200).json({
              userId: user._id,
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
