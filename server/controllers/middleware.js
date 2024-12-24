const allowedOrigins = [
  "https://buzz2talk.netlify.app", // Production URL
  "http://localhost:5173", // Comment for production
];

export const ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.userData) {
    // Session exists, user is authenticated
    return next();
  }
  res
    .status(401)
    .json({ message: "Unauthorized: Please log in to access this resource." });
};

export const validateOrigin = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer; // Check both `Origin` and `Referer` headers

  if (origin && allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    next(); // Allow the request
  } else {
    res.status(403).json({ message: "Forbidden: Unauthorized origin" });
  }
};
