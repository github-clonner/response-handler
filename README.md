# Insac Response
Configura el formato de la respuesta de un servicio web creado con express.

# Caracteristicas
- Envía 2 tipos de respuestas: exitosa y fallida.
- El formato de la respuesta es personalizable.
- Captura los errores producidos por Insac Validator y Sequelize.

# Ejemplo
``` js
const { Response, errors } = require('insac-response')
const express = require('express')

const app = express()
const response = new Response()

app.use(response.success())
app.use(response.error())

app.post('/libros', (req, res, next) => {
  if (!req.body.titulo) {
    throw new errors.ValidationError('Se requiere el título del libro.')
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
  "status": "success",
  "message": "Tarea completada con éxito.",
  "data": {
    "titulo": "El cuervo"
  }
}
```

### Respuesta con error
`curl -H "Content-Type: application/json" -X POST http://localhost:4000/libros`
``` json
{
  "status": "error",
  "code": 400,
  "message": "Error de validación",
  "errors": [
    {
      "path": null,
      "value": null,
      "msg": "Se requiere el título del libro."
    }
  ]
}
```
