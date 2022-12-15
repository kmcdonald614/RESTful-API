<script>
import $ from 'jquery'
export default {
    // get data from inputs and send to main file to be sent to api
    data() {
        return {
            case_number: "",
            date: "",
            time: "",
            code: 0,
            incident: "",
            police_grid: 0,
            neighborhood_number: 0,
            block: ""
        }
    },
    methods: {
        uploadJSON(method, url, data) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    type: method,
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(data),
                    dataType: "text",
                    success: (response) => {
                        console.log(response)
                        resolve(response);
                    },
                    error: (status, message) => {
                        console.log(status, message)
                        reject({ status: status.status, message: status.statusText });
                    }
                });
            });
        }, passEvent(condition) {
            this.$emit('subCon', condition)
        },
        sendDataToParent() {
            // console.log(this.case_number, this.date, this.time, 
            // this.code, this.incident, this.police_grid, this.neighborhood_number, this.block)           
            let [case_number, date, time, code, incident, police_grid, neighborhood_number, block] =
                [`${this.case_number}`, this.date, this.time, this.code, this.incident, this.police_grid, this.neighborhood_number,
                this.block];

            let insert_Object = {
                case_number,
                date,
                time,
                code,
                incident,
                police_grid,
                neighborhood_number,
                block
            }
            //console.log('clicked')
            // this.$emit('incident_data_insert', insert_Object); 

            let url = 'http://localhost:8000/new-incident'
            //console.log(url)

            this.uploadJSON("PUT", url, insert_Object)
                .then((data) => {
                    alert(data)
                    this.case_number = "",
                        this.date = "",
                        this.time = "",
                        this.code = 0,
                        this.incident = "",
                        this.police_grid = 0,
                        this.neighborhood_number = 0,
                        this.block = ""
                        this.passEvent(true)
                })
                .catch((err) => {
                    console.log(err)
                    if (err.status == 500) {
                        alert("Case already exists in the Database...")
                        this.passEvent(false)
                    } else {
                        alert("Your submission was not accepted at this time. Please try again later.")
                        this.passEvent(false)
                    }

                })
        }
    }
}
</script>

<template>
    <!-- Replace this with your actual form: can be done here or by making a new component -->
    <div class="grid-container">
        <div class="grid-x grid-padding-x">
            <div class="large-2 medium-1 small-0 cell"></div>
            <div class="large-8 medium-10 small-12 cell">
                <br><br>

                <form onsubmit="return false">
                    <h1> New Incident Form: </h1>
                    <br>
                    <label for="case_number">Case Number</label>
                    <input v-model="case_number" pattern="[0-9]*" type="number" id="case_number"
                        placeholder="e.g. 45623188" required><br>
                    <label for="date">Date</label>
                    <input v-model="date" type="date" id="date" required><br>
                    <label for="time">Time</label>
                    <input v-model="time" type="time" id="time" step="1" required><br>
                    <label for="code">Code</label>
                    <input v-model="code" type="number" id="code" placeholder="e.g. 4" required><br>
                    <label for="incident">Incident</label>
                    <input v-model="incident" type="text" id="incident" placeholder="e.g. Robbery" required><br>
                    <label for="police_grid">Police Grid</label>
                    <input v-model="police_grid" type="number" id="police_grid" placeholder="e.g. 5" required><br>
                    <label for="neighborhood_number">Neighborhood Number</label>
                    <input v-model="neighborhood_number" type="number" id="neighborhood_number" placeholder="e.g. 6"
                        required><br>
                    <label for="block">Block</label>
                    <input v-model="block" type="text" id="block" placeholder="e.g. 2115 Summit Avenue " required><br>
                    <!-- <p v-if=this.Error>{{Error}}</p> -->
                    <div id="containerSubmit">
                        <input type="submit" id="submitBtn" @click="sendDataToParent">
                        <input type="submit" id="submitBtnFake">
                    </div>
                </form><br>
                <!-- <p>{{case_number}}, {{date}}, {{time}}, {{code}}, {{incident}},
                {{police_grid}}, {{neighborhood_number}}, {{block}}</p> -->
            </div>
            <div class="large-2 medium-1 small-0 cell"></div>

        </div>
    </div>
</template>

<style>
h1 {
    font-size: 1.2rem;
    margin-top: -63px;
    background-color: white;
    width: fit-content;
    padding: 8px;
    border-radius: 10px;
    border: 1px black solid;
}

form:invalid input[id=submitBtnFake] {
    opacity: 0.4;
    background-color: #696969;
}

form:valid input[id=submitBtnFake] {
    display: none;
}

form:invalid input[id=submitBtn] {
    display: none;
}

label {
    margin-top: -30px;
}

form {
    border: 1px solid black;
    padding: 50px;
    margin-bottom: 30px;
    background-color: rgba(213, 219, 216, 0.8);
    border-radius: 1rem;
}

#containerSubmit {
    display: flex;
    justify-content: center;
    align-items: center;
}

#submitBtn,
#submitBtnFake {
    width: 12rem;
    height: 2.5rem;
    border-radius: 2rem;
    font-size: 1.3rem;
    font-style: normal;
    font-weight: 100;
    cursor: pointer;
}
</style>