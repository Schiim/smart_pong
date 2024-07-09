const teams = [];
let selectedTeams = [];

function addTeam() {
  const teamName = document.getElementById("teamName").value;
  const teamColor = document.getElementById("teamColor").value;

  if (teamName) {
    const team = { name: teamName, color: teamColor, cups: 6, points: 0 };
    teams.push(team);
    displayTeams();
    document.getElementById("teamForm").reset();
  }
}

function displayTeams() {
  const list = document.getElementById("teamList");
  list.innerHTML = "";
  teams.forEach((team, index) => {
    const item = document.createElement("li");
    const label = document.createElement("label");
    const radioInput = document.createElement("input");
    radioInput.type = "checkbox";
    radioInput.name = "teamSelection";
    radioInput.value = index;
    radioInput.onchange = handleTeamSelection;

    const points = document.createElement("span");
    points.textContent = `Punkte: ${team.points}`;
    points.className = "points";

    label.appendChild(radioInput);
    label.appendChild(document.createTextNode(` ${team.name} `));
    label.appendChild(points);
    label.style.color = team.color;

    item.appendChild(label);
    list.appendChild(item);
  });
  document.getElementById("matchButton").disabled = teams.length < 2;
}

function clearTeams() {
  teams.length = 0;
  displayTeams();
}

function handleTeamSelection() {
  selectedTeams = [];
  const selections = document.querySelectorAll(
    'input[name="teamSelection"]:checked'
  );
  selections.forEach((input) => {
    selectedTeams.push(teams[input.value]);
  });

  document.getElementById("matchButton").disabled = selectedTeams.length !== 2;
}

function prepareMatch() {
  if (selectedTeams.length === 2) {
      const matchInfo = document.getElementById("matchInfo");
      matchInfo.innerHTML =
          generateMatchHTML(selectedTeams[0], 0) +
          " vs " +
          generateMatchHTML(selectedTeams[1], 1);
      document.getElementById("endMatchButton").classList.remove("hidden");

      // Sende die Teamfarben an das ESP32
      sendColorsToESP32(selectedTeams[0].color, selectedTeams[1].color);
  }
}


function sendColorsToESP32(color1, color2) {
  const url = "http://192.168.0.33/"; // Ersetze <ESP32_IP> durch die IP-Adresse des ESP32
  const data = {
      team1Color: color1,
      team2Color: color2
  };

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(response => response.text())
  .then(data => {
      console.log('Erfolg:', data);
  })
  .catch((error) => {
      console.error('Fehler:', error);
  });
}

//Funktion zum testen der Cups und Punkte
function generateMatchHTML(team, index) {
  return `<div class="team-info">${team.name} <span class="team-color" style="color:${team.color}">●</span> 
            (<button class="small" onclick="changeCups(${index}, -1)">-</button> 
            <span id="cups${index}">${team.cups}</span> Becher 
            <button class="small" onclick="changeCups(${index}, 1)">+</button>)</div>`;
}

//Dito. Ist zum Testen gedacht
function changeCups(teamIndex, delta) {
  const team = selectedTeams[teamIndex];
  if (team.cups + delta >= 0 && team.cups + delta <= 6) {
    team.cups += delta;
    document.getElementById(`cups${teamIndex}`).textContent = team.cups;
  }
}

/* Diese Funktion wird warscheinlich praktischer sein, sobald die Becher per Sensor gelesen werden

        function prepareMatch() {
            if (selectedTeams.length === 2) {
                const matchInfo = document.getElementById('matchInfo');
                matchInfo.innerHTML = `
                    <div class="team-info">Match Team:</div>
                    <div class="team-info">${selectedTeams[0].name} <span class="team-color" style="color:${selectedTeams[0].color}">●</span> (${selectedTeams[0].cups} Becher) vs ${selectedTeams[1].name} <span class="team-color" style="color:${selectedTeams[1].color}">●</span> (${selectedTeams[1].cups} Becher)</div>
                `;
                document.getElementById('endMatchButton').classList.remove('hidden');
            }
        }
            
*/

function endMatch() {
  if (selectedTeams[0].cups > selectedTeams[1].cups) {
    teams[teams.indexOf(selectedTeams[0])].points++;
  } else if (selectedTeams[0].cups < selectedTeams[1].cups) {
    teams[teams.indexOf(selectedTeams[1])].points++;
  }
  selectedTeams.forEach((team) => (team.cups = 6));
  displayTeams();
  document.getElementById("matchInfo").innerHTML = "";
  document.getElementById("endMatchButton").classList.add("hidden");
}
