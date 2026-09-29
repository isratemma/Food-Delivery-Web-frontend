import express from 'express';
import {
  getItemById,
  updateItem,
  deleteItem,
  toggleItemAvailability,
} from '../controllers/item.controller.js';
import protect from '../middlewares/protect.js';
import restrictTo from '../middlewares/restrictTo.js';
import { uploadItemImage } from '../middlewares/upload.js';

const router = express.Router();

// ── Public ──
router.get('/:id', getItemById);

// ── Owner protected ──
router.put('/:id',          protect, restrictTo('owner'), uploadItemImage, updateItem);
router.delete('/:id',       protect, restrictTo('owner'), deleteItem);
router.patch('/:id/toggle', protect, restrictTo('owner'), toggleItemAvailability);

export default router;
