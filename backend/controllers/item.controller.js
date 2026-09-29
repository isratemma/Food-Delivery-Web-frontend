import Item from '../models/item.model.js';
import Shop from '../models/shop.model.js';

// Helper — verify shop belongs to logged-in owner
const verifyOwnership = async (shopId, userId) => {
  const shop = await Shop.findOne({ _id: shopId, owner: userId });
  return shop;
};

/* ── Add item to shop ────────────────────────────────────────
   POST /api/shops/:shopId/items
   Protected — owner only
   Accepts multipart/form-data with optional image field
──────────────────────────────────────────────────────────── */
export const createItem = async (req, res) => {
  try {
    const shop = await verifyOwnership(req.params.shopId, req.user._id);
    if (!shop) return res.status(403).json({ message: 'Shop not found or not yours.' });

    const image = req.file?.path || req.body.image || '';
    const item = await Item.create({ ...req.body, image, shop: req.params.shopId });
    return res.status(201).json(item);
  } catch (error) {
    console.error('createItem error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Get all items for a shop (public) ───────────────────────
   GET /api/shops/:shopId/items
   Query: ?category=Main&search=burger&available=true
──────────────────────────────────────────────────────────── */
export const getShopItems = async (req, res) => {
  try {
    const { category, search, available } = req.query;

    const filter = { shop: req.params.shopId };
    if (category)  filter.category   = { $regex: category, $options: 'i' };
    if (search)    filter.name        = { $regex: search,   $options: 'i' };
    if (available) filter.isAvailable = available === 'true';

    const items = await Item.find(filter).sort({ category: 1, name: 1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error('getShopItems error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Get single item (public) ────────────────────────────────
   GET /api/items/:id
──────────────────────────────────────────────────────────── */
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('shop', 'name category');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    return res.status(200).json(item);
  } catch (error) {
    console.error('getItemById error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Update item ─────────────────────────────────────────────
   PUT /api/items/:id
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('shop');
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (String(item.shop.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorised.' });
    }

    if (req.file?.path) req.body.image = req.file.path;

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    console.error('updateItem error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Delete item ─────────────────────────────────────────────
   DELETE /api/items/:id
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('shop');
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (String(item.shop.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorised.' });
    }

    await item.deleteOne();
    return res.status(200).json({ message: 'Item deleted.' });
  } catch (error) {
    console.error('deleteItem error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Toggle item availability ────────────────────────────────
   PATCH /api/items/:id/toggle
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const toggleItemAvailability = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('shop');
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    if (String(item.shop.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorised.' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();
    return res.status(200).json({
      isAvailable: item.isAvailable,
      message: `Item is now ${item.isAvailable ? 'available' : 'unavailable'}.`,
    });
  } catch (error) {
    console.error('toggleItemAvailability error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
