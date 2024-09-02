import {configureStore} from "@reduxjs/toolkit";
import aiGenratedSlice  from "./genratedSopSlice";
export const store = configureStore({
    reducer:{
        genrated:aiGenratedSlice,
    }
})