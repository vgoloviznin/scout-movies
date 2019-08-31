const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');

const asyncVerify = promisify(jwt.verify);

function generateSecret(username) {
  const secret = [username, process.env.JWT_SECRET].join('-');

  const hash = crypto.createHash('sha256');
  hash.update(secret);
  return hash.digest('hex');
}

async function verify(token) {
  if (!token) {
    return false;
  }

  const decoded = jwt.decode(token, { complete: true });

  if (!decoded) {
    return false;
  }

  const secret = generateSecret(decoded.payload.username);

  try {
    await asyncVerify(token, secret);
  } catch (e) {
    return false;
  }

  return true;
}

module.exports = {
  generateToken: (username) => {
    const secret = generateSecret(username);

    const token = jwt.sign({ username }, secret, { expiresIn: process.env.EXPIRATION });

    return token;
  },
  contextHelper: async (context) => {
    const isLoggedIn = await verify(context.request.headers.authorization);

    return { isLoggedIn };
  }
};
