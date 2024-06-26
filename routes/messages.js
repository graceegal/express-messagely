"use strict";

const Router = require("express").Router;
const router = new Router();
const { ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError, UnauthorizedError } = require('../expressError');
const Message = require('../models/message');

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id',
  ensureLoggedIn,
  async function (req, res) {
    const id = req.params.id;
    const message = await Message.get(id);
    const currentUserName = res.locals.user.username;
//TODO: fail fast
    if (message.from_user.username === currentUserName ||
      message.to_user.username === currentUserName) {

      return res.json({ message });

    } else {
      throw new UnauthorizedError();
    }


  });


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/',
  ensureLoggedIn,
  async function (req, res) {
    if (req.body === undefined) throw new BadRequestError();

    const from_username = res.locals.user.username;
    const { to_username, body } = req.body;
    const message = await Message.create({ from_username, to_username, body });

    return res.json({ message });

  });


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read',
  ensureLoggedIn,
  async function (req, res) {
    const id = req.params.id;
    const messageData = await Message.get(id);
    const currentUserName = res.locals.user.username;

    if (messageData.to_user.username === currentUserName) {
      const message = await Message.markRead(id);

      return res.json({ message });

    } else {
      throw new UnauthorizedError();
    }
  });


module.exports = router;