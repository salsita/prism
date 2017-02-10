export interface Action {
  type : string
};

export interface Matcher {
  (action : Action) : Action | null
};

export interface Handler<S> {
  (state : S, action : Action) : S
};
