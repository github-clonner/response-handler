/* global describe it expect */
const express    = require('express')
const bodyParser = require('body-parser')
const request    = require('request')

describe('\n - Clase: Response\n', () => {
  describe(` Método: success`, () => {
    it('Ejecución con parámetros', (done) => {
      const { Response, errors } = require(global.LIB)
      const app = express()
      app.use(bodyParser.json())

      function successFormat (result) {
        return {
          status  : result.status,
          message : result.message,
          data    : result.data
        }
      }

      app.use(Response.success({ successFormat }))
      app.use(Response.error())

      app.post('/libros', (req, res, next) => {
        if (!req.body.titulo) {
          throw new errors.PreconditionFailed()
        }
        res.success200(req.body, 'Libro obtenido exitosamente.')
      })
      app.use((err, req, res, next) => {
        res.error(err)
      })
      app.listen(4000)
      let options = {
        uri    : `http://localhost:4000/libros`,
        method : 'POST',
        json   : { titulo: 'El gato negro', precio: 11.99 }
      }
      request(options, (error, response, body) => {
        if (error) { console.log(error); done() }
        expect(body).to.have.property('status', 'success')
        expect(body).to.have.property('message', 'Libro obtenido exitosamente.')
        expect(body).to.have.property('data')
        expect(Object.keys(body.data).length).to.equal(2)
        expect(body.data).to.have.property('titulo', options.json.titulo)
        expect(body.data).to.have.property('precio', options.json.precio)
        console.log('BODY = ', JSON.stringify(body, null, 2))
        // BODY =  {
        //   "status": "success",
        //   "message": "Libro obtenido exitosamente.",
        //   "data": {
        //     "titulo": "El gato negro",
        //     "precio": 11.99
        //   }
        // }
        options.json = { precio: -124 }
        request(options, (error, response, body) => {
          const { errors } = require(global.LIB)
          if (error) { console.log(error); done() }
          expect(body).to.have.property('name', 'ResponseHandlerError')
          expect(body).to.have.property('status', errors.PreconditionFailed.STATUS)
          expect(body).to.have.property('type', errors.PreconditionFailed.TYPE)
          expect(body).to.have.property('code', errors.PreconditionFailed.CODE)
          expect(body).to.have.property('message', errors.PreconditionFailed.MESSAGE)
          expect(body).to.have.property('errors')
          expect(body.errors).to.be.an('array')
          expect(body.errors).to.have.lengthOf(1)
          expect(body.errors[0]).to.have.property('dev')
          expect(body.errors[0]).to.have.property('msg')
          console.log('BODY = ', JSON.stringify(body, null, 2))
          // BODY =  {
          //   "name": "ResponseHandlerError",
          //   "status": "error",
          //   "type": "PRECONDITION_FAILED",
          //   "code": 412,
          //   "message": "Condición insuficiente",
          //   "errors": [
          //     {
          //       "msg": "No se cumple con algunas condiciones que son necesarias para completar la tarea.",
          //       "dev": null
          //     }
          //   ]
          // }
          setTimeout(() => { process.exit(0) }, 200)
          done()
        })
      })
    })
  })
})
