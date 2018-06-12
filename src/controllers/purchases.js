import express                    from 'express';
import to                         from 'await-to-js';
import Purchase                   from '../models/purchase/Purchase';
import User                       from '../models/users/User';
import { isAuthenticated }        from '../config/passport';
import postPurchasesValidator     from '../middleware/purchase.post.validation';
import getPurchasesValidator      from '../middleware/purchase.get.validation';

let purchasesRouter = express.Router();

purchasesRouter.get('/', isAuthenticated, getPurchasesValidator, async (req, res, next) => {
    let {start_date, end_date, ...params} = req.query;
    let query = {
        ...params,
        ...{
            date_purchased: {
                $gte  : (start_date || 0),
                $lt   : (end_date || new Date().getTime() / (1000 * 3600))
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
    res.status(200).send(result);
});

purchasesRouter.post('/', isAuthenticated, postPurchasesValidator, async(req, res, next) => {
    let newPurchase = new Purchase(req.body);
    
    let [newPurchaseErr, savedPurchase] = await to(newPurchase.save());
    if (newPurchaseErr) next(newPurchaseErr);

    let [getUserErr, user] = await to(User.findById(req.user.id));
    if (getUserErr) {
        Purchase.deleteOne({_id: savedPurchase._id});
        next(getUserErr);
    }
    
    user.purchases.unshift(savedPurchase);
    
    let addPurchaseErr = await to(user.save());
    if (addPurchaseErr) {
        Purchase.deleteOne({_id: savedPurchase._id});
        next(addPurchaseErr);
    }

    res.status(201)(`Added product for ${req.user.email}`);
});

module.exports = purchasesRouter;
