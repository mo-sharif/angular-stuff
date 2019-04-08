# 💥 Reactive Programing Rxjs 💥
-------------------
Resources | Demos
------------ | -------------
[RXJS Operators](https://www.learnrxjs.io/operators/) | [Handling HTTP Requests](https://stackblitz.com/edit/http-observable-posts)
[RXJS reactivex](http://reactivex.io/rxjs/manual/overview.html) | [Table data filter and pagination](https://stackblitz.com/edit/angular-table-filter-paginattion)
[Observables vs Subjects](http://jasonwatmore.com/post/2018/06/25/angular-6-communicating-between-components-with-observable-subject) | [Angular Reactive Forms](https://stackblitz.com/edit/reactive-forms-material-mosh)

Table of contents
=================

   * [Observables](#What-is-an-Observable)
   * [Hot vs. Cold Observable](#Hot-vs.-Cold-Observable)
   * [Subject](#Subject)
   * [Multicasted Observables](#Multicasted-Observables)
   * [BehaviorSubject](#BehaviorSubject)
   * [AsyncSubject](#AsyncSubject)
   * [Commonly used RxJs Operators](#rxjs-operators)

        * Combination
            * [Concat](#Concat)
            * [Merge](#Merge)
            * [startWith](#startWith)

        * Conditional
             * [defaultIfEmpty](#defaultIfEmpty)   
             * [every](#every)

        * Creation
             * [create](#create)
             * [empty](#empty)
             * [from](#from) 
             * [fromEvent](#fromEvent) 
             * [interval](#interval) 
             * [of / just](#of-/-just) 
             * [range](#range) 
             * [throw](#throw) 
             * [timer](#timer)

         * Error Handling
             * [catch / catchError](#catch-/-catchError)
             * [retry](#retry)

         * Filtering
             * [debounceTime](#debounceTime)
             * [distinctUntilChanged](#distinctUntilChanged)
             * [filter](#filter)
             * [take](#take)
             * [takeUntil](#takeUntil)

         * [Multicasting](#Multicasting)
             * [multicast](#multicast)
             * [share](#share)

         * [Transformation](#Transformation)
             * [bufferTime](#bufferTime)
             * [concatMap](#concatMap)
             * [groupBy](#groupBy)
             * [map](#map)
             * [mapTo](#mapTo)
             * [mergeMap / flatMap](#mergeMap-/-flatMap)
             * [partition](#partition)
             * [pluck](#pluck)
             * [reduce](#reduce)
             * [scan](#scan)
             * [switchMap](#switchMap)

         * [Utility](#Utility)
             * [do / tap](#do-/-tap)
             * [delay](#delay)
             * [finalize / finally](#finalize-/-finally)
             * [repeat](#repeat)

    * [Installation](#installation)



## What is an Observable?

An Observable can be seen as a data source. That data might exist or not exit and might or might not change over time.

An Observable emits data, until it has nothing to emit anymore and then completes (there are some Observable that will never complete) or throws an exception (error handling is a big part of Observable combination).

You can combine these data-sources or alter the emitted data using operators like map, merge, switchMap, etc. So, a data-source can be an alteration of another data-source or the combination of many others.

An Observable is a source, If you want to use the data from that source, you need to `subscribe()` to the Observable and then you get notified of any data emitted.

## Hot vs. Cold Observable

There are two kind of Observables: cold and hot Observables.

**Cold Observables:** These are Observables that do not emit data until you subscribe to them, basically, data does not exists until you ask for it (e.g. HTTP requests).

**Hot Observables:** These Observables start emitting without caring if there is or not a subscriber waiting for data.
Most of the time, you have to deal with cold Observables (HTTP requests), that's why you need to subscribe to them, without this subscription you only define a data source, and then never trigger the request.

So let's think about Observable with a video metaphor:

- A cold Observable is like a Youtube: Videos are broadcasted when you ask for it `subscribe()`.
- A hot Observable is like regular TV : Video are broadcasted without any regard to the fact that anyone asks for it or not.

**ConnectableObservable:** are Observables that emit data as soon as you call their `connect()` method. In other words, this Observable becomes hot as soon as you call the `connect()` method.

You can turn a cold Observable into a ConnectableObservable using some operators like `publish()`.

# Subject

An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers. While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.

A Subject is like an Observable, but can multicast to many Observers. Subjects are like EventEmitters: they maintain a registry of many listeners.

Every Subject is an Observable. Given a Subject, you can subscribe to it, providing an Observer, which will start receiving values normally. From the perspective of the Observer, it cannot tell whether the Observable execution is coming from a plain unicast Observable or a Subject.

Internally to the Subject, subscribe does not invoke a new execution that delivers values. It simply registers the given Observer in a list of Observers, similarly to how addListener usually works in other libraries and languages.

Every Subject is an Observer. It is an object with the methods next(v), error(e), and complete(). To feed a new value to the Subject, just call next(theValue), and it will be multicasted to the Observers registered to listen to the Subject.

The follow example shows the basic usage of an Rx.BehaviorSubject class.

```
// Since a Subject is an Observer, this also means you may provide a Subject as the argument to the subscribe of any Observable

import { Subject, from } from 'rxjs';

const subject = new Subject<number>();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});

const observable = from([1, 2, 3]);

observable.subscribe(subject); // You can subscribe providing a Subject

// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3
```
# Multicasted Observables

A "multicasted Observable" passes notifications through a Subject which may have many subscribers, whereas a plain "unicast Observable" only sends notifications to a single Observer.

A multicasted Observable uses a Subject under the hood to make multiple Observers see the same Observable execution.

```
import { from, Subject } from 'rxjs';
import { multicast } from 'rxjs/operators';

const source = from([1, 2, 3]);
const subject = new Subject();
const multicasted = source.pipe(multicast(subject));

// These are, under the hood, `subject.subscribe({...})`:
multicasted.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
multicasted.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});

// This is, under the hood, `source.subscribe(subject)`:
multicasted.connect();
```

# BehaviorSubject

Represents a value that changes over time. Observers can subscribe to the subject to receive the last (or initial) value and all subsequent notifications. 

The follow example shows the basic usage of an Rx.BehaviorSubject class.

```
/* Initialize with initial value of 42 */

let subject = new Rx.BehaviorSubject(42);

let subscription = subject.subscribe(
    x => console.log('Observer got a next value: ' + x),
    err => console.error('Observer got an error: ' + err),
    () => console.log('Observer got a complete notification')
  );

// => Next: 42

// => Next: 56
subject.onNext(56);

// => Completed
subject.onCompleted();
```
# AsyncSubject

The AsyncSubject is a variant where only the last value of the Observable execution is sent to its observers, and only when the execution completes.

The AsyncSubject is similar to the last() operator, in that it waits for the complete notification in order to deliver a single value.

```
import { AsyncSubject } from 'rxjs';
const subject = new AsyncSubject();

subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});

subject.next(5);
subject.complete();

// Logs:
// observerA: 5
// observerB: 5
```

# RxJs Operators

## Concat

signature: `concat(observables: ...*): Observable`

>Subscribe to observables in order as previous completes, emit values.

```
// Concat 2 basic observables

import { concat } from 'rxjs/operators';
import { of } from 'rxjs';

//emits 1,2,3
const sourceOne = of(1, 2, 3);

//emits 4,5,6
const sourceTwo = of(4, 5, 6);

//emit values from sourceOne, when complete, subscribe to sourceTwo
const example = sourceOne.pipe(concat(sourceTwo));

//output: 1,2,3,4,5,6
const subscribe = example.subscribe(val =>
  console.log('Example: Basic concat:', val)
);
```

## Merge

signature: `merge(input: Observable): Observable`

>Turn multiple observables into a single observable.

```
//  Merging multiple observables, static method

import { mapTo } from 'rxjs/operators';
import { interval, merge } from 'rxjs';

//emit every 2.5 seconds
const first = interval(2500);

//emit every 2 seconds
const second = interval(2000);

//emit every 1.5 seconds
const third = interval(1500);

//emit every 1 second
const fourth = interval(1000);

//emit outputs from one observable
const example = merge(
  first.pipe(mapTo('FIRST!')),
  second.pipe(mapTo('SECOND!')),
  third.pipe(mapTo('THIRD')),
  fourth.pipe(mapTo('FOURTH'))
);

//output: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
const subscribe = example.subscribe(val => console.log(val));
```

## startWith

signature: `startWith(an: Values): Observable`

>Emit given value first.

```
// startWith on number sequence

import { startWith } from 'rxjs/operators';
import { of } from 'rxjs';

//emit (1,2,3)
const source = of(1, 2, 3);

//start with 0
const example = source.pipe(startWith(0));

//output: 0,1,2,3
const subscribe = example.subscribe(val => console.log(val));
```

## defaultIfEmpty

signature: `defaultIfEmpty(defaultValue: any): Observable`

>Emit given value if nothing is emitted before completion.

```
// Default for empty value

import { defaultIfEmpty } from 'rxjs/operators';
import { of } from 'rxjs';

//emit 'Observable.of() Empty!' when empty, else any values from source
const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));

//output: 'Observable.of() Empty!'
const subscribe = exampleOne.subscribe(val => console.log(val));

```

## every

signature: `every(predicate: function, thisArg: any): Observable`

>If all values pass predicate before completion emit true, else false.

```
// Some values false

import { every } from 'rxjs/operators';
import { of } from 'rxjs';

//emit 5 values
const source = of(1, 2, 3, 4, 5);

const example = source.pipe(
  //is every value even?
  every(val => val % 2 === 0)
);

//output: false
const subscribe = example.subscribe(val => console.log(val));
```

## create

signature: `create(subscribe: function)`

>Create an observable with given subscription function.

```
// Observable that emits multiple values

import { Observable } from 'rxjs';

/*
  Create an observable that emits 'Hello' and 'World' on  
  subscription.
*/

const hello = Observable.create(function(observer) {
  observer.next('Hello');
  observer.next('World');
  observer.complete();
});

//output: 'Hello'...'World'
const subscribe = hello.subscribe(val => console.log(val));
```

## empty

signature: `empty(scheduler: Scheduler): Observable`

>Observable that immediately completes.

```
// empty immediately completes

import { empty } from 'rxjs';

//output: 'Complete!'
const subscribe = empty().subscribe({
  next: () => console.log('Next'),
  complete: () => console.log('Complete!')
});
```


## from

signature: `from(ish: ObservableInput, mapFn: function, thisArg: any, scheduler: Scheduler): Observable`

>Turn an array, promise, or iterable into an observable.

* This operator can be used to convert a promise to an observable!
* For arrays and iterables, all contained values will be emitted as a sequence!
* This operator can also be used to emit a string as a sequence of characters!

```
// Observable from array

import { from } from 'rxjs';

//emit array as a sequence of values
const arraySource = from([1, 2, 3, 4, 5]);

//output: 1,2,3,4,5
const subscribe = arraySource.subscribe(val => console.log(val));
```

## fromEvent

signature: `fromEvent(target: EventTargetLike, eventName: string, selector: function): Observable`

>Turn event into observable sequence.

```
// Observable from mouse clicks

import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

//create observable that emits click events
const source = fromEvent(document, 'click');

//map to string with given event timestamp
const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));

//output (example): 'Event time: 7276.390000000001'
const subscribe = example.subscribe(val => console.log(val));
```

## interval

signature: `interval(period: number, scheduler: Scheduler): Observable`

>Emit numbers in sequence based on provided timeframe.

```
// Emit sequence of values at 1 second interval

import { interval } from 'rxjs';

//emit value in sequence every 1 second
const source = interval(1000);
//output: 0,1,2,3,4,5....
const subscribe = source.subscribe(val => console.log(val));
```

## of / just

signature: `of(...values, scheduler: Scheduler): Observable`

>Emit variable amount of values in a sequence and then emits a complete notification.

```
// Emitting a sequence of numbers
import { of } from 'rxjs';

//emits any number of provided values in sequence
const source = of(1, 2, 3, 4, 5);

//output: 1,2,3,4,5
const subscribe = source.subscribe(val => console.log(val));
```

## range

signature: `range(start: number, count: number, scheduler: Scheduler): Observable`

>Emit numbers in provided range in sequence.

```
// Emit range 1-10

import { range } from 'rxjs';

//emit 1-10 in sequence
const source = range(1, 10);

//output: 1,2,3,4,5,6,7,8,9,10
const example = source.subscribe(val => console.log(val));
```

## throw

signature: `throw(error: any, scheduler: Scheduler): Observable`

>Emit error on subscription.

```
// Throw error on subscription

import { throwError } from 'rxjs';

//emits an error with specified value on subscription
const source = throwError('This is an error!');

//output: 'Error: This is an error!'
const subscribe = source.subscribe({
  next: val => console.log(val),
  complete: () => console.log('Complete!'),
  error: val => console.log(`Error: ${val}`)
});
```

## timer

signature: `timer(initialDelay: number | Date, period: number, scheduler: Scheduler): Observable`

>After given duration, emit numbers in sequence every specified duration.

```
// timer emits 1 value then completes

import { timer } from 'rxjs';

//emit 0 after 1 second then complete, since no second argument is supplied
const source = timer(1000);

//output: 0
const subscribe = source.subscribe(val => console.log(val));
```

## catch / catchError

signature: `catchError(project : function): Observable`

>Gracefully handle errors in an observable sequence.

```
// Catching error from observable

import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

//emit error
const source = throwError('This is an error!');

//gracefully handle error, returning observable with error message
const example = source.pipe(catchError(val => of(`I caught: ${val}`)));

//output: 'I caught: This is an error'
const subscribe = example.subscribe(val => console.log(val));
```

## retry

signature: `retry(number: number): Observable`

>Retry an observable sequence a specific number of times should an error occur.

* Useful for retrying HTTP requests!
* If you only want to retry in certain cases, check out retryWhen!
* For non error cases check out repeat!

```
// Retry 2 times on error

import { interval, of, throwError } from 'rxjs';
import { mergeMap, retry } from 'rxjs/operators';

//emit value every 1s
const source = interval(1000);
const example = source.pipe(
  mergeMap(val => {
    //throw error for demonstration
    if (val > 5) {
      return throwError('Error!');
    }
    return of(val);
  }),
  //retry 2 times on error
  retry(2)
);
/*
  output:
  0..1..2..3..4..5..
  0..1..2..3..4..5..
  0..1..2..3..4..5..
  "Error!: Retried 2 times then quit!"
*/
const subscribe = example.subscribe({
  next: val => console.log(val),
  error: val => console.log(`${val}: Retried 2 times then quit!`)
});
```

## debounceTime

signature: `debounceTime(dueTime: number, scheduler: Scheduler): Observable`

>Discard emitted values that take less than the specified time between output.

* This operator is popular in scenarios such as type-ahead where the rate of user input must be controlled!

```
// Debouncing based on time between input
import { fromEvent, timer } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const input = document.getElementById('example');

//for every keyup, map to current input value
const example = fromEvent(input, 'keyup').pipe(map(i => i.currentTarget.value));

//wait .5s between keyups to emit current value
//throw away all other values
const debouncedInput = example.pipe(debounceTime(500));

//log values
const subscribe = debouncedInput.subscribe(val => {
  console.log(`Debounced Input: ${val}`);
});
```

## distinctUntilChanged

signature: `distinctUntilChanged(compare: function): Observable`

>Only emit when the current value is different than the last.

* distinctUntilChanged uses === comparison by default, object references must match!

```
// distinctUntilChanged with basic values

import { from } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

//only output distinct values, based on the last emitted value
const myArrayWithDuplicatesInARow = from([1, 1, 2, 2, 3, 1, 2, 3]);

const distinctSub = myArrayWithDuplicatesInARow
  .pipe(distinctUntilChanged())
  //output: 1,2,3,1,2,3
  .subscribe(val => console.log('DISTINCT SUB:', val));

const nonDistinctSub = myArrayWithDuplicatesInARow
  //output: 1,1,2,2,3,1,2,3
  .subscribe(val => console.log('NON DISTINCT SUB:', val));
```

## filter

signature: `filter(select: Function, thisArg: any): Observable`

>Emit values that pass the provided condition.

*  If you would like to complete an observable when a condition fails, check out takeWhile!

```
// filter for even numbers

import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

//emit (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);

//filter out non-even numbers
const example = source.pipe(filter(num => num % 2 === 0));

//output: "Even number: 2", "Even number: 4"
const subscribe = example.subscribe(val => console.log(`Even number: ${val}`));
```

## take

signature: `take(count: number): Observable`

>Emit provided number of values before completing.

*  If you would like to complete an observable when a condition fails, check out takeWhile!

```
// Take 1 value from source

import { of } from 'rxjs';
import { take } from 'rxjs/operators';

//emit 1,2,3,4,5
const source = of(1, 2, 3, 4, 5);

//take the first emitted value then complete
const example = source.pipe(take(1));

//output: 1
const subscribe = example.subscribe(val => console.log(val));
```

## takeUntil

signature: `takeUntil(notifier: Observable): Observable`

>Emit values until provided observable emits.

*  If you only need a specific number of values, try take!

```
// Take values until timer emits

import { interval, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

//emit value every 1s
const source = interval(1000);

//after 5 seconds, emit value
const timer$ = timer(5000);

//when timer emits after 5s, complete source
const example = source.pipe(takeUntil(timer$));

//output: 0,1,2,3
const subscribe = example.subscribe(val => console.log(val));
```

## multicast

signature: `multicast(selector: Function): Observable`

>Share source utilizing the provided Subject.

```
// multicast with standard Subject

import { Subject, interval } from 'rxjs';
import { take, tap, multicast, mapTo } from 'rxjs/operators';

//emit every 2 seconds, take 5
const source = interval(2000).pipe(take(5));

const example = source.pipe(
  //since we are multicasting below, side effects will be executed once
  tap(() => console.log('Side Effect #1')),
  mapTo('Result!')
);

//subscribe subject to source upon connect()
const multi = example.pipe(multicast(() => new Subject()));
/*
  subscribers will share source
  output:
  "Side Effect #1"
  "Result!"
  "Result!"
  ...
*/
const subscriberOne = multi.subscribe(val => console.log(val));
const subscriberTwo = multi.subscribe(val => console.log(val));
//subscribe subject to source
multi.connect();
```

## share

signature: `share(): Observable`

>Share source among multiple subscribers.

* share is like multicast with a Subject and refCount!

```
// Multiple subscribers sharing source

import { timer } from 'rxjs';
import { tap, mapTo, share } from 'rxjs/operators';

//emit value in 1s
const source = timer(1000);
//log side effect, emit result
const example = source.pipe(
  tap(() => console.log('***SIDE EFFECT***')),
  mapTo('***RESULT***')
);

/*
  ***NOT SHARED, SIDE EFFECT WILL BE EXECUTED TWICE***
  output:
  "***SIDE EFFECT***"
  "***RESULT***"
  "***SIDE EFFECT***"
  "***RESULT***"
*/
const subscribe = example.subscribe(val => console.log(val));
const subscribeTwo = example.subscribe(val => console.log(val));

//share observable among subscribers
const sharedExample = example.pipe(share());
/*
  ***SHARED, SIDE EFFECT EXECUTED ONCE***
  output:
  "***SIDE EFFECT***"
  "***RESULT***"
  "***RESULT***"
*/
const subscribeThree = sharedExample.subscribe(val => console.log(val));
const subscribeFour = sharedExample.subscribe(val => console.log(val));
```
# bufferTime

signature: `bufferTime(bufferTimeSpan: number, bufferCreationInterval: number, scheduler: Scheduler): Observable`

>Collect emitted values until provided time has passed, emit as array.

```
// Buffer for 2 seconds
import { interval } from 'rxjs';
import { bufferTime } from 'rxjs/operators';

//Create an observable that emits a value every 500ms
const source = interval(500);

//After 2 seconds have passed, emit buffered values as an array
const example = source.pipe(bufferTime(2000));

//Print values to console
//ex. output [0,1,2]...[3,4,5,6]
const subscribe = example.subscribe(val =>
  console.log('Buffered with Time:', val)
);

```

# concatMap

signature: `concatMap(project: function, resultSelector: function): Observable`

>Map values to inner observable, subscribe and emit in order.

```
// Demonstrating the difference between concatMap and mergeMap
import { of } from 'rxjs';
import { concatMap, delay, mergeMap } from 'rxjs/operators';

//emit delay value
const source = of(2000, 1000);

// map value from source into inner observable, when complete emit result and move to next
const example = source.pipe(
  concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
);

//output: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
const subscribe = example.subscribe(val =>
  console.log(`With concatMap: ${val}`)
);

// showing the difference between concatMap and mergeMap
const mergeMapExample = source
  .pipe(
    // just so we can log this after the first example has run
    delay(5000),
    mergeMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
  )
  .subscribe(val => console.log(`With mergeMap: ${val}`));
```

# groupBy

signature: `groupBy(keySelector: Function, elementSelector: Function): Observable`

>Group into observables based on provided value.

```
// Group by property

import { from } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';

const people = [
  { name: 'Sue', age: 25 },
  { name: 'Joe', age: 30 },
  { name: 'Frank', age: 25 },
  { name: 'Sarah', age: 35 }
];
//emit each person
const source = from(people);

//group by age
const example = source.pipe(
  groupBy(person => person.age),

  // return each item in group as array
  mergeMap(group => group.pipe(toArray()))
);
/*
  output:
  [{age: 25, name: "Sue"},{age: 25, name: "Frank"}]
  [{age: 30, name: "Joe"}]
  [{age: 35, name: "Sarah"}]
*/
const subscribe = example.subscribe(val => console.log(val));

```

# map

signature: `map(project: Function, thisArg: any): Observable`

>Apply projection with each value from source.

```
// Add 10 to each number
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

//emit (1,2,3,4,5)
const source = from([1, 2, 3, 4, 5]);

//add 10 to each value
const example = source.pipe(map(val => val + 10));

//output: 11,12,13,14,15
const subscribe = example.subscribe(val => console.log(val));
```

# mapTo

signature: `mapTo(value: any): Observable`

>Map emissions to constant value.

```
// Map every emission to string
import { interval } from 'rxjs';
import { mapTo } from 'rxjs/operators';

//emit value every two seconds
const source = interval(2000);

//map all emissions to one value
const example = source.pipe(mapTo('HELLO WORLD!'));

//output: 'HELLO WORLD!'...'HELLO WORLD!'...'HELLO WORLD!'...
const subscribe = example.subscribe(val => console.log(val));
```

# mergeMap / flatMap

signature: `mergeMap(project: function: Observable, resultSelector: function: any, concurrent: number): Observable`

>Map to observable, emit values.]

* flatMap is an alias for mergeMap!
* If only one inner subscription should be active at a time, try switchMap!
*  If the order of emission and subscription of inner observables is important, try concatMap!

```
// mergeMap with observable
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

//emit 'Hello'
const source = of('Hello');

//map to inner observable and flatten
const example = source.pipe(mergeMap(val => of(`${val} World!`)));

//output: 'Hello World!'
const subscribe = example.subscribe(val => console.log(val));
```

# partition

signature: `partition(predicate: function: boolean, thisArg: any): [Observable, Observable]`

>Split one observable into two based on provided predicate.

```
// Split even and odd numbers

import { from, merge } from 'rxjs';
import { partition, map } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5, 6]);
//first value is true, second false
const [evens, odds] = source.pipe(partition(val => val % 2 === 0));

/*
  Output:
  "Even: 2"
  "Even: 4"
  "Even: 6"
  "Odd: 1"
  "Odd: 3"
  "Odd: 5"
*/

const subscribe = merge(
  evens.pipe(map(val => `Even: ${val}`)),
  odds.pipe(map(val => `Odd: ${val}`))
).subscribe(val => console.log(val));
```

# pluck

signature: `pluck(properties: ...args): Observable`

>Select properties to emit.

```
// Pluck object property

import { from } from 'rxjs';
import { pluck } from 'rxjs/operators';

const source = from([{ name: 'Joe', age: 30 }, { name: 'Sarah', age: 35 }]);
//grab names
const example = source.pipe(pluck('name'));
//output: "Joe", "Sarah"
const subscribe = example.subscribe(val => console.log(val));
```

# reduce

signature: `reduce(accumulator: function, seed: any): Observable`

>Reduces the values from source observable to a single value that's emitted when the source completes.

* Just like Array.prototype.reduce()
* If you need the current accumulated value on each emission, try scan!

```
// Sum a stream of numbers

import { of } from 'rxjs';
import { reduce } from 'rxjs/operators';

const source = of(1, 2, 3, 4);
const example = source.pipe(reduce((acc, val) => acc + val));

//output: Sum: 10'
const subscribe = example.subscribe(val => console.log('Sum:', val));
Copy

```

# scan

signature: `scan(accumulator: function, seed: any): Observable`

>Reduce over time.

* You can create Redux-like state management with scan!

```
// Sum over time

import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

const source = of(1, 2, 3);
// basic scan example, sum over time starting with zero
const example = source.pipe(scan((acc, curr) => acc + curr, 0));

// log accumulated values
// output: 1,3,6
const subscribe = example.subscribe(val => console.log(val));

```
```
// Accumulating an object

import { Subject } from 'rxjs';
import { scan } from 'rxjs/operators';

const subject = new Subject();
//scan example building an object over time

const example = subject.pipe(
  scan((acc, curr) => Object.assign({}, acc, curr), {})
);

//log accumulated values
const subscribe = example.subscribe(val =>
  console.log('Accumulated object:', val)
);

//next values into subject, adding properties to object
// {name: 'Joe'}
subject.next({ name: 'Joe' });

// {name: 'Joe', age: 30}
subject.next({ age: 30 });

// {name: 'Joe', age: 30, favoriteLanguage: 'JavaScript'}
subject.next({ favoriteLanguage: 'JavaScript' });

```
# switchMap

signature: `switchMap(project: function: Observable, resultSelector: function(outerValue, innerValue, outerIndex, innerIndex): any): Observable`

>Map to observable, complete previous inner observable, emit values.

* If you would like more than one inner subscription to be maintained, try mergeMap!
* This operator is generally considered a safer default to mergeMap!
* This operator can cancel in-flight network requests!

```
// Restart interval every 5 seconds
import { timer, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

//emit immediately, then every 5s
const source = timer(0, 5000);

//switch to new inner observable when source emits, emit items that are emitted
const example = source.pipe(switchMap(() => interval(500)));

//output: 0,1,2,3,4,5,6,7,8,9...0,1,2,3,4,5,6,7,8
const subscribe = example.subscribe(val => console.log(val));
```
```
// Reset on every click

import { interval, fromEvent } from 'rxjs';
import { switchMap, mapTo } from 'rxjs/operators';

//emit every click
const source = fromEvent(document, 'click');

//if another click comes within 3s, message will not be emitted
const example = source.pipe(
  switchMap(val => interval(3000).pipe(mapTo('Hello, I made it!')))
);

//(click)...3s...'Hello I made it!'...(click)...2s(click)...
const subscribe = example.subscribe(val => console.log(val));
```
# do / tap

signature: `do(nextOrObserver: function, error: function, complete: function): Observable`

>Transparently perform actions or side-effects, such as logging.

* If you are using as a pipeable operator, do is known as tap!

```
// Logging with do

import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';

const source = of(1, 2, 3, 4, 5);
//transparently log values from source with 'do'

const example = source.pipe(
  tap(val => console.log(`BEFORE MAP: ${val}`)),
  map(val => val + 10),
  tap(val => console.log(`AFTER MAP: ${val}`))
);

//'do' does not transform values
//output: 11...12...13...14...15
const subscribe = example.subscribe(val => console.log(val));
```

# delay

signature: `delay(delay: number | Date, scheduler: Scheduler): Observable`

>Delay emitted values by given time.

```
// Delay for increasing durations

import { of, merge } from 'rxjs';
import { mapTo, delay } from 'rxjs/operators';

//emit one item
const example = of(null);
//delay output of each by an extra second
const message = merge(
  example.pipe(mapTo('Hello')),
  example.pipe(
    mapTo('World!'),
    delay(1000)
  ),
  example.pipe(
    mapTo('Goodbye'),
    delay(2000)
  ),
  example.pipe(
    mapTo('World!'),
    delay(3000)
  )
);
//output: 'Hello'...'World!'...'Goodbye'...'World!'
const subscribe = message.subscribe(val => console.log(val));
```

# finalize / finally

signature: `finalize(callback: () => void)`

>Call a function when observable completes or errors

```
// Execute callback function when the observable completes

import { interval } from 'rxjs';
import { take, finalize } from 'rxjs/operators';

//emit value in sequence every 1 second
const source = interval(1000);

//output: 0,1,2,3,4,5....
const example = source.pipe(
  take(5), //take only the first 5 values
  finalize(() => console.log('Sequence complete')) // Execute when the observable completes
)
const subscribe = example.subscribe(val => console.log(val));
```

# repeat

signature: `repeat(count: number): Observable`

>Repeats an observable on completion.

*  Like retry but for non error cases!

```
// Repeat 3 times

import { repeat, delay } from 'rxjs/operators';
import { of } from 'rxjs';

const delayedThing = of('delayed value').pipe(delay(2000));

delayedThing.pipe(
  repeat(3)
)
// delayed value...delayed value...delayed value
.subscribe(console.log)
```



# Installation

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
