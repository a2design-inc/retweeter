'use strict';

var _ = require('underscore');

var hashTagExp =  /(^|\s|[.]|[,])(([#]+)([\w\u00C0-\u02B8\u0385-\u0525\u0531-\u0556\u0561-\u0587]+))/g;
var userNamesExp = /(^|\s)(([@]+)([A-Za-z0-9-_]+))/g;
var EARTH_RADIUS = 6371;

module.exports = {
	isHashtag: function (string) {
		return _.isString(string) && string.match(hashTagExp);
	},
	isMention: function (string) {
		return _.isString(string) && string.match(userNamesExp);
	},
	isGeo: function (geo) {
		return _.isObject(geo)
			&& _.isNumber(geo.lat)
			&& (geo.lat <= 180) && (geo.lat >= -180)
			&& _.isNumber(geo.lng)
			&& (geo.lng <= 180) && (geo.lng >= -180)
			&& _.isNumber(geo.distance)
			&& geo.distance > 0;
	},
	toDegrees: function (radians) {
		return radians * (180 / Math.PI);
	},
	toRadians: function (degrees) {
		return degrees * (Math.PI / 180);
	},
	getBoundingBox: function (lat, lon, radius) {
		return [
			lon - toDegrees(radius / EARTH_RADIUS / Math.cos(toRadians(lat))),
			lat - toDegrees(radius / EARTH_RADIUS),
			lon + toDegrees(radius / EARTH_RADIUS / Math.cos(toRadians(lat))),
			lat + toDegrees(radius / EARTH_RADIUS)
		];
	}
};