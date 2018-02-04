'use strict';

module.exports= function CustomError(message, status) {
  const err = new Error(message);
  err.status= status;
  return err;
  
};
