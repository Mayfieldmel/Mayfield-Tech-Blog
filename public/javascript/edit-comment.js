//   edit a comment
async function editComment() {
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
          resp
      } else {
          alert(response.statusText);
      }
      }
}
document.querySelector('#edit-comment-form').addEventListener('submit', editComment);