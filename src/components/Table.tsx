import { Fragment, MouseEventHandler, useCallback, useState } from "react";
import { nanoid } from "nanoid";
import data from "../data.json"; //mock data
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";

//Declaring types of some variables
type Data = typeof data
type SortKeys = keyof Data[0]
type SortOrder = 'asc' | 'desc'

const Table = () => {

    //Constructing a set of data, first from the mock data we have in data.json
    const [people, setPeople] = useState<Data>(data);

    //Variables for sorting the table
    const [sortKey, setSortKey] = useState<SortKeys>("id");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

    //Function for sorting the data set
    function sortData({peopleData: peopleData, sortKey, reverse}: {peopleData: Data, sortKey: SortKeys; reverse: boolean;}) {
        //Sorts in ascending order
        const sortedPeople = peopleData.sort((a, b) =>{
            return a[sortKey] > b[sortKey] ? 1 : -1
        })

        //reverse is true when sortOrder === 'desc'
        if (reverse) {
            return sortedPeople.reverse();
        }

        return sortedPeople;
    }

    //Function for reversing the sorting order
    function changeSort(key: SortKeys){
        setSortOrder(sortOrder === 'asc' ? 'desc': 'asc');

        setSortKey(key);
    }

    //Makes the sorted data set
    const sortedPeople = useCallback(() => sortData({peopleData: people, sortKey, reverse: sortOrder === 'desc'}), [people, sortKey, sortOrder])

    //Here is saved/tracked what is in form inputs
    //It is possible to use same variable for both add new form and edit form, but for clarity they are seperate
    const [addFormData, setAddFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
    });
    const [editFormData, setEditFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
    });

    //For setting which row is in editing
    const [editPersonId, setEditPersonId] = useState(null); 


    //Button next to table heders for sorting, on click sorts by that column
    //Every other sort is descending order while every other is ascending (even if user clicks different columns)
    function SortButton({sortOrder, columnKey, sortKey, onClick}: {sortOrder: SortOrder; columnKey: SortKeys; sortKey: SortKeys; onClick: MouseEventHandler<HTMLButtonElement>;}){
        return( <button onClick={onClick} className={`${sortKey === columnKey && sortOrder === 'desc' ? 'sort-button sort-reverse' : 'sort-button'}`}>
            ▲
        </button>);
    }

    //Reads the change in form inputs whenever user makes a change to them
    function handleAddFormChange(event) {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...addFormData };
        newFormData[fieldName] = fieldValue;

        setAddFormData(newFormData);
    }

    //Reads the change in edit form inputs whenever user makes a change to them
    function handleEditFormChange(event) {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    }

    //When user submits new person through form for adding into the table
    function handleAddFormSubmit(event) {
        event.preventDefault();

        const newPerson = {
            id: nanoid(),
            firstName: addFormData.firstName.charAt(0).toUpperCase() + addFormData.firstName.slice(1),
            lastName: addFormData.lastName.charAt(0).toUpperCase() + addFormData.lastName.slice(1),
            age: parseInt(addFormData.age),
        };

        const newPeople = [...people, newPerson];
        setPeople(newPeople);

    } 

    //When user saves edits, the data set is changed to include those changes
    function handleEditFormSubmit(event) {
        event.preventDefault();

        const editedPerson = {
            id: editPersonId,
            firstName: editFormData.firstName.charAt(0).toUpperCase() + editFormData.firstName.slice(1),
            lastName: editFormData.lastName.charAt(0).toUpperCase() + editFormData.lastName.slice(1),
            age: parseInt(editFormData.age),
        };

        const newPeople = [...people];

        const index = people.findIndex((person) => person.id === editPersonId);

        newPeople[index] = editedPerson;

        setPeople(newPeople);
        setEditPersonId(null);
    }

    //When user clicks edit, the row becomes editable and current values are passed to the edit form
    function handleEditClick(event, person) {
        event.preventDefault();

        setEditPersonId(person.id);

        const formValues = {
            firstName: person.firstName,
            lastName: person.lastName,
            age: person.age,
        };

        setEditFormData(formValues);
    }

    //Handler for cancelling edit mode
    function handleCancelClick() {
        setEditPersonId(null);
    }

    //Handler for when user presses delete-button to delete a row in the table
    function handleDeleteClick(personId) {
        const newPeople = [...people];

        const index = people.findIndex((person) => person.id === personId); //getting index of the person in the deletable row

        newPeople.splice(index, 1); //removing the person from data set

        setPeople(newPeople); //setting data set with row removed
    }

    
    //Keys for sorting and labels to view in table header
    const headers : { key: SortKeys, label: string }[]= [
        { key: "firstName", label: "Etunimi"},
        { key: "lastName", label: "Sukunimi"},
        { key: "age", label: "Ikä"},
    ];

    return (
        <div>
            <form onSubmit={handleEditFormSubmit}>{/*This is for submitting an edit, submit button is found in EditableRow.tsx */}
                <table>
                    <thead>
                        <tr>
                            {headers.map((row) => {
                                return <th key={row.key}>
                                    {row.label}
                                    <SortButton columnKey={row.key} onClick={() => changeSort(row.key)}
                                    {...{
                                        sortOrder,
                                        sortKey,
                                    }}/>
                                </th>;
                            })}
                            <th key="Actions">Toiminnot</th>{/* This column is seperate, because there is no need for sorting */}
                        </tr>
                    </thead>

                    <tbody>
                        {sortedPeople().map((person) => {
                            return (
                                //If user is editing a row, the row will be made with EditableRow.tsx
                                //Otherwise rows are made with ReadOnlyRow.tsx
                                <Fragment>
                                    {editPersonId === person.id ? (
                                        <EditableRow 
                                            editFormData={editFormData} //For user to see and edit previous inputs
                                            handleEditFormChange={handleEditFormChange} 
                                            handleCancelClick={handleCancelClick}
                                        /> 
                                    ) : ( 
                                        <ReadOnlyRow 
                                            person={person} 
                                            handleEditClick={handleEditClick}
                                            handleDeleteClick={handleDeleteClick}
                                        />
                                    )}
                                </Fragment>
                                
                            )
                        })}
                    </tbody>
                </table>
            </form>

            
            <h1>Lisää uusi henkilö taulukkoon</h1>
            {/* Form for adding a new person.
            Has submit button and reset button for emptying form.
            Does not automatically empty form on submit. */}
            <form  id="add-person-form" onSubmit={handleAddFormSubmit}>
                <input 
                    type="text" 
                    name="firstName" 
                    required 
                    placeholder="Etunimi" 
                    onChange={handleAddFormChange} 
                />
                <input 
                    type="text" 
                    name="lastName" 
                    required 
                    placeholder="Sukunimi" 
                    onChange={handleAddFormChange} 
                />
                <input 
                    type="number" 
                    min="0"
                    name="age"
                    required 
                    placeholder="Ikä" 
                    onChange={handleAddFormChange} 
                />
                <button type="submit">Lisää</button>
                <button type="reset">Tyhjennä</button>
            </form>
            

        </div>
    )
}

export default Table;