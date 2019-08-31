const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET = 'SOME-SUPER-SECRET';
const EXPIRATION = '7d';

function generateSecret(id, pwdHash) {
  const secret = [id, JWT_SECRET, pwdHash].join('-');

  const hash = crypto.createHash('sha256');
  hash.update(secret);
  return hash.digest('hex');
}

module.exports = {
  generateToken: (id, username, hash) => {
    const secret = generateSecret(id, hash);

    const token = jwt.sign({
      username
    }, secret, {
      expiresIn: EXPIRATION
    });

    return token;
  }
};
