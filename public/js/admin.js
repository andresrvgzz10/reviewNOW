
function fetchContent(){

    let url = '/allNotApproveContent';
    let settings = {
        method:'GET',
    }

    let content = document.querySelector('.pendingContent');

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            console.log(responseJson);
            console.log(responseJson[0].title);

            for(let i = 0; i < responseJson.length;i++)
            {
                content.innerHTML += `
                    <tr>
                        <th scope="row">${i+1}</th>
                        <td> ${responseJson[i].title} </td>
                        <td> ${responseJson[i].type} </td>
                        <td> ${responseJson[i].creator.name} </td>
                        <td> 
                            <button type="button" value="${responseJson[i].title}-${responseJson[i]._id}" id="btnApproveContent" class="btn btn-success">Approve</button> 
                            <button type="button" value="${responseJson[i]._id}" id="btnDeleteContent" class="btn btn-danger">Delete</button> 
                        </td>
                    </tr>
                `;
            }

            approveDeleteContent();
        })
        .catch(err => {
            console.log(err);
            //window.location.href ="/index.html"
        })

}

function fetchReviews(){

    let url = '/allNotApproveReviews';
    let settings = {
        method:'GET',
    }

    let content = document.querySelector('.pendingReviews');

    fetch(url,settings)
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then (responseJson => {
            console.log(responseJson);

            for(let i = 0; i < responseJson.length;i++)
            {
                //console.log(responseJson[i]._id)
                content.innerHTML += `
                    <tr>
                        <th scope="row">${i+1}</th>
                        <td> ${responseJson[i].content.title} </td>
                        <td> ${responseJson[i].comment} </td>
                        <td> ${responseJson[i].user.name} </td>
                        <td> 
                            <button type="button" value="${responseJson[i]._id}" id="btnApproveReview" class="btn btn-success"> Approve </button> 
                            <button type="button" value="${responseJson[i]._id}" id="btnDeleteReview" class="btn btn-danger">Delete</button> 
                        </td>                    
                    </tr>
                `;
            }
            
            approveDeleteReview();
        })
        .catch(err => {
            console.log(err);
            //window.location.href ="/index.html"
        })

}


function approveDeleteContent(){

    console.log("hola");
    let contentContent = document.querySelector('.createContent');
    //console.log(content);

    contentContent.addEventListener('click',(event) => {
       
        event.preventDefault();
        
        if(event.target.matches('#btnApproveContent'))
        {
            let data = event.target.value;
            let arrayDeCadenas = data.split('-')
            console.log(arrayDeCadenas);
            let title = arrayDeCadenas[0];
            let id = arrayDeCadenas[1];
            console.log("Aprobar: ")
            approveContent(title,id)
        }
        if(event.target.matches('#btnDeleteContent')){
            let id = event.target.value;

            console.log("Eliminar: " + id)
            deleteContent(id);
        }
    });

}

function approveDeleteReview(){

    console.log("hola - review");
    let contentReview = document.querySelector('.verifyReview');
    //console.log(content);

    contentReview.addEventListener('click',(event) => {
       
        event.preventDefault();
        let id = event.target.value;
        if(event.target.matches('#btnApproveReview'))
        {
            console.log("Aprobar: " + id)
            approveReview(id);
        }
        if(event.target.matches('#btnDeleteReview')){
            console.log("Eliminar: " + id)
            deleteReview(id);
        }
    });

}

function approveContent(title,id){

    let url = '/approveContent';
    let data = {
        title,
        _id: id
    }
    let settings = {
        method:'PATCH',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    //let content = document.querySelector('.pendingContent');
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
        .catch( err => {
            console.log(err);
            alert(err)
        })

}

function deleteContent(id){

    let url = '/deleteContent';
    let data = {
        _id: id
    }
    let settings = {
        method:'PATCH',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    //let content = document.querySelector('.pendingContent');
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
        .catch( err => {
            console.log(err);
            alert(err)
        })

}

function approveReview(id){


    
    let url = '/approveReview';
    let data = {
        _id: id
    }

    console.log(data)
    let settings = {
        method:'PATCH',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    //let content = document.querySelector('.pendingContent');
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
        .catch( err => {
            console.log(err);
            alert(err)
        })
}

function deleteReview(id){
    let url = '/deleteReview';
    let data = {
        _id: id
    }
    let settings = {
        method:'PATCH',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    //let content = document.querySelector('.pendingContent');
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
        .catch( err => {
            console.log(err);
            alert(err)
        })
}



function init(){

    fetchContent();
    fetchReviews();

}

init();