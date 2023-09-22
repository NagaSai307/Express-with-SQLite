const express = require("express");

const router = express.Router();

const booksContoller = require("../controllers/bookscontroller");
const userControllers = require("../controllers/userscontrollers");
const { authenticate } = require("../middlewares/authenticate");


router.get("/books",authenticate, booksContoller.getAllBooks);
router.get("/books/:bookId/",authenticate, booksContoller.getBookbyId);
router.post("/books/",authenticate, booksContoller.postAbook);
router.put("/books/:bookId/",authenticate, booksContoller.updateABook);
router.delete("/books/:bookId/",authenticate, booksContoller.DeleteABook);
router.get("/authors/:authorId/books/",authenticate, booksContoller.bookbyAuthorId);
router.get("/books",authenticate, booksContoller.searchQuery);
router.post("/users", userControllers.userRegisterApi);
router.post("/login", userControllers.userLoginApi);
router.get("/profile",authenticate,userControllers.getUserProfile);
router.post("/forgot",userControllers.forgotAPi);
module.exports = { router };
