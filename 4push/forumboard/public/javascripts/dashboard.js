'use strict'
{
  const nametag = document.getElementById('nametag');
  const contentData = "";
  const token = localStorage.getItem('token');
  const loginId = Number(localStorage.getItem('id'));

  window.onload = async function () {
    //ページ遷移の許可Auth
    const params = { token, userid: loginId }
    const query = new URLSearchParams(params);
    await fetch('http://localhost:3000/authentication', {
      headers: {
        token,
        userid: loginId
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
        console.error('えらー！' + e);
        window.location.href = '/login.html';
      })
    //contentデータの要求
    await fetch('http://localhost:3000/contentrequest', {
      headers: {
        'Content-Type': 'application/json',
        token,
        userid: loginId
      },
    })
      .then(response => response.json())
      .then(contents => {
        //contents
        if (contents.errMessage === 'AuthError') {
          return window.location.href = '/login.html';
        }
        contents.forEach(content => {
          //コンテンツ表示のためのhtml初期作成
          //fragにて箱を作成し最後にhtmlのdomへ紐付け
          const frag = document.createDocumentFragment();
          const contentCardbox = document.createElement('div');
          contentCardbox.classList.add('row', 'justify-content-center', 'cardbox', 'cardboxstyle');
          const contentCard = document.createElement('div');
          contentCard.classList.add('card', 'cardstyle');
          contentCardbox.appendChild(contentCard);
          const contentCardBody = document.createElement('div');
          contentCardBody.classList.add('card-body');
          contentCard.appendChild(contentCardBody);
          const contentCardTitle = document.createElement('h5');
          contentCardTitle.textContent = content.title;
          contentCardTitle.classList.add('card-title');
          contentCardBody.appendChild(contentCardTitle);
          const contentCardText = document.createElement('p');
          contentCardText.classList.add('card-text');
          contentCardText.textContent = content.content;
          contentCardBody.appendChild(contentCardText);
          const contentCardUser = document.createElement('p');
          contentCardUser.textContent = '投稿者: ' + content.user.name;
          contentCardBody.appendChild(contentCardUser);
          contentCardUser.classList.add('card-text');
          const contentLikebox = document.createElement('div');
          contentLikebox.classList.add('likebox')
          contentCardBody.appendChild(contentLikebox);
          const contentLikeMark = document.createElement('div');
          contentLikeMark.classList.add('likemargin');
          contentLikebox.appendChild(contentLikeMark);
          const contentCardIcon = document.createElement('i');
          contentCardIcon.classList.add('far', 'fa-heart');
          contentLikeMark.appendChild(contentCardIcon);
          const contentLikeVal = document.createElement('div');
          contentLikeVal.classList.add('likemargin');
          contentLikebox.appendChild(contentLikeVal);
          const contentCardLikes = document.createElement('p');
          contentCardLikes.textContent = content.likes.length;
          contentCardLikes.classList.add('likecount');
          contentLikeVal.appendChild(contentCardLikes);
          //ユーザーが一致する場合のみボタンを表示
          if (content.userId === loginId) {
            const contentCardChange = document.createElement('button');
            contentCardChange.textContent = '編集';
            contentCardChange.setAttribute('type', 'button');
            contentCardChange.classList.add('btn', 'btn-success', 'rounded-pill');
            contentCardChange.classList.add('likemargin');
            //編集画面に渡すデータの保存とページ遷移
            contentCardChange.addEventListener('click', function () {
              localStorage.setItem('contentTitle', content.title);
              localStorage.setItem('contentText', content.content);
              localStorage.setItem('contentId', content.id);
              window.location.href = '/newpost.html';
            })
            contentCardBody.appendChild(contentCardChange);
            const contentCardDelete = document.createElement('button');
            contentCardDelete.setAttribute('type', 'button');
            contentCardDelete.classList.add('btn', 'btn-outline-danger', 'rounded-pill');
            contentCardDelete.textContent = '削除';
            contentCardDelete.setAttribute('type', 'button');
            contentCardDelete.addEventListener('click', async function () {
              await fetch('/contentdel', {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                  token,
                  userid: loginId
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({ id: content.id })
              })
                .then(response => response.json())
                .then(data => {
                  if (data.result === 'delComplete') {
                    window.location.href = '/dashboard.html';
                  } else {
                    const contentErr = document.createElement('p');
                    contentErr.textContent = '削除できませんでした'
                    container.appendChild(contentErr);
                  }
                })
            })
            contentCardBody.appendChild(contentCardDelete);
          }
          frag.appendChild(contentCardbox);
          const container = document.getElementById('container');
          container.appendChild(frag);
        });
      });
  }
}