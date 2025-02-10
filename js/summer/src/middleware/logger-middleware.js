/**
 * Middlweware para logar requisições HTTP.
 * Executado a quando recepciona cada requisição. Antes dos demais middlewares.
 * @param {import('express').Request} req - Objeto de solicitação HTTP.
 * @param {import('express').Response} res - Objeto de resposta HTTP.
 * @param {import('express').NextFunction} next - Função para chamar o próximo middleware.
 */
export default function httpReqLogger(req, res, next) {
  req.time = new Date().toLocaleString();

  console.log(req.time, req.method, req.hostname, req.user, req.originalUrl);

  next();
}
