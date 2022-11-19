// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');


let db_filename = path.join(__dirname, 'db', 'stpaul_crime.sqlite3');

let app = express();
let port = 8000;

app.use(express.json());

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});


// GET request handler for crime codes
app.get('/codes', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    
    res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    
    res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let query = `SELECT case_number, date(date_time) AS date, time(date_time) AS time, code, incident, police_grid, 
    neighborhood_number, block FROM Incidents`;
    let clause = 'WHERE'
    let params = [];

    // Will reduce and organize this later...

    if (req.query.hasOwnProperty('start_date')) {
        query = `${query} ${clause} date(date_time) >= ?`;
        params.push(req.query.start_date);
        clause = 'AND';
    }
    if (req.query.hasOwnProperty('end_date')) {
        query = `${query} ${clause} date(date_time) <= ?`;
        params.push(req.query.end_date);
        clause = 'AND';
    }
    if (req.query.hasOwnProperty('code')) {
        query = `${query} ${clause} code = ?`;
        let numOfParams = req.query.code.split(',');
        if (numOfParams.indexOf('') !== -1) {
            res.status(200).type('text').send("Empty item in list. Please check search parameters...");
            return;
        }
        params.push(numOfParams[0]);
        clause = 'AND'
        for (let i = 1; i < numOfParams.length; i++) {
            params.push(numOfParams[i]);
            query = `${query} ${clause} code = ?`   
        }
        console.log(query)
    }
    if (req.query.hasOwnProperty('grid')) {
        query = `${query} ${clause} police_grid = ?`;
        let numOfParams = req.query.grid.split(',');
        if (numOfParams.indexOf('') !== -1) {
            res.status(200).type('text').send("Empty item in list. Please check search parameters...");
            return;
        }
        params.push(numOfParams[0]);
        clause = 'AND'
        console.log(numOfParams)
        for (let i = 1; i < numOfParams.length; i++) {
            params.push(numOfParams[i]);
            query = `${query} ${clause} police_grid = ?`        
        }
    }
    if (req.query.hasOwnProperty('neighborhood')) {
        query = `${query} ${clause} neighborhood_number = ?`;
        let numOfParams = req.query.neighborhood.split(',');
        if (numOfParams.indexOf('') !== -1) {
            res.status(200).type('text').send("Empty item in list. Please check search parameters...");
            return;
        }
        params.push(numOfParams[0]);
        clause = 'AND'
        for (let i = 1; i < numOfParams.length; i++) {
            params.push(numOfParams[i]);
            query = `${query} ${clause} neighborhood_number = ?`   
        }
    }
    if (req.query.hasOwnProperty('limit')) {
        query = `${query} LIMIT ?`; 
        params.push(req.query.limit)    
    } else {
        query = `${query} LIMIT 1000`
    }
    console.log(query)

    databaseSelect(query, params)
    .then((data) => {
        res.status(200).type('json').send(data);
    })
    .catch((err) => {
        res.status(500).type('text').send(`Error... ${err}`)
    })

    // res.status(200).type('text').send(query); // <-- easier testing query building

    // res.status(200).type('json').send({}); // <-- you will need to change this
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body); // uploaded data
    
    res.status(200).type('txt').send('OK'); // <-- you may need to change this
});


// Create Promise for SQLite3 database SELECT query 
function databaseSelect(query, params) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows);
            }
        })
    })
}

// Create Promise for SQLite3 database INSERT or DELETE query
function databaseRun(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    })
}


// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
