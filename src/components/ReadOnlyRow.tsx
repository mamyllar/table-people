//This makes a normal row to the table and shows edit and delete buttons at the end
function ReadOnlyRow({ person, handleEditClick, handleDeleteClick}) {
    

    return(
        <tr>
            <td>{person.firstName}</td>
            <td>{person.lastName}</td>
            <td>{person.age}</td>
            <td>
                <button type="button" onClick={(event) => handleEditClick(event,person)}>Muokkaa</button>
                <button type="button" onClick={()=> handleDeleteClick(person.id)}>Poista</button>
            </td>
        </tr>
    )
}

export default ReadOnlyRow;