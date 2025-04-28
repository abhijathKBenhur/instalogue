const CatalogueSchema = require("../db-config/Catalogue.schema");
const express = require("express");
const router = express.Router();

addStore = async (req, res) => {

  const newStore = new CatalogueSchema({
    category: req.body.category,
    subCategory:  req.body.subCategory,
    thumbnailURL:  req.body.thumbnailURL,
    postURL:  req.body.postURL,
    storeName:  req.body.storeName,
    keywords: (!req?.body?.keywords || req?.body?.keywords === '') ? [] : req?.body?.keywords?.split(","),
    index: 0
  })

  if (!newStore || req.body.password != "itsmeaddy") {
    return res.status(400).json({ success: false, error: "Adding failed" });
  }

  newStore
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Store added!",
      });
    })
    .catch((error) => {
      console.log(error)
      return res.status(400).json({
        error,
        message: "New store not posted!",
      });
    });
  
}



getStores = async (req, res) => {
  let selectedCategory = req.body.selectedCategory;
  let selectedSubCategory = req.body.selectedSubCategory;
  let searchString = req.body.searchString;
  let searchOrArray = [];
  let payLoad = {};

  if (selectedCategory) {
    payLoad.category = selectedCategory;
  }
  if(selectedSubCategory) {
    payLoad.subCategory = selectedSubCategory;
  }
  if (searchString) {
    searchOrArray.push(
      { category: { $regex: new RegExp(searchString, "i") } },
      { subCategory: { $regex: new RegExp(searchString, "i") } },
      { storeName: { $regex: new RegExp(searchString, "i") } }
    );
    payLoad.$or = searchOrArray;
  }

  CatalogueSchema.find(payLoad)
    .limit(100)
    .sort({ index: "asc", createdAt: "desc" })
    .then((signatures) => {
      return res.status(200).json({ success: true, data: signatures });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ success: false, error: err });
    });
};



getCategories = async (req, res) => {
  CatalogueSchema.find({})
    .distinct("category", (err,categories) => {
      if(!err){
        return res.status(200).json({ success: true, data: categories });
      }
    })
};

getSubCategories = async (req, res) => {
  let payLoad = {}
  if(req.body.category){
    payLoad.category = req.body.category
  }
  CatalogueSchema.find(payLoad)
    .distinct("subCategory", (err,subCategories) => {
      if(!err){
        return res.status(200).json({ success: true, data: subCategories });
      }
    })
};

router.post("/getStores", getStores);
router.post("/addStore", addStore);
router.post("/getCategories", getCategories);
router.post("/getSubCategories", getSubCategories);


module.exports = router;
