import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBooking, deleteBooking, getList } from './BookingSlice';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


const Booking = () => {
    const calendarEvents = useSelector((state) => state.booking.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [Data, setData] = useState({
            id: '',
            title: '',
            info: '',
            start: '',
            end: ''
        });
    
    useEffect(() => {
        dispatch(getList());
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...Data,
            [name]: value,
        });
    };

    
    
    const handleBooking = async (e) => {
        e.preventDefault();
        if (!Data.title || !Data.start || !Data.end) return;
        
        try {
         await dispatch(addBooking(Data));
           setData({id: "", title: "", info: "", start: "", end: ""});

        } catch (error) {
            alert("Kunde inte spara bokningen: " + error);
        }
    }
    
    const handleEventClick = async (info) => {
        const { id, title } = info.event;
        const extraInfo = info.event.extendedProps.info;
        
        const confirmDelete = window.confirm(
        `Bokning: ${title}\nInfo: ${extraInfo || 'Ingen info'}\n\nVill du ta bort denna bokning?`
         );

        if (confirmDelete) {
            dispatch(deleteBooking(id));
        }
    }

    return (
        <div className="booking-page" style={{ padding: '20px' }}>
            <header>
                <h1>Boka köket</h1>
            </header>
        
            <div className="form-container" style={{ marginBottom: '60px' }}>
          
                <form onSubmit={handleBooking} style={{ marginBottom: '50px' }}>          
                    <input 
                        name="title" 
                        value={Data.title} 
                        onChange={handleChange} 
                        placeholder="Namn" 
                    />  
                    <input 
                        name="info"
                        value={Data.info}
                        onChange={handleChange}
                        placeholder="Extra information"
                        style={{ width: '300px' }}
                    />
                    <input 
                        type="datetime-local" 
                        name="start" 
                        value={Data.start}
                        onChange={handleChange}
                         
                    />
                    <input 
                        type="datetime-local" 
                        name="end" 
                        value={Data.end} 
                        onChange={handleChange} 
                    />
                    <button type="submit">Boka</button>
                </form>

         
              <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek'
                    }}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    events={calendarEvents}
                    height="auto"
                    dateClick={(info) => {
                        setData(prev => ({ ...prev, start: info.dateStr + "T12:00", end: info.dateStr + "T13:00" }));
                    }}
                    eventClick={handleEventClick}
                />

            </div>

          
            <button className="return-button" onClick={() => navigate(-1)}>
                Tillbaks
            </button>
        </div>
    );
}

export default Booking;

