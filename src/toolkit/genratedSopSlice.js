import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    originalGenratedResponse:"",
    customerSpecificGenratedResponse:"",
    htmlGenratedResponse:"",
    editedGenreatedImprovements:"",
    editedGenreated:"",
    moduleStateAgentProjectAndLevelCustomerSpecificFlag:[]
}
export const aiGenratedSlice = createSlice({
    name:"genrated",
    initialState,
    reducers:{
        setOriginalGenratedResponse:(state,action)=>{
            state.originalGenratedResponse = action.payload;
        },   
        setCustomerSpecificGenratedResponse:(state,action)=>{
            state.customerSpecificGenratedResponse = action.payload;
        },   
        setHtmlGenratedResponse:(state,action)=>{
            state.htmlGenratedResponse = action.payload;
        }, 
        setEditedOriginalResponse:(state,action)=>{
            state.editedGenreatedImprovements=action.payload;
        },
        setModuleStateAgentProjectAndlevelCustomerSpecific:(state,action)=>{
            state.moduleStateAgentProjectAndLevelCustomerSpecificFlag = action.payload;
        },   
    },
});
export const { setEditedOriginalResponse,setOriginalGenratedResponse,setHtmlGenratedResponse,setModuleStateAgentProjectAndlevelCustomerSpecific,setCustomerSpecificGenratedResponse } = aiGenratedSlice.actions;
export default aiGenratedSlice.reducer;