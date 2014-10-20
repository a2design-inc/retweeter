'use strict';

var filter = require('./filter');
var _ = require('underscore');
var utils = require('./utils.js');

var Builder = function (positive, negative) {
	this.positive = positive;
	this.negative = negative;
}

Builder.prototype.getParams = function () {
	return _.reduce(this.positive, function reduceParams(prev, current) {
			if(utils.isGeo(current)) {
				var item = ''
					+ current.lng + ','
					+ current.lat + ','
					+ current.distance;
				prev.locations.push(item);
			} else {
				prev.track.push(current);
			}
			return prev;
		}, {track: [], locations: []});
};

Builder.prototype.getFilters = function () {
	return _.map(this.negative, function mapFilter(elm) {
		if(utils.isGeo(elm)) {
			return filter.getHashtagFilter(elm);
		}
		
		return filter.getQueryFilter(elm);
	});
};

module.exports = Builder;