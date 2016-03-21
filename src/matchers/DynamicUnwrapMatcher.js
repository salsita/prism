import escapeStringRegexp from 'escape-string-regexp';
import Matcher from './Matcher';

export default class DynamicUnwrapMatcher extends Matcher {

  constructor(pattern) {
    super();
    this.regexp = new RegExp(`^${escapeStringRegexp(pattern)}\\.([^.]+)\\.(.+)`);
  }

  match(action) {
    const match = action.type.match(this.regexp);

    if (match) {
      return [match[2], match[1]];
    } else {
      return false;
    }
  }
}
