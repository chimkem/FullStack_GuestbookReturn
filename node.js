// --------------- Set up ---------------
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// configure Express to serve static files (images, css, js)
app.use(express.static(path.join(__dirname, 'public'))); 

// views directory for template files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// parse incoming JSON and URL-encoded data
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
// --------------------------------------


// --------------- App ---------------

// Homepage
app.get('/', (req, res) => {
    console.log("Showing page");
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Guestbook
app.get('/guestbook', (req, res) => {
    fs.readFile('database/guestdata.json', 'utf8', (err, data) => {
        if (err) throw err;
        const messages = JSON.parse(data);
        console.log("Showing guestbook");
        res.render('guestbook', {messages});
    });
});

// Get guestbook data as JSON
app.get('/guestbook/data', (req, res) => {
    fs.readFile('database/guestdata.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

// New message page
app.get('/newmessage', (req, res) => {
    console.log("Showing newmessage");
    res.sendFile(path.join(__dirname, 'views','newmessage.html'));
});

// Create new message
app.post('/newmessage', (req, res) => {
    fs.readFile("database/guestdata.json", 'utf8', (err, data) => {
        if (err) throw err;

        const messages = JSON.parse(data);

        // Calculate the next ID by looking at the last message ID
        const dataID = messages[messages.length - 1];
        const messageID = dataID ? Number(dataID.id) + 1 : 1;

        // Create the message information
        const newMessage = {
            id: messageID,
            username: req.body.username,
            country: req.body.country,
            message: req.body.message,
            date: new Date()
        };

        console.log("Message successful");
        messages.push(newMessage);

        fs.writeFile("database/guestdata.json", JSON.stringify(messages, null, 2), (err) => {
            if (err) throw err;
            res.redirect('/guestbook'); // Redirect to show updated guestbook
        });
    });
});

// Ajax message page
app.get('/ajaxmessage', (req, res) => {
    console.log("Showing ajaxmessage");
    res.sendFile(path.join(__dirname,'views', 'ajaxmessage.html'));
});

// Create ajax message
app.post('/ajaxmessage', (req, res) => {
    const { username, country, message } = req.body;

    const responseMessage = {
        username,
        country,
        message,
    };

    console.log("Ajax successful");
    // send the message
    res.json([responseMessage]);
});

// App port
app.listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000/ aka. http://localhost:3000/');
});
