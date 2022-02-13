//This makes a row in a table that has input fields with previous values that can be edited
//In the last column there are save and cancel buttons
function EditableRow({editFormData, handleEditFormChange, handleCancelClick}) {
    

    return(
        <tr>
            <td>
                <input 
                    type="text" 
                    name="firstName" 
                    required 
                    placeholder="Etunimi"
                    value={editFormData.firstName}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input 
                    type="text" 
                    name="lastName" 
                    required 
                    placeholder="Sukunimi"
                    value={editFormData.lastName}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <input 
                    type="number" 
                    min="0"
                    name="age" 
                    required 
                    placeholder="Ikä"
                    value={editFormData.age}
                    onChange={handleEditFormChange}
                />
            </td>
            <td>
                <button type="submit">Tallenna</button>
                <button type="button" onClick={handleCancelClick}>Peruuta</button>
            </td>
        </tr>
    )
}

export default EditableRow;