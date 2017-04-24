#!/usr/bin/env node
'use strict';

var model = require('../models/model.js');


// timelog [assign | unassign] <task name> [to | from] <project name|uid>
function Assigner(args, todo){

    if(!args.hasPos(1) || ( !args.hasPos(3) && !args.hasArg('uid') ) || (args.hasPos(2) && args.getPos(2) !== "to" && args.getPos(2) !== "from")){
        console.error('Timelog takes both a task name and a project name or uid with the following syntax:');
        console.log('timelog assign <task name> to <project name|uid>');
        process.exit(1);
    }

    var proj, uid = false;
    if(args.hasArg('uid')){
    	uid  = true;
    	proj = args.getArg('uid');
    }else{
    	proj = args.getPos(3);
    }

    console.log(todo);
    if(todo == "assign"){
    	model.setProjectTask(proj, args.getPos(1), uid);
	}else if (todo == "unassign"){
		model.removeProjectTask(proj, args.getPos(1), uid);
	}else {
		console.log("Here something went wrong");
	}


}

exports._ = function(args, action){
	Assigner(args, action);
};
