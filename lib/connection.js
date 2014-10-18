'use strict';

var connection = require('mysql-promise')();
var config = require('./../config.js');
var _ = require('underscore');

var mysqlCredentials = config.mysql_credentials[config.env];
console.log(config.env);
var connectionConfig = _.extend(mysqlCredentials, {
	queryFormat: function(sql, val, timezone) {
		return sql;
	}
});

connection.configure(connectionConfig);

module.exports = connection; 