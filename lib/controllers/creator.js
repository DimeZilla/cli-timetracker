'use strict';

const model = require('../models/include.js');

let Creator = {
	'create': function(){
		let valid = this.validate(),
        res;
    if(!valid) return false;
    
    if(this.type == "task"){
      res = model.addTask( {
      	name: this.name, 
      	description: this.description, 
      	billable: this.billable 
      });
    }else if(this.type == "project"){
    	res = model.addProject({
    		name: this.name, 
    		description: this.description 
    	});
    }

    if(res){
		  console.log(this.type + " with name " + this.name + ' was created');	
      return true;
    }else{
      console.log("something went wrong. nothing created");
      return false;
    }
        
	},
	'validate': function(){
		let validated = true;
		if( !this.type || this.type == '' ){
			validated = false;
			console.error( new Error( 'What are we creating? A Project? A Task?' ) );
		}else if ( !this.name || this.name == '' ){
			validated = false;
			console.error( new Error( this.type.toUpperCase() + ' name empty') );
		}
    return validated;
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

module.exports._ = function(arg){
	Creator.arg = arg;
	return Creator.init();
};