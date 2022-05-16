import { useEffect, useState } from 'react'
import React from 'react';

export default function Dropdown({ parameter, paramKey, handleInputChange }) {

    const [dropdownItems, setDropdownItems] = useState([]);

    useEffect(() => {
        fetch(parameter.endpoint.url)
            .then((response) => {
                if (!response.ok) {
                    setError(true);
                    return;
                }
                return response.json();
            })
            .then((response) => {
                setDropdownItems(response.result ?? []);

                if (parameter.emptyOption){
                    handleInputChange(paramKey, parameter, { target: { value: parameter.emptyOption.value ?? '' } })
                }
                else{
                    handleInputChange(paramKey, parameter, { target: { value: response?.result[0]?.value ?? '' } })
                }
            })
    }, []);

    return (
        <tr>
            <td>{parameter.label}</td>
            <td>

                <select onChange={(e) => { handleInputChange(paramKey, parameter, e) }}>
                    {parameter.emptyOption && (
                        <option value={parameter.emptyOption.value}>{parameter.emptyOption.text}</option>
                    )}
                    {dropdownItems.map((dropdownItem, index) => (
                        <React.Fragment key={index}>
                            <option value={dropdownItem.value}>{dropdownItem.text}</option>
                        </React.Fragment>
                    ))}
                </select>
            </td>
        </tr>
    )
}