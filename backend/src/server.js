const express = require('express');
const env = require('dotenv');
const mongoose = require('mongoose');

const app= express();


//routes
const userRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin/auth');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');


//environment variable or constants
env.config();

//mongodb connect
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@practicenode.en4df.mongodb.net/${process.env.MONGO_DB_DATABASE}`,
  {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
  }
).then(() =>{
  console.log('Database Connected')
});

//static files
//app.use(express.static("/uploads"))

app.use(express.json());
app.use('/api',userRoutes)
app.use('/api',adminRoutes)
app.use('/api',categoryRoutes)
app.use('/api',productRoutes)
app.use('/api',cartRoutes)


app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})