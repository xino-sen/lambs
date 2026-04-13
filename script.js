// State Data
const teams = {
    "Purok 1": { wins: 0, losses: 0, fouls: 0, points: 0 },
    "Purok 2": { wins: 0, losses: 0, fouls: 0, points: 0 },
    "Purok 3": { wins: 0, losses: 0, fouls: 0, points: 0 },
    "Purok 4": { wins: 0, losses: 0, fouls: 0, points: 0 },
    "Purok 5": { wins: 0, losses: 0, fouls: 0, points: 0 },
    "Purok 6": { wins: 0, losses: 0, fouls: 0, points: 0 }
};

let games = [
    { id: 1, t1: "Purok 1", t2: "Purok 2", s1: 88, s2: 82, f1: 12, f2: 15, status: "recent", date: "April 10", time: "5:00 PM" }
];

// Functions for UI update
function addGameToList() {
    const t1 = document.getElementById('teamA').value;
    const t2 = document.getElementById('teamB').value;
    const date = document.getElementById('gameDate').value;
    const time = document.getElementById('gameTime').value;

    if(!date || !time) { alert("Please fill in Date and Time"); return; }
    if(t1 === t2) { alert("A team cannot play against itself!"); return; }

    const newGame = { id: Date.now(), t1: t1, t2: t2, s1: 0, s2: 0, f1: 0, f2: 0, status: "upcoming", date: date, time: time };
    games.push(newGame);
    updateUI();
    document.getElementById('gameDate').value = "";
    document.getElementById('gameTime').value = "";
}

function updateUI() {
    const recentDiv = document.getElementById('recentMatches');
    const upcomingDiv = document.getElementById('upcomingMatches');
    recentDiv.innerHTML = '';
    upcomingDiv.innerHTML = '';

    games.forEach(game => {
        const html = `
            <div class="game-strip ${game.status}">
                <div style="position: absolute; top: -10px; left: 20px; background: var(--referee-dark); color: var(--hoops-orange); font-size: 0.7rem; padding: 3px 12px; border-radius: 20px; font-weight: 700;">${game.date} | ${game.time}</div>
                <div class="team-info" style="font-family:'Oswald'; font-weight:700;">
                    ${game.t1} 
                    ${game.status === 'recent' ? `<br><span style="font-size:0.7rem; color:red; font-weight:400;">Fouls: ${game.f1}</span>` : ''}
                </div>
                <div class="score-box">${game.status === 'recent' ? `${game.s1} - ${game.s2}` : 'VS'}</div>
                <div class="team-info" style="text-align:right; font-family:'Oswald'; font-weight:700;">
                    ${game.t2}
                    ${game.status === 'recent' ? `<br><span style="font-size:0.7rem; color:red; font-weight:400;">Fouls: ${game.f2}</span>` : ''}
                </div>
                ${game.status === 'upcoming' ? `<button class="btn-update" style="margin-left:15px;" onclick="finalizeGame(${game.id})">Finish</button>` : ''}
            </div>
        `;
        if (game.status === 'recent') recentDiv.innerHTML += html;
        else upcomingDiv.innerHTML += html;
    });
    calculateStandings();
}

function calculateStandings() {
    for (let t in teams) { teams[t].wins = 0; teams[t].losses = 0; teams[t].points = 0; teams[t].fouls = 0; }
    games.filter(g => g.status === 'recent').forEach(g => {
        teams[g.t1].fouls += g.f1;
        teams[g.t2].fouls += g.f2;
        if (g.s1 > g.s2) { teams[g.t1].wins++; teams[g.t1].points += 2; teams[g.t2].losses++; } 
        else { teams[g.t2].wins++; teams[g.t2].points += 2; teams[g.t1].losses++; }
    });

    const sortedTeams = Object.keys(teams).sort((a,b) => teams[b].points - teams[a].points);
    const body = document.getElementById('standingsBody');
    body.innerHTML = ''; 
    sortedTeams.forEach(name => {
        const t = teams[name];
        body.innerHTML += `<tr><td><strong>${name}</strong></td><td>${t.wins}-${t.losses}</td><td style="color:red">${t.fouls}</td><td><strong>${t.points}</strong></td></tr>`;
    });
}

function finalizeGame(id) {
    const game = games.find(g => g.id === id);
    const score = prompt(`Score for ${game.t1} vs ${game.t2} (e.g. 90-85):`);
    if (score && score.includes('-')) {
        const fouls = prompt(`Team Fouls (e.g. 10-14):`, "0-0");
        const sParts = score.split('-');
        const fParts = fouls.split('-');
        game.s1 = parseInt(sParts[0]) || 0; 
        game.s2 = parseInt(sParts[1]) || 0;
        game.f1 = parseInt(fParts[0]) || 0; 
        game.f2 = parseInt(fParts[1]) || 0;
        game.status = 'recent';
        updateUI();
    }
}

// Initial Run
updateUI();