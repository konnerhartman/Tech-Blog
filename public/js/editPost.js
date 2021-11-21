async function editFormHandler(event) {
    event.preventDefault();

    const name = document.querySelector('input[name="postTitle"]').value.trim();
    const description = document.querySelector('input[name="updateContent"]').value.trim();

    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          animal_id: id,
          name,
          description,
          location
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        document.location.replace('/dashboard/');
      } else {
        alert(response.statusText);
      }

}

document.querySelector('.edit-animal-form').addEventListener('submit', editFormHandler);