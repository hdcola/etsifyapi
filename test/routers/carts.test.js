const request = require('supertest');
const express = require('express');
const appSetup = require('../../appSetup');
const ApiError = require('../../utils/api-error');
const { users, items } = require('../../models');
const { generateToken } = require('../../middlewares/jwt');

const app = express();
appSetup(app);

jest.mock('../../models/');

describe('GET /api/carts', () => {
    let token;
    let userId;

    beforeEach(() => {
        userId = 1;
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const countItemsReq = async () => {
        return await request(app)
            .get('/api/carts/count')
            .set('Authorization', `Bearer ${token}`);
    };

    const getItemsReq = async () => {
        return await request(app)
            .get('/api/carts')
            .set('Authorization', `Bearer ${token}`);
    };

    it('getCount() it should fail finding the user', async () => {
        users.findByPk = jest.fn(() => null);

        const response = await countItemsReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`User ${userId} doesn't exist.`);
    });

    it('getCount() it should return count 0 for non existent cart', async () => {
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return null;
                },
            };
        });

        const response = await countItemsReq();

        expect(response.status).toBe(200);
        expect(response.body).toBe(0);
    });

    it('getCount() it should return count for existing cart', async () => {
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-02T11:19:10.000Z',
                        last_updated: '2024-11-02T11:19:10.000Z',
                        user_id: userId,
                        countItems: () => {
                            return 2;
                        },
                    };
                },
            };
        });

        const response = await countItemsReq();

        expect(response.status).toBe(200);
        expect(response.body).toBe(users.findByPk().getCart().countItems());
    });

    it('getItems() it should fail finding the user', async () => {
        users.findByPk = jest.fn(() => null);

        const response = await getItemsReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`User ${userId} doesn't exist.`);
    });

    it('getItems() it should fail finding a cart', async () => {
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return null;
                },
            };
        });

        const response = await getItemsReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(
            `User ${userId} doesn't have a cart.`
        );
    });

    it('getItems() it should return cart items', async () => {
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        getItems: () => {
                            return [
                                {
                                    item_id: 1,
                                    name: 'Test Item',
                                    description: 'Test Item Description',
                                    quantity: 1,
                                    price: '5.99',
                                    rating: 5,
                                    discount_percent: null,
                                    image_url: null,
                                    date_created: '2024-10-31T23:05:20.000Z',
                                    last_updated: '2024-10-31T23:05:20.000Z',
                                    store: {
                                        store_id: 1,
                                        name: "Test's Store",
                                        rating: 0,
                                        logo_url: null,
                                        country: {
                                            country_id: 42,
                                            name: 'Canada',
                                            code: 'CA',
                                        },
                                    },
                                    carts_items: {
                                        quantity: 1,
                                        discount_percent: null,
                                    },
                                },
                            ];
                        },
                    };
                },
            };
        });

        const response = await getItemsReq();

        expect(response.status).toBe(200);
        expect(response.body).toEqual(users.findByPk().getCart().getItems());
    });
});

describe('POST /api/carts', () => {
    let token;
    let userId;

    beforeEach(() => {
        userId = 1;
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const addItemReq = async () => {
        return await request(app)
            .post('/api/carts/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 1 });
    };

    it('addItem() it should fail finding the user', async () => {
        users.findByPk = jest.fn(() => null);

        const response = await addItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`User ${userId} doesn't exist.`);
    });

    it('addItem() it should fail finding the item', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
            };
        });
        items.findByPk = jest.fn(() => null);

        const response = await request(app)
            .post(`/api/carts/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 1 });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`Item ${itemId} doesn't exist.`);
    });

    it('addItem() it should fail finding a cart and creates one', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return null;
                },
                createCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        addItem: () => {
                            return itemId;
                        },
                    };
                },
            };
        });
        items.findByPk = jest.fn(() => {
            return {
                item_id: itemId,
                name: 'Test Item',
                description: 'Test Item Description',
                quantity: 1,
                price: '5.99',
                rating: 5,
                discount_percent: null,
                image_url: null,
                date_created: '2024-10-31T23:05:20.000Z',
                last_updated: '2024-10-31T23:05:20.000Z',
                store_id: 1,
            };
        });

        const response = await request(app)
            .post(`/api/carts/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toBe(users.findByPk().createCart().cart_id);
    });

    it('addItem() it should reject an invalid quantity', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        addItem: () => {
                            throw ApiError.badRequest('Validation Error', [
                                {
                                    message: 'Quantity cannot be lower than 0.',
                                    field: 'quantity',
                                },
                            ]);
                        },
                    };
                },
            };
        });
        items.findByPk = jest.fn(() => {
            return {
                item_id: itemId,
                name: 'Test Item',
                description: 'Test Item Description',
                quantity: 1,
                price: '5.99',
                rating: 5,
                discount_percent: null,
                image_url: null,
                date_created: '2024-10-31T23:05:20.000Z',
                last_updated: '2024-10-31T23:05:20.000Z',
                store_id: 1,
            };
        });

        const response = await request(app)
            .post('/api/carts/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: -1 });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Validation Error');
        expect(response.body.errors).toEqual([
            {
                message: 'Quantity cannot be lower than 0.',
                field: 'quantity',
            },
        ]);
    });

    it('addItem() it should add an item to cart', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        addItem: () => {
                            return itemId;
                        },
                    };
                },
            };
        });
        items.findByPk = jest.fn(() => {
            return {
                item_id: itemId,
                name: 'Test Item',
                description: 'Test Item Description',
                quantity: 1,
                price: '5.99',
                rating: 5,
                discount_percent: null,
                image_url: null,
                date_created: '2024-10-31T23:05:20.000Z',
                last_updated: '2024-10-31T23:05:20.000Z',
                store_id: 1,
            };
        });

        const response = await addItemReq();

        expect(response.status).toBe(200);
        expect(response.body).toBe(users.findByPk().getCart().cart_id);
    });
});

describe('PATCH /api/carts', () => {
    let token;
    let userId;

    beforeEach(() => {
        userId = 1;
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const updateItemReq = async () => {
        return await request(app)
            .patch('/api/carts/1')
            .set('Authorization', `Bearer ${token}`)
            .send({ quantity: 2 });
    };

    it('updateQuantity() it should fail finding the user', async () => {
        users.findByPk = jest.fn(() => null);

        const response = await updateItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`User ${userId} doesn't exist.`);
    });

    it('updateQuantity() it should fail finding a cart', async () => {
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return null;
                },
            };
        });

        const response = await updateItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(
            `User ${userId} doesn't have a cart.`
        );
    });

    it('updateQuantity() it should fail finding the item', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                    };
                },
            };
        });
        items.findByPk = jest.fn(() => null);

        const response = await updateItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`Item ${itemId} doesn't exist.`);
    });

    it('updateQuantity() it should fail find the item in cart', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        hasItem: () => {
                            return false;
                        },
                    };
                },
            };
        });
        items.findByPk = jest.fn(() => {
            return {
                item_id: itemId,
                name: 'Test Item',
                description: 'Test Item Description',
                quantity: 1,
                price: '5.99',
                rating: 5,
                discount_percent: null,
                image_url: null,
                date_created: '2024-10-31T23:05:20.000Z',
                last_updated: '2024-10-31T23:05:20.000Z',
                store_id: 1,
            };
        });

        const response = await updateItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(
            `Item ${itemId} doesn't exist in cart.`
        );
    });

    it('updateQuantity() it should update quantity in cart', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        hasItem: () => {
                            return true;
                        },
                        addItem: () => {
                            return itemId;
                        },
                    };
                },
            };
        });
        items.findByPk = jest.fn(() => {
            return {
                item_id: itemId,
                name: 'Test Item',
                description: 'Test Item Description',
                quantity: 1,
                price: '5.99',
                rating: 5,
                discount_percent: null,
                image_url: null,
                date_created: '2024-10-31T23:05:20.000Z',
                last_updated: '2024-10-31T23:05:20.000Z',
                store_id: 1,
            };
        });

        const response = await updateItemReq();

        expect(response.status).toBe(200);
        expect(response.body).toBe(items.findByPk().quantity);
    });
});

describe('DELETE /api/carts', () => {
    let token;
    let userId;

    beforeEach(() => {
        userId = 1;
        token = generateToken({ userId: userId });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const deleteItemReq = async () => {
        return await request(app)
            .delete('/api/carts/1')
            .set('Authorization', `Bearer ${token}`);
    };

    it('deleteItem() it should fail finding the user', async () => {
        users.findByPk = jest.fn(() => null);

        const response = await deleteItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(`User ${userId} doesn't exist.`);
    });

    it('deleteItem() it should fail finding a cart', async () => {
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return null;
                },
            };
        });

        const response = await deleteItemReq();

        expect(response.status).toBe(400);
        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe(
            `User ${userId} doesn't have a cart.`
        );
    });

    it('deleteItem() it should remove the item from cart', async () => {
        const itemId = 1;
        users.findByPk = jest.fn(() => {
            return {
                user_id: userId,
                username: 'TestUser',
                full_name: 'Test Name',
                email: 'test@email.com',
                password:
                    '$2b$10$H.iF.YiIZFBZkrNs9h77auF8Vi0sCWC3qlH99Lv0sV/L4PGhYXiDu',
                date_created: '2024-10-31T15:04:46.000Z',
                last_updated: '2024-10-31T15:04:46.000Z',
                getCart: () => {
                    return {
                        cart_id: 1,
                        date_created: '2024-11-01T06:50:49.000Z',
                        last_updated: '2024-11-01T06:50:49.000Z',
                        user_id: userId,
                        removeItem: () => {
                            return itemId;
                        },
                    };
                },
            };
        });

        const response = await deleteItemReq();

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
    });
});
