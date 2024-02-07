import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import EmployeeTable from "../Components/EmployeeTable/EmployeeTable";



const MissingList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const missing = location.state
        
    return (
        <div>
            <button type="button" onClick={() => navigate("/")}>Cancel</button>
            <EmployeeTable employees={missing} disableButtons={true}/>
        </div>
        
    );
};

export default MissingList;