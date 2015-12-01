angular.module('app.services', [])
.factory('Lisper', function() {

  var interpret = function(expression) {
    var code = readFromTokens(tokenize(expression));
    return evaluate(code, globalContext);
  };

  var evaluate = function(code, context) {

    // var current = code instanceof Array ? code.shift() : code;

    // if (context[current]) {
    //   var args = code.map(function(item) { return evaluate(item, context); });
    //   return context[current].apply(this, args);
    // } else if (current instanceof Array) {
    //   return evaluate(current, context);
    // } else {
    //   return code;
    // }

    if (typeof code === "number") {
      return code;
    } else if (typeof code === "string") {
      return context[code] || "undefined";
    } else if (code[0] === "quote") {
      var rest = code.slice(1);
      if (rest[0] instanceof Array) {
        return "(" + rest[0].join(" ") + ")";
      } else {
        return rest.join(" ");
      }
    }

  };

  var tokenize = function(expression) {
    return expression.replace(/\(/g, ' ( ')
                     .replace(/\)/g, ' ) ')
                     .trim()
                     .split(/\s+/);
  };

  var readFromTokens = function(tokens) {

    if (!tokens.length) {
      throw "No tokens found.";
    }

    var token = tokens.shift();
    var list;

    if (token === '(') {
      list = [];
      while (tokens[0] !== ')') {
        list.push(readFromTokens(tokens));
      }
      tokens.shift();
      return list;
    } else if (token === ')') {
      throw "Unexpected )";
    } else {
      return categorize(token);
    }
  };

  var categorize = function (token) {
    if (!isNaN(parseFloat(token))) {
      return parseFloat(token);
    } else {
      return token;
    }
  };

  var add = function () {
    var args = Array.prototype.slice.call(arguments);
    var start = args.shift();
    return args.reduce(function(total, current) {
      return total += current;
    }, start);
  };

  var subtract = function () {
    var args = Array.prototype.slice.call(arguments);
    var start = args.shift();
    return args.reduce(function(total, current) {
      return total -= current;
    }, start);
  };

  var multiply = function () {
    var args = Array.prototype.slice.call(arguments);
    var start = args.shift();
    return args.reduce(function(total, current) {
      return total *= current;
    }, start);
  };

  var divide = function () {
    var args = Array.prototype.slice.call(arguments);
    var start = args.shift();
    return args.reduce(function(total, current) {
      return total /= current;
    }, start);
  };

  var defaultContext = function () {
    return {
      '+': add,
      '-': subtract,
      '/': divide,
      '*': multiply,
      'car': function(list) { return list[0]; },
      'cdr': function(list) { return list.slice(1); },
      'cons': function(a, b) { return [a].concat(b); },
      'eq?': function(a, b) { return a === b; },
      'length': function(list) { return list.length || null; },
      'list': function() {},
      'list?': function(input) {return input instanceof Array; },
      'map': function(list, callback) { return list.map(callback); },
      'max': function(list) { return list.sort(function(a,b) {return a - b})[0]; },
      'min': function(list) { return list.sort(function(a,b) {return a - b})[list.length-1]; },
      'not': function(input) { return !input; },
      'null?': function(input) { return input === null; },
      'number?': function(input) { return typeof input === 'number'; },
      'procedure?': function(input) { return typeof input === 'function'; },
      'symbol?': function(input) { return typeof input === 'string'; },
    }
  };

  var globalContext = defaultContext();

  return {
    interpret : interpret
  }

})