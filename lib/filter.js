'use strict';

var utils = require('./utils.js');

function getHashtagFilter(elm) {
	return function testHashtag(data) {
		return data.match('#' + criteria);
	};
}

function getMentionFilter(elm) {
	return function testHashtag(data) {
		return data.match('@' + criteria);
	};
}

function getLocationFilter(elm) {
	var boundingBox = utils.getBoundingBox(elm.lat, elm.lng, elm.distance);
	return function(data) {
		return parseFloat(data.lng) > parseFloat(boundingBox[0])
			&& parseFloat(data.lng) < parseFloat(boundingBox[2])
			&& parseFloat(data.lat) > parseFloat(boundingBox[1])
			&& parseFloat(data.lat) < parseFloat(boundingBox[3]);
	};
}

module.exports = {
	getLocationFilter: getLocationFilter,
	getMentionFilter: getMentionFilter,
	getLocationFilter: getLocationFilter
};