{
  const form = document.getElementById('form');
  const email = document.getElementById('inputEmail');
  const password = document.getElementById('password');
  let formCheckFlug = 0;
  const registErrDisplay = document.getElementById('registErr');
  registErrDisplay.style.display = "none";
  const registerErrDisplay = function () {
    registErrDisplay.style.display = "block";
  }
  window.onload = function () {
    const registCheck = localStorage.getItem('formCheckFlug');
    const tokenCheck = localStorage.getItem('token');
    if (registCheck) {
      registerErrDisplay();
      localStorage.removeItem('formCheckFlug');
    }
    if (tokenCheck) {
      localStorage.clear();
    }
  }
  function checkForm() {
    //初期化
    formCheckFlug = 0;
    email.classList.add('is-valid')
    password.classList.add('is-valid')
    email.classList.remove('is-invalid')
    password.classList.remove('is-invalid')
    if (email.value === "") {
      email.classList.add('is-invalid');
      formCheckFlug = 1;
    }
    if (password.value.length <= 6) {
      password.classList.add('is-invalid');
      formCheckFlug = 1;
    }
  }

  const dbCheck = async function () {
    const data = {
      email: email.value,
      password: password.value,
    }
    const resdata = await fetch('http://localhost:3000/logincheck', {
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
    return resdata.json();
  }

  function logSubmit(event) {
    checkForm();
    if (!formCheckFlug) {
      dbCheck()
        .then(data => {
          if (!data.id) { //登録情報の照合
            localStorage.setItem('formCheckFlug', '1');
            //リロード時のエラー表示のためのlocalstarageへの登録
            window.location.href = '/login.html';
          } else {
            //重複がない場合はtokenを取得し、localstarageに保存
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.id);
            window.location.href = '/dashboard.html';
          }
        })
    }
    event.preventDefault();
  }
  form.addEventListener('submit', logSubmit)
}