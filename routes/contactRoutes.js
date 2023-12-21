const express = require("express");
const app = express();
const router = express.Router();
const {
    userContact,
    addUser,
    ContactDetails,
    allContactDetails,
    DeleteContactDetails,
    filterContact,
    details,
    groupdeatils,
    postContactDetails,
    myOrders,
    getUser,
    deletePostById,
    userSeraching,
    searchContact,
    UpdateContactDetails, getUpdate
} = require("../controller/dashboard/contactController");


const { isAuthenticatedUser } = require('../middleware/Auth');


router.route("/contact/add").get(isAuthenticatedUser, addUser).post(isAuthenticatedUser, userContact);
router.route("/dashboard").get(isAuthenticatedUser, ContactDetails);
router.route("/contact/details").post(isAuthenticatedUser,postContactDetails);
router.route("/dashboard/delete").post(isAuthenticatedUser, DeleteContactDetails);
router.route("/dashboard/filter").post(isAuthenticatedUser, filterContact);
router.route("/dashboard/edit").get(isAuthenticatedUser, getUpdate).delete(isAuthenticatedUser, DeleteContactDetails).post(isAuthenticatedUser, getUpdate);
router.route("/dashboard/edits").post(isAuthenticatedUser, UpdateContactDetails);
router.route("/dashboard/detail").post(isAuthenticatedUser, getUpdate);
router.route("/dashboard/userdeatil").post(isAuthenticatedUser, getUser);
router.route("/contact/groupName").get(isAuthenticatedUser,groupdeatils);
// router.route("/dashboard/search").post(isAuthenticatedUser,userSeraching);
module.exports = router;