const { Pool } = require('pg')

const pool = new Pool()

pool.connect((err) => {
    if (!err) {
        console.log('PostgreSQL Connected')
    } else {
        console.error(err)
    }
})

module.exports = pool