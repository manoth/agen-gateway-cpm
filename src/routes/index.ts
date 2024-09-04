'use strict';

import * as express from 'express';
const router = express.Router();

const validToken = (req, res, next) => {
  const crypto = req.crypto;
  const token = req.token;
  const hospcode = req.hospcode;
  try {
    req.decoded = JSON.parse(crypto.aes_decrypt(token, hospcode));
    next();
  } catch (err) {
    console.log((!token) ? `You don't have a token` : 'Gatewat error: Token not validated.');
    res.status(401).json({ ok: false, error: 'Token not validated.' });
  }
}

import trigger from './trigger';
router.use('/trigger', validToken, trigger);

export default router;