import { Link } from "react-router-dom";
import "./EmployeeTable.css";

const fetchEmployeeById = (id) => {
  return fetch(`/api/employees/${id}`).then((res) => res.json());
};

const EmployeeTable = ({ employees, onDelete, missing, setMissing, disableButtons }) => {

  const handleCheck = async (event) => {
    console.log(event.target.value);
  
    let newMissing = [...missing]
    if (event.target.checked){
      newMissing = missing.filter(employee => employee._id !== event.target.value)
    } else {
      const missingEmployee = await fetchEmployeeById(event.target.value)
      newMissing = [...missing, missingEmployee]
    }
    console.log(newMissing);
    setMissing(newMissing)
  }
  
  return (
  <div className="EmployeeTable">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Level</th>
          <th>Position</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {employees.map((employee) => (
          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.level}</td>
            <td>{employee.position}</td>
            <td>
              <Link to={`/update/${employee._id}`}>
                <button type="button" >Update</button>
              </Link>
              <button type="button" onClick={() => onDelete(employee._id)} disabled={disableButtons}>
                Delete
              </button>
              <input type="checkbox" value={employee._id} onChange={handleCheck} disabled={disableButtons}></input>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

export default EmployeeTable;
