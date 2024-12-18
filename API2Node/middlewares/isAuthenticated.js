 const jwt = require("jsonwebtoken");

// const isAuthenticated = (req,res,next) => {
//     const { authorization } = req.headers;

//     if(!authorization) {
//         return res.status(401).json({message: "Sem token"});
//     }
//     jwt.verify(authorization, process.env.SECRET, (err, decoded) => {
//         if(err) {
//             return res.status(401).json({message: "Token inválido"});
//         }
//         req.userId = decoded.id;
//         return next();
//     });
// }

const isAuthenticated = (req, red, next) => {return next()};

 module.exports = isAuthenticated;