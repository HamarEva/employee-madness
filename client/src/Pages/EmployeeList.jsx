import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable";

const fetchEmployees = () => {
  return fetch("/api/employees").then((res) => res.json());
};

const deleteEmployee = (id) => {
  return fetch(`/api/employees/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
};

const EmployeeList = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState(null);
  const [filterInput, setFilterInput] = useState("");

  const [inputPosOrLevel, setInputPosOrLevel] = useState("");

  const handleDelete = (id) => {
    deleteEmployee(id);

    setEmployees((employees) => {
      return employees.filter((employee) => employee._id !== id);
    });
  };

  useEffect(() => {
    fetchEmployees()
      .then((employees) => {
        setLoading(false);
        setEmployees(employees);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="filter">
          <label >Filter Position or Level: </label>
          <input
            className="input"
            type="text"
            placeholder="Search Position or Level"
            value={inputPosOrLevel}
            onChange={searchPosOrLevel}
          />
      </div>
      <EmployeeTable employees={filterPosOrLevel(employees, filterInput)} onDelete={handleDelete} />
    </div>
  );
};

export default EmployeeList;
