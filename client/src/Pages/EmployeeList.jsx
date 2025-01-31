import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

/* const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
}; */

const fetchEmployees = () => {
  return fetch("/api/employees")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Response was not ok! Status: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

/* const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
}; */

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Response was not ok! Status: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error(error);
    });
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [filterInput, setFilterInput] = useState("");
  const [sortExpr, setSortExpr] = useState("none");
  const [inputPosOrLevel, setInputPosOrLevel] = useState("");
  const [missing, setMissing] = useState([]);

  
  const navigate = useNavigate();
  

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });

    setMissing((missing) => {
      return missing.filter((employee) => employee._id !== id);
    })
  };

  useEffect(() => {
    
      fetchEmployees()
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
        setMissing(employees);
      })
    
  }, []);

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

  const convertName = name => {
    const names = name.split(" ")
    const nameObject = {
      first: names[0],
      middle: names.slice(1, -1).join(" "),
      last: names[names.length-1]
    }
    return nameObject
  }

  const sortBySelected = (employees, sortExpr)=>{
    if (sortExpr === "none"){
      return employees
    } else if (sortExpr === "level" || sortExpr === "position"){
      const sortedEmployees = [...employees].sort((a,b) => a[sortExpr].localeCompare(b[sortExpr]));
      return sortedEmployees
    } else {
      const sortedEmployees = [...employees].sort((a,b) => convertName(a.name)[sortExpr].localeCompare(convertName(b.name)[sortExpr]))
      return sortedEmployees
    }
  }

  const sortEmployees = event => {
    setSortExpr(event.target.value);
  }

  const goToMissingList = () => {
    navigate('/missing', { state: missing });
  }
  
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="arrange">
        <div className="filter&sort">
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
              <option value="first">First name</option>
              <option value="middle">Middle name</option>
              <option value="last">Last name</option>
              <option value="position">Position</option>
              <option value="level">Level</option>
            </select>
        </div>
        </div>
      
      <div className="missing">
        <button onClick={goToMissingList}>Missing list</button>
      </div>
      </div>
      <EmployeeTable employees={sortBySelected(filterPosOrLevel(employees, filterInput), sortExpr)}
        onDelete={handleDelete} missing={missing} setMissing={setMissing} disableButtons={false}/>
    </div>
  );
};

export default EmployeeList;
