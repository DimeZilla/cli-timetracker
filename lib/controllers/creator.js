#!/usr/bin/env node
'use strict';
var exports = module.exports = {};

var model = require('../models/model.js');
var Creator = {
	'create': function(){
		this.validate();
		if(this.type == "task"){
			model.addTask( this.name, this.description, this.billable );
			console.log(this.name + ' task created');
			return;
		}
        
        if(this.type == "project"){
        	if(exports.debug){
        		console.log('name: ' + this.name, 'description: ' + this.description);
        	}
        	model.addProject( this.name, this.description );
        	console.log(this.name + ' project created');
        	return;
        }

        console.log("something went wrong. nothing created");
        
	},
	'validate': function(){
		var exit = false;
		if( !this.type || this.type == '' ){
			exit = true;
			console.error( new Error( 'What are we creating? A Project? A Task?' ) );
		}else if ( !this.name || this.name == '' ){
			exit = true;
			console.error( new Error( this.type.toUpperCase() + ' name empty') );
		}
        
        if(exit){
        	process.exit(1);
        }
	},
	'init': function(){
		
		if(!this.arg.hasArg('name') ){
			this.name = this.arg.getPos(2);	
		}else{
			this.name = this.arg.getArg('name')
		}
		
		if(this.arg.hasArg('billable')){
			var bill = String(arg.getArg('billable')).toLowerCase();
			this.billable = (bill == 'true');
		}else{
			this.billable = false;
		}

		this.type = this.arg.getPos(1);

		this.description = '';
		if( this.arg.hasArg('description') ){
			this.description = this.arg.getArg('description');
		}
		
		this.create();
	}
};

exports._ = function(arg){
	Creator.arg = arg;
	Creator.init();
};