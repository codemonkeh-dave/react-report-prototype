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
        // console.log('key', key)
        // console.log('param', param)
        // console.log('args', args)

        param.value = args?.target?.value;
        setParamState({ ...paramState, [key]: param });
    }

    function dump(input) {
        return JSON.stringify(input, null, 2);
    }

    return (
        <>
            <div className="report">
                {/* <pre>{dump(paramState)}</pre> */}
                <h1>Report Parameters</h1>

                <table className="params">
                    <tbody>
                        {Object.keys(paramState).map((paramKey, index) => (
                            <React.Fragment key={index}>
                                {paramState[paramKey].type === 'text' && (
                                    <>
                                        <Textbox parameter={paramState[paramKey]} paramKey={paramKey} handleInputChange={handleInputChange} />
                                    </>
                                )}
                                {paramState[paramKey].type === 'dropdown' && (
                                    <Dropdown parameter={paramState[paramKey]} paramKey={paramKey} handleInputChange={handleInputChange}  />
                                )}
                            </React.Fragment>
                        )
                        )}
                    </tbody>
                </table>
                <br />
                <button onClick={resetClicked}>Reset</button>
                <button onClick={() => submitClicked(paramState)}>Submit</button>
            </div>
        </>
    )
}