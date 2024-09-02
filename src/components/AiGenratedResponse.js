import React, { useCallback, useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaPencilRuler } from 'react-icons/fa';
import {  Modal } from 'react-bootstrap';
import aiGeneratedIcon from '../pages/images/star.png';
import {  useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { GENERATED_SOP_FEEDBACK_API } from '../services/plan-service';
import './css/aigenratedComponent.css'
import { useNavigate } from 'react-router-dom';
import { handleSessionExpiration } from '../utils/authUtils';
const AiGenratedResponse = () => {
  const navigate = useNavigate();
  const [improvementTextareaValue, setImprovementTextareaValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [htmlData, setHtmlData] = useState('');
  const [isCustomerSpecific,setIsCustomerSpecific] = useState(false)
  const [originalAiResponse, setOriginalResponse] = useState('');
  const [moduleStateAgent, setModuleStateAgent] = useState({});
  const [customerSpecific_SOP, setCustomerSpecific_SOP] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editedCustomerSpecificSOP, setEditedCustomerSpecificSOP] = useState('');
  const [editedGenratedSOP, setEditGenratedSOP] = useState('');
  const genratedAiResponse = useSelector((state) => state.genrated.originalGenratedResponse);
  const genratedHtmlAiResponse = useSelector((state) => state.genrated.htmlGenratedResponse);
  const genratedCustomerSpecificAiResponse = useSelector((state) => state.genrated.customerSpecificGenratedResponse);
  const getOriginalSOPGenratedModified = useSelector((state) => state.genrated.editedGenreatedImprovements);
  const getModuleStateAgentProjectAndlevelCustomerSpecific = useSelector(
    (state) => state.genrated.moduleStateAgentProjectAndLevelCustomerSpecificFlag
  );
  useEffect(() => {
    setOriginalResponse(genratedAiResponse);
    setHtmlData(genratedHtmlAiResponse);
    if (getModuleStateAgentProjectAndlevelCustomerSpecific) {
      const { level, customer_specific, ...rest } = getModuleStateAgentProjectAndlevelCustomerSpecific;
      if (customer_specific) {
        setCustomerSpecific_SOP(genratedCustomerSpecificAiResponse);
        setImprovementTextareaValue(genratedCustomerSpecificAiResponse);
        setEditGenratedSOP(getOriginalSOPGenratedModified)
        setIsCustomerSpecific(true)
      } else {
        setImprovementTextareaValue(genratedAiResponse);
        setIsCustomerSpecific(false)
       
      }
      setModuleStateAgent(rest);
    }
  }, [
    getOriginalSOPGenratedModified,
    genratedAiResponse,
    genratedHtmlAiResponse,
    getModuleStateAgentProjectAndlevelCustomerSpecific,
    genratedCustomerSpecificAiResponse,
  ]);
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleCorrectSop = async () => {
    try {
      const response = await GENERATED_SOP_FEEDBACK_API(
        moduleStateAgent,
        originalAiResponse,
        customerSpecific_SOP,
        originalAiResponse,
        editedCustomerSpecificSOP,
        '',
        ''
      );
      if (response?.status === 200) {
        toast.success(response?.data?.message);
      }
    } catch (err) {
      handleSessionExpiration(err,navigate)
      console.error(err);
    }
  };
  const handleNeedImprovementApiSubmitSop = async () => {
    try {
      const response = await GENERATED_SOP_FEEDBACK_API(
        moduleStateAgent,
        originalAiResponse,
        customerSpecific_SOP,
        editedGenratedSOP,
        editedCustomerSpecificSOP,
        feedback
      );
      if (response?.status === 200) {
        toast.success(response?.data.message);
        setShowModal(false);
      }
    } catch (err) {
     handleSessionExpiration(err,navigate)
      console.error(err);
    }
  };
  const handleImprovementChange = useCallback(
    (e) => {
      const value = e.target.value;
      if (isCustomerSpecific) {
        setEditedCustomerSpecificSOP(value);
      } else {
        setEditGenratedSOP(value);
      }
      setImprovementTextareaValue(value);
    },
    [ isCustomerSpecific] // Make sure the dependencies are accurate
  );
  return (
    <div className='ai_genrated_response'>
      <div className="html-sop">
        <div className="html_content">
          <div  dangerouslySetInnerHTML={{ __html: htmlData }} />
        </div>
        <div className="genratedIconMainDiv">
          <img className="generated_icon" src={aiGeneratedIcon} alt="generated_sop" />
        </div>
      </div>
      <div className="html-sop-buttons">
        <button onClick={handleCorrectSop}>
          <FaCheckCircle size={'1.7rem'} /> 正しい
        </button>
        <button onClick={handleShowModal}>
          <FaPencilRuler size={'1.6rem'} /> 改善
        </button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal-width">
        <Modal.Header closeButton>
          <div>
            <Modal.Title>生成されたSOP</Modal.Title>
          </div>
        </Modal.Header>

        <Modal.Body>
          <p>(必要に応じてこの SOP を変更して下さい)</p>
          <textarea
            className="form-control"
            placeholder="Modify this SOP if required"
            value={improvementTextareaValue}
            onChange={handleImprovementChange}
            rows={16}
          />
          <br />
          <textarea
            className="form-control"
            placeholder="ここにフィードバックと改善点を入力してください"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={2}
          />
        </Modal.Body>
        <Modal.Footer>

          <button className='close_model_improve_text'  onClick={handleCloseModal}>
          閉じる
          </button>
          <button className='submit_model_improve_text'  onClick={handleNeedImprovementApiSubmitSop}>
          実行
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AiGenratedResponse;
