// importing routes
const logInRouter = require('./logInRouter');
const usersRouter = require('./usersRouter');
const inboxRouter = require('./inboxRouter');

// creating an array of routes
const routes = [
    {
        path: '/users',
        handler: usersRouter
    },
    {
        path: '/inbox',
        handler: inboxRouter
    },
    {
        path: '/',
        handler: logInRouter
    }
]

// exporting a function of generating route
module.exports = (app) => {
    routes.forEach((r) => app.use(r.path, r.handler))
}