import React from "react";

import { ErrorState } from "./store";

export const Error =
    (props: { store: ErrorState }) => <div>Error: {props.store.message}</div>;
