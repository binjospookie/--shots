'use strict';
var net = require('net');
var onetime = require('onetime');

module.exports = function (port, opts, cb) {
	if (typeof opts !== 'object') {
		cb = opts;
		opts = {};
	}

	cb = cb ? onetime(cb) : function () {};

	var timeout = typeof opts.timeout === 'number' ? opts.timeout : 1000;
	var socket = new net.Socket();

	var onError = function () {
		cb(null, false);
		socket.destroy();
	};

	socket.setTimeout(timeout);
	socket.on('error', onError);
	socket.on('timeout', onError);

	socket.connect(port, opts.host, function () {
		cb(null, true);
		socket.end();
	});
};
