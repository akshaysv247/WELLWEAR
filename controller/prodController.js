const Product = require("../model/productSchema");
const path = require("path");
const mongoose=require('mongoose')
const { findOne } = require("../model/UserSchema");
const Category = require("../model/categorySchema");
// const multer=require('multer')

module.exports = {
  addProducts: (req, res) => {
    Product.create(req.body)
      .then((result) => {
        res.redirect("/admin/product-list");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getAllProducts: async (req, res) => {
    const productDetails = await Product.find().sort({ _id: -1 }).populate('category');
    res.render("admin/product-list", { productDetails });
  },
  deleteProduct: async (req, res) => {
    id = req.params.id;
    await Product.deleteOne({ _id: id });
    res.redirect("/admin/product-list");
  },
  getProductDetail: async (req, res) => {
    id = req.params.id;
    let Products = await Product.findOne({ _id: id });
    const Categories=await Category.find({})
    res.render("admin/product-edit", { Products ,Categories});
  },
  editProduct: async (req, res) => {
    id = req.query.id;
    data = req.body;
    console.log(data)
    await Product.updateOne(
      { _id: id },
      {
        $set: {
          title: data.title,
          category: data.category,
          price: data.price,
          quantity: data.quantity,
          image: data.image,
          size: data.size,
          color: data.color,
          description: data.description,
          moreDetails: data.moreDetails,
          thumbnail: data.thumbnail,
          group_tag: data.group_tag,
        },
      }
    );
    res.redirect("/admin/product-list");
  },
  productDetails: async (req, res) => {
    id = req.params.id;
    const products = await Product.findOne({ _id: id });
    res.render("admin/product-details", { products });
  },
  addCategory: async (req, res) => {
    console.log(req.body);
    let catMessage;
    if (!req.body.catName || !req.body.thumbnail) {
      catMessage = "Please fill all the fields";
      res.locals.catMessage = catMessage;
      return res.render("admin/main-category");
    }
    Category.create(req.body)
      .then((result) => {
        console.log('kjvdfngfojgnjfgn;kjg;kdafgjk;dg;kabgkfbg')
        res.redirect("/admin/list-category");
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getAllCategory: async (req, res) => {
    let categoryDetails = await Category.find().sort({ _id: -1 });
    res.render("admin/category-list", { categoryDetails });
  },
  getCategoryDetails: async (req, res) => {
    id = req.params.id;
    console.log("kdlsn",id)
    let Categories = await Category.findOne({ _id: id });
    console.log(Categories)
    res.render('admin/edit-category', { Categories });
  },
  deleteCategory: async (req, res) => {
    id = req.params.id;
    await Category.deleteOne({ _id: id });
    res.redirect("/admin/list-category");
  },
  editCategory: async (req, res) => {
    id = req.params.id;
    cat = req.body;
    console.log("fkjfjn gkda gk ",cat,id)
    await Category.updateOne(
      { _id: id },
      {
        $set: {
          catName: cat.catName,
          thumbnail: cat.thumbnail,
        },
      }
    );
    res.redirect("/admin/list-category");
  },
};
