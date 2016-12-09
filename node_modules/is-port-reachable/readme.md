# is-port-reachable [![Build Status](https://travis-ci.org/sindresorhus/is-port-reachable.svg?branch=master)](https://travis-ci.org/sindresorhus/is-port-reachable)

> Check if a local or remote port is reachable


## Install

```
$ npm install --save is-port-reachable
```


## Usage

```js
var isPortReachable = require('is-port-reachable');

isPortReachable(80, {host: 'google.com'}, function (err, reachable) {
	console.log(reachable);
	//=> true
});
//=>
```


## API

### isPortReachable(port, [options], callback)

#### port

Type: `number`

#### options

##### host

Type: `string`  
Default: `localhost`

Can be a domain or an IP.

##### timeout

Type: `number`  
Default: `1000`

Milliseconds to wait before giving up.

#### callback(error, reachable)

##### error

Type: `null`

It's there by Node.js convention, but will always be `null`.

##### reachable

Type: `boolean`


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
