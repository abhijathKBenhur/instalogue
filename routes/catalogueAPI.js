const CatalogueSchema = require("../db-config/Catalogue.schema");
const express = require("express");
const router = express.Router();

getStores = async (req, res) => {
  let selectedCategory = req.body.selectedCategory;
  let searchString = req.body.searchString;
  let searchOrArray = [];
  let payLoad = {
  };

  if (selectedCategory) {
    searchOrArray.push({ category: { $regex: new RegExp(selectedCategory, "i") } });
  }
  if (searchString) {
    searchOrArray.push({ title: { $regex: new RegExp(searchString, "i") } });

  }
  if (searchOrArray.length > 0) {
    payLoad.$or = searchOrArray;
  }

  CatalogueSchema.find(payLoad)
    .limit(100)
    .sort({ createdAt: "desc" })
    .then((signatures) => {
      return res.status(200).json({ success: true, data: signatures });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ success: false, error: err });
    });
};

router.post("/getStores", getStores);

module.exports = router;
