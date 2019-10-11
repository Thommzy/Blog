$(function() {
  var $postPreview = $('.post-preview');
  var $alert = $('#alertShit');
  var $success = $('#succesShit');
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/postlists',
    success: function(data) {
      console.log('success:', data);
      for (let i = 0; i < data.length; i++) {
        $postPreview.append(`<a href="specific.html">
          <h2 class="post-title">
           ${data[i].post_topic}
          </h2>
          <h3 class="post-subtitle">
            ${data[i].post_content}
          </h3>
        </a>
        <p class="post-meta">
          Posted by
          <a href="">Admin</a>
        </p> <hr />`);
      }
    }
  });

  //SignUp Ajax Starts
  $('#register').submit(e => {
    e.preventDefault();
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/users',
      success: function(data) {
        console.log(data);

        let username = $('#registerFullname').val();
        let signUpEmail = $('#registerEmail').val();
        let password = $('#registerPassword').val();
        var sedt = [];
        var sedtEmail = [];
        for (let i = 0; i < data.length; i++) {
          sedt.push(data[i].username);
          sedtEmail.push(data[i].signUpEmail);
        }
        console.log(JSON.stringify(sedt));
        localStorage.setItem('users!', JSON.stringify(sedt));
        localStorage.setItem('email!', JSON.stringify(sedtEmail));
        let newValue = localStorage.getItem('users!');
        let newEmail = localStorage.getItem('email!');
        console.log(newValue);
        console.log(newEmail);

        if (
          newValue.indexOf(username) !== -1 ||
          newEmail.indexOf(signUpEmail) !== -1
        ) {
          $alert.append(`<div class="alert alert-danger" role="alert">
          Full Name or Email Already Exists
        </div>`);
          window.setTimeout(function() {
            window.location.reload();
          }, 2000);
        } else {
          if (username.length > 2) {
            $.ajax({
              url: 'http://localhost:3000/users',
              method: 'post',
              data: {
                username,
                signUpEmail,
                password
              }
            }).done(e => {
              $success.append(`<div class="alert alert-success" role="alert">
              Success!
            </div>`);
              location.href = 'specific.html';
              console.log(e);
            });
          }
        }
      }
    });

    // .fail(e => {
    //   if (username === '') {
    //     alert('Fill in your Username');
    //   }
    // });
  });

  //SignUp Ajax Ends
});
