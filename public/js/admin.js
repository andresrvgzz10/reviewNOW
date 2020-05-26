
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
                            <button type="button" value="${responseJson[i].title}" class="btn btn-success">Approve</button> 
                            <button type="button" value="${responseJson[i].title}" class="btn btn-danger">Delete</button> 
                        </td>
                    </tr>
                `;
            }
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
                content.innerHTML += `
                    <tr>
                        <th scope="row">${i+1}</th>
                        <td> ${responseJson[i].content.title} </td>
                        <td> ${responseJson[i].comment} </td>
                        <td> ${responseJson[i].user.name} </td>
                        <td> 
                            <button type="button" value="${responseJson[i].title}" id="btnAppove" class="btn btn-success">Approve</button> 
                            <button type="button" value="${responseJson[i].title}" id="btnDelete" class="btn btn-danger">Delete</button> 
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


function approveDeleteContent(){

    console.log("hola");
    let content = document.querySelector('.createReview');
    //console.log(content);

    content.addEventListener('click',(event) => {
       
        event.preventDefault();

        console.log("Event: " +event.target);
        console.log(event.target.matches('#btnAppove'));

        if(event.target.matches('.pendingContent'))
        {
            console.log("Aprobar: ")
        }
        if(event.target.matches('#btnDelete')){
            console.log("Eliminar: ")
        }
    });

}



function init(){

    fetchContent();
    fetchReviews();

}

init();