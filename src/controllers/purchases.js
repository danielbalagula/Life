import express                    from 'express';
import to                         from 'await-to-js';
import shortid                    from 'shortid';
import debug                      from 'debug';

import Purchase                   from '../models/purchase/Purchase';
import User                       from '../models/users/User';
import { isAuthenticated }        from '../config/passport';
import postPurchasesValidator     from '../middleware/purchase.post.validation';
import getPurchasesValidator      from '../middleware/purchase.get.validation';

let purchasesRouter = express.Router();

let purchasesLogger = debug('purchases_');

purchasesRouter.get('/', isAuthenticated, getPurchasesValidator, async (req, res, next) => {
    let {startDate, endDate, ...params} = req.query;
    let query = {
        ...params,
        ...{
            datePurchased: {
                $gte: (startDate || 0),
                $lt: (endDate || new Date().getTime() / (1000 * 3600))
            }
        },
        ...{
            '_id': { $in: req.user.purchases }
        }
    };
    let [findErr, result] = await to(Purchase.find(query));
    
    if (findErr) {
        res.status(500);
        next('Internal server error retrieving purchase(s)');
    }
    purchasesLogger(`[${req.id}] ${req.user.email} retrieved ${result.length} products`);
    res.status(200).send(result);
});

purchasesRouter.post('/', isAuthenticated, postPurchasesValidator, async(req, res, next) => {
    let newPurchaseId = shortid.generate();
    let newPurchase = new Purchase({
        ...req.body,
        ...{
            _id: newPurchaseId
        }
    });
    
    Promise.all([newPurchase.save(), User.findOneAndUpdate({_id: req.user.id}, {
        $addToSet: {
            purchases: newPurchaseId
        }
    })]).then(([savedPurchase, updatedUser]) => {
        purchasesLogger(`[${req.id}] ${updatedUser.email} added product with id ${savedPurchase._id}`)
        res.status(201).send(`Added product for ${req.user.email}`);
    }).catch((err) => {
        next(err)
        Purchase.deleteOne({_id: newPurchaseId});
    })
});

module.exports = purchasesRouter;
