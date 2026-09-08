import express from 'express';
import { createOrder, getOrders, getOrderById,  updateOrderStatus, deleteOrder } from '../controller/orderController.js';

const router = express.Router();

//create a new order
router.post('/createOrder', createOrder);
//get all orders
router.get('/getOrders', getOrders);
//get a single order
router.get('/:id', getOrderById);

//update order status
router.patch('/:id/status', updateOrderStatus);
//delete an order
router.delete('/:id', deleteOrder);

export default router;