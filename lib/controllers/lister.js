#!/ust/bin/env node
'use strict';

var arg = require('../assets/_args.js');
var model = require('../models/model.js');

var exports = module.exports = {};

var columnify = require('columnify');
var readline = require('readline');

var Lister = {
	'missingArg': function(){
		var self = this;
		var r1 = readline.createInterface({
        	input: process.stdin,
        	output: process.stdout
	    });
	    
	    r1.question("Do you want to list all projects and all tasks? [Y|n]: ", (answer) => {
	        if(answer.toUpperCase() == "Y" ){
	            console.log("Projects: ");
	            self.list = app.model.listData('p');
	            self.print();
	            console.log("");
	            console.log("Tasks: ");
	            self.list = app.model.listData('t');
	            self.print();
	        }
	        r1.close();
	    });
	},
	'getList': function(){
		this.type = this.type.toLowerCase();
		var typeKey = {
			'task' : 't',
			'tasks' : 't',
			'project' : 'p',
			'projects' : 'p'
		};
		this.list = model.listData(typeKey[this.type], this.name);
	},
	'print': function(){
		if(typeof this.list === 'string'){
			console.log(this.list);
		}else{
			console.log(columnify(this.list));
		}
	},
	'list': function(){
		// if we are missing the third argument - lets ask if they want to print all
		if(!this.type || this.type == ''){
			this.missingArg();
		}
		var option = arg.getPos(2);
		if( typeof option !== 'undefined' && option.toLowerCase() == "for"){
			var project = arg.getPos(3) || arg.getArg('project');
			if(typeof project !== 'undefined'){
				if(project.toLowerCase() == "project"){
					project = arg.getPos(4);
				}
			}
			if(typeof project !== 'undefined'){
				this.name = model.getUID(project);
			}
		}
		this.getList();
		this.print();
	},
	'init': function(){
		
		this.type = arg.getPos(1);
		this.name = null;

		return this;
	}
};

exports._ = Lister.init();