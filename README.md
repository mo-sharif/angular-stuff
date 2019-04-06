 # 💥 Observables 🤗


## What is an Observable?
An Observable can be seen as a data source. That data might exist or not exit and might or might not change over time.

An Observable emits data, until it has nothing to emit anymore and then completes (there are some Observable that will never complete) or throws an exception (error handling is a big part of Observable combination).

You can combine these data-sources or alter the emitted data using operators like map, merge, switchMap, etc. So, a data-source can be an alteration of another data-source or the combination of many others.

An Observable is a source, If you want to use the data from that source, you need to subscribe() to the Observable and then you get notified of any data emitted.

## Hot vs. Cold Observable
There are two kind of Observables: cold and hot Observables.

**Cold Observables:** These are Observables that do not emit data until you subscribe to them, basically, data does not exists until you ask for it (e.g. Ajax requests).

**Hot Observables:** These Observables start emitting without caring if there is or not a subscriber waiting for data.
Most of the time, you have to deal with cold Observables (AJAX requests), that's why you need to subscribe to them, without this subscription you only define a data source, and then never trigger the request.

So let's think about Observable with a video metaphor:

- A cold Observable is like a Youtube: Videos are broadcasted when you ask for it (subscribe()).
- A hot Observable is like regular TV : Video are broadcasted without any regard to the fact that anyone asks for it or not.

**ConnectableObservable:** are Observables that emit data as soon as you call their connect() method. In other words, this Observable becomes hot as soon as you call the connect() method.

You can turn a cold Observable into a ConnectableObservable using some operators (like publish()).


# 💥 Angular Stuff 🤗
 
[StalkBlitz Here 👋](https://stackblitz.com/edit/http-observable-posts)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
