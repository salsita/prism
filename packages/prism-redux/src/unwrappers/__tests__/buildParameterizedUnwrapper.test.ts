import buildParameterizedUnwrapper from '../buildParameterizedUnwrapper';

describe('buildParameterizedUnwrapper', () => {
  it('should provide unwrapped action and parameter', () => {
    const unwrapper = buildParameterizedUnwrapper('Foo');

    const action = unwrapper({ type: 'Foo.Parameter.Bar' });

    if (action) {
      expect(action.type).toBe('Bar');
      expect(action.args.param).toBe('Parameter');
    } else {
      throw new Error;
    }
  });

  it('should allow unwrapped action nesting', () => {
    const unwrapper = buildParameterizedUnwrapper('Foo');
    const action = unwrapper({ type: 'Foo.Parameter.Bar.Baz' });

    if (action) {
      expect(action.type).toBe('Bar.Baz');
      expect(action.args.param).toBe('Parameter');
    } else {
      throw new Error;
    }
  });

  it('should not match when action does not start with pattern', () => {
    const unwrapper = buildParameterizedUnwrapper('Foo');

    const action1 = unwrapper({ type: 'Bar.Baz' });
    expect(action1).toBeNull();
  
    const action2 = unwrapper({ type: 'Bar' });
    expect(action2).toBeNull();
  });
});
