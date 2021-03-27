const slugify = require('slugify');
const Category = require('../models/category');
const Product = require('../models/product')

//find category all subs and its childs 
function createCategories(categories,parentId =null){
 
    const categoryList=[]
     
    let category;
    if(parentId ==null){
        category= categories.filter(cat =>cat.parentId==undefined)
    }else{
        category =categories.filter(cat =>cat.parentId==parentId)
    }

    for(let cate of category){
        categoryList.push({
            _id:cate._id,
            name:cate.name,
            slug:cate.slug,
            children:createCategories(categories, cate._id)
        })
    }

    return categoryList
};

// find category's all childreen ides
let allId = []
function createSingleCategories(categories,parentId){
 
    const categoryList=[]

    let category;
     category =categories.filter(cat =>cat.parentId==parentId)
     
    allId.push(parentId)
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            children: createSingleCategories(categories, cate._id)   
        });  
    }
   return allId
};


//create new category
//method post
//route /api/category/create

exports.addCategory = (req,res) => {

    const categoryObj = {
        name: req.body.name,
        slug:slugify(req.body.name)
    }
    
    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId;
    }
    
    const cat = new Category(categoryObj);
    
    cat.save((error,category)=>{
    
    if(error) return res.status(400).json({error});
    if(category){
        return res.status(201).json({category})
    }
    
    })
    
};

//get all categories
//method get
// route /api/category/getcategory

exports.getCategories = (req,res) =>{
 
    Category.find({})
    .exec((error,categories) =>{
        if(error) return res.status(400).json({error});

        if(categories){

            const categoryList = createCategories(categories)
            return res.status(200).json({categoryList})
        }
    })
};


//get single category
//method get
//route /api/category/getcategory/:id

//when we get single category also we get products

exports.getSingleCategory = (req,res) =>{
 const id = req.params.id

 Category.findById(id)
 .exec((error,category) =>{
    if(error) return res.status(400).json({error});

    if(category){
           
        Category.find({})
        .exec((error,categories) =>{
            if(error) return res.status(400).json({error});
    
            if(categories){
              
                const allId = createSingleCategories(categories,id)
                
                Product.find({category:{$in:allId}})
                .exec((error,products) =>{
                    if(error) return res.status(400).json({error});
            
                   if(products){
                       return res.status(200).json(products)
                   }
                    
                })

  

            }
        })
    }
 })
}


// delete category
//method DELETE
//route /api/category/getcategory/:id

exports.deleteCategory =async (req,res,next) =>{

    try {
        
        //find single category
        const category = await Category.findById(req.params.id)
        const existId = req.params.id

        if(!category){
            return res.status(400).json({succes:false}) 
        };
        
        //find all categories
        const allCategories = await Category.find();
        const allId = createSingleCategories(allCategories,existId)
        //find categories and delete
        const removeCategories = await Category.deleteMany({_id:{$in:allId}})
       
       //find products and delete
       const products =await  Product.deleteMany({category:{$in:allId}})
       
        res.status(200).json({success:true})
    } catch (error) {
        res.status(400).json({succes:false})
    }
}

// update category
//method PUT
//route /api/category/getcategory/:id

exports.updateCategory= async (req,res,next) =>{

    try {
      const category = await Category.findByIdAndUpdate(req.params.id, req.body,{
          new:true,
          runValidators:true
      });
      
      category.slug = slugify(req.body.name);
      
      if(!category){
          return res.status(400).json({succes:false}) 
      }
      
      res.status(200).json({succes:true, data:category})
    } catch (error) {
      res.status(400).json({succes:false})  
    }
  }