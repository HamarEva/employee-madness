import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Loading from "../Components/Loading";

const fetchKittens = (id) => {
    return fetch(`/api/kittens/${id}`).then((res) => res.json())
};

const createKitten = (kitten) => {
    return fetch("/api/kittens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kitten),
    }).then((res) => res.json());
};

const Kittens = () => {
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [kittens, setKittens] = useState([]);
    const [name, setName] = useState("");
    const [weight, setWeight] = useState(0);
    const [posted, setPosted] = useState(0);

    const { employeeId } = useParams();

    useEffect(() => {
        console.log(employeeId);
        fetchKittens(employeeId)
        .then((kittens) => {
          setLoading(false);
          setKittens(kittens);
        })
  
    }, [employeeId, posted]);

    const handleCreateKitten = () => {
        setLoading(true);
        const kitten = {
            name:name,
            weight:weight,
            employee: employeeId
        }
        createKitten(kitten)
          .then(() => {
            setLoading(false);
            setPosted(posted + 1);
        })
    };

    if (loading) {
        return <Loading />;
    }
    
    return (
        <div>
        <div className="kittenTable">
            <table>
            <thead>
                <tr>
                <th>Name</th>
                <th>Weight</th>
                </tr>
            </thead>
            <tbody>
                {kittens.map((kitten) => (
                <tr key={kitten._id}>
                    <td>{kitten.name}</td>
                    <td>{kitten.weight}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <form className="kittenForm" onSubmit={handleCreateKitten}>
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
                <label htmlFor="weight">Weight:</label>
                <input
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                name="weight"
                id="weight"
                />
            </div>
            <div className="buttons">
                <button type="submit">
                Add kitten
                </button>

                <button type="button" onClick={() => navigate("/")}>
                Cancel
                </button>
            </div>
        </form>
        </div>
    );
};

export default Kittens;