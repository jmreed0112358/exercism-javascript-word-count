var Words = require('./word-count');

const UNPRINTABLE_CHARS = '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f';

describe('count()', function() {
  var words = new Words();

  it('counts one word', function() {
    var expectedCounts = { word: 1 };
    expect(words.count('word')).toEqual(expectedCounts);
  });

  it('counts one of each', function() {
    var expectedCounts = { one: 1, of: 1, each: 1 };
    expect(words.count('one of each')).toEqual(expectedCounts);
  });

  it('counts multiple occurrences', function() {
    var expectedCounts = { one: 1, fish: 4, two: 1, red: 1, blue: 1 };
    expect(words.count('one fish two fish red fish blue fish')).toEqual(expectedCounts);
  });

  it('includes punctuation', function() {
    var expectedCounts = { car: 1, ':': 2, carpet: 1, as: 1, java: 1, 'javascript!!&@$%^&': 1 };
    expect(words.count('car : carpet as java : javascript!!&@$%^&')).toEqual(expectedCounts);
  });

  it('includes numbers', function() {
    var expectedCounts = { testing: 2, 1: 1, 2: 1 };
    expect(words.count('testing 1 2 testing')).toEqual(expectedCounts);
  });

  it('normalizes to lowercase', function() {
    var expectedCounts = { go: 3 };
    expect(words.count('go Go GO')).toEqual(expectedCounts);
  });

  it('counts properly international characters', function() {
    var expectedCounts = { '¡hola!': 1, '¿qué': 1, 'tal?': 1, 'привет!': 1, 'iñtërnâtiônàlizætiøn☃': 1 };
    expect(words.count('¡Hola! ¿Qué tal? Привет! Iñtërnâtiônàlizætiøn☃')).toEqual(expectedCounts);
  });

  it('counts multiline', function() {
    var expectedCounts = { hello: 1, world: 1 };
    expect(words.count('hello\nworld')).toEqual(expectedCounts);
  });

  it('counts tabs', function() {
    var expectedCounts = { hello: 1, world: 1 };
    expect(words.count('hello\tworld')).toEqual(expectedCounts);
  });

  it('counts multiple spaces as one', function() {
    var expectedCounts = { hello: 1, world: 1 };
    expect(words.count('hello  world')).toEqual(expectedCounts);
  });

  it('does not count leading or trailing whitespace', function() {
    var expectedCounts = { introductory: 1, course: 1 };
    expect(words.count('\t\tIntroductory Course      ')).toEqual(expectedCounts);
  });

  it('handles properties that exist on Object’s prototype', function() {
    var expectedCounts = { reserved: 1, words: 1, like: 1, constructor: 1, and: 1, tostring: 1, 'ok?': 1 };
    expect(words.count('reserved words like constructor and toString ok?')).toEqual(expectedCounts);
  });
});

describe('sanitize()', function() {
  var words = new Words();

  it('tokenizes, returns the expected result', function() {
    var actual = words.sanitize('Foo Bar');
    var expected = [ 'foo', 'bar' ];
    expect(actual).toEqual(expected);
  });

  it('input contains extra whitespace, returns expected input', function() {
    var actual = words.sanitize('  Foo   Bar   ');
    var expected = [ 'foo', 'bar' ];
    expect(actual).toEqual(expected);
  });

  it('input contains unicode, returns expected input', function() {
    var actual = words.sanitize('¡Hola! ¿Qué tal? Привет! Iñtërnâtiônàlizætiøn☃');
    var expected = [ '¡hola!', '¿qué', 'tal?', 'привет!', 'iñtërnâtiônàlizætiøn☃' ];
    expect(actual).toEqual(expected);
  });

  it('input contains unprintable characters, returns expected input', function() {
    var actual = words.sanitize( UNPRINTABLE_CHARS + 'Foo Bar');
    var expected = [ 'foo', 'bar' ];
    expect(actual).toEqual(expected);
  });
});

describe('replaceControlCharsWithSpaces', function() {
  var words = new Words();

  it('replaces control chars with spaces', function() {
    var actual = words.replaceControlCharsWithSpaces(UNPRINTABLE_CHARS + 'Foo Bar');
    var expected = '                                Foo Bar';
    expect(actual).toEqual(expected);
  });

  it('replaces control chars, but leaves other unicode chars alone', function() {
    var actual = words.replaceControlCharsWithSpaces(UNPRINTABLE_CHARS + '¡Hola! ¿Qué tal? Привет! Iñtërnâtiônàlizætiøn☃');
    var expected = '                                ¡Hola! ¿Qué tal? Привет! Iñtërnâtiônàlizætiøn☃';
    expect(actual).toEqual(expected);
  });
});
