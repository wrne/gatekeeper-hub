import { getRolebyUser } from "../../utils/auth-utils.js";

export default function autorizateMiddleware(allowedRoles) {
  return async (req, res, next) => {
	try {
		const userRole = await getRolebyUser(req.user)
		if (!allowedRoles.includes(userRole)) {
	
			throw new Error('Route not allowed to this user');
		}
		next();
		
	} catch (error) {
		return res.error(401, error, 'Not autorized');
		
	}
  };
}
