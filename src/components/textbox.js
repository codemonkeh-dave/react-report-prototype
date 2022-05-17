export default function TextInput({ parameter, paramKey, handleInputChange }) {
    return (
        <>
            <div className="label">{parameter.label}</div>
            <div className="input">
                <input type="text" value={parameter.value} onChange={(e) => { handleInputChange(paramKey, parameter, e) }} />
            </div>
        </>
    )
}