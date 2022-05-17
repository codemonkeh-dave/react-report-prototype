import { useEffect, useState } from 'react';
import React from 'react';
import Dropdown from './dropdown.js'
import Textbox from './textbox.js';

export default function ReportParams({ resetClicked, submitClicked, parameters }) {

    const [paramState, setParamState] = useState({});

    useEffect(() => {
        setParamState(parameters);
    }, [parameters])

    function handleInputChange(key, param, args) {
        param.value = args?.target?.value;
        setParamState({ ...paramState, [key]: param });
    }

    function dump(input) {
        return JSON.stringify(input, null, 2);
    }

    return (
        <>
            <div className="paramsContainer">
                <h1>Report Parameters</h1>
                
                    <div className="params">
                        {Object.keys(paramState).map((paramKey, index) => (
                            <div className="row" key={index}>
                                {paramState[paramKey].type === 'text' && (
                                    <>
                                        <Textbox parameter={paramState[paramKey]} paramKey={paramKey} handleInputChange={handleInputChange} />
                                    </>
                                )}
                                {paramState[paramKey].type === 'dropdown' && (
                                    <Dropdown parameter={paramState[paramKey]} paramKey={paramKey} handleInputChange={handleInputChange} />
                                )}
                            </div>
                        )
                        )}
                    </div>
                    <br />
                    <button className="reportButton" onClick={resetClicked}>Reset</button>
                    <button className="reportButton" onClick={() => submitClicked(paramState)}>Submit</button>
                
            </div>
        </>
    )
}