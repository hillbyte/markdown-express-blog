const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const { storage } = require("../Config/multer");
const upload = multer({
  storage,
});

//*importing post schema
require("../Model/Post");
let POST = mongoose.model("posts");
//===Geting all Routes=====
router.get("/create-post", (req, res) => {
  res.render("post/createPost");
});
router.get("/edit-post", (req, res) => {
  res.render("post/editPost");
});
router.get("/fetch-post", (req, res) => {
  // res.render("post/fetchPost");
  POST.find({})
    .sort({ createdAt: "desc" })
    .lean() //lean retturn  plain js obj
    .then((posts) => {
      // console.log(posts);
      res.render("post/fetchPost", { posts });
    })
    .catch((err) => console.log(err));
});
//=shwo single post
router.get("/show/:id", (req, res) => {
  POST.findOne({ _id: req.params.id })
    .lean()
    .then((singlePost) => {
      res.render("post/show", { singlePost });
    })
    .catch((err) => console.log(err));
});
//=fetch single route
router.get("/edit-post/:id", (req, res) => {
  //fetch db then find obj_id
  POST.findOne({ _id: req.params.id })
    .lean()
    .then((editPost) => {
      res.render("post/editPost", { editPost });
    })
    .catch((err) => console.log(err));
});

//====post methods
router.post("/create-post", upload.single("photo"), (req, res) => {
  // console.log(req.body); //undifined, res should be parsed, need url encodded
  let { title, description, markdown } = req.body;
  //?validation form data in serverside
  let error = [];
  if (!title) {
    error.push({ text: "title filed is required" });
  }
  if (!description) {
    error.push({ text: "description filed is required,let's try again!" });
  }
  if (error.length > 0) {
    res.render("post/createPost", { errors: error }); //ending req,res cycle
    console.log(error);
  } else {
    let newPost = { title, photo: req.file, description, markdown };
    //save into database
    new POST(newPost)
      .save()
      .then((post) => {
        res.redirect("/posts/fetch-post", 301, () => {});
      })
      .catch((err) => console.log(err));
    // res.send("Succesfully post created");
  }
});
//==put route
router.put("/edit-post/:id", (req, res) => {
  POST.findOne({ _id: req.params.id })
    .then((updatePost) => {
      updatePost.title = req.body.title;
      updatePost.description = req.body.description;
      updatePost.markdown = req.body.markdown;

      //save data into db
      updatePost
        .save()
        .then((_) => {
          res.redirect("/posts/fetch-post", 301, () => {});
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
//=delete route
router.delete("/delete-post/:id", (req, res) => {
  POST.remove({ _id: req.params.id })
    .then((_) => {
      res.redirect("/posts/fetch-post", 301, () => {});
    })
    .catch();
});
module.exports = router;
//orm- object relational mapping -sql
//odm -obj document mapping -nosql
