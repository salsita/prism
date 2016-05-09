import React from 'react';
import { forwardTo, view } from 'redux-elm';

import GifViewer from '../random-gif-viewer/view';

const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px 0',
  fontSize: '2em',
  textAlign: 'center'
};

export default view(({ model, dispatch }) => (
  <div>
    <input
      placeholder="What kind of gifs do you want?"
      value={model.topic}
      onKeyDown={ev => {
        if (ev.keyCode === 13) {
          dispatch({ type: 'Create' });
        }
      }}
      onChange={ev => dispatch({ type: 'ChangeTopic', value: ev.target.value })}
      style={inputStyle}
    />
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {model.gifViewers.map((gifViewerModel, index) =>
        <GifViewer
          key={index}
          model={gifViewerModel}
          dispatch={forwardTo(dispatch, 'GifViewer', index)}
        />)}
    </div>
  </div>
));
