import express from 'express';
import {
  createShop,
  getAllShops,
  getShopById,
  getMyShop,
  updateShop,
  deleteShop,
  toggleShopStatus,
} from '../controllers/shop.controller.js';
import {
  createItem,
  getShopItems,
} from '../controllers/item.controller.js';
import protect from '../middlewares/protect.js';
import restrictTo from '../middlewares/restrictTo.js';

const router = express.Router();

// ── Public ──
router.get('/',           getAllShops);
router.get('/my',         protect, restrictTo('owner'), getMyShop);
router.get('/:id',        getShopById);
router.get('/:shopId/items', getShopItems);

// ── Owner protected ──
router.post('/',              protect, restrictTo('owner'), createShop);
router.put('/:id',            protect, restrictTo('owner'), updateShop);
router.delete('/:id',         protect, restrictTo('owner'), deleteShop);
router.patch('/:id/toggle',   protect, restrictTo('owner'), toggleShopStatus);
router.post('/:shopId/items', protect, restrictTo('owner'), createItem);

export default router;
