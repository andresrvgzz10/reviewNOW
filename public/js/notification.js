
function fetchContent(){

    let email = localStorage.getItem('email');
    let url = '/contentByUserEmail?email='+email;
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

            
            for(let i = 0; i < responseJson.length;i++)
            {
                let flag = '<p class="text-danger">Revision</p>';
                if(responseJson[i].status === "1")
                {
                    flag = '<p class="text-success">Approved</p>';
                }
                if(responseJson[i].status === "3"){
                    flag = '<p class="text-secondary">Not approved</p>';
                }
                content.innerHTML += `
                    <tr>
                        <th scope="row">${i+1}</th>
                        <td> ${responseJson[i].title} </td>
                        <td> ${responseJson[i].type} </td>
                        <td> 
                            ${flag}
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

    let email = localStorage.getItem('email');
    let url = '/reviewsByUser?email=' + email;
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
                let flag = '<p class="text-danger">Revision</p>';
                if(responseJson[i].status === "1")
                {
                    flag = '<p class="text-success">Approved</p>';
                }
                if(responseJson[i].status === "3"){
                    flag = '<p class="text-danger">Not approved</p>';
                }
                content.innerHTML += `
                    <tr>
                        <th scope="row">${i+1}</th>
                        <td> ${responseJson[i].content.title} </td>
                        <td> ${responseJson[i].comment} </td>
                        <td> 
                            ${flag}
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



function init(){

    fetchContent();
    fetchReviews();

}

init();