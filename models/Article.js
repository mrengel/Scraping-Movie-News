var mongoose = require("mongoose");

//Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	//'note' is an object that stores a Note id
	//The ref property links the ObjectId to the Note model
	//Allows for population 
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

//Creates our model from the above schema
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;