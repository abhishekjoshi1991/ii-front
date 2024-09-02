import { privateAxios } from "./helper";
/**
 * Passes email data and gets the predicted URL.
 * 
 * @param {Object} data - The data to be sent in the request. Expected keys:
 *                        - emails: File (if a file is being uploaded)
 *                        - email: string (if text data is being submitted)
 * @returns {Promise<Object>} The response from the server, which includes the predicted URL.
 */
export const PASS_EMAIL_AND_GET_PREDICTED_URL_API = async (data) => {
    const response = await privateAxios.post(`/api/v1/pass_email_data`, data);
    return response;
}
/**
 * Passes resource information and gets the generated SOP.
 * 
 * @param {Object} data - The data to be sent in the request. Expected keys: 
 *                        - module: string 
 *                        - agent: string 
 *                        - state: string
 *                        - project: string
 * @returns {Promise<Object>} The response from the server.
 */
export const PASS_RESOURCE_INFO_GET_GENERATED_SOP_API = async (data) => {
    const response = await privateAxios.post(`/api/v1/genratedsop`, data);
    return response; 
}
/**
 * Sends module state agent data to the server.
 * 
 * @param {Object} data - The data to be sent in the request. Expected keys: 
 *                        - emails: file (if a file is being uploaded)
 *                        - email: string (if text data is being submitted)
 * @returns {Promise<Object>} The response from the server.
 */
export const GET_MODULE_STATE_AGENT_API = async (data) => {
    const response = await privateAxios.post(`/api/v1/sendmoduledata`, data);
    return response;
}
/**
 * Sends the correct SOP URL to the server for validation.
 * 
 * @param {Object} data - The data to be sent in the request. Expected keys: 
 *                        - generated_sop: string (URL of the generated SOP)
 *                        - correct_sop: string (URL of the correct SOP)
 *                        - sop_type: string (type of SOP, e.g., "correct", "ignore", "incorrect")
 *                        - page_number: number (page number of the SOP)
 *                        - module: string (module related to the SOP)
 *                        - state: string (state related to the SOP)
 *                        - agent: string (agent related to the SOP)
 *                        - prepared_query: string (query prepared for the SOP)
 *                        - project: string (project related to the SOP)
 * @returns {Promise<Object>} The response from the server.
 */
export const PASS_CORRECT_SOP_URL_API = async (data) => {
    const response = await privateAxios.post(`/api/v1/pass_validate_data`, data);
    return response;
}
/**
 * Deletes SOP from the database.
 * 
 * @param {number} deleteSopPageNumber - The page number of the SOP to be deleted.
 * @returns {Promise<Object>} The response from the server.
 */
export const DELETE_SOP_FROM_DATABASE_API = async (deleteSopPageNumber) => {
    console.log(deleteSopPageNumber)
        const response = await privateAxios.delete(`/api/v1/delete_sop_api/${deleteSopPageNumber}`);
    return response;
}
/**
 * GET_PROJECT_SPECIFIC_LEVELS_API S
 * 
 * @param {String} project_name - The Project name is required
 * @returns {Promise<Object>} The response from the server.
 */
export const GET_PROJECT_SPECIFIC_LEVELS_API = async (project_name) => {
        const response = await privateAxios.post(`/api/v1/get_project_specific_level`,project_name);
        return response;
}
/**
 * Submits feedback for a generated SOP to the server.
 * 
 * @param {Object} moduleStateAgent - The state of the module agent.
 * @param {string} originalGenratedSop - The original generated SOP.
 * @param {string} [customer_specific_sop_input=''] - Optional customer-specific SOP input.
 * @param {string} [modified_generated_sop=''] - Optional modified SOP input.
 * @param {string} [modified_customer_specific_sop=''] - Optional modified SOP input.
 * @param {string} [feedback_input=''] - Optional feedback input.
 * @returns {Promise<Object>} The response from the server.
 */
export const GENERATED_SOP_FEEDBACK_API = async (moduleStateAgent,originalGenratedSop,customer_specific_sop_input='',modified_generated_sop='',modified_customer_specific_sop='',feedback_input='') => {
        const prepData={...moduleStateAgent,generated_sop:originalGenratedSop,customer_specific_sop:customer_specific_sop_input,modified_generated_sop:modified_generated_sop,modified_customer_specific_sop,feedback:feedback_input}
        const response = await privateAxios.post(`/api/v1/generated_sop_feedback`, prepData);
        return response;
}
