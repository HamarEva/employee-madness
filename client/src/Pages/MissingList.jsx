import { useLocation } from "react-router-dom";
import EmployeeTable from "../Components/EmployeeTable/EmployeeTable";

const MissingList = () => {
    const location = useLocation();
    const missing = location.state
        
    return (
        <div>
            <EmployeeTable employees={missing} disableButtons={true}/>
        </div>
    );
};

export default MissingList;