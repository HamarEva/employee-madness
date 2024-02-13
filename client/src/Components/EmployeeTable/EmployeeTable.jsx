import { Link } from "react-router-dom";
import { useState } from "react";
import "./EmployeeTable.css";
import { useNavigate } from "react-router-dom";

const fetchEmployeeById = (id) => {
  return fetch(`/api/employees/${id}`).then((res) => res.json());
};

const sortEmployees = (employees, dir) => {
  const returnEmployees = [...employees]
  return dir === "asc" ? returnEmployees.sort((a,b) => a.name.localeCompare(b.name))
  : dir === "desc" ? returnEmployees.sort((b,a) => a.name.localeCompare(b.name))
  : returnEmployees
}

const EmployeeTable = ({ employees, onDelete, missing, setMissing, disableButtons }) => {
  const navigate = useNavigate();

  const [sortDir, setSortDir] = useState("none");

  const [currentPage, setCurrentPage] = useState(1);
  const emplPerPage = 10;
  const lastIndex = currentPage * emplPerPage;
  const firstIndex = lastIndex - emplPerPage;
  const empls = sortEmployees(employees, sortDir).slice(firstIndex, lastIndex);
  const nPage = Math.ceil(employees.length/emplPerPage);
  const numbers = [...Array(nPage+1).keys()].slice(1);

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
  
  const orderList = () => {
    if (sortDir === "none" || sortDir === "desc") {
      setSortDir("asc")
    } else {
      setSortDir("desc")
    }
  }

  const goToKittens = event => {
    console.log(event.target.dataset.id);
    navigate(`/kittens/${event.target.dataset.id}`)
  }

  return (
  <div>
  <div className="EmployeeTable">
    <table>
      <thead>
        <tr>
          <th onClick={orderList}>Name</th>
          <th>Level</th>
          <th>Position</th>
          <th>Fav Brand</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {empls.map((employee) => (
          <tr key={employee._id}>
            <td>{employee.name}</td>
            <td>{employee.level}</td>
            <td>{employee.position}</td>
            <td>{employee.brand.name}</td>
            <td>
              <Link to={`/update/${employee._id}`}>
                <button type="button" >Update</button>
              </Link>
              <button type="button" onClick={() => onDelete(employee._id)} disabled={disableButtons}>
                Delete
              </button>
              <button type="kitten" data-id={employee._id} onClick={goToKittens}>
                Kittens list
              </button>
              <input type="checkbox" value={employee._id} onChange={handleCheck} disabled={disableButtons}></input>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  <nav>
    <ul className="pagination">
      <li key="prev" className="page-item">
          <button className="prev" onClick={prevPage}>Prev</button>
      </li>
      {numbers.map((n, i) => (
        <li key={i} className="page-item">
          <button className={currentPage === n ? "activePage" : "page"} onClick={()=>{changePage(n)}}>{n}</button>
        </li>
      ))}
      <li key="next" className="page-item">
          <button className="next" onClick={nextPage}>Next</button>
      </li>
    </ul>
  </nav>
  </div>
  )

  function prevPage(){
    if (currentPage !== 1){
      setCurrentPage(currentPage - 1)
    }
  }
  
  function changePage(n){
    setCurrentPage(n)
  }
  
  function nextPage(){
    if (currentPage !== nPage){
      setCurrentPage(currentPage + 1)
    }
  }

}
export default EmployeeTable;
