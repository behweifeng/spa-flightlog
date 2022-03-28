function showUser() {
    let logout = document.getElementById('logout');

    if (logout.style.display == 'flex') {
        logout.style.display = 'none';
    } else {
        logout.style.display = 'flex';
        logout.style.alignItems = 'flex-end';
        logout.style.height = '20px';
    }
};


function logIn() {
    let username = document.getElementById('username');
    let password = document.getElementById('password');

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Authentication successful.");
                localStorage.setItem('loged', username.value);
                localStorage.setItem('accessToken', JSON.parse(this.responseText).accessToken);
                checkLoged();
            } else {
                alert("Authentication unsuccessful.");
            }
        }
    };

    request.open('POST', 'https://flightlog-backend.herokuapp.com/user/authenticate', true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({ "username": username.value, "password": password.value }));
};

function logOut() {
    localStorage.removeItem('loged');
    localStorage.removeItem('accessToken');
    checkLoged();
};

function hideContent(){
    document.getElementById('dispFlightContent').style.display = 'none';
    document.getElementById('createFlightContent').style.display = 'none';
    document.getElementById('updateFlightContent').style.display = 'none';
}

function displayFlightLogs() {
    tableFromJson();
    hideContent();
    document.getElementById('dispFlightContent').style.display = 'flex';
}

function createFlightNav() {
    hideContent();
    document.getElementById('createFlightContent').style.display = 'flex';
}

function updateFlightNav() {
    var select = document.getElementById("selectedFlightSN");

    console.log("123")
    console.log(select.value)
    if (select.value == ""){
        alert("No flight selected.")
    } else {

    var myFlights = JSON.parse(localStorage.getItem("myFlights"));
    for (var i = 0; i < myFlights.length; i++) {
        if (myFlights[i]["_id"] == select.value){
            var flight = myFlights[i];
            break;
        }
    } 

    document.getElementById("tailNumberUF").setAttribute('value',flight['tailNumber']);
    document.getElementById("flightIDUF").setAttribute('value',flight['flightID']);
    document.getElementById("takeoffUF").setAttribute('value',flight['takeoff']);
    document.getElementById("landingUF").setAttribute('value',flight['landing']);
    document.getElementById("durationUF").setAttribute('value',flight['duration']);
 
    hideContent();
    document.getElementById('updateFlightContent').style.display = 'flex';
    }
}

function updateFlight(){
    var select = document.getElementById("selectedFlightSN");
    var form = document.getElementById("#updateFlightRecordForm");
    
    data = {
        'tailNumber': form.querySelector('input[name="tailNumber"]').value,
        'flightID': form.querySelector('input[name="flightID"]').value,
        'takeoff': form.querySelector('input[name="takeoff"]').value,
        'landing': form.querySelector('input[name="landing"]').value,
        'duration': form.querySelector('input[name="duration"]').value
    };

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 204) {
                alert("Flight updated.");
                displayFlightLogs();
            } else {
                alert("Flight not updated, please check your inputs.");
            }
        }
    };

    request.open('PUT', "https://flightlog-backend.herokuapp.com/flightLog/" + select.value, true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', "Bearer " + localStorage.accessToken);
    request.send(JSON.stringify(data));
}

function delRequest() {
    var select = document.getElementById("selectedFlightSN");
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 204) {
                alert("Flight deleted.");
                displayFlightLogs();
            } else {
                alert("An error occured. Flight not deleted.");
            }
        }
    };

    request.open('DELETE', "https://flightlog-backend.herokuapp.com/flightLog/" + select.value, true);
    request.setRequestHeader('Authorization', "Bearer " + localStorage.accessToken);
    request.send();
}

function createFlight() {
    var form = document.getElementById("#newFlightRecordForm");
    // var form = document.forms[0];

    data = {
        'tailNumber': form.querySelector('input[name="tailNumber"]').value,
        'flightID': form.querySelector('input[name="flightID"]').value,
        'takeoff': form.querySelector('input[name="takeoff"]').value,
        'landing': form.querySelector('input[name="landing"]').value,
        'duration': form.querySelector('input[name="duration"]').value
    };

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 201) {
                alert("Flight added.");
                displayFlightLogs();
            } else {
                alert("Flight not added, please check your inputs.");
            }
        }
    };

    request.open('POST', "https://flightlog-backend.herokuapp.com/flightLog", true);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader('Authorization', "Bearer " + localStorage.accessToken);
    request.send(JSON.stringify(data));
}


function checkLoged() {
    let login = document.getElementById('login');
    let nav = document.getElementById('navigation');
    let loged = localStorage.getItem('loged');

    if (loged) {
        // console.log(`User loged: ${loged}`);
        login.style.display = 'none';
        displayFlightLogs();
        nav.style.display = 'flex';
    } else {
        login.style.display = 'flex';
        document.getElementById('dispFlightContent').style.display = 'none';
        nav.style.display = 'none';
    }
};

function tableFromJson() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myFlights = JSON.parse(this.responseText);
            localStorage.setItem('myFlights', JSON.stringify(myFlights));
            if (myFlights.length > 0){
                var col = ["S/N"];
            for (var i = 0; i < myFlights.length; i++) {
                for (var key in myFlights[i]) {
                    if (col.indexOf(key) === -1) {
                        if (key != "_id" & key != "__v"){
                            col.push(key);
                        }
                    }
                }
            }

            var table = document.createElement("table");
            table.border = "1px solid black";

            var tr = table.insertRow(-1);                  

            for (var i = 0; i < col.length; i++) {
                var th = document.createElement("th");     
                th.innerHTML = col[i];
                tr.appendChild(th);
            }

            for (var i = 0; i < myFlights.length; i++) {

                tr = table.insertRow(-1);
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = (i+1);

                for (var j = 1; j < col.length; j++) {
                    var tabCell = tr.insertCell(-1);
                    tabCell.innerHTML = myFlights[i][col[j]];
                }
            }

            var divShowData = document.getElementById('showData');
            divShowData.innerHTML = "";
            divShowData.appendChild(table);

            var v = "";
            var flightsListData = document.getElementById('selectedFlightSN');
            for (var i = 0; i < myFlights.length; i++) {
                v += "<option value='" + myFlights[i]["_id"] + "'>" + (i+1) + "</option>"
            }
            flightsListData.innerHTML = v;

            } else {
                var divShowData = document.getElementById('showData');
                divShowData.innerHTML = "There are no flight records.";
            }
            
        }
    };

    request.open('GET', 'https://flightlog-backend.herokuapp.com/flightLog');
    request.setRequestHeader('Authorization', "Bearer " + localStorage.accessToken);
    request.send();


}

checkLoged();