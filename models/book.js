'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  
  class Book extends Sequelize.Model {}

  Book.init({
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Title" is required'
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: '"Author" is required'
        }
      },
    },
    genre: Sequelize.STRING,
    year: {
      type: Sequelize.INTEGER,
      validate: {
        is: {
          args: /^\d{4}$/i,
          msg: 'Year is required in YYYY format'
        }
      },
    },
  }, { sequelize });

  return Book;
}