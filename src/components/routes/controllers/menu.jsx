

const menu = () => {
    const navigate = useNavigate();
    const handleHallOfShameClick = () => {
        navigate('/hallOfShame');
    };

    return (
        <div>
            <header className="welcome_container">
                <h1>Välkommen till NH3!</h1>
            </header> 
            <div className="homePage_background"></div>
            <button className="get-started-button" onClick={handleHallOfShameClick}>
                Nu åker vi
            </button>
        </div>
    )
}

export default menu