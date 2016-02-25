# redux-elm

> Redux is great, Elm is great too, why not to have The Elm Architecture in Redux?

Global application state is a great concept, yet it requires a lot of discipline to write maintanable and extendable applications. Elm solves the problem by heavily relying on Composition which is a new Encapsulation in FP lingo. Let's compose Views, State (Model), Reducers (Updaters), **Actions** and **Side Effects**.

This repo is port of [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial) in [Redux](https://github.com/rackt/redux) and JavaScript. Please, keep in mind that we can't get all the benefits of Elm without [Elm](http://elm-lang.org/) itself :-) but we can certainly think about our Redux application as composable components and that's the goal.

Just give it a chance and see the examples:

 1. **[Counter](./examples/src/1-counter/main.js)** - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/1/Counter.elm)
 2. **[Pair of Counters](./examples/src/2-pair-of-counters/main.js)** - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/2/CounterPair.elm)
 3. **[Dynamic list of Counters](./examples/src/3-a-dynamic-list-of-counters/main.js)** - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/3/CounterList.elm)
 4. **[Random GIF Viewer](./examples/src/4-random-gif-viewer/main.js)** - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/5/RandomGif.elm)
 5. **[Pair of Random GIF Viewers](./examples/src/5-pair-of-random-gif-viewers/main.js)** - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/6/RandomGifPair.elm)
 6. **[List of Random GIF Viewers](./examples/src/6-list-of-random-gif-viewers/main.js)** - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/7/RandomGifList.elm)

# Demo

```
cd examples
npm install
npm start
open http://localhost:3000
```

# Why not npm?

Because *WIP*