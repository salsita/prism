import { Action } from './buildReducer';

const escape = /[|\\{}()[\]^$+*?.]/g;
const escapeStringRegexp = (value : string) => value
  .replace(escape, '\\$&');

export default (pattern : string) => {
  const regexp = new RegExp(`^${escapeStringRegexp(pattern)}\\.(.+)`);

  return (action : Action) : Action | null => {
    if (action.type === pattern) {
      return action;
    } else {
      const match = action.type.match(regexp);

      if (match) {
        return {
          ...action,
          type: match[1]
        };
      } else {
        return null;
      }
    }
  }
};
