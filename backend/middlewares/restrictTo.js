/* ── restrictTo ──────────────────────────────────────────────
   Role-based access control. Must come after protect.
   Usage: router.delete('/item/:id', protect, restrictTo('owner', 'admin'), deleteItem)
──────────────────────────────────────────────────────────── */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        message: `Access denied. This action requires one of: ${roles.join(', ')}.`,
      });
    }
    next();
  };
};

export default restrictTo;
