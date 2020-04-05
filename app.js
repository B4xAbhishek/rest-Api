const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb",{useNewUrlParser:true});
/////////////requests taregtertting//////

const articleSchema = {
  title:String,
  content:String
};

const Article = mongoose.model("Article",articleSchema);
//TODO
app.route("/articles")

.get(function(req,res){
  Article.find(function(err,foundArticles){
        res.send(foundArticles);
  });
})

.post(function(req,res){
const newArticle = new Article({
  title: req.body.title,
  content:req.body.content
});

newArticle.save(function(err){
  if (!err){
    res.send("Success")
  }
  else{
  res.send(err);
}
});
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Success");
    }
      else{
        res.send(err);
      }
  })
});

///////////////request taregtertting for specific ////////
app.route("/articles/:articleTitle")

.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, article){
    if (article){
      const jsonArticle = JSON.stringify(article);
      res.send(jsonArticle);
    } else {
      res.send("No article with that title found.");
    }
  });
})

.patch(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    function(err){
      if (!err){
        res.send("Successfully updated selected article.");
      } else {
        res.send(err);
      }
    });
})

.put(function(req, res){

  const articleTitle = req.params.articleTitle;

  Article.update(
    {title: articleTitle},
    {content: req.body.newContent},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        res.send(err);
      }
    });
})


.delete(function(req, res){
  const articleTitle = req.params.articleTitle;
  LostPet.findOneAndDelete({title: articleTitle}, function(err){
    if (!err){
      res.send("Successfully deleted selected article.");
    } else {
      res.send(err);
    }
  });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
