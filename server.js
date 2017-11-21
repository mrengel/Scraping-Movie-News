var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

//Require Models
var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

//setting up handlebars
//app.engine("handlebars", exphbs({defaultLayout: "main"}));
//app.set("view engine", "handlebars");

//Use body-parser for form submissions
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: "application/vnd.api+json"}));
//use express.static to serve public folder as a static directory
app.use(express.static("public"));

//Setting up mongoose
//Connecting to Mongo DB
//mongoose.Promise = Promise;
//mongoose.connect("mongodb://localhost/movienewsdb", {
	//useMongoClient: true
//});

//Routes

//A GET route for scraping collider.com
app.get("/scrape", function(req, res){
	axios.get("http://collider.com/all-news/").then(function(response){
		var $ = cheerio.load(response.data);
			
		$("article h2").each(function(i, element){
			var result = {};

			result.title = $(this)
				.children("a")
				.text();
			result.link = $(this)
				.children("a")
				.attr("href");
			/*result.feed-excerpt-p
				.children("class")
				.text();*/
			db.Article
				.create(result)
				.then(function(dbArticle){
					res.send()
				})
				.catch(function(err){
					res.json(err);
				});
			});
		});
		
});

//Route for getting all Articles from the db
app.get("/articles", function(req, res){
	db.Article
	.find({})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

//Route for grabbing a specific Article by id, with its note
app.get("/articles/:id", function(req, res){
	db.Article
	.findOne({_id: req.params.id})
	.populate("note")
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});

//Route for saving/updating a note
app.post("/articles/:id", function(req, res){
	db.Note
	.create(req.body)
	.then(function(dbNote){
		return db.Article.findOneAndUpdate({_id: req.params.id}, {note:dbNote._id}, {new:true});
	})
	.then(function(dbArticle){
		res.json(dbArticle);
	})
	.catch(function(err){
		res.json(err);
	});
});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});