/** @ignore */ const ResponseError = require('../ResponseError')

/**
* Clase InternalServerError
*/
class InternalServerError extends ResponseError {
  /**
  * Crea una instancia.
  * @param {Object} err - Error.
  */
  constructor (err) {
    super(
      InternalServerError.TYPE,
      InternalServerError.CODE,
      InternalServerError.MESSAGE,
      [{ msg: InternalServerError.MSG, dev: err ? err.toString() : null }],
      err
    )
  }
}

InternalServerError.TYPE    = 'INTERNAL_SERVER_ERROR'
InternalServerError.CODE    = 500
InternalServerError.MESSAGE = 'Error interno'
InternalServerError.MSG     = 'Hubo un error inesperado, inténtelo mas tarde.'

/**
* Crea un objeto de tipo error sin invocar al constructor.
* Esto es para mantener en la cima del stack el punto exacto donde ocurrio el error.
* @param {Object} err - Error.
* @return {Object}
*/
InternalServerError.create = (err) => {
  return ResponseError.create(
    InternalServerError.TYPE,
    InternalServerError.CODE,
    InternalServerError.MESSAGE,
    [{ msg: InternalServerError.MSG, dev: err ? err.toString() : null }],
    err
  )
}

module.exports = InternalServerError
