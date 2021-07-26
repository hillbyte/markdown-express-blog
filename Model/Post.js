//?write db schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const marked = require("marked");
const createdDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createdDomPurify(new JSDOM().window);
//title should match with clientside name attribute title
const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    photo: {
      type: [""],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    markdown: {
      type: String,
      required: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "my-blog" }
);
PostSchema.pre("validate", function (next) {
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

module.exports = mongoose.model("posts", PostSchema); //here model name is  posts
