
function fetchAlreadyWatch(){

    let email = localStorage.getItem('email');
    let url = '/getContentAlreadyWatchByEmailUser?email='+email;
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
                                <button type="submit" value="${responseJson[i]._id}" id="seemore" class="btn btn-outline-danger btn-sm">Remove</button>
                            </div>
                            </div>
                        </div>
                    </div>
                `;

                removeContent();
            }
        })
        .catch(err => {
            console.log(err)
        });
}

function removeContent(){

    let content = document.querySelector('.content');
    //let email = localStorage.getItem("email");
    console.log(content);
    content.addEventListener('click',(event) => {
        event.preventDefault();

        if(event.target.matches('#seemore'))
        {
            console.log("Remove: "+event.target.value);
            let id = event.target.value;
            deleteContent(id)
            //token to the localStorage

        }
    });

}

function deleteContent(id){

    let url = '/deleteAlreadyWatchByID?id='+id;
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
            location.reload();
        })
        .catch(err => {
            console.log(err);
        });

}

function init(){
    fetchAlreadyWatch();

}

init();