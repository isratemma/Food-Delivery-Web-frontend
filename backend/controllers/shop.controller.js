import Shop from '../models/shop.model.js';

/* ── Create Shop ─────────────────────────────────────────────
   POST /api/shops
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const createShop = async (req, res) => {
  try {
    const existing = await Shop.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You already have a shop.' });
    }

    const shop = await Shop.create({ ...req.body, owner: req.user._id });
    return res.status(201).json(shop);
  } catch (error) {
    console.error('createShop error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Get all shops (public) ──────────────────────────────────
   GET /api/shops
   Query: ?city=Dhaka&category=restaurant&search=burger&page=1&limit=10
──────────────────────────────────────────────────────────── */
export const getAllShops = async (req, res) => {
  try {
    const { city, category, search, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };
    if (city)     filter['address.city'] = { $regex: city, $options: 'i' };
    if (category) filter.category = category;
    if (search)   filter.name = { $regex: search, $options: 'i' };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Shop.countDocuments(filter);
    const shops = await Shop.find(filter)
      .populate('owner', 'fullName email')
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return res.status(200).json({
      shops,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('getAllShops error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Get single shop (public) ────────────────────────────────
   GET /api/shops/:id
──────────────────────────────────────────────────────────── */
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'fullName email');
    if (!shop) return res.status(404).json({ message: 'Shop not found.' });
    return res.status(200).json(shop);
  } catch (error) {
    console.error('getShopById error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Get owner's own shop ────────────────────────────────────
   GET /api/shops/my
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(404).json({ message: 'You do not have a shop yet.' });
    return res.status(200).json(shop);
  } catch (error) {
    console.error('getMyShop error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Update shop ─────────────────────────────────────────────
   PUT /api/shops/:id
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!shop) return res.status(404).json({ message: 'Shop not found or not yours.' });

    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json(updated);
  } catch (error) {
    console.error('updateShop error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Delete shop ─────────────────────────────────────────────
   DELETE /api/shops/:id
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!shop) return res.status(404).json({ message: 'Shop not found or not yours.' });

    await shop.deleteOne();
    return res.status(200).json({ message: 'Shop deleted.' });
  } catch (error) {
    console.error('deleteShop error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/* ── Toggle shop open/closed ─────────────────────────────────
   PATCH /api/shops/:id/toggle
   Protected — owner only
──────────────────────────────────────────────────────────── */
export const toggleShopStatus = async (req, res) => {
  try {
    const shop = await Shop.findOne({ _id: req.params.id, owner: req.user._id });
    if (!shop) return res.status(404).json({ message: 'Shop not found or not yours.' });

    shop.isOpen = !shop.isOpen;
    await shop.save();
    return res.status(200).json({ isOpen: shop.isOpen, message: `Shop is now ${shop.isOpen ? 'open' : 'closed'}.` });
  } catch (error) {
    console.error('toggleShopStatus error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};
