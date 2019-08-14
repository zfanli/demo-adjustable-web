/* eslint-disable @typescript-eslint/no-var-requires */
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(proxy('/api/v1/credentials', { target: process.env.API_SERVER }))
  app.use(proxy('/api/panels', { target: process.env.API_SERVER }))
  app.use(proxy('/userinfo', { target: process.env.DATA_API_SERVER }))
  app.use(proxy('/cotinfo', { target: process.env.DATA_API_SERVER }))
}
