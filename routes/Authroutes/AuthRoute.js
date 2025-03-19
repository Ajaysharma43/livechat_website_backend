import express from 'express'
import { AddUser, CheckUser, VerifyUsername } from '../../controllers/AuthRouteControllers/AuthRouteControllers.js';
import { GenerateToken, VerifyUser } from '../../controllers/LoginController/LoginController.js';

const route = express.Router()

route.post('/Signup' , CheckUser , VerifyUsername , AddUser)
route.post('/login' , VerifyUser , GenerateToken)

export default route;