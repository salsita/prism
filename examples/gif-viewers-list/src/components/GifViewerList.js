import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import GifViewer from './GifViewer';


const inputStyle = {
  width: '100%',
  height: '40px',
  padding: '10px 0',
  fontSize: '2em',
  textAlign: 'center'
};

const GifViewerList = ({ topic, gifViewers, onAddGifViewer, onChangeTopic }) => (
  <div>
    <input
      placeholder="What kind of gifs do you want?"
      value={topic}
      onKeyDown={onAddGifViewer}
      onChange={onChangeTopic}
      style={inputStyle}
    />
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {gifViewers.map((gifViewer, index) => <GifViewer key={index} {...gifViewer} />)}
    </div>
  </div>
);

GifViewerList.propTypes = {
  topic: PropTypes.string.isRequired,
  gifViewers: PropTypes.arrayOf(PropTypes.shape({
    selector: PropTypes.func.isRequired,
    wrapper: PropTypes.func.isRequired
  }).isRequired).isRequired,
  onAddGifViewer: PropTypes.func.isRequired,
  onChangeTopic: PropTypes.func.isRequired
};

const mapStateToProps = appState => ({
  topic: appState.topic,
  gifViewers: appState.gifViewers.length
});

const mapDispatchToProps = dispatch => ({
  onAddGifViewer: () => dispatch({ type: 'Create' }),
  onChangeTopic: payload => dispatch({ type: 'ChangeTopic', payload })
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  gifViewers: Array(stateProps.gifViewers).fill(0).map((_, index) => ({
    selector: state => state.gifViewers[index],
    wrapper: type => `GifViewer.${index}.${type}`
  })),
  onAddGifViewer: ev => {
    if (ev.keyCode === 13) {
      dispatchProps.onAddGifViewer();
    }
  },
  onChangeTopic: ev => dispatchProps.onChangeTopic(ev.target.value)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(GifViewerList);
