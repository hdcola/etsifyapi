const ApiError = require('./api-error');
const { Sequelize } = require('sequelize');

function validateSequelizeAndThrow(err) {
    if (!(err instanceof Sequelize.ValidationError)) return;

    const errors = err.errors.map((e) => ({
        message: e.message,
        field: e.path,
    }));
    throw ApiError.badRequest('Validation Error', errors);
}

const sequelizeTryCatch = async (fn) => {
    try {
        return await fn();
    } catch (err) {
        if (err instanceof ApiError) throw err;

        // Sequelize validation error
        validateSequelizeAndThrow(err);
        // Other errors
        throw ApiError.badRequest(err.message);
    }
};

module.exports = { validateSequelizeAndThrow, sequelizeTryCatch };
