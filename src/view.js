import React, { Component, PropTypes } from 'react';

import { Mount, Unmount } from './actions';

export default View => class ReduxElmView extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

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
};
