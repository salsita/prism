## Why does the Elm Architecture matter to Redux developers?

You've probably noticed all the buzz around [Redux](https://github.com/reactjs/redux) and [React](http://facebook.github.io/react/) lately. There's no question that these technologies have had a seismic effect on the JavaScript frontend world.

Redux is great for newcomers because there's no need to understand complex abstractions. It's pretty easy to grasp all the basic concepts and start writing code. It has [great tooling](https://github.com/zalmoxisus/redux-devtools-extension), a very active development community and a fast-growing ecosystem.

On the other hand, **Redux lacks built-in abstractions for real-world, maintainable, scalable applications**. In particular, it is difficult to create and distributed encapsulated, reusable components. Of course, many developers have already built large-scale apps using Redux but, because it is so new, people are only now starting to appreciate the potential benefits of baking higher level constructs into the Redux stack.

The alternative is full-scope frameworks like Angular and Ember that offer abstractions for every piece of the application puzzle. But these frameworks lack the simplicity, elegance and modularity of React and Redux.

Ideally we would find a balance: something that can serve as the basis for a large production app without the need to master a large monolithic framework. That's why patterns are more important than over-engineered frameworks.

[The Elm Architecture](https://github.com/evancz/elm-architecture-tutorial), an application architecture for the [Elm programming language](http://elm-lang.org/), is a great example. It's a wonderful set of patterns and ideas for solving the hard problems faced in real-world software development:

* **Side Effects** - API calls, logging and anything else that's not directly related to your domain logic
* **[Fractability](http://staltz.com/unidirectional-user-interface-architectures.html)** - Are your components isolated? Could you publish your deeply nested components as independent npm packages?
* **[Encapsulation](http://blog.javascripting.com/2016/02/02/encapsulation-in-redux/)** - People do not often talk about encapsulation in the front-end world. But without it, it's nearly impossible to decouple components... and decoupling is the secret sauce for any scalable architecture
* **Local Component State** - Imagine you want to instantiate a Component (e.g. multiple instances of a Calendar widget in single screen)

This repository aims to bring the full power of The Elm Architecture to JavaScript. Some Elm folks will no doubt protest that it does not make sense to use The Elm Architecture in JavaScript, because JavaScript doesn't enforce the same invariants as Elm.

We don't share that view. **The Elm Architecture clearly addresses some important areas where Redux alone is lacking** (and by The Elm Architecture we really mean the architecture, not the language itself).

The goal of `redux-elm` is not to turn JavaScript into an awkward and inadequate Elm clone. What it tries to do instead is to take advantage of The Elm Architecture where it makes sense, using JavaScript capabilities to make best possible use of the architecture.
