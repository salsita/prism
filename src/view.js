import React, { Component } from 'react';

import { Mount, Unmount } from './actions';

export default View => class ReduxElmView extends Component {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({ type: Mount });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: Unmount });
  }

  render() {
    return <View {...this.props} />;
  }
}
