
console.log("HOLA")


function fetchTowatch(){

    let email = localStorage.getItem('email');
    let url = '/getContentToWatchByEmailUser?email='+email;
    let settings = {
        method:'GET'
    }

    let content = document.querySelector('.content');
    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            for(let i = 0; i < responseJson.length; i++)
            {
                console.log(responseJson[i]);
                content.innerHTML += `
                <div class="col-sm-4 px-md-5 mt-2">
                        <div class="card">
                            <img style="height: 400px;" src="${responseJson[i].content.image}" class="p-4" alt="...">
                            <div class="card-body text-center">
                            <strong class="d-inline-block mb-2 text-display" >${responseJson[i].content.type}</strong>
                            <h3 class="mb-0" id="title" value="${responseJson[i].content.title}">${responseJson[i].content.title}</h3>
                            <div class="contentEach mt-2 text-center">
                                <button type="submit" value="${responseJson[i]._id}" id="remove" class="btn btn-outline-danger btn-sm">Remove</button>
                                <button type="submit" value="${responseJson[i]._id}-${responseJson[i].content.title}" id="alreadyWatch" class="btn btn-outline-secondary btn-sm">Already watch</button>
                            </div>
                            </div>
                        </div>
                    </div>
                `;
            }

            selectionOfButtons();
        })
        .catch(err => {
            console.log(err)
        });
}


function selectionOfButtons(){

    let content = document.querySelector('.content');
    //let email = localStorage.getItem("email");
    console.log(content);
    content.addEventListener('click',(event) => {
        title = event.target.value;
        event.preventDefault();

        if(event.target.matches('#remove'))
        {
            console.log("Remove: "+event.target.value);
            deleteContent(event.target.value)
            //token to the localStorage

        }
        if(event.target.matches('#alreadyWatch'))
        {
            console.log("Already Watch");
            let data = event.target.value;
            let arrayDeCadenas = data.split('-')
            console.log(arrayDeCadenas);
            let id = arrayDeCadenas[0];
            let title = arrayDeCadenas[1];

            deleteContent(id);
            addContentToAlreadyWatch(title);
        }
    });

}


function addContentToAlreadyWatch(title){

    let email = localStorage.getItem("email");
    let url = '/addContentToAlreadyWatch';
    let data = {
        title,
        email
    }
    let settings = {
        method:'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )

    }

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then(responseJson => {
            console.log(responseJson);
        })
        .catch(err => {
            console.log(err);
        });


}

function deleteContent(id){

    let url = '/deleteToWatchByID?id='+id;
    let settings = {
        method:'DELETE'
    }

    let content = document.querySelector('.content');
    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then(responseJson => {
            console.log(responseJson);
            location.reload()
        })
        .catch(err => {
            console.log(err);
        });

}


function init(){
    fetchTowatch();
}

init();