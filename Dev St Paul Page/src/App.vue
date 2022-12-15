<script>
import $ from 'jquery'
import NewIncident from './components/NewIncident.vue'
import About_Page from './components/About.vue'
import Map from './components/Map.vue'

export default {
    data() {
        return {
            view: "map",
            formCondition: false
        };
    },
    methods: {
        viewMap(event) {
            this.view = "map";
        },
        viewNewIncident(event) {
            this.view = "new_incident";
        },
        viewAbout(event) {
            this.view = "about";
        },
        updateFormCondition(condition) {
            this.formCondition = condition
        }
    },
    components: {
        About_Page,
        NewIncident,
        Map
    }
}
</script>

<template>
    <div class="main_container">
        <div class="top-bar">
            <div class="top-bar-left">
                <ul class="menu" data-dropdown-menu>
                    <li class="menu-text"><img src="../images/police-badge.png" alt=""> St. Paul, Minnesota Crime
                        Reports</li>
                </ul>
            </div>
            <div class="top-bar-right">
                <ul class="menu">
                    <li>
                        <p :class="'cell small-4 ' + ((view === 'map') ? 'selected' : 'unselected')" @click="viewMap">
                            Map</p>
                    </li>
                    <li>
                        <p :class="'cell small-4 ' + ((view === 'new_incident') ? 'selected' : 'unselected')"
                            @click="viewNewIncident">New Incident</p>
                    </li>
                    <li>
                        <p :class="'cell small-4 ' + ((view === 'about') ? 'selected' : 'unselected')"
                            @click="viewAbout">About</p>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="view === 'map'">
            <Map :formCondition="this.formCondition"></Map>
        </div>
        <div v-if="view === 'new_incident'">
            <NewIncident @subCon="updateFormCondition($event)" />
            <!-- @subCon="checkFormCondition($event)" -->
        </div>
        <div v-if="view === 'about'">
            <About_Page />
        </div>
    </div>
</template>

<style>
.main_container {
    background: radial-gradient(at bottom right, #d5dbd8 0, #d5dbd8 17.25px, rgba(213, 219, 216, 0.2) 17.25px, rgba(213, 219, 216, 0.2) 34.5px, rgba(213, 219, 216, 0.75) 34.5px, rgba(213, 219, 216, 0.75) 51.75px, rgba(213, 219, 216, 0.25) 51.75px, rgba(213, 219, 216, 0.25) 69px, rgba(213, 219, 216, 0.3) 69px, rgba(213, 219, 216, 0.3) 86.25px, rgba(213, 219, 216, 0.75) 86.25px, rgba(213, 219, 216, 0.75) 103.5px, rgba(213, 219, 216, 0.2) 103.5px, rgba(213, 219, 216, 0.2) 120.75px, transparent 120.75px, transparent 138px), radial-gradient(at top left, transparent 0, transparent 17.25px, rgba(213, 219, 216, 0.2) 17.25px, rgba(213, 219, 216, 0.2) 34.5px, rgba(213, 219, 216, 0.75) 34.5px, rgba(213, 219, 216, 0.75) 51.75px, rgba(213, 219, 216, 0.3) 51.75px, rgba(213, 219, 216, 0.3) 69px, rgba(213, 219, 216, 0.25) 69px, rgba(213, 219, 216, 0.25) 86.25px, rgba(213, 219, 216, 0.75) 86.25px, rgba(213, 219, 216, 0.75) 103.5px, rgba(213, 219, 216, 0.2) 103.5px, rgba(213, 219, 216, 0.2) 120.75px, #d5dbd8 120.75px, #d5dbd8 138px, transparent 138px, transparent 345px);
    background-blend-mode: multiply;
    background-size: 138px 138px, 138px 138px;
    background-color: #586ba4;
}

button {
    padding: 8px;
    background-color: #586ba4;
    border-radius: 5px;
    margin: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #3d496f;
}
</style>
