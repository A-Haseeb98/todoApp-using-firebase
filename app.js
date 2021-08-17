let main = document.getElementById("main");
const getTodo = () => {

    firebase.database().ref("todos").on("child_added", (data) => {
        console.log(data.val().todo)
        main.innerHTML += `
        <div  id="del${data.key}" class="input-group p-3 todo-list" >
        <input id="edit${data.key}" class=" list-input form-control bg-light"  value="${data.val().todo}" disabled="">
        <button id="btn${data.key}" class="button btn btn-outline-dark" onclick="edit('${data.key}')">Edit</button>
        <button id="${data.key}" class="button btn btn-outline-dark" onclick="del('${data.key}')">Delete</button>
        </div>`
    })
}

let add = () => {
    var task = document.getElementById("task")
    if (task.value === "") {
        swal("Nothing To Add!", "", "warning");
    }
    else {
        firebase.database().ref("todos").push({
            todo: task.value
        })
        .then(() => {
            swal("Successfully Added!", "", "success");
            task.value = null
        })
    }
}

let deleteAll = () => {
    swal({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        buttons: true,
        buttons: ["No", "Yes"],
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                firebase.database().ref("todos").remove();
                main.innerHTML = null;
            }
        });
}

let del = (key) => {
    swal({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        buttons: true,
        buttons: ["No", "Yes"],
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                firebase.database().ref(`todos/${key}`).remove()
                document.getElementById('del' + key).remove();
            }
        });
}

let edit = (key) => {
    const input = document.getElementById('edit' + key);
    const btn = document.getElementById('btn' + key);

    if (btn.innerText === 'Update') {
        btn.innerText = 'Edit'
        console.log(input.value)
        input.disabled = true;
        firebase.database().ref(`todos/${key}`).update({
            todo: input.value
        })
        swal("Successfully Edited!", "", "success");
    }
    else {
        input.disabled = false;
        input.focus();
        btn.innerText = 'Update'
    }
}

function enter(e) {
    if(e.keyCode === 13){
        add();
    }
}