const Product = require('../models/product');
const slugify= require('slugify');


//create new product
//method POST

exports.createProduct = (req,res) =>{
     
    const{
        name,
        price,
        quantity,
        description,
        category,
        createdBy
    } =req.body

    let productPictures = [];
    if(req.files.length>0){
        productPictures = req.files.map(file=>{
            return {img:file.filename}
        })
    }


    const product = new Product({
      name:name,
      slug:slugify(name),
      price,
      quantity,
      description,
      productPictures,
      category,
      createdBy: req.user._id
    });

    product.save(((error,product) =>{
        if(error) return res.status(400).json({error})
        if(product){
            return res.status(200).json({product})
        }
    }))
};

//get all products
//method GET
//url /api/product/getproduct
//access public


exports.getproducts = (req,res) =>{
 
    Product.find({})
    .exec((error,products) =>{
        if(error) return res.status(400).json({error});

        if(products){
            return res.status(200).json({products})
        }
    })
};

//get single product
//method GET
// url /api/product/getproduct/:id
//access public

exports.getSingleproduct = (req,res) =>{
  
    Product.findById(req.params.id)
    .exec((error,product) =>{
        if(error) return res.status(400).json({error});
        
        if(product){
            return res.status(200).json({product})
        }
    })
};