import express from 'express'
import { AddUser, CheckUser, VerifyUsername } from '../../controllers/AuthRouteControllers/AuthRouteControllers.js';

const route = express.Router()

route.post('/Signup' , CheckUser , VerifyUsername , AddUser)

export default route;