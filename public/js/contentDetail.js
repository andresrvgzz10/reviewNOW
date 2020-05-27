
function fetchReview(comment){

    let email = localStorage.getItem("email");
    let statusLocal = localStorage.getItem("userStatus");
    let title = localStorage.getItem("title");

    console.log(statusLocal);
    let status = "";
    if(statusLocal === "admin")
    {
        status = "1";
    }
    else{
        status = "0";
    }
    let url = '/createReview';
    let data = {
        email,
        status,
        title,
        comment
    }
    console.log(data)
    let settings= {
        method: 'POST',
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
            if(status === "0")
            {
                alert("Wait to see your review here - check your notification account");
            } 
            loadReviewsContent();
        })
        .catch(err => {
            console.log(err);
            alert("You cant review more than one time this content");
            //window.location.href ="/index.html"
            location.reload();
        })
}


function watchReview(){
    let reviewBtn = document.querySelector('.form-reviewContent');


    reviewBtn.addEventListener('submit', (event) => {
        event.preventDefault();
        console.log("Prepargin review");

        let comment = document.getElementById("commentReview").value;

        let validation = document.querySelector('.validationReview');

        if(!comment)
        {
            event.preventDefault();
            validation.innerHTML = "<p> You need to field the textarea in order to submit your review</p>";
            return;
        }

        validation.innerHTML = "";

        validateReview(comment);


    });
}

function loadReviewsContent()
{
    let title = localStorage.getItem("title");
    let url = '/getReviewsApprovedByTitleContent?title='+title;

    let settings = {
        method: 'GET'
    }

    let result = document.querySelector('.reviews');

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            console.log(responseJson.length);
            console.log(responseJson);

                for(let i=0;responseJson.length;i++)
                {
                    result.innerHTML += `

                    <div class="d-flex justify-content-center">
                    <div class="card flex-md-row mb-4 box-shadow" style="width: 900px;">
                            <div class="card-body d-flex flex-column align-items-start">
                            <strong class="d-inline-block mb-2 text-danger" >${responseJson[i].user.name}</strong>
                            <p class="card-text mb-auto">${responseJson[i].comment}</p>
                            </div>
                    </div>
                    </div>
                    `;
                }
        })
        .catch(err => {
            console.log(err);
            //window.location.href ="/index.html"
        })
}

function validateReview(comment){
    let title = localStorage.getItem("title");
    let url = '/getReviewByUserandContent?title='+title+"&email=" +localStorage.getItem("email");
    let settings = {
        method: 'GET'
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
            let resul = responseJson;
            if(!resul)
            {
                fetchReview(comment);
            }
            else{
               alert("You cant write more reviews");
            }
        })
        .catch(err => {

        })
}

function loadContent()
{

    console.log(localStorage.getItem('title'))
    let url = '/getContentByTitle';

    let data = {
        title :localStorage.getItem('title')
    }
    let settings = {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )

    }

    let result = document.querySelector('.resultContent');

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            console.log(responseJson);

            result.innerHTML = `
            <div class="d-flex justify-content-center">
            <div class="createReview" style="width: 1600px;">
            <div class="card flex-md-row mb-4 box-shadow h-md-250">
                        <div class="card-body d-flex flex-column align-items-start">
                        <strong class="d-inline-block mb-2 text-success" >${responseJson.type}</strong>
                        <h3 class="mb-0" id="title" value="${responseJson.title}">${responseJson.title}</h3>
                        <p class="card-text mb-auto">${responseJson.description}</p>
                        <img class="card-img-right d-none d-md-block" alt="Thumbnail [200x250]" style="width: 200px; height: 250px;" src="${responseJson.image}" data-holder-rendered="true">
                        </div>
            </div>
            </div>
            </div>

            <div class="d-flex justify-content-center">
            <div class="createReview" style="width: 900px;">
                <form class="form-reviewContent">
                    <label for="exampleFormControlTextarea1">Create Your Review</label>
                    <textarea class="form-control" id="commentReview" rows="3"></textarea>
                    <button type="submit" class="btn btn-outline-dark btn-sm">Create Review</button>
                </form>
                <div class="validationReview">
                </div>
            </div>
            </div>
            <br>


            <div class="reviews">
            </div>
            
            `;
            watchReview();
            loadReviewsContent();
        })
        .catch(err => {
            console.log(err);
            //window.location.href ="/index.html"
        })

}



function init()
{
    loadContent()

}

init();