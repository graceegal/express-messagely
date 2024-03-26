"use strict";

const Router = require("express").Router;
const router = new Router();
const { BadRequestError, UnauthorizedError } = require('../expressError');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** POST /login: {username, password} => {token} */
router.post("/login", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();

  const { username, password } = req.body;
  //TODO: check the boolean val is === true
  if (await User.authenticate(username, password)) {
    await User.updateLoginTimestamp(username);
    let token = jwt.sign({ username }, SECRET_KEY);

    return res.json({ token });
  } else {
    throw new UnauthorizedError('Invalid username/password');
  }
});


/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post("/register", async function (req, res) {
  if (req.body === undefined) throw new BadRequestError();

  const user = await User.register(req.body);

  let payload = { username: user.username };

  let token = jwt.sign(payload, SECRET_KEY);

  return res.json({ token });
});




module.exports = router;