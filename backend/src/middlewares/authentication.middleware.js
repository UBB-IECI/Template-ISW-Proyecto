"use strict";

const jwt = require("jsonwebtoken");
const { ACCESS_JWT_SECRET } = require("../config/configEnv");
const { respondError } = require("../utils/resHandler");
/**
 * @name verifyJWT
 * @param {*} req {Request}
 * @param {*} res {Response}
 * @param {*} next
 */
const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return respondError(req, res, 401, "No autorizado", "No hay token");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, ACCESS_JWT_SECRET, (err, decoded) => {
      if (err) return respondError(req, res, 403, "No autorizado", err.message);
      req.email = decoded.email;
      req.roles = decoded.roles;
      next();
    });
  } catch (error) {
    handleError(error, "authentication.middleware -> verifyToken");
  }
};

module.exports = verifyJWT;
