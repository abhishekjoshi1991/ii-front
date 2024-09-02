import { myAxios } from "./helper";

export const SIGN_UP_API=async (user)=>{
    const response = await myAxios
        .post('/api/v1/auth/signup', user);
    return response.data;
}
export const USER_LOGIN_API=async (loginDetails)=>{
    const response = await myAxios
        .post('/api/v1/auth/login', loginDetails,{ timeout: 10000 });
    return response.data;
}
