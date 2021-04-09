{
  const form = document.getElementById('form');
  const name = document.getElementById('username');
  const email = document.getElementById('inputEmail');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const registErrDisplay = document.getElementById('registErr');
  registErrDisplay.style.display = "none";
  let formCheckFlug = 0;

  const registerErrDisplay = function () {
    registErrDisplay.style.display = "block";
  }
  window.onload = function () {
    const registCheck = localStorage.getItem('formCheckFlug');
    if (registCheck) {
      registerErrDisplay();
      localStorage.removeItem('formCheckFlug');
    }
  }
  //サーバーへの確認
  const dbCheck = async function () {
    const data = {
      name: name.value,
      email: email.value,
      password: password.value,
    }
    const resdata = await fetch('http://localhost:3000/', {
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

  function checkForm() {//入力ミスのチェック
    //初期化
    formCheckFlug = 0;
    name.classList.add('is-valid')
    email.classList.add('is-valid')
    password.classList.add('is-valid')
    confirmPassword.classList.add('is-valid')
    name.classList.remove('is-invalid')
    email.classList.remove('is-invalid')
    password.classList.remove('is-invalid')
    confirmPassword.classList.remove('is-invalid')

    if (name.value === "") {
      name.classList.add('is-invalid')
      formCheckFlug = 1;
    }
    if (email.value === "") {
      email.classList.add('is-invalid');
      formCheckFlug = 1;
    }
    if (password.value.length <= 6) {
      password.classList.add('is-invalid');
      formCheckFlug = 1;
    }
    if (confirmPassword.value !== password.value) {
      confirmPassword.classList.add('is-invalid');
      formCheckFlug = 1;
    }
  }
  function logSubmit(event) {
    checkForm();
    if (!formCheckFlug) {
      dbCheck()
        .then(data => {
          if (data.regist) {  //重複メールアドレスのチェック
            //submitボタンによりリロードされるのでされた際にエラー表示するようローカルストレージに保存
            localStorage.setItem('formCheckFlug', '1');
            window.location.href = '/index.html';
          } else {
            //重複がない場合はtokenを取得し、ローカルストレージに保存
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