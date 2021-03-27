const express = require('express');
const { requireSignin, adminMiddleware} = require('../common-middleware');
const router = express.Router();
const { addCategory, getCategories, getSingleCategory, deleteCategory,updateCategory } = require('../controller/category');


router.post('/category/create',requireSignin,adminMiddleware,addCategory);

router.get('/category/getcategory',getCategories);

router.get('/category/getcategory/:id',getSingleCategory);

router.delete('/category/getcategory/:id',requireSignin,adminMiddleware,deleteCategory)

router.put('/category/getcategory/:id',requireSignin,adminMiddleware,updateCategory)
module.exports= router