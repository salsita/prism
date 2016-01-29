# redux-elm

> Redux is great, Elm is great too, why not to have Elm architecture in Redux?

Global application state is a great concept, yet it requires a lot of discipline to write maintanable and extendable applications. Elm solves the problem by heavily relying on Composition which is a new Encapsulation in FP lingo. Let's compose Views, State (Model), Reducers (Updaters), **Actions** and **Side Effects**.

This repo is port of [The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial) in [Redux](https://github.com/rackt/redux) and JavaScript. Please, keep in mind that we can't get all the benefits of Elm without [Elm](http://elm-lang.org/) itself :-) but we can certainly think about our Redux application as composable components and that's the goal.

Just give it a chance and see the examples:

 * [Counter](./src/1-counter/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/1/Counter.elm)
 * [Pair of Counters](./src/2-pair-of-counters/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/2/CounterPair.elm)
 * [Dynamic list of Counters](./src/3-a-dynamic-list-of-counters/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/3/CounterList.elm)
 * [Fancier list of Counters](./src/4-a-fancier-list-of-counters/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/4/CounterList.elm)
 * [Random GIF Viewer](./src/5-random-gif-viewer/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/5/RandomGif.elm)
 * [Pair of Random GIF Viewers](./src/6-pair-of-random-gif-viewers/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/6/RandomGifPair.elm)
 * [List of Random GIF Viewers](./src/7-list-of-random-gif-viewers/main.js) - [original](https://github.com/evancz/elm-architecture-tutorial/blob/master/examples/7/RandomGifList.elm)

# Demo

```
npm install
npm start
open http://localhost:3000
```

# Why not npm?

**This is not a framework**, this is just a proof concept. If you feel like you'd like to see the repo as framework just give us a star. If the repo hits 500 stars, I'll turn this into real library including proper documentation, implementation, versioning, tests, build system, up-to date deps, npm and everything you'd expect.

All credits goes to [Dan Abramov](https://github.com/gaearon) as the author of Redux and [Evan Czaplicki](https://github.com/evancz) as the author of Elm.