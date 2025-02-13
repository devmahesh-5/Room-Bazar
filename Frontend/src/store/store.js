import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authslice.js";

export const store = configureStore({
    reducer:{
        auth: authSlice
    },
});