export default function TextInput({parameter, paramKey, handleInputChange}) {
    return (
        <>
            <tr>
                <td>{parameter.label}</td>
                <td>
                    <input type="text" value={parameter.value} onChange={(e) => { handleInputChange(paramKey, parameter, e) }} />
                </td>
            </tr>
        </>
    )
}