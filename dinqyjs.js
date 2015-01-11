/*!Dinqyjs JavaScript Library v1.3.4
* http://dinqyjs.com/
*
* Copyright (c) 2014 Garry Passarella
* Released under the MIT license
* http://dinqyjs.com/license
*
* Date: 2015-01-10
*/
var Dinqyjs = (function() {
	"use strict";

	var NULL = null,
	UNDEFINED = void 0,
	TRUE = true,
	FALSE = false,
	ARRAY = Array,
	ARRAY_PROTOTYPE = ARRAY.prototype,
	LENGTH = "length",
	APPLY = "apply",
	PUSH = "push",
	REVERSE = "reverse",
	SLICE = "slice",
	SORT = "sort",
	SPLICE = "splice",
	INDEXOF = "indexOf",
	LASTINDEXOF = "lastIndexOf",

	_arrayElementCompare = function(element) {
		return function(other) {
			return element === other;
		};
	},

	_arrayMidpoint = function(arrayLength, evenResolver) {
		var index = arrayLength /  2;
		return parseInt(evenResolver > 0 ? Math.ceil(index) : index);
	},

	_config = {
		ARRAY_PREALLOCATION: 64000
	},

	_defaultSort = function(x, y) {
		return x > y ? 1 : (x < y ? -1 : 0);
	},

	_differenceXY = function(inner, outer, predicate) {
		var usePredicate = _isFunction(predicate),
			i = 0,
			j,
			x,
			y,
			difference = [],
			outerLength;

		inner = _unwrap(_wrap(inner).distinct(predicate));
		outer = _unwrap(outer);

		outerLength = outer[LENGTH];

		while (i < inner[LENGTH]) {
			x = inner[i++];
			j = 0;
			while (j < outerLength)	{
				y = outer[j];
				if (usePredicate && predicate(x, y) || !usePredicate && x === y) {
					break;
				}
				j++;
			}
			if (j === outerLength) {
				difference[PUSH](x);
			}
		}
		return _wrap(difference);
	},

	_eachKeys = function(array, callback) {
		var thisElement,
			key;

		for (key in array) {
			thisElement = array[key];
			if (!_isFunction(thisElement)) {
				callback(thisElement, key);
			}
		}
	},

	_error = function(message) {
		throw new Error(message);
	},

	_errorNoMatches = "Array contains no matching elements",
	_errorNotExactlyOneMatch = "Array does not contain exactly one matching element",

	_firstIndex = function(array, predicate, increments, startIndex, count) {
		var thisElement,
			thisLength = array[LENGTH];

		increments = increments || 1;

		if (!_isFunction(predicate)) {
			return thisLength > 0 ? (increments > 0 ? 0 : thisLength - 1) : -1;
		}

		if (_isUndefined(startIndex)) {
			startIndex = increments > 0 ? 0 : thisLength - 1;
		}

		if (_isUndefined(count) || count > thisLength) {
			count = thisLength;
		}

		while (count > 0) {
			thisElement = array[startIndex];
			if (predicate(thisElement)) {
				return startIndex;
			}
			startIndex += increments;
			count--;
		}
		return -1;
	},

	_getTop1 = function(comparison, array, selector) {
		var	thisElement,
			useSelector = _isFunction(selector),
			elementToCheckAgainst;

		for(var i = 0, thisLength = array[LENGTH], extreme = thisLength > 0 ? array[0] : NULL; i < thisLength; i++) {
			thisElement = array[i];
			elementToCheckAgainst = (useSelector ? selector(thisElement) : thisElement);
			if (comparison ?
				elementToCheckAgainst <= extreme :
				elementToCheckAgainst >= extreme
			) {
				extreme = thisElement;
			}
		}
		return extreme;
	},

	_isFunction = function(obj) {
		return typeof obj == "function";
	},

	_isUndefined = function(obj) {
		return obj === UNDEFINED;
	},

	_joinXY = function(innerElement, outerElement) {
		return {
			inner: innerElement,
			outer: outerElement
		};
	},

	_loop = function(array, callback, condition, returnOn) {
		for (var i = 0; i < array[LENGTH] && condition(array[i], i) != returnOn; i++) {
			callback(array[i], i);
		}
	},

	_minitabVariation = function(q, n) {
		return 1 / 4 * (q * n + q);
	},

	_multiply = function(runningTotal, value) {
		return runningTotal * value;
	},

	_partition = function(array, keySelector, elementSelector, resultSelector) {
		var i = 0,
			thisElement,
			partitions = [],
			p,
			useElementSelector = _isFunction(elementSelector),
			useResultSelector = _isFunction(resultSelector);

		while (i < array[LENGTH]) {
			thisElement = array[i++];
			p = keySelector(thisElement);
			if (useElementSelector) {
				thisElement = elementSelector(thisElement);
			}

			(partitions[p] = (p in partitions) ? partitions[p] : [])[PUSH](thisElement);
		}

		if (useResultSelector) {
			_useResultSelectorOnGroup(partitions, resultSelector);
		}

		return partitions;
	},

	//This uses the minitab method to get quartiles
	_quartile = function(collection, q, selector) {
		var useSelector = _isFunction(selector),
			sorted,
			quartilePosition,
			lowerIndex,
			upperIndex,
			lowerElement,
			upperElement,
			lowerValue,
			upperValue,
			collectionLength = collection.count();

		if (collectionLength < 1) {
			return UNDEFINED;
		}

		//Set up a clone of the array
		sorted = _unwrap(collection).concat();
		_sortAndThenSortMore(sorted, selector);

		quartilePosition = _minitabVariation(q, collectionLength);
		lowerIndex = parseInt(quartilePosition);
		upperIndex = parseInt(Math.ceil(quartilePosition));
		lowerValue = sorted[lowerIndex - 1];
		upperValue = sorted[upperIndex - 1];
		lowerElement = useSelector ? selector(lowerValue) : lowerValue;
		upperElement = useSelector ? selector(upperValue) : upperValue;

		return upperIndex > lowerIndex ? lowerElement : (lowerElement + upperElement) / 2;
	},

	_randomForSorting = function() {
		return Math.random() - 0.5;
	},

	_sortAndThenSortMore = function(array, selectors) {
		if (_isUndefined(selectors) || selectors[LENGTH] < 1) {
			array[SORT](_defaultSort);
			return;
		}

		selectors = _isFunction(selectors) ?
					[ selectors ] :
					ARRAY_PROTOTYPE.slice.call(selectors);


		array[SORT](_sorterWithSelectors(selectors));
	},

	_sorterWithSelectors = function (selectors) {
		return function(x, y) {
			var s = 0,
				result = 0,
				xSelected,
				ySelected,
				direction,
				thisSelector,
				selectorsLength = selectors[LENGTH];

			while (s < selectorsLength && result === 0) {
				thisSelector = selectors[s++];
				if (!_isFunction(thisSelector)) {
					continue;
				}

				direction = 0;
				if (s < selectorsLength &&
					typeof selectors[s] == "string" &&
					selectors[s][INDEXOF]("des") === 0
				) {
					direction = 1;
				}

				xSelected = thisSelector(x);
				ySelected = thisSelector(y);
				if (xSelected < ySelected) {
					result = direction ? 1 : -1;
				} else if (xSelected > ySelected) {
					result = direction ? -1 : 1;
				}
			}
			return result;
		};
	},

	_total = function(array, summingFunction, selector) {
		var total = NULL,
			i = array[LENGTH] - 1,
			thisElement,
			usePredicate = _isFunction(selector),
			toAdd;

		while (i >= 0) {
			thisElement = array[i--];
			toAdd = usePredicate ? selector(thisElement) : thisElement;
			total = (total === NULL ? toAdd : summingFunction(total, toAdd));
		}
		return total;
	},

	_unwrap = function(Collection) {
		return Collection._ || Collection;
	},

	_useResultSelectorOnGroup = function(array, resultSelector) {
		var key,
			thisElement;

		for (key in array) {
			thisElement = array[key];
			array[key] = resultSelector(thisElement, key);
		}

		return array;
	},

	_wrap = function(array) {
		return array._ ?  array : new Dinqyjs.Collection(array);
	};

	//Array polyfills:
	if (!ARRAY_PROTOTYPE[INDEXOF]) {
		ARRAY_PROTOTYPE[INDEXOF] = function(element, start) {
			return _firstIndex(this, _arrayElementCompare(element), 1, start);
		};
	}

	if (!ARRAY_PROTOTYPE[LASTINDEXOF]) {
		ARRAY_PROTOTYPE[LASTINDEXOF] = function(element, start) {
			return _firstIndex(this, _arrayElementCompare(element), -1, start);
		};
	}

	if (!ARRAY_PROTOTYPE.map) {
		ARRAY_PROTOTYPE.map = function(callback) {
			var thisLength = this[LENGTH],
				results = new ARRAY(thisLength > _config.ARRAY_PREALLOCATION ?
				0 :
				thisLength),
				i = 0;

			if (!_isFunction(callback)) {
				return UNDEFINED;
			}

			while (i < thisLength) {
				results[i] = callback(this[i++]);
			}
			return results;
		};
	}

	if (!ARRAY.isArray) {
		ARRAY.isArray = function(arg) {
			return arg.constructor === ARRAY;
		};
	}

	return {
		Collection : (function() {
			function Collection(array) {
				this._ = array || [];
			}

			Collection.associative = function(object) {
				for (var i in object) {
					if (!_isFunction(object[i])) {
						return +object[LENGTH] === 0;
					}
				}
				return FALSE;
			};

			Collection.configure = function(key, value) {
				return _config[key] = (arguments[LENGTH] < 2 ? _config[key] : value);
			};

			Collection.transpose = function(/*collections or arrays*/) {
				var	a,
					args = arguments,
					thisArray,
					thisArrayLength,
					results = [];

				for(var i = 0, argsLength = arguments[LENGTH]; i < argsLength; i++) {
					thisArray = _unwrap(args[i]);
					thisArrayLength = thisArray[LENGTH];

					while (results[LENGTH] < thisArrayLength) {
						results[PUSH]([]);
					}

					a = 0;
					while (a < thisArrayLength) {
						results[a][PUSH](thisArray[a++]);
					}
				}

				return _wrap(results);
			};

			Collection.prototype = {
				all: function(predicate) {
					var all = TRUE,
						i = 0;

					while (i < this._[LENGTH]) {
						all &= predicate(this._[i++]);
					}
					return all ? TRUE : FALSE;
				},

				any: function(predicate) {
					return _firstIndex(this._, predicate) >= 0;
				},

				ascending: function(/*selectors*/) {
					_sortAndThenSortMore(this._, arguments);
					return this;
				},

				atRandom: function() {
					return this._[Math.floor(Math.random() * this._[LENGTH])];
				},

				average: function(selector) {
					var thisLength = this._[LENGTH];
					return thisLength ? this.sum(selector) / thisLength : 0;
				},

				clear: function() {
					this._[SPLICE](0, this._[LENGTH]);
				},

				clearWhere: function(selector) {
					var i = this._[LENGTH] - 1;

					while (i >= 0) {
						if (selector(this._[i])) {
							this._[SPLICE](i, 1);
						}
						i--;
					}
					return this;
				},

				clone: function() {
					return _wrap(this._.concat());
				},

				concat: function() {
					return _wrap(ARRAY_PROTOTYPE.concat[APPLY](this._, arguments));
				},

				contains: function(item) {
					return this._[INDEXOF](item) > -1;
				},

				count: function(element) {
					var i = 0,
					arrayLength = this._[LENGTH],
					count = 0;
					if (_isUndefined(element)) {
						return arrayLength;
					}
					while (i < arrayLength) {
						if (this._[i++] === element) {
							count++;
						}
					}
					return count;
				},

				descending: function() {
					_sortAndThenSortMore(this._, arguments);
					return this[REVERSE]();
				},

				difference: function(other, predicate) {
					var thisUnwrapped = this._;
					other = _unwrap(other);
					return _differenceXY(thisUnwrapped, other, predicate)
							.union(_differenceXY(other, thisUnwrapped, predicate));
				},

				distinct: function(selector) {
					var usePredicate = _isFunction(selector),
						distinct = [],
						x,
						y,
						i,
						j,
						thisLength;

					for(i = 0, thisLength = this._[LENGTH]; i < thisLength; i++) {
						x = this._[i];
						if (distinct[INDEXOF](x) == -1) {
							for(j = 0; j < thisLength; j++) {
								y = this._[j];
								if (usePredicate && selector(x, y) || !usePredicate && x === y) {
									distinct[PUSH](x);
									break;
								}
							}
						}
					}
					return _wrap(distinct);
				},

				doUntil: function(callback, stoppingCondition) {
					_loop(this._, callback, stoppingCondition, 1);
				},

				doWhile: function(callback, condition) {
					_loop(this._, callback, condition, 0);
				},

				each: function(callback) {
					var i = 0,
						thisLength = this._[LENGTH];

					if (thisLength === +thisLength && !Collection.associative(this._)) {
						while (i < thisLength) {
							callback(this._[i], i++);
						}
						return;
					}
					_eachKeys(this._, callback);
				},

				element: function(index, item) {
					return (this._[index] = arguments[LENGTH] > 1 ? item : this._[index]);
				},

				equalTo: function(other, predicate) {
					other = _unwrap(other);
					var thisLength = this._[LENGTH],
						i = thisLength - 1,
						useFunction = _isFunction(predicate),
						thisElement,
						otherElement;

					if (thisLength != other[LENGTH]) {
						return FALSE;
					}
					while (i >= 0) {
						thisElement = this._[i];
						otherElement = other[i--];
						if (useFunction ?
							!predicate(thisElement, otherElement) :
							thisElement !== otherElement
						) {
							return FALSE;
						}
					}
					return TRUE;
				},

				findIndex: function(predicate, startIndex, count) {
					return _isFunction(predicate) ?
							_firstIndex(this._, predicate, 1, startIndex, count) :
							-1;
				},

				findLastIndex: function(predicate, startIndex, count) {
					return _isFunction(predicate) ?
							_firstIndex(this._, predicate, -1, startIndex, count) :
							-1;
				},

				first: function(predicate) {
					var firstIndex = _firstIndex(this._, predicate);
					if (firstIndex >= 0) {
						return this._[firstIndex];
					}
					_error(_errorNoMatches);
				},

				flatten: function() {
					var i = 0,
						flattened = _wrap([]),
						thisElement;

					while (i < this._[LENGTH]) {
						thisElement = this._[i++];
						Collection.prototype[PUSH][APPLY](
							flattened, ARRAY.isArray(thisElement) ?
							thisElement :
							[ thisElement ]
						);
					}
					return flattened;
				},

				groupBy: function(keySelector, elementSelector, resultSelector) {
					var partition = _partition(this._,
						keySelector,
						elementSelector,
						resultSelector),
						key;
						this._[SPLICE](0, this._[LENGTH]);

					for (key in partition) {
						this._[key] = partition[key];
					}
					return this;
				},

				indexOf: function() {
					return ARRAY_PROTOTYPE[INDEXOF][APPLY](this._, arguments);
				},

				innerJoin: function(other, predicate, joinedObjectCreator) {
					other = _unwrap(other);
					if (!ARRAY.isArray(other)) {
						return this.clone();
					}
					if (!_isFunction(joinedObjectCreator)) {
						joinedObjectCreator = _joinXY;
					}

					var joined = [],
					innerElement,
					outerElement,
					i = 0,
					j;

					while (i < this._[LENGTH]) {
						innerElement = this._[i++];
						j = 0;
						while (j < other[LENGTH]) {
							outerElement = other[j++];
							if (predicate(innerElement, outerElement)) {
								joined[PUSH](joinedObjectCreator(innerElement, outerElement));
							}
						}
					}
					return _wrap(joined);
				},

				insert: function(index, element) {
					this._[SPLICE](index, 0, element);
				},

				insertRange: function(index, elements) {
					ARRAY_PROTOTYPE[SPLICE][APPLY](this._,
						[ index, 0 ].concat(
							arguments[LENGTH] < 3 ?
							_unwrap(elements) :
							ARRAY_PROTOTYPE.slice.call(arguments, 1)
						)
					);
				},

				interquartileRange: function(selector) {
					return this.upperquartile(selector) - this.lowerquartile(selector);
				},

				intersect: function(other, predicate) {
					var usePredicate = _isFunction(predicate),
						intersection = [],
						x,
						y,
						i = 0,
						j,
						thisDistinct = _unwrap(this.distinct(predicate)),
						otherDistinct = _unwrap(_wrap(other).distinct(predicate));

					while (i < thisDistinct[LENGTH]) {
						x = thisDistinct[i++];
						j = 0;
						while (j < otherDistinct[LENGTH]) {
							y = otherDistinct[j++];
							if (usePredicate && predicate(x, y) ||
								!usePredicate && x === y
							) {
								intersection[PUSH](x);
								break;
							}
						}
					}
					return _wrap(intersection);
				},

				join: function() {
					return ARRAY_PROTOTYPE.join[APPLY](this._, arguments);
				},

				keys: function() {
					var keys = [],
						key;
					for (key in this._) {
						if (!_isFunction(this._[key])) {
							keys[PUSH](key);
						}
					}
					return keys;
				},

				last: function(predicate) {
					var firstIndex = _firstIndex(this._, predicate, -1);
					if (firstIndex >= 0) {
						return this._[firstIndex];
					}
					_error(_errorNoMatches);
				},

				lastIndexOf: function() {
					return ARRAY_PROTOTYPE[LASTINDEXOF][APPLY](this._, arguments);
				},

				lowerquartile: function(selector) {
					return _quartile(this, 1, selector);
				},

				map: function(selector) {
					if (_isFunction(selector)) {
						var results = [];
						this.each(function (e) {
							results[PUSH](selector(e));
						});
						return _wrap(results);
					}
					return void 0;
				},

				max: function(selector) {
					return _getTop1(0, this._, selector);
				},

				median: function(/*selector*/) {
					var middleFloor,
						middleCeil,
						sorted;

					sorted = this.clone();
					_sortAndThenSortMore(_unwrap(sorted), arguments);
					middleFloor = sorted.middle();
					middleCeil = sorted.middle(1);

					return middleFloor < middleCeil ?
							((middleFloor + middleCeil) / 2) :
							middleFloor;
				},

				middle: function(evenResolver) {
					return this._[_arrayMidpoint(this._[LENGTH] - 1, evenResolver)];
				},

				min: function(selector) {
					return _getTop1(1, this._, selector);
				},

				mode: function(selector) {
					var highestCount = 0,
						highestElements = [],
						lastElement,
						currentCount,
						selection,
						i = 0,
						element;

					selection = _unwrap((_isFunction(selector) ? this.map(selector) : this.clone())
					.ascending());

					while (i < selection[LENGTH]) {
						element = selection[i++];
						currentCount = (element === lastElement ? currentCount + 1 : 0);
						if (currentCount === highestCount) {
							highestElements[PUSH](element);
						} else if (currentCount > highestCount) {
							highestElements = [element];
							highestCount++;
						}
						lastElement = element;
					}

					return highestElements;
				},

				multiply: function(selector) {
					return this._[LENGTH] > 0 ? _total(this._, _multiply, selector) : 0;
				},

				orderBy: function(/*selectors*/) {
					_sortAndThenSortMore(this._, arguments);
				},

				outerJoin: function(other, predicate, joinedObjectCreator) {
					var joined = [],
						innerElement,
						outerElement,
						outerNotFound,
						i = 0,
						j,
						usePredicate = _isFunction(predicate);

					other = _unwrap(other);
					if (!ARRAY.isArray(other)) {
						return this.clone();
					}
					if (!_isFunction(joinedObjectCreator)) {
						joinedObjectCreator = _joinXY;
					}

					while (i < this._[LENGTH]) {
						innerElement = this._[i++];
						outerNotFound = 1;
						j = 0;
						while (j < other[LENGTH]) {
							outerElement = other[j++];
							if (usePredicate && predicate(innerElement, outerElement) ||
								!usePredicate && innerElement === outerElement
							) {
								outerNotFound = 0;
								joined[PUSH](joinedObjectCreator(innerElement, outerElement));
							}
						}

						if (outerNotFound) {
							joined[PUSH](joinedObjectCreator(innerElement, NULL));
						}
					}
					return _wrap(joined);
				},

				pack: function() {
					var i = this._[LENGTH] - 1,
						thisElement;
					while (i >= 0) {
						thisElement = this._[i];
						if (_isUndefined(thisElement) || thisElement === NULL) {
							this._[SPLICE](i, 1);
						}
						i--;
					}
					return this;
				},

				partition: function(keySelector, elementSelector, resultSelector) {
					return _wrap(_partition(this._, keySelector, elementSelector, resultSelector));
				},

				pop: function() {
					return ARRAY_PROTOTYPE.pop[APPLY](this._, arguments);
				},

				push: function() {
					return ARRAY_PROTOTYPE[PUSH][APPLY](this._, arguments);
				},

				pushRepeatedly: function(element, times) {
					for (var i = 0; i < times; i++) {
						this[PUSH](element);
					}
					return this;
				},

				range: function(startBefore, endBefore) {
					return _wrap(this._[SLICE](startBefore, endBefore));
				},

				raw: function() {
					return this._;
				},

				removeAt: function(index) {
					this._[SPLICE](index, 1);
				},

				removeRange: function(start, count) {
					this._[SPLICE](start, count);
				},

				reverse: function() {
					return _wrap(ARRAY_PROTOTYPE[REVERSE][APPLY](this._, arguments));
				},

				shift: function() {
					return ARRAY_PROTOTYPE.shift[APPLY](this._, arguments);
				},

				shuffle: function() {
					this._[SORT](_randomForSorting);
					return this;
				},

				single: function(predicate) {
					var matches = _unwrap(this);
					if (_isFunction(predicate)) {
						matches = _unwrap(_wrap(this).where(predicate));
					}

					if (matches[LENGTH] != 1) {
						_error(_errorNotExactlyOneMatch);
					}
					return matches[0];
				},

				skip: function(count) {
					return _wrap(this._[SLICE](count));
				},

				sort: function() {
					ARRAY_PROTOTYPE.sort[APPLY](this._, arguments);
					return this;
				},

				sum: function(selector) {
					return this._[LENGTH] > 0 ? _total(this._, function(runningTotal, value) {
						return runningTotal + value;
					}, selector) : 0;
				},

				take: function(count) {
					return _wrap(this._[SLICE](0, count));
				},

				toString: function() {
					return ARRAY_PROTOTYPE.toString[APPLY](this._);
				},

				union: function(other) {
					var unioned = this.clone();
					ARRAY_PROTOTYPE[PUSH][APPLY](_unwrap(unioned), _unwrap(other));
					return unioned;
				},

				unshift: function() {
					return ARRAY_PROTOTYPE.unshift[APPLY](this._, arguments);
				},

				upperquartile: function(selector) {
					return _quartile(this, 3, selector);
				},

				valueOf: function() {
					return ARRAY_PROTOTYPE.valueOf[APPLY](this._, arguments);
				},

				where: function(predicate) {
					var matches = [],
						thisElement,
						i = 0;

					while (i < this._[LENGTH]) {
						thisElement = this._[i++];
						if (predicate(thisElement)) {
							matches[PUSH](thisElement);
						}
					}
					return _wrap(matches);
				}
			};

			return Collection;

		}())
	};
}());
//For node.js
if (typeof exports === "object" && exports) {
	exports.Dinqyjs = Dinqyjs;
}
