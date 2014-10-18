'use strict';

var filter = require('./filter');
var _ = require('underscore');
var utils = require('./utils.js');

var Builder = function (positive, negative) {
	this.positive = positive;
	this.negative = negative;
}

Builder.prototype.getParameters = function () {
	return _.reduce(this.positive, function reduceParams(prev, current) {
			switch (current) {
				case utils.isGeo(current):
					var item = ''
						+ current.lng + ','
						+ current.lat + ','
						+ current.distance;
					prev.locations.push(item);
					break;
				
				case utils.isHashtag(current):
					prev.track.push(current);
					break;

				case utils.isMention(current):
					prev.track.push(current);
					break;

				default:
					throw new Error('Invalid option: ' + current);
			}
			return prev;
		}, {track: [], locations: []});
};

Builder.prototype.getFilters = function () {
	return _.map(this.negative, function mapFilter(elm) {
		switch (current) {
			case utils.isGeo(elm):
				return getHashtagFilter(elm);

			case utils.isHashtag(elm):
				return getMentionFilter(elm);

			case utils.isMention(elm):
				return getLocationFilter(elm);

			default:
				throw new Error('Invalid option: ' + elm);
		}
	});
};

module.exports = Builder;