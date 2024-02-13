import { useEffect, useState } from "react";
import Loading from "../Components/Loading";
import EmployeeTable from "../Components/EmployeeTable/EmployeeTable";

const fetchTopPaid = () => {
  return fetch("/api/employees/toppaid").then((res) => res.json());
};



const TopPaidList = () => {
  const [loading, setLoading] = useState(true);
  const [toppaid, setToppaid] = useState(null);
  

  useEffect(() => {
    fetchTopPaid()
      .then((toppaid) => {
        setLoading(false);
        setToppaid(toppaid.slice(0,3));
      })
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <EmployeeTable employees={toppaid} />
    </div>
  );
};

export default TopPaidList;