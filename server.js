const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db')

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'my-app', 'build')));

app.post('/api/hallofshame', async (req, res) => { 
    const { name, complaint } = req.body;
    console.log(req.body)
    if (!name || !complaint) return res.status(400).json({ error: 'Du måste fylla båda fälten' });
    try {
        const [result] = await db.query('INSERT INTO nominations (name, complaint) VALUES (?, ?)', [name, complaint]);
        res.status(200).json({
            id: result.insertId,
            name,
            complaint
        });
    } catch (error) {
        console.error("MySQL-fel:", error)
        res.status(500).json({ error: 'Databaserfel' });
    }
    
});

app.delete('/api/hallofshame/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: 'Något blev fel med id' });
    console.log("Försöker ta bort ID:", id);

    try {
        const [result] = await db.query('DELETE FROM nominations WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Hittade ingen med det ID:t' }); //borde aldrig hända
        res.status(200).json({ id });

    } catch (error) {
        console.error("MySQL-fel vid DELETE:", error);
        res.status(500).json({ error: 'Databaserfel' });
    }
    
});

app.get('/api/hallofshame', async (req, res) => {
    try {
        const [list] = await db.query('SELECT * FROM nominations');
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json({ error: 'Kunde inte hämta data' });
    }
});

app.post('/api/booking', async (req, res) => {

    const { title, info, start, end } = req.body;
    console.log("Inkommande data:", req.body);
    if (!title || !start || !end ) return res.status(400).json({ error: 'Du måste fylla i fälten korrekt' });
    try {
        
        const dbStart = start.replace('T', ' ') + ':00';
        const dbEnd = end.replace('T', ' ') + ':00';
        const checkQuery = `
            SELECT * FROM bookings 
            WHERE start < ? AND end > ?
        `;

        const [existingBookings] = await db.query(checkQuery, [dbEnd, dbStart]);

        if (existingBookings.length > 0) {
            return res.status(400).json({error: 'Tiden överlappar med en annan tid'});
        }


        const [result] = await db.query('INSERT INTO bookings (title, info, start, end) VALUES (?, ?, ?, ?)', [title, info, dbStart, dbEnd]);

        res.status(200).json({
           id: result.insertId,
           title,
           info,
           start: start.replace('T', ' '),
           end: end.replace('T', ' ')
        });

    } catch (error) {
        console.error("MySQL Error:", error);
        return res.status(500).json({ error: 'Ett oväntat serverfel uppstod' });
    }

});

app.get('/api/booking', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, title, start, end, info FROM bookings');
        
        const events = rows.map(row => ({
            id: row.id,
            title: row.title,
            start: row.start,
            end: row.end,
            extendedProps: {
                info: row.info // Vi sparar din info här
            }
        }));
        
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Kunde inte hämta data' });
    }

});

app.delete('/api/booking/:id', async (req, res) => {
    const {id } = req.params;

    if (!id) return res.status(400).json({ error: 'Något blev fel med id' });
    console.log("Försöker ta bort ID:", id);

    try {
        const [result] = await db.query('DELETE FROM bookings WHERE id = ?', [id]);
        res.status(200).json({ id });
    } catch (error) {
        console.error("MySQL-fel vid DELETE:", error);
        res.status(500).json({ error: 'Databaserfel' });
    }
})

const buildPath = path.join(__dirname, 'my-app', 'build');
console.log("Servern letar efter frontend i:", buildPath);


app.use(express.static(buildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'), (err) => {
        if (err) {
            console.error("Kunde inte skicka index.html:", err);
            res.status(404).send("Frontend-filerna saknas på servern. Har du kört 'npm run build'?");
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server körs på port ${PORT}`);
});