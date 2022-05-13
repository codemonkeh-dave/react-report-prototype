import { useEffect, useState } from 'react'

export default function Dropdown({ label, endpoint }) {

    const [dropdownItems, setDropdownItems] = useState([]);

    useEffect(() => {
        console.log('dropdown')

        fetch(endpoint)
            .then((response) => {
                if (!response.ok) {
                    setError(true);
                    return;
                }
                return response.json();
            })
            .then((response) => {
                setDropdownItems(response.result ?? []);
            })
    }, []);

    return (
        <tr>
            <td>{label}</td>
            <td>
                <select>
                    {dropdownItems.map((dropdownItem) => (
                        <>
                            <option value={dropdownItem.value}>{dropdownItem.text}</option>
                        </>

                    ))}
                </select>

            </td>
        </tr>
    )
}