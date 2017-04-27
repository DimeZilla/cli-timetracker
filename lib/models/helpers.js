'use strict';

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
  createFile: function(file){
      if(!fs.existsSync(file)){
          fs.closeSync(fs.openSync(file, 'w'));
          return true;   
      }
      console.error('file already exists');
      return false;
  },
  deleteFile: function(file){
      if(fs.existsSync(file)){
          fs.unlinkSync(file);
          return true;
      }
      console.log("the File already doesn't exist");
      return false;
  },
	writeToFile : function(file, data){
	    fs.writeFileSync(file, JSON.stringify(data),'utf8');
        return true;
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
  zeroPad: function(numDigits, string){
    let zeros = new Array(numDigits).join('0');
    return (zeros + string).slice( -1 * numDigits );
  },
  isoDate: function(date, withOffset){
    /*
     * We are converting to isoDate meaning that this will no
     * longer be an object and so we need to calc the timzezone offset so that
     * we can get back our date
     */
    if(withOffset !== undefined && withOffset === true){
      let offset = date.getTimezoneOffset() * 60000;
      date = new Date(date.valueOf() + offset);      
    }

    let  year = date.getFullYear(),
  		month = this.zeroPad(2,date.getMonth() + 1),
  		day = this.zeroPad(2,date.getDate());

  	return year + '-' + month + '-' + day;
  },
  fullDateString: function(date){
  	return this.isoDate(date, false) + ' ' + date.toLocaleTimeString();
  },
  pluckUniqueValues: function(data, key){
      let ret = _.uniq(_.pluck(data, key));
      ret.sort();
      return ret;
  },
  pluckUniqueMultipleValues: function(data, key1, key2){
      let parents = this.pluckUniqueValues(data, key1);
          parents.sort();
          parents = parents.map(function(rent){
                  let tmp = {};
                  tmp[key1] = rent;
                  tmp[key2] = [];
                  return tmp;
              });

      parents.forEach(function(row1){
          data.forEach(function(row2){
              if(row1[key1] == row2[key1] && row1[key2].indexOf(row2[key2]) === -1){
                  row1[key2].push(row2[key2]);
              }
          });
          row1[key2].sort();
      });

      let ret = [];
      parents.forEach(function(rent){
          rent[key2].forEach(function(child){
              ret.push([rent[key1], child]);
          });
      });
      
      return ret;
  }
};
// tries to parse the output and if fails returns an empty object
