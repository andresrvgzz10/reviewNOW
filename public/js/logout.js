
function logout() {
    console.log("Cerrar Sesion");

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('title');
    localStorage.removeItem('userStatus');

    window.location.href = "/"
    
  }