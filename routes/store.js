const express = require('express');
const router = express.Router();
const { createStore, getStores } = require('../services/store-service');
const { getUserFromToken } = require('../services/user-service');

router.post('/', async (req, res, next) => {
   const { name, description, country_id } = req.body;
     /*const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ success: false, message: 'User is not logged in' });
    }*/
    try {
        // const userData = getUserFromToken(token);
        // const user_id = userData.id; 
        user_id = 15;
        const store = await createStore({  
            country_id,
            name, 
            description,
            user_id 
        });
        res.status(201).json({
            success: true,
            message: 'Store created successfully',
            store,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    // const token = localStorage.getItem('tocken');
    try {
        const userData = getUserFromToken(token);
    // mocking from user_id = 22 in database
       // const user_id = userData.id; 
       user_id = 15;
        const stores = await getStores(user_id);
        res.status(200).json({
            success: true,
            stores,
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
