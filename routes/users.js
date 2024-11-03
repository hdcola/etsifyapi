var express = require('express');
var router = express.Router();
const {
    createUser,
    login,
    findUserByEmail,
    getUserById,
    changeUserSettings,
} = require('../services/user-service');
const ApiError = require('../utils/api-error');
const { generateToken } = require('../middlewares/jwt');
const { OAuth2Client } = require('google-auth-library');
const { validateToken } = require('../middlewares/jwt');

const client_id = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(client_id);

/* Create a new user */
router.post('/register', async function (req, res, next) {
    const { username, full_name, email, password } = req.body;
    try {
        const token = await createUser({
            username,
            full_name,
            email,
            password,
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
        });
    } catch (err) {
        next(err);
    }
});

const register = async (user_info, res, next) => {
    const { username, full_name, email, password, picture } = user_info;
    try {
        const token = await createUser({
            username,
            full_name,
            email,
            password,
            picture,
        });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
        });
    } catch (err) {
        next(err);
    }
};

/* Login */
router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;
    try {
        const token = await login({ email, password });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/:id([0-9]+)', async (req, res, next) => {
    const { id } = req.params;

    const user = await getUserById(id);

    if (!user) {
        const err = ApiError.notFound('User not found');
        return next(err);
    }

    return res.status(200).json({
        userId: user.user_id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        picture: user.picture,
    });
});

router.put('/:id([0-9]+)', validateToken, async (req, res, next) => {
    const id = parseInt(req.params.id, 10);
    const user_id = parseInt(req.userId, 10);

    if (id !== user_id) {
        const err = ApiError.forbidden('Forbidden');
        return next(err);
    }
    try {
        const { full_name, username, password, picture } = req.body;
        const token = await changeUserSettings({
            userId: id,
            full_name,
            username,
            password,
            picture,
        });
        res.status(200).json({
            success: true,
            message: 'User settings updated successfully',
            token,
        });
    } catch (err) {
        next(err);
    }
});

router.post('/google-login', async function (req, res, next) {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: client_id,
        });
        const payload = ticket.getPayload();
        const username = payload.name;
        const email = payload.email;
        const picture = payload.picture;
        const full_name = payload.given_name + ' ' + payload.family_name;

        // Check if email already exists
        const user = await findUserByEmail(email);
        if (!user) {
            // Create a new user
            const password = Math.random().toString(36).substring(7);
            await register(
                { username, full_name, email, picture, password },
                res,
                next
            );
        } else {
            const token = generateToken({
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                id: user.id,
                picture: picture,
                userId: user.user_id,
            });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
            });
        }
    } catch (error) {
        console.error('error: ' + error);
        const err = ApiError.unauthorized('Invalid Token');
        next(err);
    }
});

/* Logout */
router.post('/logout', function (req, res) {
    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});

module.exports = router;
