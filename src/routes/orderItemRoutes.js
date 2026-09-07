import express from 'express';
import { createOrder, getAllOrders, getOrderById, updateOrder, updateOrderStatus, deleteOrder } from '../controller/orderItemController.js';

const router = express.Router();

//create a new order
router.post('/createOrder', createOrder);
//get all orders
router.get('/getAllOrders', getAllOrders);
//get a single order
router.get('/:id', getOrderById);
//update an order
router.put('/:id', updateOrder);
//update order status
router.patch('/:id/status', updateOrderStatus);
//delete an order
router.delete('/:id', deleteOrder);

export default router;