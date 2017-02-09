import { Component, ComponentClass, PropTypes, StatelessComponent } from 'react';
import { Action, Dispatch, Store } from 'redux';
import { createEagerElement } from 'recompose';

type Context<S> = {
  store: Store<S>
};

export interface Wrapper {
  (type: string): string
};

export interface Selector<S> {
  (state : any): S
};

type Props<S> = {
  wrapper: Wrapper,
  selector: Selector<S>
};

const contextDefintion = { store: PropTypes.object.isRequired };

export default <S> (
  EnhanceableComponent : ComponentClass<any> | StatelessComponent<any>
) : ComponentClass<Props<S>> =>
  class PrismEnhancedComponent extends Component<Props<S>, void> {

    static childContextTypes = contextDefintion;
    static contextTypes = contextDefintion;

    static propTypes = {
      wrapper: PropTypes.func.isRequired,
      selector: PropTypes.func.isRequired
    };

    context: Context<S>;

    getChildContext() {
      const {
        selector,
        wrapper
      } = this.props;

      const {
        store
      } = this.context;

      const dispatch : Dispatch<S> = (action : Action) =>
        store.dispatch({
          ...action,
          type: wrapper(action.type)
        });
      
      const getState = (state : S) => selector(store.getState());

      return {
        store: {
          ...store,
          dispatch,
          getState
        }
      };
    }

    render() {
      return createEagerElement(
        EnhanceableComponent,
        this.props
      );
    }
  }