/*
 * A lazy loader
 * This will get all of our files here together and export all of the methods as one object
 */
var exports = module.exports = {};

var fs = require('fs');
var path = require('path');
var items = fs.readdirSync(__dirname);

var thisname = path.basename(__filename);
items.forEach(function(item){
	
	if(item != thisname){
		var arg = require( __dirname + path.sep + item );
		Object.keys(arg).forEach(function(key){
			if(arg.hasOwnProperty(key)){
				exports[key] = arg[key];	
			}
		});
	}
});