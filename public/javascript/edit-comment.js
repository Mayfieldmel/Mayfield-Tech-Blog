//   edit a comment
async function editComment() {
    const comment_text = document.querySelector('input[name="comment-text"]').value.trim();
    var id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];
  
      id = id.split('?')[0];
    
      if (comment_text) {
      const response = await fetch(`/api/comments/${id}`,
         {
          method: 'PUT',
          body: JSON.stringify({
          comment_text
          }),
          headers: {
          'Content-Type': 'application/json'
          }
    }
      );
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
          alert(response.statusText);
      }
      }
}
document.querySelector('#edit-comment-form').addEventListener('submit', editComment);