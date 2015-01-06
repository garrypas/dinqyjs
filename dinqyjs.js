/*!Dinqyjs JavaScript Library v1.2.0
 * http://dinqyjs.com/
 *
 * Copyright (c) 2014 Garry Passarella
 * Released under the MIT license
 * http://dinqyjs.com/license
 *
 * Date: 2015-01-03
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

			_arrayElementCompare = function(element) {
				return function(other) {
					return element === other;
				};
			},

			_arrayPrototype = Array.prototype,

			_arrayMidpoint = function(arrayLength, evenResolver) {
				var thisLength = arrayLength,
				index = thisLength /  2;
				return parseInt(evenResolver > 0 ? Math.ceil(index) : index);
			},

			_defaultSort = function(x, y) {
				return x > y ? 1 : (x < y ? -1 : 0);
			},

			_defaultSortDesc = function(x, y) {
				return x > y ? -1 : (x < y ? 1 : 0);
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
					while (j < outerLength)
					{
						y = outer[j];
						if(usePredicate && predicate(x, y) || !usePredicate && x === y) {
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
					if (comparison ? elementToCheckAgainst <= extreme : elementToCheckAgainst >= extreme) {
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

			_minitabVariation = function(q, n) {
				return 1 / 4 * (q * n + q);
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
				if (collection.count() < 1) {
					return void 0;
				}
				var useSelector = _isFunction(selector),
				sorted,
				quartilePosition,
				lowerIndex,
				upperIndex,
				lowerElement,
				upperElement;

				//Set up a clone of the array
				sorted = collection.clone();
				_sortAndThenSortMore(sorted.raw(), 1, selector);
				sorted = sorted.raw();

				quartilePosition = _minitabVariation(q, collection.count());
				lowerIndex = parseInt(quartilePosition);
				upperIndex = parseInt(Math.ceil(quartilePosition));
				lowerElement = useSelector ? selector(sorted[lowerIndex - 1]) : sorted[lowerIndex - 1];
				upperElement = useSelector ? selector(sorted[upperIndex - 1]) : sorted[upperIndex - 1];

				return upperIndex > lowerIndex ? lowerElement : (lowerElement + upperElement) / 2;
			},

			_sortAndThenSortMore = function(array, selectors) {
				if (!selectors || selectors.length < 1) {
					array.sort(_defaultSort);
				} else {
					if (_isFunction(selectors)) {
						selectors = [ selectors ];
					} else {
						selectors = _arrayPrototype.slice.call(selectors);
					}
					array.sort(function(x, y) {
						var s = 0,
							result = 0,
							xSelected,
							ySelected,
							thisSelector,
							nextSelector,
							direction;
						while (s < selectors.length && result === 0) {
							thisSelector = selectors[s++];
							if (!_isFunction(thisSelector)) {
								continue;
							}

							direction = 0;
							if (s < selectors.length) {
								nextSelector = selectors[s];
								if (typeof nextSelector == "string") {
									direction = nextSelector.indexOf("des") === 0 ? 1 : 0;
								}
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
				}
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
					var total = 0,
						i = 0,
						thisLength = this._.length;

					while (i < thisLength) {
						total += selector ? selector(this._[i]) : this._[i];
						i++;
					}
					return thisLength ? (total / thisLength) : 0;
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
					return _wrap(_arrayPrototype.concat.apply(this._, arguments));
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
					other = _unwrap(other);
					var thisUnwrapped = this._;
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
					var i = 0;
					while (i < this._.length) {
						callback(this._[i]);
						if (stoppingCondition(this._[++i])) {
							return;
						}
					}
				},

				doWhile: function(callback, condition) {
					var i = 0;
					while (i < this._.length) {
						if (!condition(this._[i], i)) {
							return;
						}
						callback(this._[i], i++);
					}
				},

				each: function(callback) {
					var i = 0,
						thisLength = this._.length;
					//Touch the first element to see if this an associative array:
					if (thisLength === +thisLength && !Collection.associative(this._)) {
						while (i < thisLength) {
							callback(this._[i], i);
							i++;
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
						flattened = new Collection(),
						thisElement;
					while (i < this._.length) {
						thisElement = this._[i++];
						Collection.prototype.push.apply(
							flattened, Array.isArray(thisElement) ?
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
					return _arrayPrototype.indexOf.apply(this._, arguments);
				},

				insert: function(index, element) {
					this._.splice(index, 0, element);
				},

				insertRange: function(index, elements) {
					var args = [ index, 0 ].concat(
						arguments.length < 3 ?
						_unwrap(elements) :
						_arrayPrototype.slice.call(arguments, 1)
					);
					_arrayPrototype.splice.apply(this._, args);
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
					if (!Array.isArray(other)) {
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

				join: function() {
					return _arrayPrototype.join.apply(this._, arguments);
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
					return _arrayPrototype.lastIndexOf.apply(this._, arguments);
				},

				lowerquartile: function(selector) {
					return _quartile(this, 1, selector);
				},

				map: function() {
					var mapped = _arrayPrototype.map.apply(this._, arguments);
					return mapped ? _wrap(mapped) : void 0;
				},

				max: function(selector) {
					return _getTop1(0, this._, selector);
				},

				middle: function(evenResolver) {
					return this._[_arrayMidpoint(this._.length - 1, evenResolver)];
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

				min: function(selector) {
					return _getTop1(1, this._, selector);
				},

				multiply: function(selector) {
					return this._.length > 0 ? _total(this._, function(runningTotal, value) {
						return runningTotal * value;
					}, selector) : 0;
				},

				outerJoin: function(other, predicate, joinedObjectCreator) {
					other = _unwrap(other);
					if (!Array.isArray(other)) {
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
					return _arrayPrototype.pop.apply(this._, arguments);
				},

				push: function() {
					return _arrayPrototype.push.apply(this._, arguments);
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
					return _wrap(_arrayPrototype.reverse.apply(this._, arguments));
				},

				shift: function() {
					return _arrayPrototype.shift.apply(this._, arguments);
				},

				//Use Fisher-Yates shuffle algorithm
				shuffle: function() {
					var i = this._.length - 1,
						thisElement,
						random;

					while (i >= 0) {
                        random = Math.floor(Math.random() * this._.length);
						thisElement = this._[i];
						this._[i--] = this._[random];
						this._[ random ] = thisElement;
       				}
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
					_arrayPrototype.sort.apply(this._, arguments);
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
					return _arrayPrototype.toString.apply(this._, arguments);
				},

				union: function(other) {
					var unioned = this.clone();
					_arrayPrototype.push.apply(unioned.raw(), _unwrap(other));
					return unioned;
				},

				unshift: function() {
					return _arrayPrototype.unshift.apply(this._, arguments);
				},

				upperquartile: function(selector) {
					return _quartile(this, 3, selector);
				},

				valueOf: function() {
					return _arrayPrototype.valueOf.apply(this._, arguments);
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
			if (!_arrayPrototype.indexOf) {
				_arrayPrototype.indexOf = function (element, start) {
					return _firstIndex(this, _arrayElementCompare(element), 1, start);
				};
			}

			if (!_arrayPrototype.lastIndexOf) {
				_arrayPrototype.lastIndexOf = function(element, start) {
					return _firstIndex(this, _arrayElementCompare(element), -1, start);
				};
			}

			if (!_arrayPrototype.map) {
				_arrayPrototype.map = function(callback) {
					var thisLength = this.length,
						results = new Array(thisLength > _config.ARRAY_PREALLOCATION ?
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

			if (!Array.isArray) {
				Array.isArray = function(arg) {
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
