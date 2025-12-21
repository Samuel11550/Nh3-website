import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { addPerson } from "./hallOfShameSlice";
import { useNavigate } from 'react-router-dom';
import './HallOfShame.css';

const HallOfShame = () => {
    const people = useSelector(state => state.hallOfShameList.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Data, setData] = useState({
        name: '',
        complaint: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...Data,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Data.name || !Data.complaint) return;

        try {
            const response = await axios.post("http://localhost:3001/api/hallofshame", {
                person: Data.name,
                reason: Data.complaint,
            });

            const { person, reason } = response.data;

            dispatch(addPerson({name: person, complaint: reason }));
            setData({ name: "", complaint: "" });
            
        } catch (error) {
             console.error("Error posting nomination:", error);
        }
    
    };

    const handleGoBack = () => {
        navigate(-1); 
    };
    
    
    const bgStyle = {
        backgroundImage: "url('/pictures/HOS_background1.jpg'), url('/pictures/HOS_background2.jpg')",
        backgroundPosition: 'left top, right top',
        backgroundSize: '50% 100%, 50% 100%',
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundAttachment: 'fixed'
    };

    return (
    <div className="HOS-background" style={bgStyle}>

        <header className="HOS-header">
            <h1> Hall Of Shame </h1>
        </header>
        
        <div className="shame-list-container">
            
            <ul>
                {Array.isArray(people) && people.map((person) => (
                    <li key={person.id}>
                        <strong>{person.name}</strong>: {person.complaint}
                    </li>
                ))}
            </ul>

            <form className="complaint-form" onSubmit={handleSubmit}>
                <input type="text" name="name"
                    placeholder="Vem ska hamna på Hall of Shame?"
                    value={Data.name}
                    onChange={handleChange} />
                <input type="text" name="complaint"
                    placeholder="Varför ska de hamna på väggen?"
                    value={Data.complaint}
                    onChange={handleChange} />
                <button type="submit">Lägg upp</button>
            </form>
            
            <button className="return-button" onClick={handleGoBack}>
                Tillbaks
            </button>
        </div>
        
    </div>
)
}

export default HallOfShame;