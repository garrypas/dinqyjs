![Dinqyjs](http://dinqyjs.com/logo.gif)

(for the latest documentation go to dinqyjs.com)

Powerful
--------

Over 60 functions.

Tiny
----

Barely 8kb minified. A footprint that will barely register.

Simple
------

No caching, tricks, parsing engines to imitate C# or Ruby, or unwanted additional features. Dinqy is unashamedly Javascript. It behaves exactly as you expect it to, every time.

Fast
----

Dinqy has been benchmarked for optimal performance - as fast in IE6 as it is in Node.

In the browser or in Node
-------------------------

Works in both Node and in the browser.

Node via npm: npm install dinqyjs

Then add this line to your .js file to start using Dinqy:

var Dinqyjs = require('dinqyjs').Dinqyjs;

Also available on Nuget
-----------------------

Install-Package dinqyjs

Simple
===

No caching, tricks, parsing engines to imitate C# or Ruby, or unwanted additional features. Dinqy is unashamedly Javascript. It behaves exactly as you expect it to, every time.

Fast
===

Dinqy has been benchmarked for optimal performance - as fast in IE6 as it is in Node.

Dive in
===

First wrap your array in an instance of Dinqyjs.Collection

    var array = [1, 2, 3];
    var collection = new 
    Dinqyjs.Collection(array);
  
Working with a Dinqy collection is child's play. Here we find all values greater than 1 and project them into a new array

    var numberTwo = collection.where(function (element) {
      return element > 1;
    });
Functions can be chained together to easily query data. Take the following example, where we want to do some paging on a set of records

    var array = [/* Some large array of records */];
    var records = new      Dinqyjs.Collection(array).where(function(element) {
      return element.price > 100;
    }).skip(10).take(10);

Finally if you want to work with a native Javascript array you can easily get it using the `raw()` function

    var realArray = records.raw();

...a closer look

**all(predicate)**


The all() function indicates whether all elements of a collection match the given predicate

    var areAllTrue = collection.all(function(element) { return element.price < 100; });

**any([predicate])**

The any() function indicates whether any element of a collection matches the given predicate. If no argument is supplied the returned value indicates if any element is present in the collection (the length is greater than zero).

    var areAllTrue = collection.any(function(element) { return element.price > 10; });

**ascending([selectors...])**

Sorts the collection in ascending order. Unless the array is a simple type such as a string or number a selector will also need to be supplied to indicate what to sort on. This function modifies the underlying array. Given an array of [3,1,2] the new order will be 1,2,3

collection.ascending(function(element) {
    return element.price;
});
NEW: From version 1.3 this function accepts multiple selectors, given 'sort by' ... 'then by' capability.

**associative(array)**

A static helper that indicates if the object passed is an associative array (an array that has non-numeric indexes).

    var array = [];
    array["someKey"] = 1;
    var isAssociative = Collection.associative(array);

The code above will set the value of 'isAssociative' to 'true'

**atRandom()**

Returns one element from the collection selected at random

    collection.atRandom();

**average([selector])**

Returns the average of the elements in the collection. Unless the array is an array of simple numbers as selector function will need to be supplied to choose the values to use.

    collection.average(function(element) {
      return element.price;
    });

**clear()**

Clears the array, removing all elements

    collection.clear();
    clearWhere([predicate])

Removes elements from the array where the predicate returns true. The example below removes all elements where the price is greater than 100.

    collection.clearWhere(function(element) {
      return element.price > 100;
    });

**clone()**

Returns a clone of the collection and the underlying array

    var clone = collection.clone();

**concat(elements...)**

Wraps the native `concat()` function of the Array type, concatenates the elements to the end of the array

    collection.concat([1, 2, 3]);

**contains(element)**

Indicates whether the collection contains the given element. Returns true or false.

    var contains = collection.contains(someObject);

**count([element])**

Returns the number of elements in the collection.

    var arrayLength = collection.count();

NEW: From version 1.3 you can could occurrences of a particular element of an array.

**crossJoin(collection, [selector])**

Cross joins two sets. Joining a set with i rows to a set with j rows gives an resultset of i\*j rows, with every row from the first set joined to every row from the second

    var collection = new Collection([{x:1},{x:2}]);
    var joined = collection.crossJoin([{y:3},{y:4}]);

"joined" has 4 rows; `{x:1,y:3}, {x:1,y:4}, {x:2,y:3} and {x:2,y:4}`.

**descending([selectors...])**

Sorts the collection in descending order. Unless the array is a simple type such as a string or number a selector will also need to be supplied to indicate what to sort on. This function modifies the underlying array. Given an array of `[3, 1, 2]` the new order will be 3,2,1

    collection.descending(function(element) {
      return element.price;
    });

NEW: From version 1.3 this function accepts multiple selectors, given 'sort by' ... 'then by' capability.

**difference(other[, predicate])**

Returns the difference between two collections, removing duplicates.

    var collection1 = new Collection([1, 2, 3, 3]);
    var collection2 = [2, 3, 4, 3, 3];
    var difference = collection1.difference(collection2, function(x, y) {
      return x === y;
    });

In the example above 'difference' will have a length of 2, and contain the elements `[1, 4]`.

**distinct([selector])**

Creates a copy of the collection and the underlying array with duplicates removed. The optional selector is used to compare two elements for equality

    var newCollection = 
    collection.distinct(function(x, y) {
      return x === y;
    });

**doUntil(callback, stoppingCondition)**

Loops over the collection until the stopping condition function returns true. The condition is checked after each iteration

    collection.doUntil(function(element) {
      //Do something with the element
    }, function(element, index) {
      //Continues until this condition is true
    });

**doWhile(callback, condition)**

Loops over the collection while the condition function returns true. The condition is check before each iteration

    collection.doWhile(function(element) {
      //Do something with the element
    }, function(element, index) {
      //Continues while this condition is true
    });

**each(callback)**

Loops over the elements of a collection, array or object.

    collection.each(function(element, index) {
      //... some code that would normally go inside a loop
    });

The each() function sends two arguments to the callback, the element and the index within the array

**element(indexer[, item])**

Gets the element at the given index (or with the given key)

    var element = collection.element(1);

NEW: From version 1.3 you can also set the item at the given index by passing an optional second argument

**equalTo(other [, predicate])**

Compares the elements of two collections for equality. If all elements are equal and the collections are the same size then 'true' is returned, otherwise 'false' is returned. If a predicate is not supplied a default `===` is used to test for equality

    var element = collection.element(1);

**findIndex(predicate[, start, count])**

Finds the first element in the collection that matches the predicate, and returns its index position. Optionally supply a start position and how many iterations to perform before terminating

    var index = collection.findIndex(function(element) {
      return element === 2;
    }, 1, 3);

The example above would find 2 in `[1, 2, 3, 4, 5]` but not 1 or 5 as it would never check them.

**findLastIndex(predicate[, start, count])**

Finds the last element in the collection (looping backwards) that matches the predicate, and returns its index position. Optionally supply a start position and how many iterations to perform before terminating.

    var index = collection.findLastIndex(function(element) {
      return element === 2;
    }, 1, 3);

The example above would find 2 in `[1, 2, 3, 4, 5]` but not 1 or 5 as it would never check them.

**first([predicate])**

Finds the first element in the collection where the predicate function returns true. If no predicate is supplied the first element is returned. If the collection has no elements an exception is thrown.

    var first = collection.first(function(element) {
      return element.price > 100;
    });

**flatten()**

Takes and array of arrays and creates a flat array containing all the elements.

    var nonFlat = [ [1,2,3], 4, [5,6], 7, 8, [9, 10] ];
    var flat = new Collection(nonFlat).flatten();

In the example above flat would be an array of 10 elements `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]`.

**groupBy(keySelector[, elementSelector, resultSelector])**

Splits an collection into sections. The value returned by the key selector indicates the section the element should be partitioned into. A key and result selector can be specified to customize the resultset. The key difference between `partition()` and `groupBy()` is that partition does not modify the underlying array and can be seen more as a way of getting a window into the data whereas `groupBy()` transforms the underlying array.

    var collection = new Dinqyjs.Collection([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var grouped = collection.groupBy(function(e) {
      return e.key
    }, function(e) {
      return { firstName : e.firstName, lastName : e.lastName };
    }, function(group, key) {
      group.key = key;
      return group;
    });

In the above example results are grouped using the 'key' field value. The elements are transformed into a set of elements containing only first and last name. Finally each group of elements has a key associated with it as a field.

**indexOf(element[, start, count])**

Returns the index of the given element. Optionally start looping at the position indicated by start and terminate after a certain number of iterations.

    var index = collection.indexOf(someObject, 0, 10);

**innerJoin(other, predicate[, joinedObjectCreator])**

We can join two arrays by wrapping the first in an instance of Dinqyjs.Collection, and joining to the second using a predicate function to match keys from elements in the two array. Optionally pass a function to tranform each element before the result is returned

    var firstNames = [
      { key : 1, firstName : 'John' },
      { key : 2, firstName : 'Peter' },
      { key : 3, firstName : 'Paul' }
    ];
    
    var lastNames = [
      { key : 2, lastName : 'Bloggs' },
      { key : 3, lastName : 'Smith' },
      { key : 4, lastName : 'Jones' }
    ];
    
    var collection = new Dinqyjs.Collection(firstNames).innerJoin(lastNames, function(inner, outer) {
         return inner.key === outer.key;
       }, function(inner, outer) {
         return { 
           key : inner.key,
           name : inner.firstName + ' ' + outer.lastName
         };
       });

The above will return the following collection

    [
      { key : 2, name : 'Peter Bloggs' },
      { key : 3, name : 'Paul Smith' }
    ]

**interquartileRange([selector])**

Calculates the interquartile range of the elements of the array. Selector is optional

    var iqr = new Collection({ x : 1 }, { x : 2 }, { x : 3 }).interquartileRange(function(e) {
      return element.x;
    });
    
NEW: This function is new in version 1.3.

**insert(insertBefore, element)**

Inserts an element into the collection before the element at the position indicated by insertBefore. This function modifies the underlying array

    collection.insert(0, 100);

The example above would insert 100 at position 0. If the collection were `[1, 2, 3]` it would then become `[100, 1, 2, 3]`

**insertRange(insertBefore[, elements...])**

Inserts a range of elements into the collection before the element at the position indicated by insertBefore. Elements can be either a Dinqyjs.Collection, array or a parameterized list of elements. This function modifies the underlying array

**collection.insertRange(0, 100, 101);**

The example above would insert 100 at position 0 and 101 at position 1. If the collection were `[1, 2, 3]` it would then become `[100, 101, 1, 2, 3]`.

**intersect(other[, predicate])**

Returns the intersection of two collections

    var collection1 = new Collection([1, 2, 3]);
    var collection2 = [2, 3, 4];
    var intersection = 
    collection1.intersect(collection2, function(x, y) {
      return x === y;
    });

In the example above the elements of intersection would be `[2, 3]`.

**keys()**

Returns the keys for the underlying array or object. This is useful if you are using dictionaries, but will also work with numeric indexes.

    var keys = collection.keys();

**join(separator)**

Joins the elements of an array into a string. Wrapper around the native join() function of the Array type

    var str = collection.join(',');

**last([predicate])**

Finds the last element in the collection where the predicate function returns true. If no predicate is supplied the last element is returned. If the collection has no elements an exception is thrown.

    var last = collection.last(function(element) {
      return element.price > 100;
    });

**lastIndexOf(element[, start, count])**

Returns the last index of the given element in the collection. Optionally start looping (backwards) at the position indicated by start and terminate after a certain number of iterations.

    var lastIndex = collection.lastIndexOf(someObject, 0, 10);

**lowerquartile([selector])**

Calculates the lower quartile of the elements of the array (selector is optional)

    var q1 = new Collection([1, 2, 3]).lowerquartile();

NEW: This function is new in version 1.3.

**map([selector])**

Projects all elements of a collection into a new collection, applying a mapping. This is a wrapper around the native `Array.map()` function with a polyfill function added to the Array type for older browsers. Although a selector is optional the function will always return 'undefined' if it is omitted.

    var mapped = collection.map(function(element) {
      return { name : element.firstName + ' ' + element.lastName };
    });

**max([selector])**

Returns the largest value in a collection. Unless the collection is of simple types such as numbers a selector will need to be passed indicating which values to use

    var max = collection.max(function(element) {
      return element.price;
    });

The above example finds the greatest price.

**median()**

Returns the middle element in the collection (note that this is not the mathematical median)

    var median = collection.median();

The above example would return '3' from `[1, 2, 3, 4, 5]`

BREAKING CHANGE: As of version 1.3 this function now returns the mathematical median rather than the middle element. Users of previous versions looking to upgrade should instead use `middle()`.

**middle([evenResolver])**

Returns the middle element in the collection (note that this is not the mathematical median). If there are an even number of elements (in which case there is a choice of two middle elements) pass `0` as an argument to choose the lower one or `1` to choose the upper one. This function chooses the lower element by default in such cases

    var median = collection.median();

The above example would return '3' from `[1, 2, 3, 4, 5]`

NEW: As of version 1.3 this function replaces median() which now returns the mathematical median rather than the middle element.

**min([selector])**

Returns the smallest value in a collection. Unless the collection is of simple types such as numbers a selector will need to be passed indicating which values to use

    var min = collection.min(function(element) {
      return element.price;
   });

The above example finds the lowest price

**mode([selector])**

Returns the mode from the collection (the element with the most occurances). Note the returned value is an array to allow for bi-modal and multi-modal modes.

    var median = collection.mode();

The above example would return `[1, 2]` from a collection with the elements `[1, 1, 2, 2, 3, 4, 5]`.
NEW: This function is new to version 1.3

**multiply([selector])**

Multiplies all of the values in the collection. If the elements of the array are not numbers you will need to supply a selector function to indicate which values to use. If there are no elements then zero is returned

    var total = collection.multiply(function(element) {
      return element.xyz;
    });

Be aware that Javascript uses binary floating point numbers and therefore there may be the risk of rounding errors when multiplication is performed

**none([predicate])**

The none() function indicates that no elements of a collection match the given predicate. If no argument is supplied the returned value indicates the collection is empty (the length is zero).

    var areAllFalse = collection.none(function(element) { return element.price > 10; });

**orderBy([selectors/direction...])**

Allows sorting on multiple fields in both ascending and descending order. If a direction is not specified ascending order is used by default

    collection.orderBy(function(element) {
      return element.x;
    }, function(element) {
      return element.y;
    }, 'desc');

In the example above 'collection' is sorted first by `element.x` (in ascending order), then by `element.y` in descending order. It is necessary to include the string `'desc'` immediately after the descending selector (`'asc'` could be added after an ascending selector, but is not required).
NEW: This function is new in version 1.3 and was added to offer the the powerful sorting functionality absent in earlier versions.

**outerJoin(other[, predicate, selector])**

Performs an outer join on two collections. A predicate can be supplied to define equality otherwise a default `===` is used. A selector can also optionally be supplied to customize the format of elements in the new collection.

    var firstNames = [
      { key : 1, firstName : 'John' },
      { key : 2, firstName : 'Peter' },
      { key : 3, firstName : 'Paul' }
    ];
    var lastNames = [
      { key : 2, lastName : 'Bloggs' },
      { key : 2, lastName : 'Davies' },
      { key : 3, lastName : 'Smith' },
      { key : 4, lastName : 'Jones' }
    ];

    var collection = new Dinqyjs
      .Collection(firstNames)
      .outerJoin(lastNames, function(inner, outer) {
         return inner.key === outer.key;
       }, function(inner, outer) {
         var lastNamePart = outer ? ' ' + outer.lastName : '';
         return { key : inner.key, name : inner.firstName + ' ' + lastNamePart };
       });
Where matching elements are not found on the right nulls are used. The above will return the following collection

    [
      { key : 1, name : 'John' },
      { key : 2, name : 'Peter Bloggs' },
      { key : 2, name : 'Peter Davies' },
      { key : 3, name : 'Paul Smith' }
    ]

**pack()**

Fixes 'holey' arrays by removing null and undefined elements. This function modifies the underlying array

    collection.pack();

If the collection had been `[null, 1, 2, undefined, 3]` the collection would then become `[1, 2, 3]` once this code has run

**partition(keySelector[, elementSelector, resultSelector])**

Splits an collection into sections. The value returned by the key selector indicates the section the element should be partitioned into. A key and result selector can be specified to customize the resultset. The key difference between `partition()` and `groupBy()` is that partition does not modify the underlying array and can be seen more as a way of getting a window into the data whereas `groupBy()` transforms the underlying array.

    var collection = new Dinqyjs.Collection([1, 
2, 3, 4, 5, 6, 7, 8, 9, 10]);
    var partitioned = collection.partition(function(e) {
      return (e - 1) % 3;
    });

In the above example 'partitioned' would have a length of 3 and would be `[ [1, 4, 7, 10], [2, 5, 8], [3, 6, 9] ]`

**pop()**

Wraps the native pop function of the Array type

    var popped = collection.pop();

**push(elements...)**

Pushes one or more elements onto the end of the collection. This function modifies the underlying array

    collection.push(0, 100, 101);

The example above would push 100 and 101 onto the collection. If the collection were `[1, 2, 3]` it would then become `[1, 2, 3, 100, 101]`

**range(start, end)**

Returns the elements between the positions indicated by 'start' and 'end' as a collection

    var range = collection.range(1, 3);

The example above would get `[2, 3, 4]` from `[1, 2, 3, 4, 5]`.

**raw()**

Returns a reference to the underlying array. Because the array is passed by reference you can work interchangeably with the Dinqyjs.Collection and the array it wraps.

    var array = [1];
    var collection = new Dinqyjs.Collection(array);
    collection.push(2);
    collection.raw().push(3);
    array.push(4);

In the example above 'collection' would be `[1, 2, 3, 4]` after the code has run

**remove(element)**

Removes the given element from the collection (if found)

    var collection = new Dinqyjs.Collection([ obj1, obj2 ]);
    collection.remove(obj1);

**removeAt(index)**

Removes the element at the given position

    collection.removeAt(1);

**removeRange(start, count)**

Removes the number of elements indicated by count from the start position onwards

    collection.removeRange(1, 3);

The example above `[1, 2, 3, 4, 5]` would become `[1, 5]`

**reverse()**

Reverses the order of the collection. This function modifies the underlying array

    collection.reverse();

The example above `[1, 2, 3, 4, 5]` would become `[5, 4, 3, 2, 1]`

**shift()**

Removes the first item from the collection. Wrapper around the native `shift()` function of the Array type

    var removed = collection.shift();

**shuffle()**

Rearranges the elements of the collection into a random order. This function modifies the underlying array

    collection.shuffle();

**single([predicate])**

Finds exactly one element in the collection where the predicate function returns true, if zero or multiple matches are found an exception is thrown. If no predicate is supplied the collection must have exactly one element or an exception is thrown. single() can be thought of as a stricter form of first()

    var first = collection.first(function(element) {
      return element.price > 100;
    });

**skip(count)**

Skips the number of elements indicated by count before returning all remaining elements

    var skipped = collection.skip(2);

If the collection were `[1, 2, 3, 4, 5]` then 'skipped' would be `[3, 4, 5]`

**sort([callback])**

A wrapper around the native sort function of the Array type. You may prefer to use `ascending()` or `descending()` instead. This function modifies the underlying array

    collection.sort();

**sum([selector])**

Adds up all the values in the collection. If the elements of the array are not numbers you will need to supply a selector function to indicate which values to use. If there are no elements then zero is returned

    var total = collection.sum(function(element) {
      return element.price * element.qty;
    });

**take(count)**

Takes the number of elements indicated by the 'count' argument.

    var taken = collection.take(2);

If the collection were `[1, 2, 3, 4, 5]` then 'taken' would be `[1, 2]` after this code has run

**transpose([collections...])**

Takes a set of collections or arrays and merges them into an array with elements grouped by their original position

    var transposed = Collection.transpose(array1, array2, collection);

Given the elements `[1,4,7], [2,5,8,9], [3,6]` the returned array would be `[ [1,2,3], [4,5,6], [7,8], [9] ]`
NEW: This function is new in version 1.3.

**union(other)**

Takes one collection and unions it with another, returning a new collection containing the two sets of elements

    var unioned = collection.union([4, 5]);

If the collection were `[1, 2, 3]` then 'unioned' would become `[1, 2, 3, 4, 5]` after this code has run

**unshift(elements...)**

Adds items to the start of the collection. Wrapper around the native `unshift()` function of the Array type

    collection.unshift(1, 2);

If the collection were `[3, 4, 5]` it would be `[1, 2, 3, 4, 5]` after this code has run

**upperquartile([selector])**

Calculates the upper quartile of the elements of the array (selector is optional)

    var q3 = new Collection([1, 2, 3]).upperquartile();

NEW: This function is new in version 1.3.

**valueOf()**

A wrapper around `Array.valueOf()`

    var valueof = collection.valueOf();

**where(predicate)**

Selects all elements where the predicate function is true, returning a new array containing the matches

    var selected = collection.where(function(element) {
      return element > 1;
    });

If the collection were `[1, 2, 3]` then 'selected' would be `[2, 3]` after this code has run
