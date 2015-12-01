angular.module('app.services', [])
.factory('Lisper', function() {

  var interpret = function(expression) {
    var code = readFromTokens(tokenize(expression));
    return evaluate(code, globalContext);
  };

  var evaluate = function(code, context) {

    if (typeof code === "number") {
      return code;
    } else if (typeof code === "string") {
      return context[code] || "undefined";
    } else if (code[0] === "quote") {
      return handleQuote(code);
    } else if (code[0] === "define") {
      return handleDefine(code, context);
    } else if (code[0] === "if") {
      return handleConditionals(code, context);
    } else if (context[code[0]]) {
      return handleProc(code, context);
    } else {
      return handleList(code, context);
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

  var handleQuote = function (input) {
    return rest = input.slice(1);
  };

  var handleDefine = function (input, context) {
    var variable = input[1];
    var exp = input[2] instanceof Array ? input.slice(1) : input[2];
    context[variable] = evaluate(exp, context);
    return;
  };

  var handleConditionals = function (input, context) {
    var test = input[1];
    var then = input[2];
    var otherwise = input[3];

    if (evaluate(test, context)) {
      return evaluate(input[2]);
    } else {
      return evaluate(input[3]);
    }
  };

  var handleProc = function (input, context) {
    var proc = evaluate(input[0], context);
    var args = input.slice(1).map( function(item) {return evaluate(item, context); });
    return proc.apply(this, args);
  };

  var handleList = function (input, context) {
    var result = [];
    for (var i = 0; i < input.length; i++) {
      result.push(evaluate(input[i], context));
    }
    return result;
  };

  var defaultContext = function () {
    return {
      '+': add,
      '-': subtract,
      '/': divide,
      '*': multiply,

      '>': function(a, b) { return a > b; },
      '<': function(a, b) { return a < b; },
      '>=': function(a, b) { return a >= b; },
      '<=': function(a, b) { return a <= b; },

      'car': function(list) {return list[0]; },
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