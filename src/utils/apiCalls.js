// apiCalls.js
import {
  GET_MODULE_STATE_AGENT_API,
  GET_PROJECT_SPECIFIC_LEVELS_API,
  PASS_EMAIL_AND_GET_PREDICTED_URL_API,
  PASS_RESOURCE_INFO_GET_GENERATED_SOP_API,
} from '../services/plan-service';

import { toast } from 'react-toastify';
import { handleSessionExpiration } from './authUtils';

export const fetchResource = async (dataToSend, navigate) => {
  try {
    const resourceApi = await GET_MODULE_STATE_AGENT_API(dataToSend);
    if (typeof resourceApi.data === 'object') {
      return resourceApi.data;
    } else {
      toast.success(resourceApi.data);
      return false;
    }
  } catch (err) {
    handleSessionExpiration(err, navigate);
    throw err;
  }
};

export const fetchPredictedData = async (dataToSend, navigate) => {
  try {
    const response = await PASS_EMAIL_AND_GET_PREDICTED_URL_API(dataToSend);
    console.log(response.data)
    if (typeof response.data === 'object') {
      return response.data;
    } else {
      toast.success(response.data);
      return false;
    }
  } catch (err) {
    handleSessionExpiration(err, navigate);
    throw err;
  }
};

export const generateSOPAPI = async (prepareData, navigate) => {
  try {
    const response = await PASS_RESOURCE_INFO_GET_GENERATED_SOP_API(prepareData);
    if (typeof response.data === 'object') {
      return response.data;
    } else {
      toast.success(response.data);
      return false;
    }
  } catch (err) {
    handleSessionExpiration(err, navigate);
    throw err;
  }
};
export const getProjectSpecificLevelAPI = async (project, navigate) => {
  try {
    const response = await GET_PROJECT_SPECIFIC_LEVELS_API(project);
    if (typeof response.data === 'object') {
      return response.data;
    } else {
      toast.success(response.data);
      return false;
    }
  } catch (err) {
    if(err.response?.status ===404){
      toast.error("レベルが見つかりません")
      return false;
    }else{
      handleSessionExpiration(err, navigate);
      throw err;
    }
  
  }
};
