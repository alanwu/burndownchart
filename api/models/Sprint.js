module.exports = {

  attributes: {
  	sprintID : {
  		type: 'string',
  		unique: true,
  		required: true
  	},
  	name: {
  		type: 'string'
  		unique: true,
  		required: true
  	},
  	beginDate: {
  		type: 'date'
  		unique: true,
  		required: true
  	},
  	endDate: {
  		type: 'date'
  		unique: true,
  		required: true
  	},
  	committedHours: {
  		type: 'float'
  		unique: true,
  		required: true
  	},
    devCapacity: {
    	type: 'array'
    	unique: true,
  		required: true
    },
    devException: {
    	type: 'array'
    	unique: true,
  		required: true
    },
    qaCapacity: {
    	type: 'array'
    	unique: true,
  		required: true
    },
    qaException: {
    	type: 'array'
    	unique: true,
  		required: true
    },
    burnDown: {
    	type: 'array'
    	unique: true,
  		required: true
    },
    numOfDev: {
    	type: 'integer'
    	unique: true,
  		required: true
    },
    numOfQa: {
    	type: 'integer'
    	unique: true,
  		required: true
    }
  },

  findBySprintName: function(opts, cb) {
  	var sprintName = opts.sprintName;
  	Sprint.find({
  		name: sprintName
  	}).exec(function(error, sprints) {
  		if (sprints.length == 0) {
  			console.error('Cannot find the sprint specified');
  		} else if (sprints.length > 1) {
			console.error('Found more than one sprints based on the name');
  		} else {
  			return sprints[0];
  		}
  	});
  	}
  }
};

