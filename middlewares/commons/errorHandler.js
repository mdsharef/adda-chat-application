// external imports
const createError = require('http-errors');

const notFoundHandler = (req, res, next) => {
    next(createError(404, "Your requested content has not been found!"));
}

const errorHandler = (err, req, res, next) => {
    res.locals.error =
        process.env.NODE_ENV === 'development' ? err : { message: err.message };
    
    res.status(err.status || 500)

    if(res.locals.html) {
        // html response
        res.render('errors/error', { title: 'Error Page'})
    } else {
        // json response
        res.json(res.locals.error)
    }
}

module.exports = { notFoundHandler, errorHandler }