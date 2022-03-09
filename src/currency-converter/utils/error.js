const errorCodes = {
    "VALIDATION_ERROR" : "0x0101",
    "API_ERROR" : "0x0102"
}

class ApiError extends Error {
    constructor(message) {
      super(message);
      this.errorCode = errorCodes.API_ERROR;
    }
  }

  module.exports = {
    ApiError
  };