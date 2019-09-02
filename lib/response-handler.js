/*!
* response-handler
* Copyright(c) 2018 Alex Quispe
* MIT License
*/
module.exports = {
  Response : require('./class/Response'),
  errors   : {
    BadRequest         : require('./class/errors/BadRequestError'),
    Unauthorized       : require('./class/errors/UnauthorizedError'),
    Forbidden          : require('./class/errors/ForbiddenError'),
    NotFound           : require('./class/errors/NotFoundError'),
    Conflict           : require('./class/errors/ConflictError'),
    PreconditionFailed : require('./class/errors/PreconditionFailedError'),
    InvalidToken       : require('./class/errors/InvalidTokenError'),
    InternalServer     : require('./class/errors/InternalServerError')
  },
  successes: {
    Ok      : require('./class/successes/OkSuccess'),
    Created : require('./class/successes/CreatedSuccess')
  }
}
