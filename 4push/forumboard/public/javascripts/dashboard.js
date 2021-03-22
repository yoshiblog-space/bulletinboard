'use strict'
{
  const nametag = document.getElementById('nametag');
  window.onload = async function () {
    const token = localStorage.getItem('token');
    const data = {
      token: token
    }
    await fetch('http://localhost:3000/authentication', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    })
      .then(dataname => dataname.json())
      .then(data => {
        if (!data) {
          return window.location.href = 'http://localhost:3000/login.html';
        }
        nametag.textContent = data.name;
      })
      .catch((e)=>{
        console.error('えらー！'+e);
        window.location.href = 'http://localhost:3000/login.html';
      })
  }
}