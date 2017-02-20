import { Action } from '../../types';
import buildUnwrapper from '../buildUnwrapper';

describe('buildUnwrapper', () => {
  it('should return unwrapped action', () => {
    const unwrap = buildUnwrapper('Foo');

    expect(unwrap({ type: 'Foo.Bar' })).toEqual({
      type: 'Bar'
    });
  });

  it('should not match when action does not start with pattern', () => {
    const unwrap = buildUnwrapper('Foo');

    expect(unwrap({ type: 'BarFoo' })).toBeNull();
    expect(unwrap({ type: 'Bar.Foo' })).toBeNull();
  });

  it('should return pattern for exact match', () => {
    const pattern = 'Foo';
    const unwrap = buildUnwrapper(pattern);

    expect(unwrap({ type: pattern })).toEqual({
      type: pattern
    });
  });

  it('should pass through the content of the action when matched', () => {
    const unwrap = buildUnwrapper('Foo');

    expect(unwrap(<Action>{ type: 'Foo.Bar' as string, payload: 42 })).toEqual({ type: 'Bar', payload: 42 });
  });
});
