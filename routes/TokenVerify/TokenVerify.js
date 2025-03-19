import express from 'express'
import { TokenVerifyMiddleware } from '../../Middleware/TokenAuth.js';
import { VerifyRefreshToken } from '../../controllers/ProtectedRouteController/ProtectedRouteController.js';
import { GenerateNewToken } from '../../controllers/ProtectedRouteController/GenerateNewToken.js';

const route = express.Router();

route.post('/Verify' ,TokenVerifyMiddleware , VerifyRefreshToken)
route.post('/GenerateNewToken' , GenerateNewToken)

export default route