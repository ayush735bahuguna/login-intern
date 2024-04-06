const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWTSecret, {
        expiresIn: "30d"
    })
}

module.exports = generateToken;