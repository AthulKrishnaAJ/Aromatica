const Category = require("../models/categoryModel")


const getCategory = async(req,res,error) => {
    try{
        const catergories = await Category.find({})
        res.render("adminView/category",{category : catergories});      

    }catch(error){
        console.log("Category Page rendering error",error.message);
        res.status(500).send("Internal server error")
    }
}




const addCategory = async(req,res) => {
    try{
        const {name,description} = req.body
        const existCategory = await Category.findOne({name});
        if(description){
            if(!existCategory){
                const newCategory = new Category({
                    name : name,
                    description : description
                })
                await newCategory.save()
                console.log(`New category saved : ${newCategory}`);
                res.redirect("/admin/allCategory")
            }
            else{
                console.log("Category already exist");
                res.redirect("/admin/category")
            }
        }
        else{
            console.log("Description is required");
        }
    }catch(error){  
        console.log(`Add category error ${error.message}`);
        res.status(500).send("Internal server error")

    }
}


const getAllCategory = async(req,res) =>{
    try{
        const categoryData = await Category.find({})
        if(categoryData){
            res.render("adminView/category",{category : categoryData});
            console.log("Redirect in category page... after add new category");
        }
        else{
            console.log("Error redirect in category page... after add new category");
        }
    }catch(error){
        console.log("Error redirection in category page... after add new category",error.message);
        res.status(500).send("Internal error occured");
    }
}




const listCategory = async(req,res) => {
    try{
        const id = req.query.id
        await Category.findByIdAndUpdate(id,{isListed : true})
        res.redirect("/admin/category");
        console.log("Category listed")
    }catch(error){
        console.log(`Category listed error ${error.message}`);
        
    }
}


const unListCategory = async(req,res) => {
    try{
        const id = req.query.id
        await Category.findByIdAndUpdate(id,{isListed : false})
        res.redirect("/admin/category")
        console.log("Category unlisted");
    }catch(error){
        console.log(`Category unlisted error ${error.message}`);
    }
}




const getEditCategory = async(req,res) => {
    try{
        const id = req.query.id
        const category = await Category.findOne({_id : id})
        res.render("adminView/editCategory",{category : category})
        console.log(category)
        console.log("1");
    }catch(error){
        console.log("Get error in edit category page",error.message);
    }
}



const updateCategory = async(req,res) => {
    try{
        const id = req.params.id
        const {name,description} = req.body
        const findCategory = await Category.find({_id : id})
        if(findCategory){
            await Category.updateOne(
                {_id : id},
                {
                    name : name,
                    description : description
                }
            )
            res.redirect("/admin/category");
            console.log("Category updated");
        }
        else{
            console.log("Cannot find category for updating");
        }


    }catch(error){
        console.log(`Error occured in update category ${error.message} `);
    }
}


module.exports = {
    getCategory,
    addCategory,  
    getAllCategory,
    listCategory,
    unListCategory,
    getEditCategory,
    updateCategory

}



