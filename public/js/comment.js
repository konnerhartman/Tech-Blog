const commentFormHandler = async (event) => {
    event.preventDefault();

    const user_comment = document.querySelector('.form-input').value.trim();

    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
      
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({
          post_id: id,
          user_comment
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }

}

document
  .querySelector('.comment-form')
  .addEventListener('submit', commentFormHandler);