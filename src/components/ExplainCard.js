import React from 'react';
import './css/card.css';

const ExplainCard = ({ page, wiki_content, wiki_title, state, agent, identifier, module }) => {
    return (
        <div className="ExplainCard">
            <div>
                <p>{identifier ? (<><b>識別子 </b> : {identifier}</>) : ""}</p>
            </div>
            <div>
                <p>{module ? (<><b>モジュール  </b> : {module}</>) : ""}</p>
            </div>
            <div>
                <p>{agent ? (<><b>エージェント  </b> : {agent}</>) : ""}</p>
            </div>
            <div>
                <p>{state ? (<><b>状態 : </b> : {state}</>) : ""}</p>
            </div>
            <div>
                <p>{wiki_title ? (<><b>ウィキタイトル  </b>  : {wiki_title}</>) : ""}</p>
            </div>
            <div>
                <p>{wiki_content ? (<><b>ウィキコンテンツ  </b>  : {wiki_content}</>) : ""}</p>
            </div>
            <div>
                <p>{page ? (<><b>ページ  </b>  : {page}</>) : ""}</p>
            </div>
        </div>
    );
};

export default ExplainCard;
