const form = document.getElementById("memberForm");
const table = document.getElementById("memberTable");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let room = document.getElementById("room").value;
    let rent = document.getElementById("rent").value;

    let row = table.insertRow();

    row.insertCell(0).innerText = name;
    row.insertCell(1).innerText = room;
    row.insertCell(2).innerText = rent;

    form.reset();
});