var express = require('express');
var router = express.Router();
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

/* Redirect to page 1 */
router.get('/', function(req, res, next) {
  res.redirect('/1');
});

/* GET home page. */
router.get('/:page', asyncHandler(async (req, res, next) => {
  const page = req.params.page;
  const itemsPerPage = 10;
  const books = await Book.findAll({ order: [[ "year", "DESC" ]] })
  if (books.length >= 1) {
    if (books.length <= 10) {
    res.render('index', { books, title: 'SQL Library Manager' })
    } else {
      let totalPages = Math.ceil(books.length / itemsPerPage);
      console.log(totalPages);
      let startIndex = (page * itemsPerPage) - itemsPerPage; //first list item to be shown on page
      let endIndex = (page * itemsPerPage - 1); //last list item to be shown on page
      const filteredBooks = books.filter((book, index) => index >= startIndex && index <= endIndex);
      res.render('index', { books: filteredBooks, title: 'SQL Library Manager', pages: totalPages, page })
    }
  } else {
    res.render('index', { books: {}, title: 'SQL Library Manager',  noBooks: true })
  }
}));

router.get('/deleted/:book', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll({ order: [[ "year", "DESC" ]] })
  books.length >= 1
  ? res.render('index', { books, title: 'SQL Library Manager', deletedBook: req.params.book })
  : res.render('index', { books: {}, title: 'SQL Library Manager',  noBooks: true, deletedBook: req.params.book })
}));

module.exports = router;
