const sql = require('mssql');

const config = {
  user: 'sa',
  password: 'lordlob665',
  server: 'localhost',
  port: 1433, // o el puerto que hayas configurado
  database: 'FormularioDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};


const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('🔌 Conectado a SQL Server');
    return pool;
  })
  .catch(err => console.log('❌ Error de conexión:', err));

module.exports = {
  sql, poolPromise,
};
