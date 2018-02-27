/**
* Módulo principal
* @module
*/
module.exports = {
  Response : require('./class/Response'),
  errors   : {
    BadRequestError         : require('./class/errors/BadRequestError'),
    UnauthorizedError       : require('./class/errors/UnauthorizedError'),
    ForbiddenError          : require('./class/errors/ForbiddenError'),
    NotFoundError           : require('./class/errors/NotFoundError'),
    ConflictError           : require('./class/errors/ConflictError'),
    PreconditionFailedError : require('./class/errors/PreconditionFailedError'),
    InternalServerError     : require('./class/errors/InternalServerError')
  },
  successes: {
    OkSuccess      : require('./class/successes/OkSuccess'),
    CreatedSuccess : require('./class/successes/CreatedSuccess')
  }
}
