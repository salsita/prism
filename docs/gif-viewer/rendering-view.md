## Rendering View

The model is ready, now it's right time to build View which projects the model onto HTML markup.

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

Just import `React` and get to implementing the `renderGif` function which takes `url` as argument and renders either Loading spinner or the actual GIF. Keep in mind that `url` can be `null` and if that happens it means that we are waiting for new GIF.

Every View must export default React component and here it is:

```javascript
import React from 'react';

const renderGif = url => {
  if (url) {
    return <img src={url} width="200" height="200" />;
  } else {
    return <img src="/assets/waiting.gif" width="200" height="200" />;
  }
};

export default ({ model, dispatch }) => (
  <div style={{ width: '200px' }}>
    <h2 style={{ width: '200px', textAlign: 'center' }}>{model.topic}</h2>
    {renderGif(model.gifUrl)}
    <button onClick={() => dispatch({ type: 'RequestMore' })}>More Please!</button>
  </div>
);
```

The essential part is using the `renderGif` function and passing it `gifUrl` from Model. We also need User interaction therefore button "More Please!" dispatches new action `RequestMore` which we will handle in the Updater.

Now you should be able to see something like this:

![gif-viewer-1](../assets/5.png)
