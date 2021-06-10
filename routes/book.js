const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

function noBook(req, res, next) {
  let err = new Error(`Sorry that book doesn't exist within the database`);
  err.status = 404;
  next(err);
}

/* Redirect to home */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

/* Create new book form. */
router.get('/new', function(req, res, next) {
  res.render('book/new', { book: {}, title: "New Book"});
});

/* POST create new book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect(`/book/${book.id}`);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("book/new", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }  
  }
}));

/* view book */
router.get('/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  book
  ? res.render('book/view', { book, title: book.title })
  : noBook(req, res, next)
}));

/* edit book */
router.get('/:id/edit', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  book
  ? res.render('book/edit', { book, title: `Edit ${book.title}`})
  : noBook(req, res, next)
}));

/* POST edit book. */
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect(`/book/${book.id}`)
    } else noBook(req, res, next)
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      book.id = req.params.id
      res.render("book/new", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }  
  }
}));

/* delete book */
router.get('/:id/delete', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  book
  ? res.render('book/delete', { book, title: `Delete ${book.title}` })
  : noBook(req, res, next)
}));

/* POST Delete book */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  const bookName = book.title.replace(' ', '-')
  if(book) {
    await book.destroy();
    res.redirect(`/deleted/${bookName}`);
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
