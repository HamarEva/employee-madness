import { useState, useEffect } from "react";

const fetchEquipment = () => {
  return fetch("/api/equipment").then((res) => res.json());
};

const EmployeeForm = ({ onSave, disabled, employee, onCancel }) => {
  const [name, setName] = useState(employee?.name ?? "");
  const [level, setLevel] = useState(employee?.level ?? "");
  const [position, setPosition] = useState(employee?.position ?? "none");
  const [equipment, setEquipment] = useState(employee?.equipment ?? "none");
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    
    fetchEquipment()
    .then((equipment) => {
      setOptions(equipment)
    })
  
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(equipment);
    if (employee) {
      return onSave({
        ...employee,
        name,
        level,
        position,
        equipment
      });
    }

    return onSave({
      name,
      level,
      position,
      equipment
    });
  };

  return (
    <form className="EmployeeForm" onSubmit={onSubmit}>
      <div className="control">
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          name="name"
          id="name"
        />
      </div>

      <div className="control">
        <label htmlFor="level">Level:</label>
        <input
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          name="level"
          id="level"
        />
      </div>

      <div className="control">
        <label htmlFor="position">Position:</label>
        <input
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          name="position"
          id="position"
        />
      </div>

      <div className="control">
        <label htmlFor="equipment">Equipment:</label>
        <select
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          name="equipment"
          id="equipment">
          <option key="none" value="none" id="none">none</option>
          {options.map((option)=>{ 
            return <option key={option._id} value={option.name} id={option._id}>{option.name}</option>
          })}
        </select>
      </div>

      <div className="buttons">
        <button type="submit" disabled={disabled}>
          {employee ? "Update Employee" : "Create Employee"}
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
