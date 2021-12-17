const express = require('express')
const app = express()
const routes = require('./routes')

require('./database')

app.use(express.json())
routes(app)
app.listen(4000, () => {
  console.log('Rodando na porta: 4000');
})
