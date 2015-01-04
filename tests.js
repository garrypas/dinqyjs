	var Collection = Dinqyjs.Collection;

	var createJoinSets = function () {
		var set1Object1 = { key : 1, value : "11" };
		var set1Object2 = { key : 2, value : "12" };
		var set1Object3 = { key : 3, value : "13" };
		var set2Object1 = { key : 2, text  : "22" };
		var set2Object2 = { key : 3, text  : "23" };
		var set2Object3 = { key : 4, text  : "24" };

		var set1 = new Collection([set1Object1, set1Object2, set1Object3]);
		var set2 = new Collection([set2Object1, set2Object2, set2Object3]);

		return {
			inner : set1,
			outer : set2
		};
	};

	var elementsMatch = function(collection1, collection2) {
		var match = true;
		collection1.each(function(e, index) {
			match &= collection2.element(index) === e;
		});
		match &= collection1.count() === collection2.count();
		return (match ? true : false);
	};

	describe("Lambdascript tests", function() {
		var list;
		beforeEach(function() {
			list = new Collection([1,2,3,4,5,6,7,8,9,10]);
		});

		it("all() -> all match predicate", function() {
			var allBelow11 = function(element) {
				return element < 11;
			};
			expect(list.all(allBelow11)).toBe(true);
		});

		it("all() -> all doesn't match predicate", function() {
			var allBelow11 = function(element) {
				return element < 10;
			};
			expect(list.all(allBelow11)).toBe(false);
		});

		it("any() -> any matches predicate", function() {
			var findNo10 = function(element) {
				return element === 10;
			};
			expect(list.any(findNo10)).toBe(true);
		});

		it("any() -> any doesn't match predicate", function() {
			var findNo10 = function(element) {
				return element === 11;
			};
			expect(list.any(findNo10)).toBe(false);
		});

		it("any() -> any doesn't match predicate", function() {
			var findNo10 = function(element) {
				return element === 11;
			};
			expect(list.any(findNo10)).toBe(false);
		});

		it("ascending() -> sorts the list in ascending order", function() {
			var thisList = new Collection([3,1,2]);
			thisList.ascending();
			expect(thisList.raw()).toEqual([1,2,3]);
		});

		it("ascending() -> uses selector", function() {
			var thisList = new Collection([{x : 3}, {x : 1}, {x : 2}]);
			thisList.ascending(function(element){
				return element.x; 
			});
			expect(thisList.element(0).x).toEqual(1);
			expect(thisList.element(1).x).toEqual(2);
			expect(thisList.element(2).x).toEqual(3);
		});

		it("ascending() -> uses sort by ... then ... method", function() {
			var thisList = new Collection([{x : 1, y : 2}, {x : 1, y : 3}, {x : 1, y : 1}]);
			thisList.ascending(function(element){
				return element.x;
			}, function(element) {
				return element.y;
			});
			expect(thisList.element(0).y).toEqual(1);
			expect(thisList.element(1).y).toEqual(2);
			expect(thisList.element(2).y).toEqual(3);
		});

		it('associative() -> true if associative array', function() {
			var associativeArray = [];
			associativeArray["a"] = 1;
			var isAssociative = Collection.associative(associativeArray);
			expect(isAssociative).toBe(true);
		});

		it('associative() -> false if proper array (empty)', function() {
			var array = [];
			var isAssociative = Collection.associative(array);
			expect(isAssociative).toBe(false);
		});

		it('associative() -> false if proper array (filled)', function() {
			var array = [1];
			var isAssociative = Collection.associative(array);
			expect(isAssociative).toBe(false);
		});

		it('associative() -> false if object', function() {
			var array = [1];
			var isAssociative = Collection.associative({});
			expect(isAssociative).toBe(false);
		});

		it("atRandom() -> chooses an element at random", function() {
			expect(typeof list.atRandom()).toBe('number');
		});

		it("average() -> calculates average (no selector)", function() {
			var avg = list.average();
			expect(avg).toBe(55 / 10);
		});

		it("average() -> calculates average (with selector)", function() {
			var avg = list.average(function(element) {
				return element * 2;
			});
			expect(avg).toBe(110 / 10);
		});

		it("average() -> avoids divisions by zero", function() {
			var avg = new Collection([]).average();
			expect(avg).toBe(0);
		});

		it("clear() -> clears", function() {
			list.clear();
			expect(list.raw().length).toBe(0);
		});

		it("clearWhere() -> clears matches", function () {
			expect(list.clearWhere(function(element) {
				return element > 5;
			}).raw()).toEqual([1,2,3,4,5]);
		});

		it("clone() -> copies all", function() {
			var clone = list.clone();
			expect(clone.count()).toBe(10);
			expect(clone.raw()).toEqual(list.raw());
		});

		it("clone() -> clones into new Collection", function() {
			var clone = list.clone();
			clone.raw().push(11);
			expect(list.count()).toBe(10);
		});

		it("concat() -> concats into new Collection", function() {
			var thisList = new Collection([1,2,3]);
			var concated = thisList.concat(4, 5);
			expect(concated.raw()).toEqual([1,2,3,4,5]);
		});

		it("configure() -> return array preallocation", function() {
			var value = Collection.configure('ARRAY_PREALLOCATION');
			expect(typeof value).toBe('number');
		});

		it("configure() -> changes array preallocation", function() {
			var oldValue = Collection.configure('ARRAY_PREALLOCATION');
			Collection.configure('ARRAY_PREALLOCATION', oldValue + 1);
			var newValue = Collection.configure('ARRAY_PREALLOCATION');
			expect(newValue).toBe(oldValue + 1);
		});

		it("contains() -> true when list contains element", function() {
			expect(list.contains(1)).toBe(true);
		});

		it("contains() -> false when list doesn't contain element", function() {
			expect(list.contains(11)).toBe(false);
		});

		it("count() -> to equal length", function() {
			expect(list.count()).toBe(list.count());
		});

		it("descending() -> sorts the list in ascending order", function() {
			var thisList = new Collection([3,1,2]);
			thisList.descending();
			expect(thisList.raw()).toEqual([3,2,1]);
		});

		it("descending() -> uses selector", function() {
			var thisList = new Collection([{x : 3}, {x : 1}, {x : 2}]);
			thisList.descending(function(element){
				return element.x; 
			});
			expect(thisList.element(0).x).toEqual(3);
			expect(thisList.element(1).x).toEqual(2);
			expect(thisList.element(2).x).toEqual(1);
		});

		it("descending() -> uses sort by ... then ... method", function() {
			var thisList = new Collection([{x : 1, y : 2}, {x : 1, y : 3}, {x : 1, y : 1}]);
			thisList.descending(function(element){
				return element.x;
			}, function(element) {
				return element.y;
			});
			expect(thisList.element(0).y).toEqual(3);
			expect(thisList.element(1).y).toEqual(2);
			expect(thisList.element(2).y).toEqual(1);
		});

		it("difference() -> diffs", function() {
			var list1 = new Collection([1, 2, 3]);
			var list2 = [2, 3, 4];
			expect(list1.difference(list2).raw()).toEqual([1, 4]);
		});

		it("difference() -> diffs without duplication", function() {
			var list1 = new Collection([1, 2, 3, 1, 3, 1]);
			var list2 = [2, 3, 4, 3, 3, 4];
			expect(list1.difference(list2).raw()).toEqual([1, 4]);
		});

		it("difference() -> diffs (with predicate)", function() {
			var list1 = new Collection([1, 2, 3]);
			var list2 = [2, 3, 4];
			expect(list1.difference(list2, function(x, y) {
				return x === y && x != 4 && y != 4;
			}).raw()).toEqual([1]);
		});

		it("difference() -> diffs without duplication (with predicate)", function() {
			var list1 = new Collection([1, 2, 3, 3]);
			var list2 = [2, 3, 4, 3, 3];
			expect(list1.difference(list2, function(x, y) {
				return x === y && x != 4 && y != 4;
			}).raw()).toEqual([1]);
		});

		it("distinct() -> removes duplicates", function() {
			expect(new Collection([1,2,2,3]).distinct().raw()).toEqual([1,2,3]);
		});

		it("distinct() -> removes duplicates (with predicate)", function() {
			expect(new Collection([1,2,2,3]).distinct(function(x, y) 
			{
				return x === y && x != 2 && y != 2;
			}).raw()).toEqual([1, 3]);
		});

		it("doWhile() -> stops on stopping condition", function() {
			var elements = [];
			list.doWhile(function(element) {
				elements.push(element);
			}, function(element) {
				return element <= 3;
			});
			expect(elements).toEqual([1,2,3]);
		});

		it("doWhile() -> sends index to callback and stopping condition", function() {
			var firstIndex;
			list.doWhile(function(element, i) {
				firstIndex = i;
			}, function(element, i) {
				return i <= 1;
			});
			expect(firstIndex).toEqual(1);
		});

		it("doUntil() -> stops on stopping condition", function() {
			var elements = [];
			list.doUntil(function(element) {
				elements.push(element);
			}, function(element) {
				return element > 5;
			});
			expect(elements).toEqual([1,2,3,4,5]);
		});

		it("each() -> enumerates", function() {
			var elements = [];
			list.each(function(element) {
				elements.push(element);
			});
			expect(elements).toEqual(list.raw());
		});

		it("each() -> enumerates objects", function() {
			var elements = [];
			var keys = [];
			var obj = { x : 1, y : 2};
			new Collection(obj).each(function(element, key) {
				elements.push(element);
				keys.push(key);
			});
			expect(elements).toEqual([1,2]);
			expect(keys).toEqual(['x','y']);
		});


		it("each() -> to enumerate associative array", function() {
			var elements = [];
			var keys = [];
			var keyArray = new Array();
			keyArray["one"]  = 1;
			keyArray["two"]  = 2;
			keyArray["three"]  = 3;

			new Collection(keyArray).each(function(element, key) {
				elements.push(element);
				keys.push(key);
			});
			expect(elements).toEqual([1,2,3]);
			expect(keys).toEqual(['one','two','three']);
		});

		it("each() -> sends back all indexes", function() {
			var count = 0;
			list.each(function(element, i) {
				count += i;
			});
			expect(count).toEqual(45);
		});

		it("element() -> gets element", function() {
			expect(new Collection([1,2,3]).element(1)).toBe(2);
		});

		it("element() -> gets element by key", function() {
			var array = [];
			array.push(1);
			array['key'] = 99;
			expect(new Collection(array).element('key')).toBe(99);
		});

		it("element() -> sets element", function() {
			list.element(1, 99);
			expect(list.element(1)).toBe(99);
		});

		it("element() -> returns newly set element", function() {
			expect(new Collection([1,2,3]).element(1, 99)).toBe(99);
		});

		it("equalTo() -> returns true if all elements are equal", function() {
			var array = new Collection([1, 2, 3]);
			var other = [1, 2, 3];
			expect(array.equalTo(other)).toBe(true);
		});

		it("equalTo() -> returns false if all elements are not equal", function() {
			var array = new Collection([1, 2, 3]);
			var other = [1, 2, 4];
			expect(array.equalTo(other)).toBe(false);
		});

		it("equalTo() -> returns false if other is larger", function() {
			var array = new Collection([1, 2, 3]);
			var other = [1, 2, 3, 4];
			expect(array.equalTo(other)).toBe(false);
		});

		it("equalTo() -> returns false if other is smaller", function() {
			var array = new Collection([1, 2, 3]);
			var other = [1, 2];
			expect(array.equalTo(other)).toBe(false);
		});

		it("equalTo() -> uses equality comparer", function() {
			var array = new Collection([1, 2, 3]);
			var other = [true, 2, 3];
			expect(array.equalTo(other, function(x, y) {
				return x == y;
			})).toBe(true);
		});

		it("findIndex() -> finds index", function() {
			expect(list.findIndex(function(element) {
				return element === 2;
			})).toBe(1);
		});

		it("findIndex() -> returns -1 when no match is found", function() {
			expect(list.findIndex(function(element) {
				return element === 999;
			})).toBe(-1);
		});

		it("findIndex() -> doesn't find index before of range", function() {
			expect(list.findIndex(function(element) {
				return element === 2;
			}, 0, 1)).toBe(-1);
		});

		it("findIndex() -> doesn't find index beyond of range", function() {
			expect(list.findIndex(function(element) {
				return element === 2;
			}, 2, 10000000000)).toBe(-1);
		});

		it("findIndex() -> finds first index when duplicates", function() {
			list.push(2);
			expect(list.findIndex(function(element) {
				return element === 2;
			})).toBe(1);
		});

		it("findIndex() -> returns -1 when first argument is not a function", function() {
			expect(list.findIndex(1)).toBe(-1);
		});

		it("findLastIndex() -> finds last index", function() {
			expect(list.findLastIndex(function(element) {
				return element === 2;
			})).toBe(1);
		});

		it("findLastIndex() -> returns -1 when no match is found", function() {
			expect(list.findLastIndex(function(element) {
				return element === 999;
			})).toBe(-1);
		});

		it("findLastIndex() -> doesn't find index before of range", function() {
			expect(list.findLastIndex(function(element) {
				return element === 2;
			}, 0, 10)).toBe(-1);
		});

		it("findLastIndex() -> doesn't find index beyond of range", function() {
			expect(list.findLastIndex(function(element) {
				return element === 2;
			}, 2, 1)).toBe(-1);
		});

		it("findLastIndex() -> finds last index when duplicates", function() {
			list.push(2);
			expect(list.findLastIndex(function(element) {
				return element === 2;
			}, 10, 11)).toBe(10);
		});

		it("findLastIndex() -> returns -1 when first argument is not a function", function() {
			expect(list.findLastIndex(1)).toBe(-1);
		});

		it("first() -> returns first element (when no predicate)", function() {
			expect(list.first()).toEqual(1);
		});

		it("first() -> returns first match (when predicate)", function() {
			expect(list.first(function(element) {
				return element > 1;
			})).toEqual(2);
		});

		it("first() -> throws exception if no match (when predicate)", function() {
			expect(function() {
				list.first(function(element) {
					return element > 10;
				});
			}).toThrow(new Error('Array contains no matching elements'));
		});

		it("first() -> throws exception if list is empty", function() {
			expect(function() {
				new Collection().first();
			}).toThrow(new Error('Array contains no matching elements'));
		});

		it("first() -> throws exception if list is empty (when predicate)", function() {
			expect(function() {
				new Collection().first(function(){ return true; });
			}).toThrow(new Error('Array contains no matching elements'));
		});

		it("flatten() -> flattens elements", function() {
			var nonFlat = [ [1,2,3], 4, [5,6], 7, 8, [9, 10] ];
			expect(new Collection(nonFlat).flatten().raw()).toEqual(list.raw());
		});

		it("groupBy() -> groups", function() {
			var predicate = function(e) {
				return (e - 1) % 3;
			};
			var grouped = list.groupBy(predicate);
			expect(grouped.element(0)).toEqual([1, 4, 7, 10]);
			expect(grouped.element(1)).toEqual([2, 5, 8]);
			expect(grouped.element(2)).toEqual([3, 6, 9]);
		});

		it("groupBy() -> groups boolean", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var grouped = list.groupBy(predicate);
			expect(grouped.element(true)).toEqual([1, 3, 5, 7, 9]);
			expect(grouped.element(false)).toEqual([2, 4, 6, 8, 10]);
		});

		it("groupBy() -> groups correct length", function() {
			var predicate = function(e) {
				return e % 3;
			};
			var grouped = list.groupBy(predicate);
			expect(grouped.count()).toBe(3);
		});

		it("groupBy() -> groups uses element selector", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var elementSelector = function(e) {
				return e * 2;
			};
			var grouped = list.groupBy(predicate, elementSelector);
			expect(grouped.element(true)).toEqual([2, 6, 10, 14, 18]);
			expect(grouped.element(false)).toEqual([4, 8, 12, 16, 20]);
		});

		it("groupBy() -> groups uses result selector", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var resultSelector = function(e, key) {
				e.key = key;
				for(var i = 0; i < e.length; i++) {
					e[i] *= 2;
				}
				return e;
			};
			var grouped = list.groupBy(predicate, null, resultSelector);
			expect(elementsMatch(new Collection(grouped.element(true)), new Collection([2, 6, 10, 14, 18]))).toBe(true);
			expect(elementsMatch(new Collection(grouped.element(false)), new Collection([4, 8, 12, 16, 20]))).toBe(true);
			expect(grouped.element(true).key).toEqual('true');
			expect(grouped.element(false).key).toEqual('false');
		});

		it("groupBy() -> modifies original", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var grouped = list.groupBy(predicate);
			expect(grouped.raw()).toEqual(list.raw());
		});

		it("indexOf() -> returns the index of an element", function() {
			expect(list.indexOf(2)).toBe(1);
		});

		it("indexOf() -> returns -1 when not found", function() {
			expect(list.indexOf(11)).toBe(-1);
		});

		it("indexOf() -> returns -1 when outside search range", function() {
			expect(list.indexOf(2, 2)).toBe(-1);
		});

		it("indexOf() -> returns -1 when inside search range", function() {
			expect(list.indexOf(2, 1)).toBe(1);
		});

		it("indexOf() -> returns first index when duplicates", function() {
			list.push(2);
			expect(list.indexOf(2)).toBe(1);
		});


		it("innerJoin() -> joins", function() {
			var sets = createJoinSets();
			var joined = sets.inner.innerJoin(sets.outer, function(inner, outer) {
				return inner.key === outer.key;
			}).raw();
			expect(joined.length).toBe(2);
			expect(joined[0].inner.key).toBe(2);
			expect(joined[0].inner.value).toBe("12");
			expect(joined[0].outer.text).toBe("22");
			expect(joined[1].inner.key).toBe(3);
			expect(joined[1].inner.value).toBe("13");
			expect(joined[1].outer.text).toBe("23");
		});

		it("innerJoin() -> joins (with object creator)", function() {
			var sets = createJoinSets();
			var joined = sets.inner.innerJoin(sets.outer, function(inner, outer) {
				return inner.key === outer.key;
			}, function(matchedInner, matchedOuter) {
				return {
					key : matchedInner.key,
					value : matchedInner.value,
					text : matchedOuter.text
				};
			}).raw();

			expect(joined.length).toBe(2);
			expect(joined[0].key).toBe(2);
			expect(joined[0].value).toBe("12");
			expect(joined[0].text).toBe("22");
			expect(joined[1].key).toBe(3);
			expect(joined[1].value).toBe("13");
			expect(joined[1].text).toBe("23");
		});

		it("innerJoin() -> joins with duplicate inners", function() {
			var sets = createJoinSets();
			sets.outer.push({
				key : 2,
				text : 'another element with key 2'
			});

			var joined = sets.inner.innerJoin(sets.outer, function(inner, outer) {
				if(!outer) {
					return false;
				} else {
					return inner.key === outer.key;
				}
			}).raw();

			expect(joined.length).toBe(3);
			expect(joined[0].inner.key).toBe(2);
			expect(joined[0].inner.value).toBe("12");
			expect(joined[0].outer.text).toBe("22");
			expect(joined[1].inner.key).toBe(2);
			expect(joined[1].inner.value).toBe("12");
			expect(joined[1].outer.text).toBe('another element with key 2');
			expect(joined[2].inner.key).toBe(3);
			expect(joined[2].inner.value).toBe("13");
			expect(joined[2].outer.text).toBe("23");
		});

		it("innerJoin() -> returns clone of self when other item is not collection/array", function() {
			var sets = createJoinSets();
			expect(list.innerJoin(1).raw()).toEqual(list.raw());
		});

		it("isArray() -> true when it is an array", function() {
			expect(Array.isArray([])).toBe(true);
		});

		it("insert() -> inserts at index", function() {
			list.insert(1, 100);
			expect(list.raw()).toEqual([1,100,2,3,4,5,6,7,8,9,10]);
		});

		it("insertRange() -> inserts range at index", function() {
			list.insertRange(1, [100, 101]);
			expect(list.raw()).toEqual([1,100,101,2,3,4,5,6,7,8,9,10]);
		});

		it("insertRange() -> inserts arguments", function() {
			list.insertRange(1, 100, 101);
			expect(list.raw()).toEqual([1,100,101,2,3,4,5,6,7,8,9,10]);
		});

		it("interset() -> intersects", function() {
			var list1 = new Collection([1, 2, 3]);
			var list2 = [2, 3, 4];
			expect(list1.intersect(list2).raw()).toEqual([2, 3]);
		});

		it("interset() -> intersects without duplication", function() {
			var list1 = new Collection([1, 2, 3, 3]);
			var list2 = [2, 3, 4, 3, 3];
			expect(list1.intersect(list2).raw()).toEqual([2, 3]);
		});

		it("interset() -> intersects (with predicate)", function() {
			var list1 = new Collection([1, 2, 3]);
			var list2 = [2, 3, 4];
			expect(list1.intersect(list2, function(x, y) {
				return x === y && x != 2 && y != 2;
			}).raw()).toEqual([3]);
		});

		it("interset() -> intersects without duplication (with predicate)", function() {
			var list1 = new Collection([1, 2, 3, 3]);
			var list2 = [2, 3, 4, 3, 3];
			expect(list1.intersect(list2, function(x, y) {
				return x === y && x != 2 && y != 2;
			}).raw()).toEqual([3]);
		});

		it('join() -> Joins with separator', function() {
			var arr = new Collection([1, 2]);
			expect(arr.join('/')).toBe('1/2');
		});

		it("keys() -> gets keys", function() {
			var keyList = { 'a' : 1, 'b' : 2 };
			keyList[3] = 3333;
			expect(new Collection(keyList).keys()).toContain('3');
			expect(new Collection(keyList).keys()).toContain('a');
			expect(new Collection(keyList).keys()).toContain('b');
			expect(new Collection(keyList).keys().length).toBe(3);
		});

		it("keys() -> ignores functions", function() {
			var keyList = { 'a' : 1, 'b' : 2 , 'f' : function () { } };
			expect(new Collection(keyList).keys()).toContain('a');
			expect(new Collection(keyList).keys()).toContain('b');
			expect(new Collection(keyList).keys().length).toBe(2);
		});

		it("last() -> returns last element (when no predicate)", function() {
			expect(list.last()).toEqual(10);
		});

		it("last() -> returns last match (when predicate)", function() {
			expect(list.last(function(element) {
				return element > 1;
			})).toEqual(10);
		});

		it("last() -> throws exception if no match (when predicate)", function() {
			expect(function() {
				list.last(function(element) {
					return element > 10;
				});
			}).toThrow(new Error('Array contains no matching elements'));
		});

		it("last() -> throws exception if list is empty", function() {
			expect(function() {
				new Collection().last();
			}).toThrow(new Error('Array contains no matching elements'));
		});

		it("last() -> throws exception if list is empty (when predicate)", function() {
			expect(function() {
				new Collection().last(function(){ return true; });
			}).toThrow(new Error('Array contains no matching elements'));
		});

		it("lastIndexOf() -> returns the index of an element", function() {
			expect(list.raw().lastIndexOf(2)).toBe(1);
		});

		it("lastIndexOf() -> returns -1 when not found", function() {
			expect(list.raw().lastIndexOf(11)).toBe(-1);
		});

		it("lastIndexOf() -> returns -1 when outside search range", function() {
			expect(list.raw().lastIndexOf(2, 0)).toBe(-1);
		});

		it("lastIndexOf() -> returns -1 when inside search range", function() {
			expect(list.raw().lastIndexOf(2, 1)).toBe(1);
		});

		it("lastIndexOf() -> returns last index when duplicates", function() {
			list.push(2);
			expect(list.raw().lastIndexOf(2)).toBe(10);
		});

		it("max() -> returns the maximum value", function() {
			expect(list.max()).toBe(10);
		});

		it("map() -> map (with predicate)", function() {
			var selection = list.map(function(element) {
				return element + 10;
			}).raw();
			expect(selection).toEqual([ 11,12,13,14,15,16,17,18,19,20 ]);
		});

		it("map() -> returns undefined", function() {
			var selection = list.map();
			expect(selection).toEqual(undefined);
		});

		it("map() -> projects into a new Collection", function() {
			var selection = list.map(function(element) {
				return element > 5;
			}).raw();
			expect(list.count()).toBe(10);
		});

		it("max() -> no items return null", function() {
			expect(new Collection().max()).toBeNull();
		});

		it("max() -> works with selector", function() {
			expect(list.max(function(e) {
				return e;
			})).toBe(10);
		});

		it("middle() -> gets the middle value (even number of elements)", function() {
			expect(list.middle()).toBe(5);
		});

		it("middle() -> gets the middle value (even number of elements, resolve upwards)", function() {
			expect(list.middle(1)).toBe(6);
		});

		it("middle() -> gets the middle value (odd number of elements)", function() {
			expect(new Collection([1,2,3]).middle()).toBe(2);
		});

		it("middle() -> gets undefined when no elements", function() {
			expect(new Collection().middle()).toBe(void 0);
		});

		it("median() -> gets middle value in odd numbered array", function() {
			expect(new Collection([1,3,2,4]).median()).toBe(2.5);
		});

		it("median() -> (x + y) / 2 in even numbered array", function() {
			expect(new Collection([1,3,5,2,4]).median()).toBe(3);
		});

		it("min() -> returns the minimum value", function() {
			expect(list.min()).toBe(1);
		});

		it("min() -> no items return null", function() {
			expect(new Collection().min()).toBeNull();
		});

		it("min() -> works with selector", function() {
			expect(list.min(function(e) {
				return e;
			})).toBe(1);
		});

		it("multiply() -> no elements returns zero", function () {
			expect(new Collection([]).multiply()).toBe(0);
		});

		it("multiply() -> sums", function () {
			expect(new Collection([2,3,4]).multiply()).toBe(24);
		});

		it("multiply() -> sums (when predicate)", function () {
			expect(new Collection([2,3,4]).multiply(function(element) {
				return element + 1;
			})).toBe(60);
		});

		it("outerJoin() -> joins with nulls", function() {
			var sets = createJoinSets();

			var joined = sets.inner.outerJoin(sets.outer, function(inner, outer) {
				if(!outer) {
					return false;
				} else {
					return inner.key === outer.key;
				}
			}).raw();

			expect(joined.length).toBe(3);
			expect(joined[0].inner.key).toBe(1);
			expect(joined[0].inner.value).toBe("11");
			expect(joined[0].outer).toBe(null);
			expect(joined[1].inner.key).toBe(2);
			expect(joined[1].inner.value).toBe("12");
			expect(joined[1].outer.text).toBe("22");
			expect(joined[2].inner.key).toBe(3);
			expect(joined[2].inner.value).toBe("13");
			expect(joined[2].outer.text).toBe("23");
		});

		it("outerJoin() -> joins without predicate", function() {
			var inner = new Collection([1, 2, 3]);
			var outer = new Collection([2, 2, 3, 4]);

			var joined = inner.outerJoin(outer).raw();

			expect(joined.length).toBe(4);
			expect(joined[0].inner).toBe(1);
			expect(joined[0].outer).toBeNull();
			expect(joined[1].inner).toBe(2);
			expect(joined[1].outer).toBe(2);
			expect(joined[2].inner).toBe(2);
			expect(joined[2].outer).toBe(2);
			expect(joined[3].inner).toBe(3);
			expect(joined[3].outer).toBe(3);
		});

		it("outerJoin() -> joins with null sent to creator (with object creator)", function() {
			var sets = createJoinSets();

			var joined = sets.inner.outerJoin(sets.outer, function(inner, outer) {
				return inner.key === outer.key;
			}, function(matchedInner, matchedOuter) {
				return {
					key : matchedInner.key,
					value : matchedInner.value,
					text : matchedOuter ? matchedOuter.text : "default"
				};
			}).raw();

			expect(joined.length).toBe(3);
			expect(joined[0].key).toBe(1);
			expect(joined[0].value).toBe("11");
			expect(joined[0].text).toBe("default");
			expect(joined[1].key).toBe(2);
			expect(joined[1].value).toBe("12");
			expect(joined[1].text).toBe("22");
			expect(joined[2].key).toBe(3);
			expect(joined[2].value).toBe("13");
			expect(joined[2].text).toBe("23");
		});

		it("outerJoin() -> joins with duplicate inners", function() {
			var sets = createJoinSets();
			sets.outer.push({
				key : 2,
				text : 'another element with key 2'
			});

			var joined = sets.inner.outerJoin(sets.outer, function(inner, outer) {
				if(!outer) {
					return false;
				} else {
					return inner.key === outer.key;
				}
			}).raw();

			expect(joined.length).toBe(4);
			expect(joined[0].inner.key).toBe(1);
			expect(joined[0].inner.value).toBe("11");
			expect(joined[0].outer).toBe(null);
			expect(joined[1].inner.key).toBe(2);
			expect(joined[1].inner.value).toBe("12");
			expect(joined[1].outer.text).toBe("22");
			expect(joined[2].inner.key).toBe(2);
			expect(joined[2].inner.value).toBe("12");
			expect(joined[2].outer.text).toBe('another element with key 2');
			expect(joined[3].inner.key).toBe(3);
			expect(joined[3].inner.value).toBe("13");
			expect(joined[3].outer.text).toBe("23");
		});

		it("outerJoin() -> returns clone of self when other item is not collection/array", function() {
			var sets = createJoinSets();
			expect(list.outerJoin(1).raw()).toEqual(list.raw());
		});

		it("pack() -> removed nulls", function() {
			var array = new Collection([null, 1, 2, null, void 0]);
			expect(array.pack().raw()).toEqual([1,2]);
		});

		it("partition() -> partitions", function() {
			var predicate = function(e) {
				return (e - 1) % 3;
			};
			var partitioned = list.partition(predicate);
			expect(partitioned.element(0)).toEqual([1, 4, 7, 10]);
			expect(partitioned.element(1)).toEqual([2, 5, 8]);
			expect(partitioned.element(2)).toEqual([3, 6, 9]);
		});

		it("partition() -> partitions boolean", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var partitioned = list.partition(predicate);
			expect(partitioned.element(true)).toEqual([1, 3, 5, 7, 9]);
			expect(partitioned.element(false)).toEqual([2, 4, 6, 8, 10]);
		});

		it("partition() -> partitions correct length", function() {
			var predicate = function(e) {
				return e % 3;
			};
			var partitioned = list.partition(predicate);
			expect(partitioned.count()).toBe(3);
		});

		it("partition() -> partitions uses element selector", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var elementSelector = function(e) {
				return e * 2;
			};
			var partitioned = list.partition(predicate, elementSelector);
			expect(partitioned.element(true)).toEqual([2, 6, 10, 14, 18]);
			expect(partitioned.element(false)).toEqual([4, 8, 12, 16, 20]);
		});

		it("partition() -> partitions uses result selector", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var resultSelector = function(e, key) {
				e.key = key;
				for(var i = 0; i < e.length; i++) {
					e[i] *= 2;
				}
				return e;
			};


			var partitioned = list.groupBy(predicate, null, resultSelector);
			expect(elementsMatch(new Collection(partitioned.element(true)), new Collection([2, 6, 10, 14, 18]))).toBe(true);
			expect(elementsMatch(new Collection(partitioned.element(false)), new Collection([4, 8, 12, 16, 20]))).toBe(true);
			expect(partitioned.element(true).key).toEqual('true');
			expect(partitioned.element(false).key).toEqual('false');
		});

		it("partition() -> creates a copy", function() {
			var predicate = function(e) {
				return e % 2 ? true : false;
			};
			var partitioned = list.partition(predicate);
			expect(partitioned.raw()).not.toEqual(list.raw());
			expect(list.raw()).toEqual([1,2,3,4,5,6,7,8,9,10]);
		});

		it("push() -> pushes range when a list of elements", function() {
			list.push(11,12);
			expect(list.count()).toBe(12);
			expect(list.raw()[10]).toBe(11);
			expect(list.raw()[11]).toBe(12);
		});

		it("range() -> gets range", function() {
			var range = list.range(1,3);
			expect(range.raw()).toEqual([2,3]);
		});

		it("removeAt() -> removes at element", function() {
			list.removeAt(1);
			expect(list.raw().length).toBe(9);
			expect(list.raw()).toEqual([1, /*2*/ 3,4,5,6,7,8,9,10]);
		});

		it("removeRange() -> removes range", function() {
			list.removeRange(1, 2);
			expect(list.count()).toBe(8);
			expect(list.raw()).toEqual([1, /*2, 3*/ 4,5,6,7,8,9,10]);
		});

		it("reverses -> reverses the list", function() {
			var thisList = new Collection([1,2,3]);
			var reversed = thisList.reverse();
			expect(reversed.raw()).toEqual([3,2,1]);
		});

		it('shift() -> Removes first item', function() {
			var arr = new Collection([1, 2, 3]);
			var removed = arr.shift();
			expect(removed).toBe(1);
			expect(arr.raw()).toEqual([2,3]);
		});

		it("shuffle() -> collection is correct size", function() {
			var selection = list.shuffle();
			expect(selection.count()).toEqual(list.count());
		});

		it("shuffle() -> alters original", function() {
			var selection = list.shuffle();
			expect(selection.raw()).toBe(list.raw());
		});

		it("shuffle() -> takes all elements into new array", function() {
			var selection = list.shuffle().distinct();
			expect(selection.count()).toBe(list.count());
		});

		it("single() -> throws exception if list length is not 1", function() {
			expect(function() {
				list.single();
			}).toThrow(new Error('Array does not contain exactly one matching element'));
		});

		it("single() -> gets single if exactly one element", function() {
			expect(new Collection([1]).single()).toBe(1);
		});

		it("single() -> throws exception if multiple matches (with predicate)", function() {
			expect(function() {
				list.single(function(element) {
					return element > 5;
				});
			}).toThrow(new Error('Array does not contain exactly one matching element'));
		});

		it("single() -> gets single if exactly one match (with predicate)", function() {
			expect(list.single(function(element) {
				return element == 5;
			})).toBe(5);
		});

		it("skip() -> skips", function () {
			expect(new Collection([1,2,3,4,5]).skip(2).raw()).toEqual([3,4,5]);
		});

		it("sort() -> sorts the list", function() {
			var thisList = new Collection([3,1,2]);
			thisList.sort();
			expect(thisList.raw()).toEqual([1,2,3]);
		});

		it("sum() -> sums", function () {
			expect(list.sum()).toBe(55);
		});

		it("sum() -> sums (when predicate)", function () {
			expect(list.sum(function(element) {
				return element + 1;
			})).toBe(65);
		});

		it("sum() -> no elements then 0", function () {
			expect(new Collection().sum()).toBe(0);
		});

		it("take() -> takes", function () {
			expect(new Collection([1,2,3,4,5]).take(2).raw()).toEqual([1,2]);
		});

		it("toString() -> converts the array to a string", function() {
			var array = new Collection([1,2,3]);
			expect(array.toString()).toBe('1,2,3');
		});

		it("union() -> unions two lists", function () {
			expect(new Collection([1,2]).union([3,4]).raw()).toEqual([1,2,3,4]);
		});

		it("union() -> unions to new Collection", function () {
			list.union([11]);
			expect(list.count()).toBe(10);
		});

		it('unshift() -> Adds items to the start of an array', function() {
			var arr = new Collection([1, 2, 3]);
			arr.unshift(-1, 0);
			expect(arr.raw()).toEqual([-1, 0, 1, 2, 3]);
		});

		it("where() -> selects matches (with predicate)", function() {
			var selection = list.where(function(element) {
				return element > 5;
			}).raw();
			expect(selection).toEqual([ 6,7,8,9,10 ]);
		});
	});