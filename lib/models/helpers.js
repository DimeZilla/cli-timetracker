var fs = require('fs');
var _ = require('underscore-node');

module.exports = {
	parseFile : function(file){
	    var obj;
	    try {
	        obj = JSON.parse(fs.readFileSync(file, 'utf8'));
	    } catch(e){
	        obj = [];
	    }
	    
	    return obj;
	},

	writeToFile : function(file, data){
	    fs.writeFileSync(file, JSON.stringify(data),'utf8');
	},
	getUID : function(str){
        return str.replace(/\s+/g,'-').toLowerCase();
    },
    rowExists : function(key,value,data){
        var tmp = {}; 
            tmp[key] = value;
        var ar = _.where(data, tmp );
        return ar.length > 0 ? true : false;
    },
    getHours : function(date1, date2){
    	return Math.round( (date1 -  date2) / (1000 * 60 * 60) * 100) / 100; // in hours rounded to 2
    },
    isoDate: function(date){
    	var year = date.getFullYear(),
    		month = date.getMonth() + 1,
    		day = date.getDate();

    	return year + '-' + month + '-' + day;
    },
    fullDateString: function(date){
    	return date.toDateString() + ' ' + date.toLocaleTimeString();
    }
};
// tries to parse the output and if fails returns an empty object
