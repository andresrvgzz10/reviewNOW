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
                /*
                content.innerHTML += `
                <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${responseJson[i].title}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${responseJson[i].type}</h6>
                    <p class="card-text">${responseJson[i].description}</p>
                    <a href="#" class="card-link">Already Watch</a>
                    <a href="#" class="card-link">To Watch</a>
                </div>
                </div>
                `;
                */

                if(responseJson[i].type == "Movie")
                {
                    content.innerHTML += `
                    <div class="col-md-6">
                    <div class="card flex-md-row mb-4 box-shadow h-md-250">
                        <div class="card-body d-flex flex-column align-items-start">
                        <strong class="d-inline-block mb-2 text-primary">${responseJson[i].type}</strong>
                        <h3 class="mb-0" id="title" value="${responseJson[i].title}">${responseJson[i].title}</h3>
                        <p class="card-text mb-auto">${responseJson[i].description}</p>
                        <div class="contentEach">
                        <button type="submit" value="${responseJson[i].title}" id="seemore" class="btn btn-outline-primary btn-sm">See More</button>
                        <button type="submit" value="${responseJson[i].title}" id="alreadyWatch" class="btn btn-outline-secondary btn-sm">Already watch</button>
                        <button type="submit" value="${responseJson[i].title}" id="toWatch" class="btn btn-outline-dark btn-sm">To watch</button>
                        </div>
                        </div>
                        <img class="card-img-right d-none d-md-block" alt="Thumbnail [200x250]" style="width: 200px; height: 250px;" src="${responseJson[i].image}">
                    </div>
                    </div>
                    `;

                }
                if(responseJson[i].type == "Tv Show")
                {
                    content.innerHTML += `
                    <div class="col-md-6">
                    <div class="card flex-md-row mb-4 box-shadow h-md-250">
                        <div class="card-body d-flex flex-column align-items-start">
                        <strong class="d-inline-block mb-2 text-success" >${responseJson[i].type}</strong>
                        <h3 class="mb-0" id="title" value="${responseJson[i].title}">${responseJson[i].title}</h3>
                        <p class="card-text mb-auto">${responseJson[i].description}</p>
                        <div class="contentEach">
                        <button type="submit" value="${responseJson[i].title}" id="seemore" class="btn btn-outline-success btn-sm">See More</button>
                        <button type="submit" value="${responseJson[i].title}" id="alreadyWatch" class="btn btn-outline-secondary btn-sm">Already watch</button>
                        <button type="submit" value="${responseJson[i].title}" id="toWatch" class="btn btn-outline-dark btn-sm">To watch</button>
                        </div>
                        </div>
                        <img class="card-img-right d-none d-md-block" alt="Thumbnail [200x250]" style="width: 200px; height: 250px;" src="${responseJson[i].image}" data-holder-rendered="true">
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
            alert("The content is already in the section 'Already Watch'");
        }
        if(event.target.matches('#toWatch'))
        {
            console.log("To watch");
            let titleToWatch = event.target.value;
            console.log("Title To Watch: " + titleToWatch);

            alert("The content is already in the section 'To Watch'");
        }
        
    })


}

function init(){
    fecthAllContent();
   
}

init();