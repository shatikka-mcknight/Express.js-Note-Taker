// DEPENDENCIES
// Nnpm packages that we will use to give our server useful functionality

const express = require('express');
const path = require('path');
const fs = require('fs');
//	Create a version 1 (timestamp) UUID
const uuidv1 = require('uuid/v1');
// Tells node that we are creating an "express" server
const app = express();
// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 5500;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//API Routes
app.get('/api/notes', (req, res) => {
    //Reads the db.json structure and returns the data in that structure
    fs.readFile('db/db.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        //method parses a JSON string, constructing the JavaScript VALUE or object described by the string
        res.json(JSON.parse(data)); 
    });
})

app.post('/api/notes', (req, res) => {
    //read file structure for data and retrieves that note and creates a new note which then display notes
    fs.readFile('db/db.json', 'utf8', function read(err, data) {
        if (err) {
            throw err;
        }
        let retrievesNotes = JSON.parse(data);
        //const will never chnage for createing a new note
        const createNewNote = {...req.body,id:uuidv1()}
        retrievesNotes.push(createNewNote);
        fs.writeFile('db/db.json', JSON.stringify(retrievesNotes), err => {
            if (err) {
                throw err;
            }
            res.json(req.body) //referance createNewNote
        })
    });
});

app.delete('/api/notes/:id', (req, res) => {
    //read file structure for data and w
    fs.readFile('db/db.json', 'utf8', function read(err, data) {
        if(err) {
            throw err;
        }
        let removesNotes = JSON.parse(data);
        let newNotes = removesNotes.filter((note) => {
            return req.params.id !== note.id;
        });

        fs.writeFile('db/db.json', JSON.stringify(newNotes), err => {
            console.log(err);
            res.json({ok:true}) 
        })
    });
})

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// If no matching route is found default to home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// LISTENER
// The below code effectively "starts" our server
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});
  