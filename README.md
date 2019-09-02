# Response Handler

Cuando se envía el resultado de una petición desde un servicio web, ésta debe incluir suficiente información para que sea interpretado adecuadamente por la aplicación cliente.

Esta librería ofrece un mecanismo simple y flexible que permite dar formato a las respuestas de un servicio web creado con express.

## Características

- Es posible definir dos tipos de respuestas `success` y `error`.
- El formato de la respuesta es personalizable.
- Se puede configurar para que todas las peticiones sean exitosas (`status: 200 Ok`).

## Tipos de errores

| Tipo | Código | Titulo | Mensaje | Causa |
|------|--------|--------|---------|-------------|
| `BAD_REQUEST` | 400 | Petición incorrecta | Hubo un error al procesar su solicitud, revise el formato en el envío de datos e inténtelo nuevamente. | Ocurre cuando algún dato de entrada no tiene el formato correcto. |
| `UNAUTHORIZED` | 401 | Acceso no autorizado | Debe autenticarse para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado. |
| `FORBIDDEN` | 403 | Acceso denegado | No cuenta con los privilegios suficientes para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado, utilizando una credencial incorrecta. |
| `NOT_FOUND` | 404 | Recurso no disponible | El servidor no puede encontrar el recurso solicitado. | Ocurre generalmente cuando el registro no existe o ha sido eliminado. |
| `CONFLICT` | 409 | Conflicto | Hubo un error durante el proceso, inténtelo nuevamente. | Ocurre generalmente cuando el registro ha sido modificado y no se puede continuar con el proceso. |
| `PRECONDITION_FAILED` | 412 | Condición insuficiente | No se cumple con algunas condiciones que son necesarias para completar la tarea. | Ocurre cuando no se cumple con ciertas condiciones (validaciones lógicas), por lo general cuando los datos de entrada en conjunto no tienen un sentido lógico. |
| `INVALID_TOKEN` | 498 | Token inválido | El token es inválido | Ocurre generalmente cuando el token ha expirado. |
| `INTERNAL_SERVER` | 500 | Error interno | Hubo un error inesperado, inténtelo mas tarde. | Este error nunca debería ocurrir, generalmente son errores desconocidos que no han sido controlados. |

## Tipos de respuesta exitosa

| Tipo | Código | Titulo | Mensaje | Causa |
|------|--------|--------|---------|-------------|
| `OK` | 200 | Éxito | La tarea ha sido completada exitosamente. | Ocurre cuando una tarea finaliza correctamente. |
| `CREATED` | 201 | Éxito al crear | El recurso ha sido creado de manera exitosa. | Ocurre cuando una tarea finaliza correctamente y como resultado se ha creado un nuevo recurso. |

## Función `success`

Esta función permite crear un middleware que adiciona las propiedades `success`, `success200` y `success201` al objeto `response` de una petición.

| Parámetros | Descripción |
|------------|-------------|
| `successHandler` | Función que se utiliza para modificar la respuesta antes de que ésta sea tratada. |
| `onSuccess` | Función que contiene el resultado final y que puede ser utilizado para realizar otras acciones. |
| `successFormat` | Función que da formato al resultado final. |

```js
function successHandler (data) {
  return data
}
function onSuccess (result, req) {
  // TODO
}
function successFormat (result) {
  return {
    name     : result.name,
    status   : result.status,
    type     : result.type,
    code     : result.code,
    message  : result.message,
    data     : result.data,
    metadata : result.metadata
  }
}

app.use(Response.success({ successHandler, onSuccess, successFormat }))
```

## Respuestas con el método `success200`
``` js
res.success200({ id: 1, titulo: 'El gato negro' })
res.success200({ id: 1, titulo: 'El gato negro' }, 'Libro obtenido exitosamente.')
res.success200([{ id: 1, titulo: 'El gato negro' }], 'Libro obtenido exitosamente.', { count: 1 })
```

``` json
{
  "name": "ResponseHandlerSuccess",
  "status": "success",
  "type": "OK",
  "code": 200,
  "message": "Libro obtenido exitosamente.",
  "data": [
    {
      "id": 1,
      "titulo": "El gato negro"
    }
  ],
  "metadata": {
    "count": 1
  }
}
```

## Función `error`

Al igual que con la función success, esta función permite crear un middleware que adiciona las propiedades `error`, `error400`, `error401`, etc. al objeto `response` de una petición.

| Parámetros | Descripción |
|------------|-------------|
| `errorHandler` | Función que se utiliza para modificar el error antes de que ésta sea tratada. |
| `onError` | Función que contiene el resultado final y que puede ser utilizado para realizar otras acciones. |
| `errorFormat` | Función que da formato al resultado final. |

```js
function errorHandler (data) {
  return data
}
function onError (result, req) {
  // TODO
}
function errorFormat (result) {
  return {
    name    : result.name,
    status  : result.status,
    type    : result.type,
    code    : result.code,
    message : result.message,
    errors  : result.errors,
    parent  : result.parent
  }
}

app.use(Response.error({ errorHandler, onError, errorFormat }))
```

## Respuestas con el método `error400`
``` js
// Errores producidos desde un controlador
res.error400('msg1')
res.error400({ msg: 'msg1', dev: 'dev1' })
res.error400([{ msg: 'msg1', dev: 'dev1' }, { msg: 'msg2', dev: 'dev2' }])

// Errores producidos desde un midleware
throw new BadRequest('msg1')
throw new BadRequest({ msg: 'msg1', dev: 'dev1' })
throw new BadRequest([{ msg: 'msg1', dev: 'dev1' }, { msg: 'msg2', dev: 'dev2' }])

// Errores producidos desde un controlador de errores
function (err, req, res, next) => {
  err = BadRequest.create('msg1')
  err = BadRequest.create({ msg: 'msg1', dev: 'dev1' })
  err = BadRequest.create([{ msg: 'msg1', dev: 'dev1' }, { msg: 'msg2', dev: 'dev2' }])

  res.error(err)
}
```

``` json
{
  "name": "ResponseHandlerError",
  "status": "error",
  "type": "BAD_REQUEST",
  "code": 400,
  "message": "Petición incorrecta",
  "errors": [
    {
      "msg": "msg1",
      "dev": "dev1"
    },
    {
      "msg": "msg2",
      "dev": "dev2"
    }
  ]
}
```

## Instalación

Para instalar sobre un proyecto, ejecutar el siguiente comando:

$ `npm install --save response-handler`

## Ejemplo

``` js
const { Response, errors }   = require('response-handler')
const { PreconditionFailed } = errors
const express    = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

app.use(Response.success())
app.use(Response.error())

app.post('/libros', (req, res, next) => {
  if (!req.body.titulo) {
    throw new PreconditionFailed('Se requiere el título del libro.')
  }
  res.success200(req.body)
})

app.use((err, req, res, next) => {
  res.error(err)
})

app.listen(4000)
```

### Respuesta exitosa

`curl -H "Content-Type: application/json" -X POST -d '{ titulo": "El cuervo" }' http://localhost:4000/libros`
``` json
{
  "name": "ResponseHandlerSuccess",
  "status": "success",
  "type": "OK",
  "code": 200,
  "message": "Tarea completada exitosamente.",
  "data": {
    "titulo": "El gato negro"
  },
  "metadata": null
}
```

### Respuesta con error

`curl -H "Content-Type: application/json" -X POST http://localhost:4000/libros`
``` json
{
  "name": "ResponseHandlerError",
  "status": "error",
  "type": "PRECONDITION_FAILED",
  "code": 412,
  "message": "Condición insuficiente",
  "errors": [
    {
      "msg": "Se requiere el título del libro.",
      "dev": null
    }
  ]
}
```
