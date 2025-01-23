export default function httpReqLogger(req, res, next) {
  req.time = new Date().toLocaleString();

  console.log(req.time, req.method, req.hostname, req.user, req.originalUrl);

  next();
}
