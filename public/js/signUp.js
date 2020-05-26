

function fetchSignUp(name,email,password){
    let url = '/user/createUser';
    let data = {
        name,
        email,
        password,
        status : 'user'
    }
    let settings = {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.result' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            console.log( responseJSON );
            window.location.href = "/"
        })
        .catch( err => {
            results.innerHTML = `<p class="text-danger"> ${err.message} </p>`;
        });


}

function watchSignUp(){

    let btnLogin = document.querySelector('.signUp-form');

    btnLogin.addEventListener('submit', (event) => {

        event.preventDefault();
        console.log("SignUp Seleccionado");

        let name = document.getElementById( 'name' ).value;
        let email = document.getElementById( 'email' ).value;
        let password = document.getElementById( 'password' ).value;

        fetchSignUp(name,email,password)

    });

}

function init()
{
    watchSignUp();
}

init()