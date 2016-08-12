var NotImplementedException = require('./exceptions/NotImplementedException.js'),
  InvalidParameterException = require('./exceptions/InvalidParameterException.js');

var Words = function () {};

Words.prototype.count = function(sentence) {
	throw new NotImplementedException();
};

module.exports = Words;