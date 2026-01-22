import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { addEntry, deleteEntry } from "./hallOfShameSlice";
import { useNavigate } from 'react-router-dom';
import './HallOfShame.css';

const HallOfShame = () => {
    const people = useSelector(state => state.hallOfShame.items);
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
        dispatch(addEntry(Data));
        setData({ name: "", complaint: "" });
    };

    const handleRemove = async (id) => {
        console.log("Tar bort ID:", id);

        dispatch(deleteEntry(id));
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
    const headerVars = {
        '--emoji-url': "url('/pictures/angry_emoji.gif')",
        '--bg-url': "url('/pictures/cleaning_header.jpg')"
    };
    return (

    <div className="HOS-background" style={bgStyle}>

        <header className="HOS-header" style={headerVars}>
            <h1> Hall Of Shame </h1>
        </header>
        
        <div className="shame-list-container">
            
            <ul>
                {Array.isArray(people) && people.map((person) => (
                    <li key={person.id}>
                        <strong>{person.name}</strong>: {person.complaint}
                        <button type="remove-button" onClick={() => handleRemove(person.id)}>
                            Ta bort</button>
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