const { items } = require('../models');
const { sequelizeTryCatch } = require('../utils/sequelize-helper');

async function getItem(itemId) {
    return sequelizeTryCatch(async () => {
        // Get the item
        const item = await items.findByPk(itemId, {
            attributes: { exclude: ['store_id', 'date_created'] },
            include: [
                {
                    association: 'store',
                    attributes: {
                        exclude: [
                            'description',
                            'date_created',
                            'last_updated',
                            'image_url',
                            'country_id',
                        ],
                    },
                    include: [{ association: 'country' }],
                },
                {
                    association: 'reviews',
                },
            ],
        });
        if (!item) {
            throw new Error(`Item ${itemId} doesn't exist.`);
        }

        return item;
    });
}

module.exports = { getItem };
