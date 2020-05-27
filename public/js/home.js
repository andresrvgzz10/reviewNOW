    function fecthAllContent(){

    let url = '/allApproveContent';
    let settings = {
        method:'GET'
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

            let content = document.querySelector('.content');
            for(let i = 0; i < responseJson.length; i++)
            {

                if(responseJson[i].type == "Movie")
                {
                    content.innerHTML += `
                    <div class="col-sm-4 px-md-5 mt-2">
                        <div class="card">
                            <img style="height: 400px;" src="${responseJson[i].image}" class="p-4" alt="...">
                            <div class="card-body text-center">
                            <strong class="d-inline-block mb-2 text-success" >${responseJson[i].type}</strong>
                            <h3 class="mb-0" id="title" value="${responseJson[i].title}">${responseJson[i].title}</h3>
                            <div class="contentEach mt-2 text-center">
                                <button type="submit" value="${responseJson[i].title}" id="seemore" class="btn btn-outline-success btn-sm">See More</button>
                                </div>
                            <div class="contentEach mt-2 text-center">
                                <button type="submit" value="${responseJson[i].title}" id="alreadyWatch" class="btn btn-outline-secondary btn-sm">Watched</button>
                                <button type="submit" value="${responseJson[i].title}" id="toWatch" class="btn btn-outline-dark btn-sm">To Watch</button>
                            </div>
                            </div>
                        </div>
                    </div>
                    `;

                }
                if(responseJson[i].type == "Tv Show")
                {
                    content.innerHTML += `

                    <div class="col-sm-4 px-md-5 mt-2">
                        <div class="card">
                            <img style="height: 400px;" src="${responseJson[i].image}" class="p-4" alt="...">
                            <div class="card-body text-center">
                            <strong class="d-inline-block mb-2 text-primary" >${responseJson[i].type}</strong>
                            <h3 class="mb-0" id="title" value="${responseJson[i].title}">${responseJson[i].title}</h3>
                            <div class="contentEach mt-2 text-center">
                                <button type="submit" value="${responseJson[i].title}" id="seemore" class="btn btn-outline-primary btn-sm">See More</button>
                            </div>
                            <div class="contentEach mt-2 text-center">
                                <button type="submit" value="${responseJson[i].title}" id="alreadyWatch" class="btn btn-outline-secondary btn-sm">Watched</button>
                                <button type="submit" value="${responseJson[i].title}" id="toWatch" class="btn btn-outline-dark btn-sm">To Watch</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    `;
                }
            }

            sendContentToAnotherView();

        })
        .catch(err => {
            console.log(err);
        })

}

function sendContentToAnotherView(){

    console.log("hola");
    let content = document.querySelector('.content');
    console.log(content);
    content.addEventListener('click',(event) => {
       
        event.preventDefault();

        console.log("Event: " +event.target.value);

        if(event.target.matches('#seemore'))
        {
            console.log("See more");
            //token to the localStorage
            localStorage.setItem('title', event.target.value);
            window.location.href = "/pages/contentDetail.html"
        }
        if(event.target.matches('#alreadyWatch'))
        {
            console.log("Already Watch");
            let titleAlreadyWatch = event.target.value;
            console.log("Title Already Watch: " + titleAlreadyWatch);
            //alert("The content " + titleAlreadyWatch + " is already in the section 'Already Watch'");
            //REVISAR SI NO ESTA EN TO WATCH Y MANDAR AGREGAR A ALREADYWATCH
            //addToAlreadyWatch(titleAlreadyWatch);
            checkAlreadyWatch(titleAlreadyWatch)
            
        }
        if(event.target.matches('#toWatch'))
        {
            console.log("To watch");
            let titleToWatch = event.target.value;
            console.log("Title To Watch: " + titleToWatch);
            //REVISAR SI NO ESTA EN LAREADY WATCH Y AGREGARLA A TO WATCH
            //addToWatch(titleToWatch)

            verifyToWatch(titleToWatch);
            
    

        }
        
    })


}

function verifyToWatch(title){
    let email = localStorage.getItem('email');
    let url = '/getToWatchContentByUser?title=' +title +"&email="+email;
    let settings = {
        method:'GET',
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
            console.log("Respuestas :" + responseJson);
            let = result = responseJson
            if(!result)
            {
                verifyAlreadyWatch(title);
            }
            else{
                alert("This content is in 'to watch' already")
                location.reload();
            }
            //location.reload();
        })
        .catch(err => {
            console.log(err);
        })

}

function verifyAlreadyWatch(title){

    let email = localStorage.getItem('email');
    let url = '/getAlreadyWatchContentByUser?title=' +title +"&email="+email;
    let settings = {
        method:'GET',
    }

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            console.log("Respuestas :" + responseJson);
            
            let resultado = responseJson;
            if(!resultado)
            {
                addToWatch(title);
            }
            else{
                alert("This content is in 'Already Watch' you can't add to 'To Watch'");
                location.reload();
            }
            

        })
        .catch(err => {
            console.log(err);
        })

}

function checkToWatch(title){

    let email = localStorage.getItem('email');
    let url = '/getToWatchContentByUser?title=' +title +"&email="+email;
    let settings = {
        method:'GET',
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
            console.log("Respuestas :" + responseJson);
            let = result = responseJson
            if(!result)
            {
                addToAlreadyWatch(title);
            }
            else{
                alert("This content is in 'to watch' you can't add to 'already watch'")
                location.reload();
            }
            //location.reload();
        })
        .catch(err => {
            console.log(err);
        })

}

function checkAlreadyWatch(title){

    let email = localStorage.getItem('email');
    let url = '/getAlreadyWatchContentByUser?title=' +title +"&email="+email;
    let settings = {
        method:'GET',
    }

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            console.log("Respuestas :" + responseJson);
            
            let resultado = responseJson;
            if(!resultado)
            {
                checkToWatch(title)
            }
            else{
                alert("This content is in 'already watch' already");
                location.reload();
            }
            

        })
        .catch(err => {
            console.log(err);
        })

}

function addToAlreadyWatch(titleAlreadyWatch){

    let email = localStorage.getItem('email');
    let url = '/addContentToAlreadyWatch';
    let data = {
        email,
        title : titleAlreadyWatch
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
        .then (responseJson => {
            console.log(responseJson);
            if(responseJson.driver)
            {
                alert("This content is already in this section");

            }else{
                alert("The content " + titleAlreadyWatch + " was added to 'Already Watch'");
            }
            
            location.reload();
        })
        .catch(err => {
            console.log(err);
        })
    
}


function addToWatch(titleToWatch){

    let email = localStorage.getItem('email');
    let url = '/addContentToWatch';
    let data = {
        email,
        title : titleToWatch
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
        .then (responseJson => {
            console.log(responseJson);
            if(responseJson.driver)
            {
                alert("This content is already in this section");

            }else{
                alert("The content " + titleToWatch + " was added to 'To Watch'");
            }
            location.reload();
        })
        .catch(err => {
            console.log(err);
        })

}

function init(){
    fecthAllContent();
   
}

init();