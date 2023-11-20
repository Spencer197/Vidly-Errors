//This function was moved here from genres.js. Was called asyncMiddleware(handler).
module.exports = function (handler) {
    return async(req, res, next) => {
      try {
        await handler(req, res);
      }
      catch(ex) {
        next(ex);
      }
    }; 
  }