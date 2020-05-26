let status = localStorage.getItem('userStatus')

let putControllerMenu = document.querySelector('.controllerMenu');
console.log(status);
if(status === "user")
{
    putControllerMenu.innerHTML = `
    <a class="dropdown-item" href="./notification.html">Notifications</a>
    `;
}
else{

    putControllerMenu.innerHTML = `
    <a class="dropdown-item" href="./admin.html">Admin</a>
    `;
}