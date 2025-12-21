const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const fs = require('node:fs/promises');
const path = require('path');
const filePath = path.join(__dirname, 'bookingsFile.json');

const nominations = [];

app.post('/api/hallofshame', (req, res) => { 
    const {id, person, reason} = req.body;

    if (!person || !reason) {
        return res.status(400).json({ error: 'Du måste fylla båda fälten' });
    }

    const nomination = {id, person, reason};
    nominations.push(nomination);
    
    res.status(201).json(nomination);
});

app.get('/api/hallofshame', (req, res) => {
  res.json(nominations);
});



app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

async function readData() {
    try {
        const array = await fs.readFile(filePath, 'utf8');
        
        const formattedArray = await JSON.parse(array);

        if (!formattedArray) return [];
        
        formattedArray.forEach((obj) => {
            obj.start = new Date(obj.start),
            obj.end = new Date(obj.end)
        });
        
        return formattedArray;

    } catch(error) {
        if (error.code === 'ENOENT') return [];
    }
}

async function saveData(dataArray) {

    // Ensure we serialize Date objects to ISO strings for storage
    const arrayForFile = dataArray.map((obj) => ({
        ...obj,
        start: obj.start instanceof Date ? obj.start.toISOString() : obj.start,
        end: obj.end instanceof Date ? obj.end.toISOString() : obj.end
    }));

    try {
        const readableArray = JSON.stringify(arrayForFile, null, 2);
        await fs.writeFile(filePath, readableArray);

    } catch (error) {
        console.error("Något gick fel", error)
    }
}


app.post('/api/bookings', async (req, res) => {

    const { title, info, start, end } = req.body;

    try {
        const existingBookings = await readData();


        const newStart = new Date(start);
        const newEnd = new Date(end);

        if (newEnd <= newStart) return res.status(400).json({ error: 'Tiden är inte giltig' });
        

        const adjustedBookingsList = existingBookings.filter((instance) => 
            (newStart < instance.end && newEnd > instance.start)
        );
        
        if (adjustedBookingsList.length > 0) return res.status(409).json({ error: 'Tiden är inte giltig' });

        const maxId = existingBookings.length > 0
            ? Math.max(...existingBookings.map(b => b.id))
            : 0;
        const newId = maxId + 1;

        const booking = {
            id: newId,
            title: title,
            info: info,
            start: newStart,
            end: newEnd     
        };

        existingBookings.push(booking);

        await saveData(existingBookings);

        // Serialize dates to ISO strings before sending
        res.status(201).json({
            id: newId,
            booking: {
                id: newId,
                title: booking.title,
                info: booking.info,
                start: booking.start.toISOString(),
                end: booking.end.toISOString()
            }
        });

    } catch (error) {
        console.error("Server Error during booking:", error);
        return res.status(500).json({ error: 'Ett oväntat serverfel uppstod' });
    }


});

app.get('/api/bookings', async (req, res) => { 
    try {
        const allBookings = await readData();
        // Convert Date objects to ISO strings
        const serializedBookings = allBookings.map(b => ({
            ...b,
            start: b.start instanceof Date ? b.start.toISOString() : b.start,
            end: b.end instanceof Date ? b.end.toISOString() : b.end
        }));
        return res.status(200).json(serializedBookings);
    } catch (error) {
        console.error("Server Error during booking:", error);
        return res.status(500).json({ error: 'Ett oväntat serverfel uppstod' });
    }
});

app.delete('/api/bookings', async (req, res) => {
    
})
   
module.exports = { readData, saveData };