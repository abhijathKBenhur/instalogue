const IdeaSchema = require("../db-config/Signature.schema");
const express = require("express");
const router = express.Router();



getSignatures = async (req, res) => {
  let limit = req.body.limit;
  let offset = req.body.offset;
  let categories = req.body.categories;
  let searchString = req.body.searchString;
  let searchOrArray = [];
  let payLoad = {
    status: "COMPLETED"
  };

  //search string block start

  if (categories) {
    let tag = categories;
    console.log(tag);
    searchOrArray.push({ category: { $regex: new RegExp(tag, "i") } });
    
  }
  if (searchString) {
    searchOrArray.push({ title: { $regex: new RegExp(searchString, "i") } });
    searchOrArray.push({ description: { $regex: new RegExp(searchString, "i") } });
  }
  if (searchOrArray.length > 0) {
    payLoad.$or = searchOrArray;
  }

  //search string block end

  
  if (!limit) {
      let tiles = await IdeaSchema.find(payLoad)
        .sort({ createdAt: "desc" })
        .populate("owner")
        .populate("creator")
        .exec();
      return res.status(200).json({ success: true, data: tiles });
  } else {
    console.log("Getting signatures for all");
    IdeaSchema.find(payLoad)
      .limit(limit)
      .sort({ createdAt: "desc" })
      .then((signatures) => {
        return res.status(200).json({ success: true, data: signatures });
      })
      .catch((err) => {
        console.log(err);
        return res.status(404).json({ success: false, error: err });
      });
  }
};


router.post("/getSignatures", getSignatures);



module.exports = router;
