import React, { useState } from 'react';
import './css/resultCard.css';
import { BiSolidRightArrowCircle } from 'react-icons/bi';
import { FaCheckCircle } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import Info from '../pages/images/icons8-info-96.png';
import { toast } from 'react-toastify';
import { DELETE_SOP_FROM_DATABASE_API, PASS_CORRECT_SOP_URL_API } from '../services/plan-service';
import {Modal, ModalBody, ModalFooter, ModalHeader } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { handleSessionExpiration } from '../utils/authUtils';


const ResultCard = ({ identifier, module, agent, state, wiki, page, link, passingdata, collectDataIfUserClickOnIncorrectSOP, project,removeSOPFromScreen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleModal = () => setModalOpen(!modalOpen);

  const handleClick = () => {
    collectDataIfUserClickOnIncorrectSOP(isOpen, { page, link, passingdata });
    setIsOpen(!isOpen);

    const element = document.querySelector('.resultcards_data');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    if (isOpen) {
      window.scrollBy({ top: 140, left: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -140, left: 0, behavior: 'smooth' });
    }
  };

  const handleUserResponse = async (...passedData) => {
    let generatedData = {};
    const [generated_sop, page_number, module, state, agent, prepared_query, project] = passedData;

    generatedData['generated_sop'] = generated_sop;
    generatedData['correct_sop'] = generated_sop;
    generatedData['sop_type'] = 'correct';
    generatedData['page_number'] = page_number;
    generatedData['module'] = module;
    generatedData['state'] = state;
    generatedData['agent'] = agent;
    generatedData['prepared_query'] = prepared_query;
    generatedData['project'] = project;

    try {
      const response = await PASS_CORRECT_SOP_URL_API(generatedData);
      if (response.status === 200) {
        if (response.data === null) {
          toast.success('Already Done');
        } else {
          toast.success(response.data);
        }
      }
    } catch (err) {
      console.error(err);
      handleSessionExpiration(err,navigate)
    }
  };

  const handleArrowButtonClick = (link) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      toast.warn('No link provided for arrow-button');
      console.warn('No link provided for arrow-button');
    }
  };

  const handleDeleteSop = (pageNumber) => {
    DELETE_SOP_FROM_DATABASE_API(pageNumber)
      .then((res) => {
        if (res.status === 200) {
          removeSOPFromScreen(pageNumber)
          toggleModal();
          toast.success(res.data?.message);
          
        }
      })
      .catch((err) => {
        handleSessionExpiration(err,navigate)
        console.error(err);
      });
  };

  return (
    <div className={`all_cards`}>
      <div className="resultcard">
        <button className="arrow-button" onClick={() => handleArrowButtonClick(link)}>
          <BiSolidRightArrowCircle size={'2rem'} /> この手順をみる
        </button>

        <div className="result_details">
          <span>識別子</span>
          <strong>{identifier}</strong>
        </div>
        <div>
          <span>モジュール</span>
          <strong>{module}</strong>
        </div>
        <div>
          <span>エージェント</span>
          <strong>{agent}</strong>
        </div>
        <div>
          <span>状態</span>
          <strong>{state}</strong>
        </div>
        <div>
          <span>wiki</span>
          <strong>{wiki}</strong>
        </div>
        <div>
          <hr />
          <span className="feedback">
            <img src={Info} alt="Feedback img" className="feedback_ico" />
            feedback
          </span>

          <button
            onClick={() =>
              handleUserResponse(
                link,
                page,
                passingdata.モジュール,
                passingdata.状態,
                passingdata.エージェント,
                passingdata.query,
                project
              )
            }
          >
            <FaCheckCircle size={'1.7rem'} /> これが正解
          </button>

          <button className="orange_button" onClick={() => handleClick()}>
            <TiDelete size={'2.2rem'} />
            これが不正解
          </button>
          <div>
            <button onClick={toggleModal}>
              <TiDelete size={'2.2rem'} /> これは対応手順ではない
            </button>
          </div>
        </div>
      </div>
      <Modal show={modalOpen} onHide={toggleModal}>
        <ModalHeader closeButton>削除確認</ModalHeader>
        <ModalBody>この SOP を Vector データベースから削除してもよろしいですか?</ModalBody>
        <ModalFooter>
        <button className='cancel_delete_sop' onClick={toggleModal}>
        キャンセル
          </button>
          <button className='confirm_delete_sop' onClick={() => handleDeleteSop(page)}>
          確認
          </button>
          
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ResultCard;
