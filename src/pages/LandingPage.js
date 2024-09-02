import React, { useEffect, useState } from 'react';
import Attachment from './images/icons8-attachment-100.png';
import RemoveIcon from './images/icons8-wrong-96.png';
import SubmitIcon from './images/icons8-sent-96.png';
import './css/dashboard.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';
import ExplainCard from '../components/ExplainCard';
import ResultCard from '../components/ResultCard';
import CorrectUrlBottomForm from '../components/CorrectUrlBottomForm';
import aiGeneratedIcon from './images/star.png';
import { Tooltip } from 'react-tooltip';
import AiGenratedResponse from '../components/AiGenratedResponse';
import { useDispatch } from 'react-redux';
import {
  setCustomerSpecificGenratedResponse,
  setHtmlGenratedResponse,
  setModuleStateAgentProjectAndlevelCustomerSpecific,
  setOriginalGenratedResponse,
} from '../toolkit/genratedSopSlice';
import { useNavigate } from 'react-router-dom';
import { formatTime, startTimer, stopTimer } from '../utils/otherUtilitis';
import { prepareDataToSend } from '../utils/validation';
import { fetchPredictedData, fetchResource, generateSOPAPI, getProjectSpecificLevelAPI } from '../utils/apiCalls';

const Dashboard = () => {
  const [isOpenDialogueBoxToEnterCorrectData, setOpenDialogueBoxToEnterCorrectData] = useState(false);
  const [resource, setResouce] = useState({});
  const [getModuleStateAgentPageNumberGenratedSOP, setModuleStateAgentPageNumberGenratedSOPLink] = useState({});
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [predictedDataResult, setPredictedDataResult] = useState([]);
  const [explainable_data, setExplainable_data] = useState([]);
  const [sourceDocuments, setSourceDocuments] = useState([]);
  const fileInputRef = React.createRef();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [finalTime, setFinalTime] = useState('');
  const [customerSpecificValue, setCustomerSpecificValue] = useState('');
  const [aiGenrated, isAiGenrated] = useState(false);
  const [showTextLevelInput, setShowTextLevelInput] = useState(false);
  const [customerSpecificLeves, setCustomerSpecificLeves] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!timerRunning) {
      setFinalTime(formatTime(timer));
    }
  }, [timer, timerRunning]);

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFinalTime('');
      setFile(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileName(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
    fileInputRef.current.value = '';
    setResouce({});
  };

  const handleTextareaChange = (event) => {
    setFile(null);
    setFileName('');
    setTextareaValue(event.target.value);
  };

  const getInputFormStyle = () => {
    if (fileName || textareaValue) {
      return { minHeight: '17.8rem' };
    } else if (textareaValue) return { height: '4rem' };
  };
  const genrateSop = async (manageTimer = true) => {
    setResouce({});
    isAiGenrated(false);
    setShowTextLevelInput(false);
    setFinalTime('');
    setPredictedDataResult([]);
    setSourceDocuments([]);
    setTimer(0);
    setExplainable_data([])
    setCustomerSpecificValue('')
  
    let intervalId;
    if (manageTimer) {
      intervalId = startTimer(setTimer, setTimerRunning); // Start the timer only if manageTimer is true
    }
  

    try {
      setIsLoading(true);
      const dataToSend = prepareDataToSend(file, textareaValue, setIsLoading, () =>
        stopTimer(intervalId, setTimerRunning)
      );
      if (dataToSend) {
        const resourceData = await fetchResource(dataToSend, navigate);
        if (resourceData) {
          setResouce(resourceData);
          const prepareData = { ...resourceData, level: '', customer_specific: false };
          const response = await generateSOPAPI(prepareData, navigate);
          if (response) {
            isAiGenrated(true);
            dispatch(setOriginalGenratedResponse(response.orignal_generated_SOP));
            dispatch(setHtmlGenratedResponse(response.modified_SOP_html));
            dispatch(setModuleStateAgentProjectAndlevelCustomerSpecific(prepareData));
          }
        }
      }
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsLoading(false);
      stopTimer(intervalId, setTimerRunning);
    }
  };
  const handleSubmit = async () => {
    setResouce({});
    isAiGenrated(false);
    setOpenDialogueBoxToEnterCorrectData(false);
    setFinalTime('');
    setPredictedDataResult([]);
    setSourceDocuments([]);
    setTimer(0);
    const intervalId = startTimer(setTimer, setTimerRunning);
    try {
      setIsLoading(true);
      const dataToSend = prepareDataToSend(file, textareaValue, setIsLoading, () =>
        stopTimer(intervalId, setTimerRunning)
      );
      if (dataToSend) {
        const resourceData = await fetchResource(dataToSend, navigate);
        if (resourceData) {
          setResouce(resourceData);
          const response = await fetchPredictedData(dataToSend, navigate);
          if (response) {
            if(response.result.length>0){
            setPredictedDataResult(response.result);
            setExplainable_data(response.explainable_data[0]);
            setSourceDocuments(response.explainable_data[0]?.source_documents);
            }else{
              toast.warn("このアラートメールの応答が見つからないため、SOP を生成します")
              await genrateSop(false);
            }
            
          }
        }
      }
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsLoading(false);
      stopTimer(intervalId, setTimerRunning);
    }
  };
  /**
   * This function handles the event when a user clicks the "Incorrect" button (labelled "これが不正解")  on any card.
   * It opens a form below with a single text input field, allowing the user to provide the correct SOP URL.
   * This is necessary because each card contains a page number and SOP URL, which we need to pass to the API.
   *
   * We pass this function as a prop to the ResultCard component. When the user clicks the "Incorrect" button (labelled "これが不正解"),
   * we call this function with `true` to open the form and pass an object containing `{ page, link, passingdata }`.
   * These values are set in `setModuleStateAgentPageNumberGenratedSOPLink` and passed as props to the CorrectUrlBottomForm component.
   */
  const functionToIfUserClickOnSOPCardIsIncorrect = (trueOrFalse, otherdata) => {
    setOpenDialogueBoxToEnterCorrectData(false);
    setModuleStateAgentPageNumberGenratedSOPLink(otherdata);
    setOpenDialogueBoxToEnterCorrectData(trueOrFalse);
  };
  /** 
  * This function is triggered when the user clicks the "Generate Customer SOP" button.
  * It first checks if the `customerSpecificValue` is provided. If not, it displays an error message.
  * If the value is valid, it sets up a timer, starts loading, for the API call.
  * The function then calls the `generateSOPAPI` API to generate the SOP with the provided customer-specific value.
  * On successful API response, it updates the state with the generated SOP data and dispatches relevant Redux actions.
  * If the response is not an object, it displays a success message with the response data.
  * In case of an error, it shows an error message.
  * Finally, it stops the timer and stops loading.
  */
  const handleGenerateCustomerSOPClick = async () => {
    if (customerSpecificValue.trim() === '') {
      if(customerSpecificLeves.length<=0){
        toast.error('レベルを選択してください');
        return
      }
      toast.error('レベル値を選択してください');
      return;
    } else {
      isAiGenrated(false);
      setTimer(0);
      setIsLoading(true);
      const intervalId = startTimer(setTimer, setTimerRunning);
      try {
        const prepareData = { ...resource, level: customerSpecificValue, customer_specific: true };
        const response = await generateSOPAPI(prepareData, navigate);
        if (response) {
          isAiGenrated(true);
          dispatch(setCustomerSpecificGenratedResponse(response.orignal_generated_SOP));
          dispatch(setHtmlGenratedResponse(response.modified_SOP_html));
          dispatch(setModuleStateAgentProjectAndlevelCustomerSpecific(prepareData));
        }
      } catch (err) {
        toast.error(err?.message);
      } finally {
        setIsLoading(false);
        stopTimer(intervalId, setTimerRunning);
      }
    }
  };

  /**
   * this function only remove SOP card from array which user deleted after successfully return 
   * we need to pass this function in Result card in in Result Card we after calling Delete API we call this function to remove from Array
   * @param {*} pageNumber -sop page number from card  
   */
  const RemoveSOPFromScreen = (pageNumber) => {
    setPredictedDataResult(prevData =>
      prevData.filter(item => item.page !== pageNumber)
    );
  }
  const getProjectSpecificLevel = async () => {
    setShowTextLevelInput(!showTextLevelInput)
    setCustomerSpecificLeves([])
    if(!showTextLevelInput){
      const response = await  getProjectSpecificLevelAPI({project:resource['project']})
      if(response){
      console.log(response?.troubleshoot_level)
      setCustomerSpecificLeves(response?.troubleshoot_level)
      }
    }
  }

  return (
    <>
      <div className="input-container">
        <div className="input-form-email" style={getInputFormStyle()}>
          <input
            type="file"
            size="60"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".txt,.eml"
          />
          <img
            src={Attachment}
            alt="attachment"
            aria-label="Attach a file"
            className="attachment-icon"
            onClick={handleIconClick}
          />
          {fileName && (
            <span className="show_selected_filedata" style={{ marginLeft: '10px' }}>
              {fileName}
            </span>
          )}
          {!fileName && (
            <textarea
              className="email_text_upload_text"
              placeholder="add email data"
              rows={6}
              value={textareaValue}
              onChange={handleTextareaChange}
            />
          )}
          {fileName && <img src={RemoveIcon} onClick={handleRemoveFile} alt="removeIcon" className="attachment-icon" />}
          {!isLoading && (
            <>
              <img
                src={aiGeneratedIcon}
                onClick={() => genrateSop()}
                alt="sendIcon"
                className="attachment-icon ai_attachment"
                // title="Generate SOP"
                data-tooltip-id="get-sop-tool-tip"
                data-tooltip-content="Generate SOP"
              />
              <img
                src={SubmitIcon}
                onClick={handleSubmit}
                alt="sendIcon"
                className="attachment-icon"
                data-tooltip-id="get-sop-tool-tip"
                data-tooltip-content="Get SOP"
              />
              <Tooltip id="get-sop-tool-tip" />
            </>
          )}
        </div>
      </div>
      {timerRunning && <div className="timer">Time elapsed: {formatTime(timer)}</div>}
      {!isLoading && Object.keys(resource).length > 0 && finalTime && (
        <div className="timer">Total time taken: {finalTime}</div>
      )}

      {resource && Object.keys(resource).length > 0 && (
        <div className="resource-with-time">
          <div className="resource-info">
            <ul>
              {Object.keys(resource).map((key) => (
                <li key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong> : {resource[key]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="skeleton-wrapper">
          <SkeletonTheme baseColor="#F1EFF1" highlightColor="#ddd">
            <p>
              <Skeleton count={8} />
            </p>
          </SkeletonTheme>
        </div>
      )}

      {!isLoading && (
        <div className="resultcards">
          {predictedDataResult.map((card, index) => (
            <ResultCard
              key={index}
              identifier={card.識別子}
              module={card.モジュール}
              agent={card.エージェント}
              state={card.状態}
              wiki={card.wiki}
              passingdata={explainable_data}
              link={card.SOP_url}
              page={card.page}
              collectDataIfUserClickOnIncorrectSOP={functionToIfUserClickOnSOPCardIsIncorrect}
              project={resource['project']}
              removeSOPFromScreen={RemoveSOPFromScreen}
            />
          ))}
        </div>
      )}

      {!isLoading && !aiGenrated && isOpenDialogueBoxToEnterCorrectData && (
        <div className="resultcards_data">
          <CorrectUrlBottomForm
            requireddata={getModuleStateAgentPageNumberGenratedSOP}
            changeState={setOpenDialogueBoxToEnterCorrectData}
            project={resource['project']}
          />
        </div>
      )}

      {!isLoading && sourceDocuments.length > 0 && (
        <div className="explainable_data">
          <hr />
          {predictedDataResult.length > 0 && (
            <>
              <h1>Explainable Data</h1>
              <p className="main_data">
                <span className="key">モジュール </span>: {explainable_data?.モジュール}
              </p>
              <p className="main_data">
                <span className="key">状態 </span>: {explainable_data?.状態}
              </p>
              <p className="main_data">
                <span className="key">エージェント </span>: {explainable_data?.エージェント}
              </p>
              <p className="main_data">
                <span className="key">query </span>: {explainable_data?.query}
              </p>
              <h2>Source Documents</h2>
            </>
          )}
          <div className="explain_data_documents">
            {sourceDocuments.map((doc, index) => (
              <ExplainCard
                key={index}
                page={doc.ページ}
                wiki_content={doc.ウィキコンテンツ}
                wiki_title={doc.ウィキタイトル}
                state={doc.状態}
                agent={doc.エージェント}
                identifier={doc.識別子}
                module={doc.モジュール}
              />
            ))}
          </div>
        </div>
      )}
      {aiGenrated && (
        <>
          <div className="customer_specific_section">
            <div>
              <button onClick={() => getProjectSpecificLevel()}>顧客固有のSOP</button>
            </div>

            {showTextLevelInput && (
              <div className="submit_custom_info_to_genrate_sop">
                <select
                className="customer_specific_section_input_field"
            id="level"
            value={customerSpecificValue}
            onChange={(e) => setCustomerSpecificValue(e.target.value)}
          >
            <option value="" disabled>レベル選択</option>
            {customerSpecificLeves.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
                <img
                  src={SubmitIcon}
                  onClick={handleGenerateCustomerSOPClick}
                  alt="sendIcon"
                  className="send_icos_genrate_custom_sop"
                  data-tooltip-id="get-sop-tool-tip"
                  data-tooltip-content="Generate Customer Sp. SOP"
                />
              </div>
            )}
          </div>
          <AiGenratedResponse />
        </>
      )}
    </>
  );
};

export default Dashboard;
