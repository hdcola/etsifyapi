const express = require('express');
const router = express.Router();
const { getItem } = require('../services/items-service');

router.get('/:itemId([0-9]+)', async (req, res, next) => {
    try {
        const item = await getItem(req.params.itemId);
        res.status(200).json(item);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
