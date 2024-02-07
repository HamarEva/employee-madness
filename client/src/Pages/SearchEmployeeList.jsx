import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";


const fetchSearchEmployees = (search) => {
  return fetch(`/api/employees/search/${search}`).then((res) => res.json())
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const SearchEmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  const [sortExpr, setSortExpr] = useState("none");
  const [inputPosOrLevel, setInputPosOrLevel] = useState("");
 
  const { search } = useParams();
 

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    
      fetchSearchEmployees(search)
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
      })

  }, [search]);

  const filterPosOrLevel = (employees, filterInput)=>{
    const filteredEmployees = employees.filter(employee => {
      return employee.level.toLowerCase().includes(filterInput) || employee.position.toLowerCase().includes(filterInput)
    })
    return filteredEmployees
  }

  const searchPosOrLevel = event => {
    setInputPosOrLevel(event.target.value);
    setFilterInput(event.target.value.toLowerCase());
  }

  const sortBySelected = (employees, sortExpr)=>{
    if (sortExpr === "none"){
      return employees
    } else {
      const sortedEmployees = [...employees].sort((a,b) => a[sortExpr].localeCompare(b[sortExpr]));
      return sortedEmployees
    }
  }

  const sortEmployees = event => {
    setSortExpr(event.target.value);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="filter">
          <label >Filter Position or Level: </label>
          <input
            type="text"
            placeholder="Search Position or Level"
            value={inputPosOrLevel}
            onChange={searchPosOrLevel}
          />
      </div>
      <div className="sort">
          <label >Sort Employees By: </label>
          <select onChange={sortEmployees}>
            <option value="none">None</option>
            
            <option value="position">Position</option>
            <option value="level">Level</option>
          </select>
      </div>
      
      <EmployeeTable employees={sortBySelected(filterPosOrLevel(employees, filterInput), sortExpr)}
        onDelete={handleDelete} disableButtons={true}/>
    </div>
  );
};

export default SearchEmployeeList;
