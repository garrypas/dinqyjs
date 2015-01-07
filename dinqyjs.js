/*!Dinqyjs JavaScript Library v1.2.0
 * http://dinqyjs.com/
 *
 * Copyright (c) 2014 Garry Passarella
 * Released under the MIT license
 * http://dinqyjs.com/license
 *
 * Date: 2015-01-07
 */
var Dinqyjs = (function() {
	"use strict";
	return {
		Collection: (function() {
		    function Collection(array) {
				this._ = array || [];
		    }

			var _config = {
				ARRAY_PREALLOCATION: 64000
			},

			NULL = null,
			TRUE = true,
			FALSE = false,
			ARRAY = Array,
			ARRAY_PROTOTYPE = ARRAY.prototype,

			_arrayElementCompare = function(element) {
				return function(other) {
					return element === other;
				};
			},

			_arrayMidpoint = function(arrayLength, evenResolver) {
				var thisLength = arrayLength,
				index = thisLength /  2;
				return parseInt(evenResolver > 0 ? Math.ceil(index) : index);
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

				inner = _wrap(inner).distinct(predicate).raw();
				outer = _unwrap(outer);

				outerLength = outer.length;

				while (i < inner.length) {
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
						difference.push(x);
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

			_errorNoMatches = "Array contains no matching elements",
			_errorNotExactlyOneMatch = "Array does not contain exactly one matching element",

			_firstIndex = function(array, predicate, increments, startIndex, count) {
				var thisElement,
					thisLength = array.length;

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

			_getTop1 = function(comparison, arr, selector) {
				var thisLength = arr.length,
					extreme = thisLength > 0 ? arr[0] : NULL,
					thisElement,
					i = 0,
					useSelector = _isFunction(selector),
					elementToCheckAgainst;

				while (i < thisLength) {
					thisElement = arr[i++];
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
				return obj === void 0;
			},

			_joinXY = function(innerElement, outerElement) {
				return {
					inner: innerElement,
					outer: outerElement
				};
			},

			_loop = function(array, callback, condition, returnOn) {
				var i = 0;
				while (i < array.length) {
					if (condition(array[i], i) == returnOn) {
						return;
					}
					callback(array[i], i++);
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

				while (i < array.length) {
					thisElement = array[i++];
					p = keySelector(thisElement);
					if (useElementSelector) {
						thisElement = elementSelector(thisElement);
					}

					(partitions[p] = (p in partitions) ? partitions[p] : []).push(thisElement);
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
					return void 0;
				}

				//Set up a clone of the array
				sorted = collection.raw().concat();
				_sortAndThenSortMore(sorted, 1, selector);

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
				var selectorsLength = selectors.length,
					s,
					result,
					xSelected,
					ySelected,
					thisSelector,
					direction;

				if (!selectors || selectorsLength < 1) {
					array.sort(_defaultSort);
					return;
				}

				selectors = _isFunction(selectors) ?
					selectors = [ selectors ] :
					ARRAY_PROTOTYPE.slice.call(selectors);

				array.sort(function(x, y) {
					s = 0;
					result = 0;

					while (s < selectorsLength && result === 0) {
						thisSelector = selectors[s++];
						if (!_isFunction(thisSelector)) {
							continue;
						}

						direction = 0;
						if (s < selectorsLength &&
							typeof selectors[s] == "string" &&
							selectors[s].indexOf("des") === 0
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
				});
			},

			_total = function(array, summingFunction, selector) {
				var total = NULL,
					i = array.length - 1,
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
				return array._ ?  array : new Collection(array);
			};

			Collection.associative = function(object) {
				for (var i in object) {
					if (!_isFunction(object[i])) {
						return +object.length === 0;
					}
				}
				return FALSE;
			};

			Collection.configure = function(key, value) {
				return _config[key] = (arguments.length < 2 ? _config[key] : value);
			};

			Collection.zip = function(/*collections or arrays*/) {
				var i = 0,
					a,
					args = arguments,
					argsLength = arguments.length,
					thisArray,
					thisArrayLength,
					results = [];

				while (i < argsLength) {
					thisArray = _unwrap(args[i++]);
					thisArrayLength = thisArray.length;

					while (results.length < thisArrayLength) {
						results.push([]);
					}

					a = 0;
					while (a < thisArrayLength) {
						results[a].push(thisArray[a++]);
					}
				}

				return _wrap(results);
			};

			Collection.prototype = {
				all: function(predicate) {
					var all = TRUE,
						i = 0;

					while (i < this._.length) {
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

				orderBy: function(/*selectors*/) {
					_sortAndThenSortMore(this._, arguments);
				},

				atRandom: function() {
					return this._[Math.floor(Math.random() * this._.length)];
				},

				average: function(selector) {
					var thisLength = this._.length;
					return thisLength ? this.sum(selector) / thisLength : 0;
				},

				clear: function() {
					this._.splice(0, this._.length);
				},

				clearWhere: function(selector) {
					var i = this._.length - 1;

					while (i >= 0) {
						if (selector(this._[i])) {
							this._.splice(i, 1);
						}
						i--;
					}
					return this;
				},

				clone: function() {
					return _wrap(this._.concat());
				},

				concat: function() {
					return _wrap(ARRAY_PROTOTYPE.concat.apply(this._, arguments));
				},

				contains: function(item) {
					return this._.indexOf(item) > -1;
				},

				count: function() {
					return this._.length;
				},

				descending: function() {
					_sortAndThenSortMore(this._, arguments);
					return this.reverse();
				},

				difference: function(other, predicate) {
					var thisUnwrapped = this._;
					other = _unwrap(other);
					return _differenceXY(thisUnwrapped, other, predicate)
							.union(_differenceXY(other, thisUnwrapped, predicate));
				},

				distinct: function(predicate) {
					var usePredicate = _isFunction(predicate),
						distinct = [],
						x,
						y,
						i = 0,
						j,
						thisLength = this._.length;

					while (i < thisLength) {
						x = this._[i++];
						if (distinct.indexOf(x) == -1) {
							j = 0;
							while (j < thisLength) {
								y = this._[j];
								if (usePredicate && predicate(x, y) || !usePredicate && x === y) {
									distinct.push(x);
									break;
								}
								j++;
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
						thisLength = this._.length;
					//Touch the first element to see if this an associative array:
					if (thisLength === +thisLength && !Collection.associative(this._)) {
						while (i < thisLength) {
							callback(this._[i], i++);
						}
					} else {
						_eachKeys(this._, callback);
					}
				},

				element: function(index, item) {
					return (this._[index] = arguments.length > 1 ? item : this._[index]);
				},

				equalTo: function(other, predicate) {
					other = _unwrap(other);
					var thisLength = this._.length,
						i = thisLength - 1,
						useFunction = _isFunction(predicate),
						thisElement,
						otherElement;

					if (thisLength != other.length) {
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
					throw new Error(_errorNoMatches);
				},

				flatten: function() {
					var i = 0,
						flattened = _wrap([]),
						thisElement;
					while (i < this._.length) {
						thisElement = this._[i++];
						Collection.prototype.push.apply(
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
					this._.splice(0, this._.length);
					for (key in partition) {
						this._[key] = partition[key];
					}
					return this;
				},

				indexOf: function() {
					return ARRAY_PROTOTYPE.indexOf.apply(this._, arguments);
				},

				insert: function(index, element) {
					this._.splice(index, 0, element);
				},

				insertRange: function(index, elements) {
					var args = [ index, 0 ].concat(
						arguments.length < 3 ?
						_unwrap(elements) :
						ARRAY_PROTOTYPE.slice.call(arguments, 1)
					);
					ARRAY_PROTOTYPE.splice.apply(this._, args);
				},

				intersect: function(other, predicate) {
					var usePredicate = _isFunction(predicate),
						intersection = [],
						x,
						y,
						i = 0,
						j,
						thisDistinct = this.distinct(predicate).raw(),
						otherDistinct = _wrap(other).distinct(predicate).raw();

					while (i < thisDistinct.length) {
						x = thisDistinct[i++];
						j = 0;
						while (j < otherDistinct.length) {
							y = otherDistinct[j++];
							if (usePredicate && predicate(x, y) ||
								!usePredicate && x === y
							) {
								intersection.push(x);
								break;
							}
						}
					}
					return _wrap(intersection);
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

					while (i < this._.length) {
						innerElement = this._[i++];
						j = 0;
						while (j < other.length) {
							outerElement = other[j++];
							if (predicate(innerElement, outerElement)) {
								joined.push(joinedObjectCreator(innerElement, outerElement));
							}
						}
					}
					return _wrap(joined);
				},

				interquartileRange: function(selector) {
					return this.upperquartile(selector) - this.lowerquartile(selector);
				},

				join: function() {
					return ARRAY_PROTOTYPE.join.apply(this._, arguments);
				},

				keys: function() {
					var keys = [],
						key;
					for (key in this._) {
						if (!_isFunction(this._[key])) {
							keys.push(key);
						}
					}
					return keys;
				},

				last: function(predicate) {
					var firstIndex = _firstIndex(this._, predicate, -1);
					if (firstIndex >= 0) {
						return this._[firstIndex];
					}
					throw new Error(_errorNoMatches);
				},

				lastIndexOf: function() {
					return ARRAY_PROTOTYPE.lastIndexOf.apply(this._, arguments);
				},

				lowerquartile: function(selector) {
					return _quartile(this, 1, selector);
				},

				map: function() {
					var mapped = ARRAY_PROTOTYPE.map.apply(this._, arguments);
					return mapped ? _wrap(mapped) : void 0;
				},

				max: function(selector) {
					return _getTop1(0, this._, selector);
				},

				median: function(/*selector*/) {
					var middleFloor,
					middleCeil,
					sorted;

					sorted = this.clone();
					_sortAndThenSortMore(sorted.raw(), arguments);
					middleFloor = sorted.middle();
					middleCeil = sorted.middle(1);

					return middleFloor < middleCeil ?
					((middleFloor + middleCeil) * 0.5) :
					middleFloor;
				},

				middle: function(evenResolver) {
					return this._[_arrayMidpoint(this._.length - 1, evenResolver)];
				},

				min: function(selector) {
					return _getTop1(1, this._, selector);
				},

				multiply: function(selector) {
					return this._.length > 0 ? _total(this._, _multiply, selector) : 0;
				},

				outerJoin: function(other, predicate, joinedObjectCreator) {
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
						outerFound,
						i = 0,
						j,
						usePredicate = _isFunction(predicate);

					while (i < this._.length) {
						innerElement = this._[i++];
						outerFound = 0;
						j = 0;
						while (j < other.length) {
							outerElement = other[j++];
							if (usePredicate && predicate(innerElement, outerElement) ||
								!usePredicate && innerElement === outerElement
							) {
								outerFound = 1;
								joined.push(joinedObjectCreator(innerElement, outerElement));
							}
						}

						if (!outerFound) {
							joined.push(joinedObjectCreator(innerElement, NULL));
						}
					}
					return _wrap(joined);
				},

				pack: function() {
					var i = this._.length - 1,
						thisElement;
					while (i >= 0) {
						thisElement = this._[i];
						if (_isUndefined(thisElement) || thisElement === NULL) {
							this._.splice(i, 1);
						}
						i--;
					}
					return this;
				},

				partition: function(keySelector, elementSelector, resultSelector) {
					return _wrap(_partition(this._, keySelector, elementSelector, resultSelector));
				},

				pop: function() {
					return ARRAY_PROTOTYPE.pop.apply(this._, arguments);
				},

				push: function() {
					return ARRAY_PROTOTYPE.push.apply(this._, arguments);
				},

				pushRepeatedly: function(element, times) {
					var i = 0;
					while (i < times) {
						this.push(element);
					}
					return this;
				},

				range: function(startBefore, endBefore) {
					return _wrap(this._.slice(startBefore, endBefore));
				},

				raw: function() {
					return this._;
				},

				removeAt: function(index) {
					this._.splice(index, 1);
				},

				removeRange: function(start, count) {
					this._.splice(start, count);
				},

				reverse: function() {
					return _wrap(ARRAY_PROTOTYPE.reverse.apply(this._, arguments));
				},

				shift: function() {
					return ARRAY_PROTOTYPE.shift.apply(this._, arguments);
				},

				shuffle: function() {
					this._.sort(_randomForSorting);
					return this;
				},

				single: function(predicate) {
					var matches = _unwrap(this);
					if (_isFunction(predicate)) {
						matches = _wrap(this).where(predicate).raw();
					}

					if (matches.length != 1) {
						throw new Error(_errorNotExactlyOneMatch);
					}
					return matches[0];
				},

				skip: function(count) {
					return _wrap(this._.slice(count));
				},

				sort: function() {
					ARRAY_PROTOTYPE.sort.apply(this._, arguments);
					return this;
				},

				sum: function(selector) {
					return this._.length > 0 ? _total(this._, function(runningTotal, value) {
						return runningTotal + value;
					}, selector) : 0;
				},

				take: function(count) {
					return _wrap(this._.slice(0, count));
				},

				toString: function() {
					return ARRAY_PROTOTYPE.toString.apply(this._, arguments);
				},

				union: function(other) {
					var unioned = this.clone();
					ARRAY_PROTOTYPE.push.apply(unioned.raw(), _unwrap(other));
					return unioned;
				},

				unshift: function() {
					return ARRAY_PROTOTYPE.unshift.apply(this._, arguments);
				},

				upperquartile: function(selector) {
					return _quartile(this, 3, selector);
				},

				valueOf: function() {
					return ARRAY_PROTOTYPE.valueOf.apply(this._, arguments);
				},

				where: function(predicate) {
					var matches = [],
						thisElement,
						i = 0;

					while (i < this._.length) {
						thisElement = this._[i++];
						if (predicate(thisElement)) {
							matches.push(thisElement);
						}
					}
					return _wrap(matches);
				}
			};

			//Array polyfills:
			if (!ARRAY_PROTOTYPE.indexOf) {
				ARRAY_PROTOTYPE.indexOf = function(element, start) {
					return _firstIndex(this, _arrayElementCompare(element), 1, start);
				};
			}

			if (!ARRAY_PROTOTYPE.lastIndexOf) {
				ARRAY_PROTOTYPE.lastIndexOf = function(element, start) {
					return _firstIndex(this, _arrayElementCompare(element), -1, start);
				};
			}

			if (!ARRAY_PROTOTYPE.map) {
				ARRAY_PROTOTYPE.map = function(callback) {
					var thisLength = this.length,
						results = new ARRAY(thisLength > _config.ARRAY_PREALLOCATION ?
							0 :
							thisLength),
						i = 0;

					if (!_isFunction(callback)) {
						return void 0;
					}

					while (i < thisLength) {
						results[i] = callback(this[i++]);
					}
					return results;
				};
			}

			if (!ARRAY.isArray) {
				ARRAY.isArray = function(arg) {
					return Object.prototype.toString.call(arg) == "[object Array]";
				};
			}

		    return Collection;

		}())
	};
}());
//For node.js
if (typeof exports === "object" && exports) {
  exports.Dinqyjs = Dinqyjs;
}
