//Kulcsok definiálása

let keys = ["id", "name", "email"];
//startGetUsers();

//Ez a funkció gyakorlatilag frissíti a táblát, meghívásakor ugyanaz történik, mintha lenyomnám a 'Get Users' gombot.
function startGetUsers() {
    getServerData("http://localhost:3000/users").then(
        //data => console.log(data));
        Mydata => fillMyDataTable(Mydata, "MyTable"));
}

//Függvény, amely a Gomb kattintására megjeleníti a db_json adatokat

document.querySelector("#getBtnData").addEventListener("click", startGetUsers);

//Get data from server
function getServerData(url) {
    let fetchOptions = {
        method: "GET",
        mode: "cors", //többféle domain között is működik
        cache: "no-cache"
    };

    return fetch(url, fetchOptions).then(
        response => response.json(),
        err => consol.error(err));
}

//Fill table with server data.
function fillMyDataTable(Mydata, tablaNev) {
    let table = document.querySelector(`#${tablaNev}`);
    if (!table) {
        console.error(`Table, which is called (" ${tablaNev} ") not found.`);
        return;
    }

    //Ha meg van a táblázat, utána: add new user row to the table
    let tBody = table.querySelector("tbody");
    //Kitöröljük a tbody tartalmát

    tBody.innerHTML = '';

    let newRow = newUserRow();
    //Az új sort a tbody-hoz adjuk - ezzel kezdjük.
    tBody.appendChild(newRow);

    //console.log(newRow); 

    //A konzolra val kiírás helyett beírása HTML tblázatba
    /*for (let row of Mydata) {
        let tr = document.createElement("tr");

        for (let k of keys) {
            // 1-1 <tr> sorban lévő <td>..</td> cellák 'legyártása'

            CreateTD(row[k], tr);
        }
        let btnGroup = createBtnGroup();
        tr.appendChild(btnGroup);
        tbody.appendChild(tr);
    }*/

    for (let row of Mydata) {
        let tr = createAnyElement("tr");

        for (let k of keys) {
            // 1-1 <tr> sorban lévő <td>..</td> cellák 'legyártása'
            let td = createAnyElement("td");
            //td.innerHTML = row[k];
            //Sorokba input mezők lesznek
            let input = createAnyElement("input", {
                class: "form-control",
                value: row[k],
                name: k
            });
            if (k == "id") {
                //    td.innerHTML = row[k];
                input.setAttribute("readonly", true);
            }
            td.appendChild(input);
            tr.appendChild(td);
        }

        let btnGroup = createBtnGroup();
        tr.appendChild(btnGroup);
        tBody.appendChild(tr);
    }
}

// <td>..</td> cellák 'legyártása' ==>innerHTML< itt nem használjuk
let CreateTD = (html, parent) => {
    //let td = document.createElement("td");
    let td = document.createElement("td");
    td.innerHTML = html;
    parent.appendChild(td);
};

/* Sorszámozás ??
for (let k in dbjson2_adatok) {
    let tr = document.createElement("tr");
    createTD(parseInt(k)+1, tr);
    for (let value of Object.values(dbjson2_adatok[k])) {
        createTD(value, tr);
    }
    tableBody.appendChild(tr);
}*/

/*  Ez a videó szerinti kód - nem működik...

    for (let row of data) {
        //console.log(row)
        let tr = document.createElement("tr");
        for (let k in row) {
            let td = document.createElement("td");
            td.innerHtml = row[k];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}*/

function createAnyElement(name, attributes) {
    let element = document.createElement(name);
    for (let k in attributes) {
        element.setAttribute(k, attributes[k]);
    }
    return element;
}

//creating btnGroup
function createBtnGroup() {
    let group = createAnyElement("div", { class: "btn btn-group" });
    //Az onclick esemény beállítása többféleképpen is lehetséges, pl
    // - addEventListener
    // - = onclick
    // - a HTML attribútum beállításával, ld. itt: 
    let infoBtn = createAnyElement("button", { class: "btn btn-info", onclick: "setRow(this)" });
    infoBtn.innerHTML = '<i class="fa fa-refresh" aria-hidden="true"></i>';
    let delBtn = createAnyElement("button", { class: "btn btn-danger", onclick: "delRow(this)" });
    //A delrow(this) a console.log(delBtn)-n nem a tr-t adja vissza, ezért itt csak egy 'this' változóként szerepel!
    delBtn.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>';

    group.appendChild(infoBtn);
    group.appendChild(delBtn);

    let td = createAnyElement("td");
    td.appendChild(group);
    return td;
}

//A delrow(btn) itt már konkrétan a delBtn gombra vonatkozik.
function delRow(btn) {
    //1. lépés: tr megkeresése. tbody - tr(3) - div(2) - td(1) a szülője 3 szinttel feljebb van
    let tr = btn.parentElement.parentElement.parentElement;
    //2. lépés: id megkeresése, ez az adat egyedi azonosítója
    let id = tr.querySelector("input.form-control").value;

    //3. lépés: fetch megírása, opcióinak megadása$
    let fetchOptions = {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache"
    };
    //fetch elindítása a szerver felé...
    //Az url át lett lakítva template strinngé, hogy bele lehessen tenni az id-t
    fetch(`http://localhost:3000/users/${id}`, fetchOptions).then(
        //A szerver által küldött adatot tovább adom
        response => response.json(),
        err => console.error(err)
    ).then(

        Mydata => {
            //A táblázat frissítéséhez "megnyomom" a 'Get Users' gombot.
            startGetUsers();
        }
    );
}

//AZ új user sor létrehozása (input mezők a td cellákban)
function newUserRow(row) {
    let tr = createAnyElement("tr");


    //Az adatsorban létrehozzuk a td-ket, üres cellákkal
    for (let k of keys) {
        let td = createAnyElement("td");
        //A td tartalmában egy felparaméterezett input-nak kell lennie
        let input = createAnyElement("input", {
            class: "form-control",
            name: k
        });
        td.appendChild(input);
        if (k == "id") {
            //    td.innerHTML = row[k];
            input.setAttribute("readonly", true);
        }
        tr.appendChild(td);
    }

    let newBtn = createAnyElement("button", {
        class: "btn btn-success",
        onclick: "createUser(this)"
    });

    newBtn.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
    td = createAnyElement("td");
    td.appendChild(newBtn);
    tr.appendChild(td);

    return tr;
}

function createUser(btn) {
    let tr = btn.parentElement.parentElement;
    //kiszervezem egy funkcióba az adatok begyűjtését egy adott sorból
    let Mydata = getRowData(tr);
    //Az id-t ki kell venni az adatsorból, hogy azt ne küldje el.
    //mert az id automatikusan akkor jön létre, amikor a json elküldi 
    //Új adatok hozzáadása - POST
    let fetchOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Mydata)
    };
    //console.log(data) Az id-ket automatikusan hozzáteszi a szerver
    fetch("http://localhost:3000/users", fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        //data => console.log(data)
        Mydata => {  
            startGetUsers();
        }
    );
}

//Funkció, amely az adatok frissítésekor jól jöhet
function getRowData(tr) {
    //Kijelöljük az összes inputot, amely a 'form-control' osztályban van
    let inputs = tr.querySelectorAll("input.form-control");
    //Létrehozunk egy 'data' nevű objektumot
    let Mydata = {};
    //Összeszedjük az adatokat
    for (let i = 0; i < inputs.length; i++) {
        Mydata[inputs[i].name] = inputs[i].value;
    }
    return Mydata;
}

//setRow

function setRow(btn) {
    let tr = btn.parentElement.parentElement.parentElement;

    let Mydata = getRowData(tr);

    //console.log(Mydata)
    //Adatok frissítése PUT
    let fetchOptions = {
        method: "PUT",
        mode: "cors",
        //cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(Mydata)
    };

    fetch(`http://localhost:3000/users/${Mydata.id}`, fetchOptions).then(
        resp => resp.json(),
        err => console.error(err)
    ).then(
        //data => console.log(data)
        Mydata => startGetUsers()
    );
}