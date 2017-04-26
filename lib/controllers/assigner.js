'use strict';
var model = require('../models/include.js');


// timelog [assign | unassign] <task name> [to | from] <project name|uid>
function Assigner(args, todo){

    if(!args.hasPos(1) || ( !args.hasPos(3) && !args.hasArg('uid') ) || (args.hasPos(2) && args.getPos(2) !== "to" && args.getPos(2) !== "from")){
        console.error('Timelog takes both a task name and a project name or uid with the following syntax:');
        console.log('timelog assign <task name> to <project name|uid>');
        return false;
    }

    let proj, uid = false;
    if(args.hasArg('uid')){
    	uid  = true;
    	proj = args.getArg('uid');
    }else{
    	proj = args.getPos(3);
    }

    let nargs = {'proj': proj, 'tas': args.getPos(1), 'uid': uid}, ret = false;
    if(todo == "assign"){
    	ret = model.setProjectTask(nargs);
	}else if (todo == "unassign"){
		ret = model.removeProjectTask(nargs);
	}

    if(!ret){
        console.error("Here something went wrong");
        return false;
    }else{
        console.log("Success");
        return true;
    }

}

exports._ = function(args, action){
	Assigner(args, action);
};
