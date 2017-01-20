export const initialState = topic => ({
  topic,
  gifUrl: null
});

export default (state = initialState('funny cats'), { type, payload }) => {
  switch (type) {
    case 'RequestMore':
      return { ...state, gifUrl: null };

    case 'NewGif':
      return { ...state, gifUrl: payload };

    default:
      return state;
  }
};
