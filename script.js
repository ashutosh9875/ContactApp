var contactData = sessionStorage["contactData"] ? JSON.parse(sessionStorage["contactData"]) : [
    {
        name: "Ashutosh Singh",
        phone: "8565935689",
        countryCode: "+91"
    },
    {
        name: "Gyanesh Singh",
        phone: "9473727249",
        countryCode: "+91"
    },
    {
        name: "Deen Singh",
        phone: "1111111111",
        countryCode: "+91"
    }
];

var homePage = (sessionStorage["homePage"] !== undefined) ? !JSON.parse(sessionStorage["homePage"]) : false;
sessionStorage["homePage"] = homePage;
toggleScreen();

function createApp() {
    let app = document.createElement("div");
    app.id = "app";
    app.className = "app";

    return app;
}

function createContactBox(data, index) {
    let contactBox = document.createElement("div");
    contactBox.id = "contact-box";
    contactBox.className = "contact-box";
    contactBox.innerHTML = `
        <div class="name">
            <div class='name-content'>${data.name}</div>
            <div class='edit-icon' onclick='createNewForm(${index})'>...</div>
        </div>
        <div class='phoneno'>${data.countryCode}-${data.phone}</div>
    `;

    return contactBox;
}

function noDataFoundElement() {
    let noDataFound = document.createElement("div");
    noDataFound.id = "no-data-found";
    noDataFound.className = "no-data-found";
    noDataFound.innerText = "No Data Found!!!";

    return noDataFound;
}

function debouncing (cbFunction, timeout = 1000) {
    let timer;

    return function (args) {
        clearTimeout(timer);
        timer  = setTimeout(() => {
            cbFunction.call(this, args)
        }, timeout)
    }
}

function onChangeSearch(e) {
    const debouncingFunc = debouncing(searching);
    debouncingFunc(e.target.value);
}

function searching(value) {
    
    const searchedContact = contactData.filter(data => (data.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) || data.phone.toLocaleLowerCase().includes(value.toLocaleLowerCase())));

    if(document.getElementById("contact-list")) 
        document.getElementById("contact-list").remove()
    const innerApp = document.getElementById("inner-app");

    let contactList = createContactElement(searchedContact);
    
    innerApp.appendChild(contactList);
}

function createContactElement(list) {
    let contactList = document.createElement("div");
    contactList.id = "contact-list";
    contactList.className = "contact-list";
 
    if(list.length === 0) {
        contactList.appendChild(noDataFoundElement())
    }

    list.forEach((contact, index) => {
        contactList.appendChild(createContactBox(contact, index));
    })

    return contactList;
}

function createInnerContent() {
    let innerApp = document.createElement("div");
    innerApp.id = "inner-app";
    innerApp.className = "inner-app";

    let searchBar = document.createElement("div");
    searchBar.id = "search-app";
    searchBar.className = "search-app";
    searchBar.innerHTML = `
        <input type='text' class='search-bar' onkeyup='onChangeSearch(event)' placeholder='Search Contact...'/>
    `;

    let contactList = createContactElement(contactData)

    innerApp.appendChild(searchBar);
    innerApp.appendChild(contactList);

    return innerApp;
}


function createHeader() {
    let contactHeader = document.createElement("div");
    contactHeader.id = "contactHeader";
    contactHeader.classList.add("contactHeader");
    
    let contactTitle = document.createElement("div");
    contactTitle.id = "contact-title";
    contactTitle.className = "contact-title";
    contactTitle.innerText= "Contact";

    let icon = document.createElement("div");
    icon.id = "back-icon";
    icon.className = "back-icon";
    icon.innerText = "X";
    icon.onclick = function () {
        document.getElementById("contactApp").remove();
        toggleScreen();
    }

    contactHeader.appendChild(contactTitle);
    contactHeader.appendChild(icon);

    return contactHeader; 
}

function toggleScreen() {
    homePage = !homePage;
    sessionStorage["homePage"] = homePage;

    if (homePage) {
        document.getElementById("bottom").classList.remove("hide");
        return;
    }

    
    document.getElementById("bottom").classList.add("hide");
    let screenContent = document.getElementById("screen-content");
    let contactApp = document.createElement("div");
    contactApp.id = "contactApp";
    contactApp.className = "contactApp";
    screenContent.appendChild(contactApp);

    let addButton = document.createElement("div");
    addButton.id = "add-button";
    addButton.className = "add-button";
    addButton.onclick = createNewForm.bind(this, "create")

    addButton.innerHTML = "<div style='margin-top:-12px'>+</div>";

    
    contactApp.appendChild(createHeader());
    contactApp.appendChild(createInnerContent());
    contactApp.appendChild(addButton);

}

function createField(inputTag, type = "text", name, id, value, placeholder, onClickFunction) {
    let input = document.createElement(inputTag);
    input.id = id;
    input.name = name;
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    input.onclick = onClickFunction;

    return input;
}

function onSaveFunction (type, index) {
    console.log(type)

    let form = document.getElementById("create-form");
    let name = form.children[0].value;
    let phone = form.children[1].value;
    let country = form.children[2].value;

    if(type) {
        contactData.push({
            name: name,
            phone: phone,
            countryCode: country
        })
    }
    else {
        contactData[index] = {
            name: name,
            phone: phone,
            countryCode: country
        }
    }
    

    sessionStorage.setItem("contactData", JSON.stringify(contactData));

    alert("Data Saved!!!");

    addContactSection();

}

function onDeleteFunction(index) {
    contactData  = contactData.filter((contact, ind) => ind !== index)
    
    sessionStorage.setItem("contactData", JSON.stringify(contactData));

    alert("Data Deleted!!!");
    
    addContactSection();
    
}

function addContactSection() {
    let contactApp = document.getElementById("contactApp");

    let child = contactApp.firstElementChild;

    while(child) {
        child.remove();
        child = contactApp.firstElementChild;
    }

    let addButton = document.createElement("div");
    addButton.id = "add-button";
    addButton.className = "add-button";
    addButton.onclick = createNewForm.bind(this, "create")

    addButton.innerHTML = "<div style='margin-top:-12px'>+</div>";

    
    contactApp.appendChild(createHeader());
    contactApp.appendChild(createInnerContent());
    contactApp.appendChild(addButton);
}

function createNewForm(type = "create") {
    let form = document.createElement("div");
    form.id = "create-form";
    form.className = "create-form"

    let nameField = createField("input", "text", "name-field", "name-field", type !== "create" ? contactData[type].name : "", "Enter Name",  () => {});
    let phoneField = createField("input", "text", "phone-field", "phone-field", type !== "create" ? contactData[type].phone : "", "Enter Phone", () => {});
    let countryField = createField("input", "text", "country-field", "country-field", type !== "create" ? contactData[type].countryCode : "", "Enter Country", () => {});
    
    let button = createField("input", "button", "submit-button", "submit-button", "Save", "", onSaveFunction.bind(this, type === "create", type));
    let deleteButton = createField("input", "button", "delete-button", "delete-button", "Delete", "", onDeleteFunction.bind(this, type));

    form.appendChild(nameField);
    form.appendChild(phoneField);
    form.appendChild(countryField);
    form.appendChild(button);
    (type !== 'create') && form.appendChild(deleteButton);
    
    let innerApp = document.getElementById("inner-app");
    let child = innerApp.firstElementChild

    while (child) {
        child.remove()
        child = innerApp.firstElementChild;
    }


    innerApp.appendChild(form);
    
    // let innerApp = document.createElement("inner-app");
    // innerApp.id = "inner-app";
    // innerApp.className = "inner-app";


}

//Event Listners
document.getElementById("bottom").addEventListener("click", function (event) {
    //console.log(event.target.id);
    if(event.target.id === 'contact') toggleScreen()
})

