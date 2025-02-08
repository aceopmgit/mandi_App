const sequelize = require("./database");

// module.exports = (func) => {
//   return (req, res, next) => {
//     func(req, res, next).catch((err) => next(err));
//   };
// };

// const sequelize = require("../config/database"); // Import your Sequelize instance

module.exports = (func, useTransaction = false) => {
  return async (req, res, next) => {
    const transaction = useTransaction ? await sequelize.transaction() : null;

    try {
      if (transaction) {
        await func(req, res, next, transaction); // Pass transaction to handler
        await transaction.commit(); // Commit on success
      } else {
        await func(req, res, next); // No transaction, call as usual
      }
    } catch (err) {
      if (transaction) await transaction.rollback(); // Rollback on error
      next(err);
    }
  };
};
