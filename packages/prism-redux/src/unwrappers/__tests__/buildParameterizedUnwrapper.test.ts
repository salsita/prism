import buildParameterizedUnwrapper from '../buildParameterizedUnwrapper';

describe('buildParameterizedUnwrapper', () => {
  it('should provide unwrapped action and parameter', () => {
    const unwrapper = buildParameterizedUnwrapper('Foo');

    const { type, args: { param }} = unwrapper({ type: 'Foo.Parameter.Bar' });
    expect(type).toBe('Bar');
    expect(param).toBe('Parameter');
  });

  it('should allow unwrapped action nesting', () => {
    const unwrapper = buildParameterizedUnwrapper('Foo');
    const  { type, args: { param }} = unwrapper({ type: 'Foo.Parameter.Bar.Baz' });

    expect(type).toBe('Bar.Baz');
    expect(param).toBe('Parameter');
  });

  it('should not match when action does not start with pattern', () => {
    const unwrapper = buildParameterizedUnwrapper('Foo');

    const action1 = unwrapper({ type: 'Bar.Baz' });
    expect(action1).toBeNull();
  
    const action2 = unwrapper({ type: 'Bar' });
    expect(action2).toBeNull();
  });
});
