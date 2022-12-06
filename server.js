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

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

// Open SQLite3 database (in read-only mode)
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Error opening ' + path.basename(db_filename));
    }
    else {
        console.log('Now connected to ' + path.basename(db_filename));
    }
});

// GET request handler for home page '/' (redirect to desired route)
app.get('/', (req, res) => {
    let response = "<html>";
    response = `${response} <head>`;
    response = `${response} </head>`;
    response = `${response} <body style="display:flex; justify-content: center; align-items: center;"><div>`;
    response = `${response} <h1>HOMEPAGE</h1>`;
    response = `${response} <h4>St. Paul Criminal Activity Database</h4>`;
    response = `${response} <h5>Query on the following:</h5>`;
    response = `${response} <p>/codes?code=1,2</p>`;
    response = `${response} <p>/neighborhoods?id=11,14</p>`;
    response = `${response} <p>/incidents?start_date=yyyy-mm-dd&end_date=yyyy-mm-dd&code=110,700&grid=38,65&neighborhood=11,14&limit=15</p>`;
    response = `${response} <button onclick="speakBTN()">Speak</button></div><script>`;
    response = `${response} function speakBTN() {`;
    response = `${response} const utterance = new SpeechSynthesisUtterance("Homepage. These are the queries you can execute on this St. Paul, Minnesota Criminal Reports API.");`;
    response = `${response} utterance.pitch = 0.1; `;
    response = `${response} window.speechSynthesis.speak(utterance);}`;
    response = `${response} </script>`;
    response = `${response} </body></html>`;
    res.status(200).type('html').send(response);
});


// GET request handler for crime codes
app.get('/codes', (req, res) => {

    // Check query for capital letter occurence
    if (queryCheck(req.query, res) === true) { return; }

    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let query = 'SELECT code, incident_type FROM Codes';
    let clause = 'WHERE';
    let params = [];

    if (req.query.hasOwnProperty('code')) {
        [query, params, clause] = addClauseParam(query, params,
            'code = ?', req.query.code, clause);
        if (query === false) { return; }
    }
    
    query = `${query} ORDER BY code ASC`

    // Get data
    databaseSelect(query, params)
        .then((data) => {
            // Send data as response
            res.status(200).type('json').send(data);
        })
        .catch((err) => {
            // Send database error response
            console.log(err);
            errorMessageFunc(res)
        })
    // res.status(200).type('json').send({}); // <-- you will need to change this
});

// GET request handler for neighborhoods
app.get('/neighborhoods', (req, res) => {

    // Check query for capital letter occurence
    if (queryCheck(req.query, res) === true) { return; }

    console.log(req.query); // query object (key-value pairs after the ? in the url)
    let query = 'SELECT neighborhood_name, neighborhood_number FROM Neighborhoods';
    let clause = 'WHERE';
    let params = [];

    if (req.query.hasOwnProperty('id')) {
        [query, params, clause] = addClauseParam(query, params,
            'neighborhood_number = ?', req.query.id, clause);
        if (query === false) { return; }
    }

    query = `${query} ORDER BY neighborhood_number ASC`

    // Get data
    databaseSelect(query, params)
        .then((data) => {
            // Send data as response
            res.status(200).type('json').send(data);
        })
        .catch((err) => {
            // Send database error response
            console.log(err);
            errorMessageFunc(res)
        })
});

// GET request handler for crime incidents
app.get('/incidents', (req, res) => {
    // Check query for capital letter occurance
    if (queryCheck(req.query, res) === true) { return; }
    let query = `SELECT case_number, date(date_time) AS date, time(date_time) AS time, code, incident, police_grid, 
    neighborhood_number, block FROM Incidents`;
    let clause = 'WHERE';
    let params = [];
    // Builds SQL Database query based on client url query
    if (req.query.hasOwnProperty('start_date')) {
        [query, params, clause] = addClauseParam(query, params,
            'date(date_time) >= ? ', req.query.start_date, clause);
        if (query === false) { return; }
    }
    if (req.query.hasOwnProperty('end_date')) {
        [query, params, clause] = addClauseParam(query, params,
            'date(date_time) <= ? ', req.query.end_date, clause);
        if (query === false) { return; }
    }
    if (req.query.hasOwnProperty('code')) {
        [query, params, clause] = addClauseParam(query, params,
            'code = ?', req.query.code, clause);
        if (query === false) { return; }
    }
    if (req.query.hasOwnProperty('grid')) {
        [query, params, clause] = addClauseParam(query, params,
            'police_grid = ? ', req.query.grid, clause);
        if (query === false) { return; }
    }
    if (req.query.hasOwnProperty('neighborhood')) {
        [query, params, clause] = addClauseParam(query, params,
            'neighborhood_number = ?', req.query.neighborhood, clause);
        if (query === false) { return; }
    }
    query = `${query} ORDER BY date_time DESC`

    if (req.query.hasOwnProperty('limit')) {
        query = `${query} LIMIT ?`;
        params.push(req.query.limit);
    } else {
        query = `${query} LIMIT 1000`;
    }

    // Get data
    databaseSelect(query, params)
        .then((data) => {
            // Send data as response
            res.status(200).type('json').send(data);
        })
        .catch((err) => {
            // Send database error response
            console.log(err);
            errorMessageFunc(res)
        })
});

// PUT request handler for new crime incident
app.put('/new-incident', (req, res) => {
    let case_No = req.body.case_number;
    if (case_No === undefined) {
        res.status(404).type('txt').send('Case Number does not exist in current input. Please check and try again...')
        return;
    }
    let keys = [];
    let values = [];
    for (let key in req.body) {
        values.push(req.body[key]); // gets data associated with an specific key
        keys.push(key);
    }

    let neededInputs = [];
    let insertQueryParams = [];
    let selectQuery = `SELECT * FROM Incidents WHERE case_number = ?`;
    let insertQuery = `INSERT INTO Incidents (`; // <-- Build rest later
    let metaDataQuery = `SELECT name, type FROM PRAGMA_TABLE_INFO('Incidents')`;

    databaseSelect(selectQuery, [case_No])
        .then((data) => {
            // Case already exists --> cannot proceed further
            if (data.length !== 0) {
                res.status(500).type('text').send('The case number already exists in database... Please choose a new case number.');
                return false;
            }
            // Case does not exist so we can proceed
            return databaseSelect(metaDataQuery, [])
        })
        .then((data) => {
            // Is in place to restrict multiple responses being sent
            if (data === false) {
                return false;
            }
            let neededInputsTypes = [];
            for (let x in data) {
                // converts Database types to JavaScript Types
                if (data[x].type == "TEXT") {
                    neededInputsTypes.push("string");
                } else if (data[x].type == "INTEGER") {
                    neededInputsTypes.push("number");
                } else {
                    neededInputsTypes.push(data[x].type);
                }
                neededInputs.push(data[x].name); // Column names from database
            }
            // date and time are handled separately on JavaScript side --> remove combined instances from 
            // data retrieved from database
            if (neededInputs.includes('date_time')) {
                neededInputs = neededInputs.filter((element) => element !== 'date_time');
                neededInputsTypes = neededInputsTypes.filter((element) => element !== 'DATETIME');
                neededInputs.push('time', 'date');
            }
            // Fails if not all attributes from database are present in input received from user
            for (let userInputKey in keys) {
                if (!neededInputs.includes(keys[userInputKey])) {
                    res.status(404).type('text').send(`Invalid response... Please make sure you include input data for all required fields. 
                        Required Fields: 
                        case_number
                        date
                        time
                        code
                        incident
                        police_grid
                        neighborhood_number
                        block`);
                    return false;
                }
            }
            // Order user data to match order of column names in neededInputs
            for (let key in neededInputs) {
                insertQueryParams.push((values[keys.indexOf(neededInputs[key])]));
            }
            // Flush out old date and time data and input date and time data concatenated together.
            let date = insertQueryParams.pop();
            let time = insertQueryParams.pop();
            if (date == undefined || time == undefined) {
                res.status(404).type('text').send("Date and/or Time inputs are invalid. Check your inputs and try again.");
                return false;
            }
            insertQueryParams.push(`${date}T${time}`);
            neededInputs.pop(); // <-- pop off date
            neededInputs.pop(); // <-- pop off time
            neededInputs.push('date_time');
            neededInputsTypes.push('string');
            // Build Insert query
            for (let key in neededInputs) {
                if (key != neededInputs.length - 1) {
                    insertQuery += `${neededInputs[key]}, `;
                } else {
                    insertQuery += `${neededInputs[key]}`;
                }
                if (typeof insertQueryParams[key] !== neededInputsTypes[key]) {
                    res.status(404).type('text').send(`Invalid response... Please make sure you include the proper input data for all required fields. 
                        Example: 
                        {
                            "case_number": "text"
                            "date": "yyyy-mm-dd"
                            "time": "hh:mm:ss"
                            "code": number 
                            "incident": "text" 
                            "police_grid": number 
                            "neighborhood_number": number
                            "block": "text"
                        }
                        `);
                    return false;
                }
            }
            insertQuery += `) values (?, ?, ?, ?, ?, ?, ?);`
            // Insert into database
            return databaseRun(insertQuery, insertQueryParams);
        })
        .then((data) => {
            if (data !== false) {
                // data has been successfully inserted
                res.status(200).type('txt').send('OK...The case has been successfully inserted into the Database.');
                return;
            } else {
                return;
            }
        })
        .catch((err) => {
            console.log(err)
            errorMessageFunc(res);
        })
});

// DELETE request handler for new crime incident
app.delete('/remove-incident', (req, res) => {
    console.log(req.body)
    let incident_num = req.body.case_number;
    if (incident_num == undefined) {
        res.status(404).type('text').send('Invalid response... Please format in JSON (e.g. { "case_number": 5 })');
        return;
    }
    incident_num = parseInt(incident_num);
    // database case_number check
    let selectQuery = `SELECT * FROM Incidents WHERE case_number = ?`;
    let deleteQuery = `DELETE FROM Incidents WHERE case_number = ?`; //<-- still need to do this

    databaseSelect(selectQuery, [incident_num])
        .then((data) => {
            if (data.length === 0) {
                res.status(500).type('text').send('Case does not exist in database...');
                return false;
            }
            return databaseRun(deleteQuery, incident_num);
        })
        .then((data) => {
            if (data !== false) {
                res.status(200).type('txt').send('OK...The case has been deleted.');
            }
            return false;
        })
        .catch((err) => {
            console.log(err);
            errorMessageFunc(res);
        });
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

/**
 * Sends an internal error message to the user. 
 * @param {Client Response} response is the response of the calling DELETE, 
 *  GET, or PUT request
 */
function errorMessageFunc(response) {
    response.status(404).type('text').send('Error. Please check your input and try again.');
}

/**
 * Builds database query and collects parameters for database query
 * based on client url query.
 * @param {string} sqlQuery Current created SQLITE3 Query
 * @param {array} sqlParams Parameters substituted for ? in SQLITE3 Query 
 * @param {string} condition Is part of condition that is added to end of SQL Query 
 * @param {array} userQuery Data from user query retrieved from URL 
 * @param {string} clause Will either be OR, AND or WHERE 
 * @param {Client Response} response Response sent to page 
 * @returns An array containing three values: 
 *          1. the built query
 *          2. the params associated with the built part of the query
 *          3. update clause (either AND or OR)
 */
function addClauseParam(sqlQuery, sqlParams, condition, userQuery, clause) {
    sqlQuery = `${sqlQuery} ${clause} ${condition}`;
    let numOfParams = userQuery.split(',');
    sqlParams.push(numOfParams[0]);
    clause = 'OR';
    for (let i = 1; i < numOfParams.length; i++) {
        sqlParams.push(numOfParams[i]);
        sqlQuery = `${sqlQuery} ${clause} ${condition}`;
    }
    clause = 'AND';
    return [sqlQuery, sqlParams, clause]
}


/**
 * Will return true if a capital letter found and false otherwise.
 * @param {string} userQuery Query that is received from user 
 * @param {Client Response} response Response that will be sent to user 
 * @returns True if an error within the user query data has been found
 *          and false otherwise. 
 */
function queryCheck(userQuery, response) {
    // loop over every input query key
    for (let data in userQuery) {
        if (checkEmptyParamData(userQuery, data, response) === true) { return true; }
        if (checkInvalidQueryFormat(data, response) === true) { return true; }
        if (checkInvalidKey(data, response) === true) { return true; }
    }
    return false;
}

/**
 * Checks for invalid Key 
 * @param {Key-Value Pair data} userQuery Key-Value Pair data that will be checked
 * @param {number} index Index to which keyword to check 
 * @param {Response} response Response value from the calling request 
 */
function checkInvalidKey(key, response) {
    let queryKeys = ["code", "id", "start_date", "end_date", "grid", "neighborhood", "limit"];
    if (queryKeys.includes(key) === false) {
        response.status(404).type('text').send(`The following query key is not recognized as valid: ${key}`);
        return true;
    }
    return false;
}

/**
 * This method checks query format and will reject the query if 
 * an invalid format is found. 
 * @param {string} keyword A keyword received from client.
 * @param {Response} response Response value from the calling request 
 * @returns True if a error is found and false otherwise. 
 */
function checkInvalidQueryFormat(keyword, response) {
    for (let index in keyword) {
        // checks to see if any of the letters in the userQuery are capitalized
        if (keyword[index].toUpperCase() === keyword[index] && keyword[index] !== '_') {
            response.status(404).type('text').send('Capital letter or number in key... Please reformat to all lower case letters and no numbers (e.g. ?limit=15)')
            return true;
        }
    }
}

/**
 * Checks to make sure the parameter data is not empty 
 * @param {Key-Value Pair data} userQuery Key-Value Pair data that will be checked
 * @param {number} index Index to which keyword to check 
 * @param {Response} response Response value from the calling request
 * @returns True if some data is empty and false otherwise. 
 */
function checkEmptyParamData(userQuery, index, response) {
    let numOfParams = userQuery[index].split(',');
    // If none of the Params of the certain userQuery data are empty
    // then send an error response
    if (numOfParams.indexOf('') !== -1) {
        response.status(404).type('text').send("Empty item in list or unnecessary comma. Please check search parameters... (e.g. ?police_grid=600,601)");
        return true;
    }
    return false;
}


// Start server - listen for client connections
app.listen(port, () => {
    console.log('Now listening on port ' + port);
});
