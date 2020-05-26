

function fetchLogin(email,password){

    console.log("fetch")
    let url = '/user/loginUser';

    let data = {
        email,
        password
    }
    let settings = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.resultLogin' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){

                console.log(response)
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log( responseJSON );

            //token to the localStorage
            localStorage.setItem('token', responseJSON.token);
            localStorage.setItem('email', email);
            localStorage.setItem('userStatus', responseJSON.userStatus);


            window.location.href = "/pages/home.html"
        })
        .catch( err => {
            results.innerHTML = `<p class="text-danger"> ${err.message} </p>`;
        });


}

function watchLogin(){

    let btnLogin = document.querySelector('.login-form');

    btnLogin.addEventListener('submit', (event) => {

        event.preventDefault();
        console.log("Log In Seleccionado");

        let email = document.getElementById( 'email' ).value;
        let password = document.getElementById( 'password' ).value;

        fetchLogin(email,password)

    });

}

function init()
{
    watchLogin();
}

init()