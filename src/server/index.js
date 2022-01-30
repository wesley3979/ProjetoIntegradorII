const express = require('express')
const app = express()
const routes = require('./routes')

require('./database/db')

app.use(express.json())
routes(app)
app.listen(3007, () => {
  console.log('Rodando na porta: 3007');
})
