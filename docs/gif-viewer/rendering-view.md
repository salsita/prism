## Rendering the View

The Model is ready, so now is the right time to build a View to project the Model onto HTML markup.

```javascript
import React from 'react';

const renderGif = url => {
  if (url) {
    return <img src={url} width="200" height="200" />;
  } else {
    return <img src="/assets/waiting.gif" width="200" height="200" />;
  }
};
```

Just import `React` and implement the `renderGif` function that takes the `url` and renders either a loading spinner or the actual GIF. Keep in mind that `url` can be `null`, in which case we are waiting for a new GIF.

Every View must export a default React component wrapped by `view` functrion:

```javascript
import React from 'react';
import { view } from 'redux-elm';

const renderGif = url => {
  if (url) {
    return <img src={url} width="200" height="200" />;
  } else {
    return <img src="/assets/waiting.gif" width="200" height="200" />;
  }
};

export default view(({ model, dispatch }) => (
  <div style={{ width: '200px' }}>
    <h2 style={{ width: '200px', textAlign: 'center' }}>{model.topic}</h2>
    {renderGif(model.gifUrl)}
    <button onClick={() => dispatch({ type: 'RequestMore' })}>More Please!</button>
  </div>
));
```

The key is to use the `renderGif` function by passing it `gifUrl` from the Model. We also need user interaction, so the "More Please!" button dispatches a `RequestMore` Action which we will handle in the Updater.

At this point you should see something like this:

![gif-viewer-1](../assets/5.png)
