const express = require("express");
const app = express();
const router = express.Router();
const {
    GroupDetails,
    postGroupDetails,
    userGroup,
    DeleteGroupDetails,
    deletePostById,
    UpdateGroupDetails,
    getUser
   
} = require("../controller/dashboard/groupController");


const { isAuthenticatedUser } = require('../middleware/Auth');


router.route("/group/add").post(isAuthenticatedUser, userGroup);
router.route("/group").get(isAuthenticatedUser, GroupDetails).post(isAuthenticatedUser, postGroupDetails);
router.route("/group/delete").post(isAuthenticatedUser, deletePostById);
// router.route("/group/filter").post(isAuthenticatedUser, filterGroup);
// router.route("/group/edit").get(isAuthenticatedUser, getUpdate).delete(isAuthenticatedUser, DeleteGroupDetails).post(isAuthenticatedUser, getUpdate);
router.route("/group/edits").post(isAuthenticatedUser, UpdateGroupDetails);
// router.route("/group/detail").post(isAuthenticatedUser, getUpdate);
router.route("/group/get").post(isAuthenticatedUser, getUser);
module.exports = router;    