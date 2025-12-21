import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { addBooking, setBookings } from './BookingSlice';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


const Booking = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const entries = useSelector((state) => {
        console.log('Full Redux state.bookings:', state.bookings);
        const result = state.bookings?.entries || [];
        console.log('Entries from selector:', result);
        return result;
    });
   
    useEffect(() => {
        if (!Array.isArray(entries)) return;
        entries.forEach((entry, idx) => {
            const containsReactElement = Object.values(entry || {}).some(v => v && typeof v === 'object' && '$$typeof' in v);
            if (containsReactElement) console.warn('Booking entry contains React element at index', idx, entry);
        });
    }, [entries]);
    
    const [Data, setData] = useState({
            id: '',
            title: '',
            info: '',
            start: '',
            end: ''
        });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...Data,
            [name]: value,
        });
    };

    useEffect(() => {
        const fetchInitialBookings = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/bookings");
                const bookingsArray = Array.isArray(response.data) ? response.data : [];
                console.log("Fetched bookings (raw):", bookingsArray);

                const sanitizedArray = bookingsArray
                    .filter(b => b && typeof b === 'object')
                    .map(b => ({
                        id: b.id === undefined || b.id === null ? '' : String(b.id),
                        title: b.title === undefined || b.title === null ? '' : String(b.title),
                        info: b.info === undefined || b.info === null ? '' : String(b.info), 
                        start: b.start === undefined || b.start === null ? '' : String(b.start),
                        end: b.end === undefined || b.end === null ? '' : String(b.end)
                    }))
                    .filter(b => !Object.values(b).some(v => v && typeof v === 'object' && '$$typeof' in v));

                console.log("Sanitized bookings:", sanitizedArray);
                dispatch(setBookings(sanitizedArray));
            } catch (error) {
                console.error("Error fetching bookings:", error);
                dispatch(setBookings([]));
            }
        };
        fetchInitialBookings();
    }, [dispatch]);
    
    const handleBooking = async (e) => {
        e.preventDefault();
        if (!Data.title || !Data.start || !Data.end) return;
        
        try {
            const response = await axios.post("http://localhost:3001/api/bookings", {
                title: Data.title,
                info: Data.info,
                start: Data.start,
                end: Data.end,
            });

           const { id, booking } = response.data;
           dispatch(addBooking(booking));

           setData({id: "", title: "", info: "", start: "", end: ""});

        } catch (error) {
            const errorMsg = error.response?.data?.error || "Ett fel uppstod";
            alert(errorMsg);
            console.error("Error posting booking:", error);
        }
    }


    const cleanEntries = Array.isArray(entries)
        ? entries.filter(entry => {
            if (!entry || typeof entry !== 'object') return false;
            return !Object.values(entry).some(v => v && typeof v === 'object' && '$$typeof' in v);
        })
        : [];

    const calendarEvents = cleanEntries.map(b => ({
        id: String(b.id), 
        title: typeof b.title === 'string' ? b.title : 'Bokad', 
        start: b.start,
        end: b.end,
        extendedProps: {
        info: b.info
    }
    }));
   
console.log('Final cleanEntries:', cleanEntries);

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
                        setData(prev => ({ ...prev, start: info.dateStr, end: info.dateStr }));
                    }}
                    eventClick={(info) => {
                        const { title } = info.event;
                        const extraInfo = info.event.extendedProps.info;
                        
                        alert(`Bokning: ${title}\nInfo: ${extraInfo || 'Ingen extra information angiven.'}`);
                    }}
                />

            </div>

          
            <button className="return-button" onClick={() => navigate(-1)}>
                Tillbaks
            </button>
        </div>
    );
}

export default Booking;

