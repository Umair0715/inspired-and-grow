const { createInventory, getAllInventories, updateInventory, getSingleInventory, deleteInventory, removeInventoryImage } = require('../controllers/inventoryController');
const { protect } = require('../middlewares/protect');
const Admin = require('../models/adminModel');
const router = require('express').Router();

router.route('/')
    .post(protect(Admin) , createInventory)
    .get(getAllInventories);

router.route('/:id')
    .put(protect(Admin) , updateInventory)
    .get(getSingleInventory)
    .delete(protect(Admin) , deleteInventory)

router.post('/remove-image/:id' , protect(Admin) , removeInventoryImage)

module.exports = router;