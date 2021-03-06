(function() {
    'use strict';

    angular
        .module('app.services', [])
        .factory('Lisper', lisper);

    function lisper () {

      /*
      "Interpret" does the following:

      1) Tokenizes expression: "tokenize"
      2) Builds syntax tree: "buildTree"
      3) Evaluates the tree: "evaluate"

      */

      var interpret = function(expression) {
        var code = buildTree(tokenize(expression));
        return evaluate(code, globalContext);
      };

      var evaluate = function(code, context, args) {

        if (typeof code === "number") {
          return code;
        } else if (typeof code === "string") {
          return context[code] || undefined;
        } else if (code[0] === "quote") {
          return handleQuote(code);
        } else if (code[0] === "define") {
          return handleDefine(code, context);
        } else if (code[0] === "if") {
          return handleConditionals(code, context);
        } else if (code[0] === "lambda") {
          return handleLambdas(code, context);
        } else if (context[code[0]]) {
          return handleProc(code, context, args);
        } else {
          return handleList(code, context);
        }

      };

      var buildTree = function(tokens) {

        if (!tokens.length) {
          throw "No tokens found.";
        }

        var token = tokens.shift();
        var list;

        if (token === '(') {
          list = [];
          while (tokens[0] !== ')') {
            list.push(buildTree(tokens));
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

      var tokenize = function(expression) {
        return expression.replace(/\(/g, ' ( ')
                         .replace(/\)/g, ' ) ')
                         .trim()
                         .split(/\s+/);
      };

      /*
      Evaluation handlers:

      i) If Quote: "handleQuote"
      ii) If Variable Definition: "handleDefine"
      iii) If Conditional Phrase: "handleConditionals"
      iv) If Proc or Function Invocation: "handleProc"
      v) If Lambda Definition: "handleLambdas"
      vi) If List: "handleList"
      vii) Lamdba class that encloses scope: "Lambda"

      */

      var handleQuote = function (input) {
        return rest = input.slice(1);
      };

      var handleDefine = function (input, context) {
        var variable = input[1];
        var expression = input[2] instanceof Array ? input.slice(2) : input[2];
        var value = evaluate(expression, context);

        context[variable] = value[0] instanceof Lambda ? value[0] : value;

        return variable;
      };

      var handleConditionals = function (input, context) {
        var test = input[1];
        var then = input[2];
        var otherwise = input[3];

        if (evaluate(test, context)) {
          return evaluate(then);
        } else {
          return evaluate(otherwise);
        }
      };

      // Implemented closures here with the "args" parameter.
      // If "args" hasn't been passed through, then we set them.
      // Otherwise, we use the existing "args" and pass them around the interpreter.

      var handleProc = function (input, context, args) {
      
        var proc = evaluate(input[0], context);
        var args = args || input.slice(1).map( function(item) { return evaluate(item, context); });
        return proc instanceof Lambda ? proc.call(context, args) : proc.apply(this, args);
      };

      var handleLambdas = function (input, context) {
        var params = input[1];
        var body = input[2];
        return new Lambda(params, body, context);
      };

      var handleList = function (input, context) {
        var result = [];
        for (var i = 0; i < input.length; i++) {
          result.push(evaluate(input[i], context));
        }
        return result;
      };

      var Lambda = function(params, body) {
        this.params = params;
        this.body = body;
        this.scope = {};

        this.call = function (context, args) {
          this.scope = context;

          for (var i = 0; i < this.params.length; i++) {
            this.scope[this.params[i]] = args[i];
          }

          return evaluate(this.body, this.scope);
        };

      };

      /*
      "Built-In" Operations:
      All of these functions exist in the global scope: ("defaultContext")
      */

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

          '>': function(a, b) { return a > b; },
          '<': function(a, b) { return a < b; },
          '>=': function(a, b) { return a >= b; },
          '<=': function(a, b) { return a <= b; },
          'eq?': function(a, b) { return a === b; },

          'car': function(list) {return list[0]; },
          'cdr': function(list) { return list.slice(1); },
          'cons': function(a, b) { return [a].concat(b); },
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
    }

})();