console.log(localStorage.getItem('token'))
let url = '/api/users/validate-token';
let settings = {
    method:'GET',
    headers : {
        sessiontoken : localStorage.getItem('token')
    } 
}


fetch(url,settings)
    .then( response => {

        console.log(response)
        if( response.ok ){
            return response.json();
        }
        throw new Error( response.statusText );
    })
    .then (responseJson => {
        console.log(responseJson);
        //return responseJson.json();
    })
    .catch(err => {
        console.log(err);
        window.location.href ="/index.html"
    })
