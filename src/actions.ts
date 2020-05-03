export type Action = InitialAction;

export interface InitialAction {type: "initialized"};

export const makeInitialized = (): InitialAction => ({type: "initialized"});
