'use strict'
{
  const form = document.getElementById('form');
  const title = document.getElementById('title');
  const content = document.getElementById('textarea');
  const nametag = document.getElementById('nametag');
  const registErrDisplay = document.getElementById('registErr');
  registErrDisplay.style.display = "none";
  const editContentTitle = document.getElementById('editContent')
  editContentTitle.style.display = "none";
  const editContentBtn = document.getElementById('editContentBtn')
  editContentBtn.style.display = "none";
  const newPostContent = document.getElementById('newPostContetBtn');
  newPostContent.style.display = "block";
  let formCheckFlug = 0;
  //認証用トークン
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  //編集用コンテンツデータ
  const editContentIdData = localStorage.getItem('contentId');
  const editContentTitleData = localStorage.getItem('contentTitle');
  const editContentTextData = localStorage.getItem('contentText');
  localStorage.removeItem('contentTitle');
  localStorage.removeItem('contentText');
  localStorage.removeItem('contentId');
  const result = localStorage.getItem('result');
  let updateFlag = 0;

  window.onload = async function () {
    //登録完了または失敗の表示
    if (result === 'NG') {
      registErrDisplay.style.display = "block";
    }
    if (editContentIdData) {
      newPostContent.style.display = "none";
      editContentTitle.style.display = "block";
      editContentBtn.style.display = "block";
      title.value = editContentTitleData;
      content.textContent = editContentTextData;
      updateFlag = 1;
    }

    await fetch('http://localhost:3000/authentication', {
      mode: 'cors', 
      headers: {
        token,
        userid: userId
      }
    })
      .then(dataname => dataname.json())
      .then(data => {
        if (!data) {
          return window.location.href = '/login.html';
        }
        nametag.textContent = data.name;
      })
      .catch((e) => {
        console.error('えらー！!' + e);
        window.location.href = '/login.html';
      })
  }
  function checkForm() {
    //初期化
    formCheckFlug = 0;
    title.classList.add('is-valid')
    textarea.classList.add('is-valid')
    title.classList.remove('is-invalid')
    textarea.classList.remove('is-invalid')
    if (title.value.length > 20 || !title.value) {
      title.classList.add('is-invalid');
      formCheckFlug = 1;
    }
    if (textarea.value.length > 140 || !textarea.value) {
      textarea.classList.add('is-invalid');
      formCheckFlug = 1;
    }
  }
  const contentsSend = async function () {
    let url ='';
    const data = {
      id: editContentIdData,
      title: title.value,
      content: content.value,
    }
    if(!updateFlag){
      url = '/contentsend';
    }else{
      url = '/contentupdate';
    }

    const resdata = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        token,
        userid: userId,
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
      contentsSend()
        .then(result => {
          if (result) {
            window.location.href = '/dashboard.html';
          } else {
            localStorage.setItem('result', 'NG');
            window.location.href = '/newpost.html';
          }
        })
        .catch((e) => console.error(e));
    }
    event.preventDefault();
  }
  form.addEventListener('submit', logSubmit)
}