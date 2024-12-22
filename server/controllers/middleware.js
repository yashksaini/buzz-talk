const allowedOrigins = [
  "https://buzz2talk.netlify.app", // Production URL
  "http://localhost:5173", // Comment for production
];

const validateOrigin = (req, res, next) => {
  const origin = req.headers.origin || req.headers.referer; // Check both `Origin` and `Referer` headers
  console.log(req.headers);

  if (origin && allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
    next(); // Allow the request
  } else {
    res.status(403).json({ message: "Forbidden: Unauthorized origin" });
  }
};

export default validateOrigin;
