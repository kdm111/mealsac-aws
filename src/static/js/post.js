const replyForm = document.querySelector('#replyForm');
const replyBtnGroup = document.querySelector('.replyBtnGroup');
const replyToggleBtn = document.querySelector('.replyToggleBtn');
const commentModifyBtn = document.querySelector('.commentModifyBtn');

const category = () => {
  history.back();
};

// 컨트롤러 완성 후 주석 풀기
const myPost = () => {
  const btnBox = document.querySelector('.btnBox');
  if (`${post.user_id}` === `${user.id}`) {
    btnBox.style.display = 'block';
  } else {
    btnBox.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const replyForm = document.getElementById('replyForm');
  const loginStatus = getCookie('loginStatus');

  if (loginStatus === 'loggedIn') {
    replyForm.style.display = 'flex';
  } else {
    replyForm.style.display = 'none';
  }
});

// 리뷰 등록
const enterReply = async e => {
  if (!userInfo) {
    alert('로그인 후 댓글 작성 가능합니다.');
    return;
  }
  const replyForm = document.getElementById('replyForm');
  const postId = document.querySelector('.postBox').id;
  const formData = new FormData(replyForm);
  const replyContent = formData.get('replyContent');
  if (replyContent.trim().length < 1) {
    alert('댓글의 내용을 입력해주세요.');
    return;
  }
  await axios
    .post('/api/comment', {
      post_id: `${postId}`,
      content: `${replyContent}`,
    })
    .then(() => {
      location.reload(true);
    })
    .catch(err => {
      console.error(err);
    });
};
replyForm.addEventListener('submit', enterReply);

// 수정
const modifyBtn = () => {
  if (replyContent.trim().length < 1) {
    alert('댓글의 내용을 입력해주세요.');
  } else if (userInfo && postUser === userInfo.user_name) {
    const postId = document.querySelector('.postBox').id;
    location.href = `/post/edit/${postId}`;
  } else {
    alert('작성자 본인만 수정할 수 있습니다.');
  }
};

// 삭제
const deleteBtn = async () => {
  const postId = document.querySelector('.postBox').id;
  if (userInfo && postUser === userInfo.user_name && userInfo.is_admin) {
    try {
      const res = await axios({
        method: 'DELETE',
        url: `/api/post/${postId}`,
      });
      if (res.data.status === 'success') {
        location.href = '/board';
      }
    } catch (err) {
      alert('게시글을 삭제하는 중에 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  } else {
    alert('작성자 본인만 삭제할 수 있습니다.');
  }
};

const toggleReply = (commentId, content) => {
  const replyContent = document.querySelector(`#replyContent_${commentId}`);
  if (replyContent.classList.contains('notEdit')) {
    replyContent.remove();
    const replyContentContainer = document.querySelector(
      `#replyContentContainer_${commentId}`,
    );
    replyContentContainer.innerHTML = `
    <input autofocus style="width: 80%; border: 1px solid gray; border-radius:8px; padding:3.5px;" type="text" class="replyContent" value="${content}" id="replyContent_${commentId}">
    <div class="replyBtnGroup" id="replyBtnGroup_${commentId}">
      <button class="replyBtn replyModifyBtn" onclick="editReply(${commentId})" >수정</button>
      <button class="replyBtn replyDeleteBtn" onclick="deleteReply(${commentId})">삭제</button>
    </div>
    `;
  } else {
    const replyContentContainer = document.querySelector(
      `#replyContentContainer_${commentId}`,
    );
    replyContentContainer.innerHTML = `<div style="width: 90%; border: none; overflow: auto; white-space: nowrap;" class="replyContent notEdit" id="replyContent_${commentId}"> ${content}</div>`;
  }
};
// reply Edit
const editReply = commentId => {
  if (confirm('수정하시겠습니까?')) {
    const replyInput = document.querySelector(`#replyContent_${commentId}`);
    if (replyContent.trim().length < 1) {
      alert('댓글의 내용을 입력해주세요.');
      return;
    }
    axios({
      method: 'put',
      url: '/api/comment',
      data: {
        comment_id: commentId,
        content: replyInput.value,
      },
    })
      .then(() => {
        location.reload(true);
      })
      .catch(error => {
        console.error(error);
      });
  }
};

// reply Delete
const deleteReply = commentId => {
  if (confirm('정말로 삭제하시겠습니까?')) {
    axios({
      method: 'delete',
      url: '/api/comment/',
      data: {
        comment_id: commentId,
      },
    })
      .then(() => {
        document.querySelector(`#reply_${commentId}`).remove();
        // location.reload()
      })
      .catch(error => {
        console.error(error);
      });
    console.log(commentId);
  }
};
