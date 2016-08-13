var xregexp = require('xregexp'),
  validator = require('validator'),
  NotImplementedException = require('./exceptions/NotImplementedException.js'),
  InvalidParameterException = require('./exceptions/InvalidParameterException.js'); 
const UNPRINTABLE_CHARS = '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f';

var Words = function () {};

/*
 * Internal function to generate a string of unprintable characters.
 */
Words.prototype.getUnprintableCharString = function() {
  var i = 0,
    result = '',
    word = '';

  for ( i = 0 ; i <= 31 ; i++ ) {
    word = String.fromCharCode(parseInt(i, 10));
    result = result + word;
  }

  return result;
};

/*
 * 
 */
Words.prototype.count = function(sentence) {
  var i = 0, 
    results = {},
    words = [];

  words = this.sanitize(sentence);

  for ( i = 0 ; i < words.length ; i++ ) {
    if ( results[words[i]] !== undefined) {
      if ( typeof results[words[i]] == 'function') {
        results[words[i]] = null;
      }
      results[words[i]] += 1;
    } else {
      results[words[i]] = 1;
    }
  }
  
  return results;
};

/*
 * Trims, and tokenizes the input sentence.  Removes unprintable characters.
 */
Words.prototype.sanitize = function(sentence) {
  var str = this.replaceControlCharsWithSpaces(sentence);
  str = validator.trim(str.toLowerCase());
  str = validator.blacklist(str, '\\[' + UNPRINTABLE_CHARS + '\\]');
  return str.split(/\s+/);
};

/*
 * Replaces control chars with spaces.
 * Seems to have issues with the pile of poo (Surrogate pairs)
 */
Words.prototype.replaceControlCharsWithSpaces = function(str) {
  var i = 0,
    result = '',
    regex;
  xregexp.install('astral');
  regex = xregexp('^\\pC+$');

  for (i = 0 ; i < str.length ; i++ ) {
    if (regex.test(str[i])) {
      result = result + ' ';
    } else {
      result = result + str[i];
    }
  }

  return result;
};

module.exports = Words;