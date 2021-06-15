var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const itemsPerPage = 10;

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

function createPagination(page, itemsPerPage, books, res, deletedBook = null) {
  let totalPages = Math.ceil(books.length / itemsPerPage);
  let startIndex = (page * itemsPerPage) - itemsPerPage; //first list item to be shown on page
  let endIndex = (page * itemsPerPage - 1); //last list item to be shown on page
  const filteredBooks = books.filter((book, index) => index >= startIndex && index <= endIndex);
  res.render('index', { books: filteredBooks, title: 'SQL Library Manager', pages: totalPages, page, deletedBook })
}

/* Redirect to page 1 */
router.get('/', function(req, res, next) {
  res.redirect('/1');
});

/* GET home page. */
router.get('/:page', asyncHandler(async (req, res, next) => {
  const page = req.params.page;
  const books = await Book.findAll({ order: [[ "year", "DESC" ]] })
  if (books.length >= 1) {
    books.length <= 10
    ? res.render('index', { books, title: 'SQL Library Manager' })
    : createPagination(page, itemsPerPage, books, res);
  } else {
    res.render('index', { books: {}, title: 'SQL Library Manager',  noBooks: true });
  }
}));

router.get('/deleted/:book', asyncHandler(async (req, res, next) => {
  const page = 1;
  const books = await Book.findAll({ order: [[ "year", "DESC" ]] })
  if (books.length >= 1) {
    books.length <= 10
    ? res.render('index', { books, title: 'SQL Library Manager', deletedBook: req.params.book })
    : createPagination(page, itemsPerPage, books, res, req.params.book);
  } else {
    res.render('index', { books: {}, title: 'SQL Library Manager',  noBooks: true, deletedBook: req.params.book });
  }
}));

module.exports = router;
