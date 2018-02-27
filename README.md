# Response Handler

Configura el formato de la respuesta de un servicio web creado con express.

# Características

- Envía 2 tipos de respuestas: exitosa (`success`) y fallida (`error`).
- El formato de la respuesta es personalizable.
- Se puede configurar para que todas las peticiones sean exitosas (`status: 200 Ok`).

## Errors

| Tipo | Código | Titulo | Mensaje | Causa |
|------|--------|--------|---------|-------------|
| `BAD_REQUEST` | 400 | Petición incorrecta | Hubo un error al procesar su solicitud, revise el formato en el envío de datos e inténtelo nuevamente. | Ocurre cuando algún dato de entrada no tiene el formato correcto. |
| `UNAUTHORIZED` | 401 | Acceso no autorizado | Debe autenticarse para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado. |
| `FORBIDDEN` | 403 | Acceso denegado | No cuenta con los privilegios suficientes para acceder al recurso. | Ocurre cuando se intenta acceder a un recurso privado, utilizando una credencial incorrecta. |
| `NOT_FOUND` | 404 | Recurso no disponible | El servidor no puede encontrar el recurso solicitado. | Ocurre generalmente cuando el registro no existe o ha sido eliminado. |
| `CONFLICT` | 409 | Conflicto | Hubo un error durante el proceso, inténtelo nuevamente. | Ocurre generalmente cuando el registro ha sido modificado y no se puede continuar con el proceso. |
| `PRECONDITION_FAILED` | 412 | Condición insuficiente | No se cumple con algunas condiciones que son necesarias para completar la tarea. | Ocurre cuando no se cumple con ciertas condiciones (validaciones lógicas), por lo general cuando los datos de entrada en conjunto no tienen un sentido lógico. |
| `INTERNAL_SERVER_ERROR` | 500 | Error interno | Hubo un error inesperado, inténtelo mas tarde. | Este error nunca debería ocurrir, generalmente son errores desconocidos que no han sido controlados. |

## Successes

| Tipo | Código | Titulo | Mensaje | Causa |
|------|--------|--------|---------|-------------|
| `OK` | 200 | Éxito | La tarea ha sido completada exitosamente. | Ocurre cuando una tarea finaliza correctamente. |
| `CREATED` | 201 | Éxito al crear | El recurso ha sido creado de manera exitosa. | Ocurre cuando una tarea finaliza correctamente y como resultado se ha creado un nuevo recurso. |

# Instalación

Para instalar sobre un proyecto, ejecutar el siguiente comando:

$ `npm install --save response-handler`

# Ejemplos:

## Ejemplo 1

``` js
const { Response, errors } = require('response-handler')
const express              = require('express')

const app = express()
app.use(bodyParser.json())

app.use(Response.success())
app.use(Response.error())

app.post('/libros', (req, res, next) => {
  if (!req.body.titulo) {
    throw new errors.PreconditionFailedError('Se requiere el título del libro.')
  }
  res.success(req.body)
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

Tambien es posible configurar el formato de las respuestas:
``` js
function successFormat (result) {
  return {
    status  : result.status,
    message : result.message,
    data    : result.data
  }
}
app.use(Response.success({ successFormat }))
```
Obteniendo el siguiente resultado:
``` json
{
    "status": "success",
    "message": "Tarea completada exitosamente.",
    "data": {
        "titulo": "El gato negro"
    }
}
```
Los métodos `success` y `error` solo aceptan 1 argumento (pueden ser objetos).

Para enviar mensajes personalizados, se pueden utilizar los metodos `success200`, `error400`, etc.

### Respuestas con el método `success200`
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

### Respuestas con el método `error400`
``` js
res.error400('msg1')
res.error400({ msg: 'msg1', dev: 'dev1' })
res.error400([{ msg: 'msg1', dev: 'dev1' }, { msg: 'msg2', dev: 'dev2' }])
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
