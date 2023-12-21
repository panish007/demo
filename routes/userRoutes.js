const express = require("express");
const router = express.Router();
const {
    registerUser,
    loginUser,
    getAllUser,
    getLogin,
    getUserDetails,
    getRegister,
    logoutpage,
    logout,
    home
} = require("../controller/userController");
const { isAuthenticatedUser } = require('../middleware/Auth');

router.route("/").get(home);
router.route("/register").get(getRegister).post(registerUser);
router.route("/login").get(getLogin).post(loginUser);

router.route("/logout").get(isAuthenticatedUser,logout);
router.route("/page").get(logoutpage);
module.exports = router;