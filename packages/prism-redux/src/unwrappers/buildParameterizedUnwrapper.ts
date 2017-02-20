import { Action } from '../types';
import escapeRegexp from '../escapeRegexp';

export interface Params {
  param: string;
};

export interface ParameterizedAction extends Action {
  args: Params;
};

export default (pattern : string) => {
  const regexp = new RegExp(`^${escapeRegexp(pattern)}\\.([^.]+)\\.(.+)`);

  return (action : Action) : ParameterizedAction | null => {
    const match = action.type.match(regexp);

    if (match) {
      return {
        ...action,
        type: match[2],
        args: {
          param: match[1]
        }
      };
    } else {
      return null;
    }
  }
};
