# `buildUnwrapper(pattern)`

Builds a simple Unwrapper, capable of unwrapping by pattern or direct matching.

#### Arguments

1. `pattern` *(string)*: Unwrapping pattern

#### Returns

`Unwrapper` *(Function)*: Unwrapper function to be used for Action unwrapping.

#### Example

```js
import { buildUnwrapper } from 'prism';

const fooUnwrapper = buildUnwrapper('Foo');

console.log(fooUnwrapper({ type: 'Foo' })); // { type: 'Foo' }
console.log(fooUnwrapper({ type: 'Foo.Bar' })); // { type: 'Bar' }
```
