//document references
const card = document.getElementById("card");

const titleButton = document.getElementById("titleButton");
const changelogButton = document.getElementById("changelogButton");
const setsButton = document.getElementById("setsButton");
const statsButton = document.getElementById("statsButton");

const titleScreen = document.getElementById("titleScreen");
const changelogScreen = document.getElementById("changelogScreen");
const setsScreen = document.getElementById("setsScreen");
const statsScreen = document.getElementById("statsScreen");
const playSetScreen = document.getElementById("playSetScreen");

const flipDurationRange = document.getElementById("flipDurationRange");
const flipDurationDisplay = document.getElementById("flipDurationDisplay");

const launchScreenSelect = document.getElementById("launchScreenSelect");

const flashcardGrid = document.getElementById("flashcardGrid");

const activeSetDisplay = document.getElementById("activeSetDisplay");
const editButton = document.getElementById("editButton");
const edit = document.getElementById("edit");
const saveEdit = document.getElementById("saveEdit");
const editTable = document.getElementById("editTable");
const addCard = document.getElementById("addCard");

const leftButton = document.getElementById("leftButton");
const flipButton = document.getElementById("flipButton");
const rightButton = document.getElementById("rightButton");

const tooltip = document.getElementById("tooltip");
const editSetPopup = document.getElementById("editSetPopup");

const newName = document.getElementById("newName");
const newColor = document.getElementById("newColor");
const newLogo = document.getElementById("newLogo");
const editPreview = document.getElementById("editPreview");
const saveSetChanges = document.getElementById("saveSetChanges");
const deleteSet = document.getElementById("deleteSet");

//global variables
var flipDuration = 1000;
var sets;
var activeSet = "none";
var editing = false;
var saveSetLength;
var setIndex = 0;
var cardSide = 0;
var tooltipVisible = false;
var editingSet = false;

//document functions
titleButton.onclick = () => {
    titleScreen.style.display = "block";
    changelogScreen.style.display = "none";
    setsScreen.style.display = "none";
    statsScreen.style.display = "none";
    playSetScreen.style.display = "none";
    editingSet = false;
    editSetPopup.style.display = "none";
}

changelogButton.onclick = () => {
    titleScreen.style.display = "none";
    changelogScreen.style.display = "block";
    setsScreen.style.display = "none";
    statsScreen.style.display = "none";
    playSetScreen.style.display = "none";
    editingSet = false;
    editSetPopup.style.display = "none";
}

setsButton.onclick = () => {
    titleScreen.style.display = "none";
    changelogScreen.style.display = "none";
    setsScreen.style.display = "block";
    statsScreen.style.display = "none";
    playSetScreen.style.display = "none";
    editingSet = false;
    editSetPopup.style.display = "none";
}

statsButton.onclick = () => {
    titleScreen.style.display = "none";
    changelogScreen.style.display = "none";
    setsScreen.style.display = "none";
    statsScreen.style.display = "block";
    playSetScreen.style.display = "none";
    editingSet = false;
    editSetPopup.style.display = "none";
}

flipDurationRange.oninput = () => {
    flipDuration = parseInt(flipDurationRange.value);
    flipDurationDisplay.innerHTML = flipDurationRange.value;
    setCookie("flipDuration", flipDurationRange.value, 365);
}

launchScreenSelect.oninput = () => {
    setCookie("launchScreen", launchScreenSelect.value, 365);
}

editButton.onclick = () => {
    if (!editing) {
        populateEditTable();
        edit.style.display = "block";
    } else {
        edit.style.display = "none";
    }
    editing = !editing;
}

saveEdit.onclick = () => {
    let newCards = [];
    for (let i = 0; i < saveSetLength; i++) {
        newCards.push([document.getElementById("term" + i).value, document.getElementById("answer" + i).value]);
    }
    sets[activeSet]["cards"] = newCards;
    sets[activeSet]["edit"] = Date.now();
    setCookie("sets", sets, 365, true);
}

addCard.onclick = () => {
    let newCards = [];
    for (let i = 0; i < saveSetLength; i++) {
        newCards.push([document.getElementById("term" + i).value, document.getElementById("answer" + i).value]);
    }
    sets[activeSet]["cards"] = newCards;
    sets[activeSet]["edit"] = Date.now();
    sets[activeSet]["cards"].
    push(["term", "definition"]);
    populateEditTable();
}

leftButton.onclick = () => {
    cardSide = 0;
    setIndex -= 1;
    if (setIndex < 0) {
        setIndex = saveSetLength - 1;
    }
    flipCard(sets[activeSet]["cards"][setIndex][cardSide], flipDuration);
}

flipButton.onclick = () => {
    if (cardSide == 0) {
        cardSide = 1;
    } else {
        cardSide = 0;
    }
    flipCard(sets[activeSet]["cards"][setIndex][cardSide], flipDuration);
}

card.onclick = flipButton.onclick;

rightButton.onclick = () => {
    cardSide = 0;
    setIndex++;
    if (setIndex > saveSetLength - 1) {
        setIndex = 0;
    }
    console.log(cardSide);
    console.log(setIndex);
    console.log(sets[activeSet]["cards"][setIndex][cardSide])
    flipCard(sets[activeSet]["cards"][setIndex][cardSide], flipDuration);
}

document.onmousemove = (event) => {
    if (tooltipVisible) {
        tooltip.style.left = (event.x + 1) + "px";
        tooltip.style.top = (event.y + 1) + "px";
    }
}

window.onresize = (event) => {
    fitText();
}

newColor.oninput = () => {
    editPreview.innerHTML = newLogo.value;
    editPreview.style.backgroundColor = newColor.value;
}

newLogo.oninput = () => {
    editPreview.innerHTML = newLogo.value;
            editPreview.style.backgroundColor = newColor.value;
}

saveSetChanges.onclick = () => {
    if (newName.value != "") {
            if (activeSet != "") {
            sets[activeSet]["color"] = newColor.value;
            sets[activeSet]["logo"] = newLogo.value;
            sets[activeSet]["edit"] = Date.now();
            if (newName.value != activeSet) {
                sets[newName.value] = sets[activeSet];
                delete sets[activeSet];
            }
        } else {
            sets[newName.value] = {}
            sets[newName.value]["color"] = newColor.value;
            sets[newName.value]["logo"] = newLogo.value;
            sets[newName.value]["edit"] = Date.now();
            sets[newName.value]["creation"] = Date.now();
            sets[newName.value]["cards"] = [["term", "definition"]];
        }
        activeSet = "";
        editingSet = false;
        editSetPopup.style.display = "none";
        addSets();
        setCookie("sets", sets, 365, true);
    }
}

deleteSet.onclick = () => {
    if (activeSet != "") {
        delete sets[activeSet];
    }
    activeSet = "";
    editingSet = false;
    editSetPopup.style.display = "none";
    addSets();
    setCookie("sets", sets, 365, true);
}

//functions
function flipCard (newText, duration) {
    setTimeout(() => {
        card.innerHTML = newText;
        fitText();
    }, duration / 2);
    const keyframes = [
        { transform: 'rotateY(0deg)'},
        { transform: 'rotateY(90deg)'},
        { transform: 'rotateY(0deg)'}
    ];
    const options = {
        duration: duration,
        iterations: 1,
        fill: 'forwards'
    };
    const animation = card.animate(keyframes, options);
}

function populateEditTable () {
    let editTableBody = editTable.childNodes[1];
    editTableBody.innerHTML = "<tr><td>Term</td><td>Definition</td><td>Action</td></tr>";
    if (sets[activeSet]["cards"].length == 0) {
        sets[activeSet]["cards"].push(["term", "definition"]);
    }
    let cards = sets[activeSet]["cards"];
    let i = 0;
    for (let card of cards) {
        let newRow = "<tr><td>" + "<input id=\"term" + i + "\" value = \"" + card[0] + "\"></td><td><input id=\"answer" + i + "\" value=\"" + card[1] + "\"></td><td><button id=\"remove" + i + "\">Remove</button></td></tr>";
        editTableBody.innerHTML += newRow;
        i++;
    }
    saveSetLength = i;
    for (let j = 0; j < i; j++) {
        document.getElementById("remove" + j).onclick = () => {
            removeCard(j);
        }
    }
}

function removeCard (i) {
    sets[activeSet]["cards"].splice(i, 1);
    populateEditTable();
}

function fitText () {
    let size = 100;
    card.style.fontSize = size + "px";

    while ((card.scrollWidth > card.clientWidth || card.scrollHeight > card.clientHeight) & size > 8) {
        card.style.fontSize = size + "px";
        size -= 1;
    }

    size -= 5;
    card.style.fontSize = size + "px";
}

//cookie handling courtesy of https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays, jsonType = false) {
    let cookieValue = cvalue;
    if (jsonType) {
        cookieValue = JSON.stringify(cvalue);
    }
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cookieValue + ";" + expires + ";path=/";
}

function getCookie(cname, jsonType = false) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            if (!jsonType) {
                return c.substring(name.length, c.length);
            } else {
                return JSON.parse(c.substring(name.length, c.length));
            }
        
        }
    }
    return null;
}

function deleteCookie(cname) {
    setCookie(cname, "none", -1);
}

//page setup functions
function addSets() {
    flashcardGrid.innerHTML = "";
    for (let set in sets) {
        let setIcon = document.createElement("div")
        setIcon.innerText = sets[set]["logo"];
        setIcon.classList = "setIcon";
        setIcon.id = "set-" + set;
        setIcon.style.backgroundColor = sets[set]["color"];
        setIcon.onmouseenter = (event) => {
            if (!editingSet) {
                tooltipVisible = true;
                tooltip.style.display = "block";
                tooltip.innerHTML = "Title: " + event.target.id.slice(4) + "<br>";
                tooltip.innerHTML += "Created: " + new Date(sets[set]["creation"]) + "<br>";
                tooltip.innerHTML += "Last edit: " + new Date(sets[set]["edit"]) + "<br>";
                tooltip.innerHTML += "Right click to edit.";
            }
        }
        setIcon.onmouseleave = () => {
            tooltipVisible = false;
            tooltip.style.display = "none";
        }
        setIcon.onclick = (event) => {
            if (!editingSet) {
                loadSet(event.target.id.slice(4));
            }
        }
        setIcon.oncontextmenu = (event) => {
            event.preventDefault();
            tooltipVisible = false;
            tooltip.style.display = "none";
            editingSet = true;
            editSetPopup.style.display = "block";

            activeSet = event.target.id.slice(4);
            newName.value = activeSet;
            newColor.value = sets[activeSet]["color"];
            newLogo.value = sets[activeSet]["logo"];
            editPreview.innerHTML = newLogo.value;
            editPreview.style.backgroundColor = newColor.value;
        }
        flashcardGrid.appendChild(setIcon);
    }
    let addIcon = document.createElement("div");
    addIcon.innerText = "+";
    addIcon.classList = "setIcon";
    addIcon.id = "addSet";
    addIcon.onclick = () => {
        if (!editingSet) {
            tooltipVisible = false;
            tooltip.style.display = "none";
            editingSet = true;
            editSetPopup.style.display = "block";
            activeSet = "";
            newName.value = "";
            newColor.value = "";
            newLogo.value = "";
            editPreview.innerHTML = newLogo.value;
            editPreview.style.backgroundColor = newColor.value;
        }
    }
    flashcardGrid.appendChild(addIcon);
}

function loadSet(set) {
    setsScreen.style.display = "none";
    playSetScreen.style.display = "block"
    activeSet = set;
    activeSetDisplay.innerHTML = set;
    setIndex = 0;
    cardSide = 0;
    card.innerHTML = sets[activeSet]["cards"][0][0];
    populateEditTable();
    fitText();
}

//cookie-dependent variables
if (getCookie("flipDuration")) {
    flipDuration = parseInt(getCookie("flipDuration"));
    flipDurationRange.value = getCookie("flipDuration");
    flipDurationDisplay.innerHTML = getCookie("flipDuration");
}

if (getCookie("launchScreen")) {
    launchScreenSelect.value = getCookie("launchScreen");
    document.getElementById(getCookie("launchScreen") + "Screen").style.display = "block";
} else {
    setCookie("launchScreen", "title", 365);
    titleScreen.style.display = "block";
}

if (getCookie("sets")) {
    sets = getCookie("sets", true);
}

addSets()