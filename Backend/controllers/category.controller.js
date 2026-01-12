import { response } from 'express'
import CategoryModels from '../Models/category.model.js'
import SubCategoryModel from '../Models/subcategory.model.js'
import ProductModel from '../Models/product.model.js'

export const AddCategoryController = async(request ,response)=>{
    try{

        const {name , image} = request.body
        if(!name || !image){
            return response.status(400).json({
                message : "Enter Required Fields",
                error : true,
                success : false
            })
        }
        const addCategory = new CategoryModels({
            name,
            image
        })
        const saveCategory  = await addCategory.save()
        if(!saveCategory){
            return response.status(500).json({
                message : 'Not Created',
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Added Category",
            error : false,
            success : true,
            data : saveCategory
        })

    }catch(error){
        return response.status(500).json({
            messsage : error.message || error,
            error : true,
            success : false
        })

    }
}

export const getCategoryController = async(request,response)=>{
    
    try{
        const data = await CategoryModels.find().sort({ createdAt : -1 })

        return response.json({
            data : data,
            error : false,
            success : true
        })

    }catch(error){
       return response.status(500).json({
            messsage : error.message || error,
            error : true,
            success : false
        }) 
    }
}

export const updateCategoryController = async(request , response)=>{
    try{
        const { _id , name ,image } = request.body

        const update = await CategoryModels.updateOne({
            _id : _id
        },{
            name,
            image
        })
        return response.json({
            message : "Updated Cartegory",
            error : false,
            success : true,
            data : update 
        })
    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })

    }
}
export const deleteCategoryController = async(request , response)=>{
    try{
        const { _id} = request.body
        const checkSubCategory = await SubCategoryModel.find({
            category : {
                "$in": [ _id ]
            }
        }).countDocuments()

        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkSubCategory > 0 || checkProduct > 0 ){
            return response.status(400).json({
                message : "Category is Already used can't be Delete",
                error : false,
                success : true
            })
        }

        const deleteCategory = await CategoryModels.deleteOne({ _id : _id})
        
        return response.json({
            message : "Category Deleted Successfully",
            error : false,
            success : true,
            data : deleteCategory
        })
    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })

    }
}