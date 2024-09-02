import React, { useState } from 'react'
import SendButton from "../pages/images/icons8-sent-96.png"
import './css/resultCard.css'
import { toast } from 'react-toastify';
import { PASS_CORRECT_SOP_URL_API } from '../services/plan-service';
import { useNavigate } from 'react-router-dom';
import { handleSessionExpiration } from '../utils/authUtils';

const CorrectUrlBottomForm = (props) => {
    const [correctUrl, setCorrectUrl] = useState('');
    const { link, page, passingdata: { モジュール, 状態, エージェント, query } } = props.requireddata;
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!correctUrl) {
            toast.error("Please Add URL")
            return;
        } else {
           
            let genratedData = {};
            genratedData["generated_sop"] = link;
            genratedData["correct_sop"] = correctUrl;
            genratedData["sop_type"] = "incorrect";
            genratedData["page_number"] = page;
            genratedData["module"] = モジュール;
            genratedData["state"] = 状態;
            genratedData["agent"] = エージェント;
            genratedData["prepared_query"] = query;
            genratedData["project"]=props.project
            try {
                const response = await PASS_CORRECT_SOP_URL_API(genratedData)
                if (response.status === 200) {
                    if (response.data === null) {
                        toast.success("すでに完了しました")
                    } else {
                        toast.success(response.data)
                    }
                    console.log(response);
                    setCorrectUrl("");
                    props.changeState(false);
                }
            } catch (err) {
               handleSessionExpiration(err,navigate)
                console.error(err)
            }
        }
    };

    return (

        <div className={`animated-div`}>
            <div className="resultcardupdate">
                <div>
                    <input
                        type="text"
                        className="add_correct_sop_url"
                        placeholder="Add Correct Url"
                        onChange={(e) => setCorrectUrl(e.target.value)}
                    />
                </div>
                <div className="result_card_buttons">
                    <img
                        src={SendButton}
                        alt="sendIcon"
                        className="result_radio_icons"
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>

    );
}

export default CorrectUrlBottomForm;