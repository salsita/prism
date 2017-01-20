import React from 'react';

import { connect } from 'react-redux';
import { enhanceComponent } from 'redux-elm';

const renderGif = url => {
  if (url) {
    return <img role="presentation" src={url} width="200" height="200" />;
  } else {
    return <img role="presentation" src="/assets/waiting.gif" width="200" height="200" />;
  }
};

const mapStateToProps = state => ({
  topic: state.topic,
  gifUrl: state.gifUrl
});

const mapDispatchToProps = {
  onRequestMore: () => ({ type: 'RequestMore' })
};

export default enhanceComponent(connect(
  mapStateToProps,
  mapDispatchToProps
)(({ topic, gifUrl, onRequestMore }) => (
  <div style={{ width: '200px' }}>
    <h2 style={{ width: '200px', textAlign: 'center' }}>{topic}</h2>
    {renderGif(gifUrl)}
    <button onClick={onRequestMore}>More Please!</button>
  </div>
)));
