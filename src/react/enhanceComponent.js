import { PropTypes, Component } from 'react';
import createEagerElement from 'recompose/createEagerElement';

const storeShape = PropTypes.shape({ });
const contextDefintion = { store: storeShape.isRequired };

export default Cmp => class ReduxElmEhancedComponent extends Component {

  static childContextTypes = contextDefintion;
  static contextTypes = contextDefintion;

  static propTypes = {
    wrapper: PropTypes.func.isRequired,
    selector: PropTypes.func.isRequired
  };

  getChildContext() {
    const store = this.context.store;

    const wrapper = this.props.wrapper;
    const selector = this.props.selector;

    return {
      store: {
        ...store,
        dispatch: action => store.dispatch({ ...action, type: wrapper(action.type) }),
        getState: () => selector(store.getState())
      }
    };
  }

  render() {
    return createEagerElement(Cmp, this.props);
  }
};
