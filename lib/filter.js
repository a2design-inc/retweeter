'use strict';

var utils = require('./utils.js');

function getQueryFilter(elm) {
	return function queryFilter(data) {
		return data.text.match(elm) !== null;
	}
}

function getLocationFilter(elm) {
	var boundingBox = utils.getBoundingBox(elm.lat, elm.lng, elm.distance);
	return function testLocation(data) {
		if(data.geo === null || data.geo.coordinates === null) {
			return true;
		}
		var lat = data.geo.coordinates[1];
		var lng = data.geo.coordinates[0];
		return parseFloat(lng) > parseFloat(boundingBox[0])
			&& parseFloat(lng) < parseFloat(boundingBox[2])
			&& parseFloat(lat) > parseFloat(boundingBox[1])
			&& parseFloat(lat) < parseFloat(boundingBox[3]);
	};
}

module.exports = {
	getQueryFilter: getQueryFilter,
	getLocationFilter: getLocationFilter
};