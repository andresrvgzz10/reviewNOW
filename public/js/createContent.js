function fetchCreate(title,type,img,status,email,description){

    let url = '/createContent';
    let data = {
        title,
        type,
        image: img,
        status,
        email,
        description
    }

    console.log(data);
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
        .then (responseJson => {
            console.log(responseJson);
        })
        .catch(err => {
            console.log(err);
            //window.location.href ="/index.html"
        })


}

function watchCreateContent(){

    let form = document.querySelector('.createContent-form');

    form.addEventListener('submit', (event)=> {
        event.preventDefault();
        console.log("Send for approval");

        let title = document.getElementById("title").value;
        let description = document.getElementById("description").value;
        let type = document.getElementById("contentType").value;
        let img = document.getElementById("image").value;

        let validation = document.querySelector('.validationCreation');

        console.log(type);

        document.getElementById("image").value = "";
        document.getElementById("contentType").value = "";
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";

        if(!title || !description || !type || !img)
        {
            validation.innerHTML = "<p> You need to field all the inputs </p>";
            return;
        }

        validation.innerHTML = "";
        let status = "";
        let email = localStorage.getItem('email');
        console.log(localStorage.getItem('userStatus'));
        if(localStorage.getItem('userStatus') === "admin")
        {
            status = "1";
        }
        else
        {
            status = "0";
        }


        //console.log(title,type,img,status,email);
        fetchCreate(title,type,img,status,email,description);


    });

}

function init()
{
    watchCreateContent();
}

init();