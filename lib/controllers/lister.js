'use strict';
var model = require('../models/include.js');

var exports = module.exports = {};

var columnify = require('columnify');
var _ = require('underscore-node');

var Lister = {
	'printAll': false,
	'getList': function(){
		this.type = (typeof this.type == 'string')? this.type.toLowerCase() : this.type;
		var typeKey = {
			'task' : 't',
			'tasks' : 't',
			'project' : 'p',
			'projects' : 'p'
		};
		this.list = model.listData({'type': typeKey[this.type],  'name: ': this.name});
	},
	'print': function(){

		if(_.isEmpty(this.list)){
			let message = "No data for type " + this.type;
			if(_.isEmpty(this.name)){
				message += ' with name ' + this.name;
			}
			console.log(message);
		}else{
			console.log(columnify(this.list));	
		}

	},
	'list': function(){
		
		var option = this.arg.getPos(2);
		if( typeof option !== 'undefined' && option.toLowerCase() == "for"){

			var project = this.arg.getPos(3) || this.arg.getArg('project');
			if(typeof project !== 'undefined'){
				if(project.toLowerCase() == "project"){
					project = this.arg.getPos(4);
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

		if(this.printAll){
			this.type = 'task';
			this.list();
			this.type = 'project';
			this.list();
		}else{
			this.type = this.arg.getPos(1);
			this.name = null;
			this.list();
		}
		
	}
};

exports._ = function(args, printAll){
	Lister.arg = args;
	if(typeof printAll !== 'undefined' && printAll === true){
		Lister.printAll = true;
	}
	Lister.init();
};