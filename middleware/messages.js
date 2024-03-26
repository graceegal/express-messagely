// "use strict";

// const { UnauthorizedError } = require("../expressError");

// function isMessageSender(id) {

// }




// function ensureCorrectUser(req, res, next) {
//   const currentUser = res.locals.user;
//   const hasUnauthorizedUsername = currentUser?.username !== req.params.username;

//   if (!currentUser || hasUnauthorizedUsername) {
//     throw new UnauthorizedError();
//   }

//   return next();
// }
