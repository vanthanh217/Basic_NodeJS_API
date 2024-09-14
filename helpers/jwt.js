const { expressjwt: expressJwt } = require("express-jwt");

const isRevokedCallBack = async (req, token) => {
  const ADMIN = process.env.ROLE_ADMIN;
  const { role } = token.payload;
  if (role === ADMIN) {
    return false; // Không từ chối token
  }
  return true; // Từ chối token
};

function authJWT() {
  const secret = process.env.SECRET;
  const apiUrl = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevokedCallBack,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, method: ["GET", "POST", "OPTIONS"] },
      `${apiUrl}/users/login`,
      `${apiUrl}/users/register`,
    ],
  });
}

module.exports = authJWT;
