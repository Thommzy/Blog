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
              window.setTimeout(function() {
                location.href = 'userLogin.html';
              }, 2000);

              console.log(e);
            });
          }
        }
      }
    });
  });
  //SignUp Ajax Ends
});

// User Login Ajax Starts
$('#login').submit(e => {
  var $loginMain = $('#loginMain');
  var $loginGreen = $('#loginGreen');
  e.preventDefault();
  let userLoginEmail = $('#emailLogin').val();
  let userLoginPassword = $('#loginPassword').val();
  $.ajax({
    url: 'http://localhost:3000/users',
    method: 'get'
  }).done(e => {
    var loginMailCheck = [];
    var loginPasswordCheck = [];
    for (let i = 0; i < e.length; i++) {
      loginMailCheck.push(e[i].signUpEmail);
      loginPasswordCheck.push(e[i].password);
      console.log(e[i].signUpEmail);
    }

    localStorage.setItem('loginEmail!', JSON.stringify(loginMailCheck));
    localStorage.setItem('loginPassword!', JSON.stringify(loginPasswordCheck));

    let userEmailgottenFromLogin = localStorage.getItem('loginEmail!');
    let userPasswordgottenFromLogin = localStorage.getItem('loginPassword!');

    if (
      userEmailgottenFromLogin.indexOf(userLoginEmail) === -1 ||
      userPasswordgottenFromLogin.indexOf(userLoginPassword) === -1
    ) {
      $loginMain.append(`<div class="alert alert-danger" role="alert">
      Email or Password Incorrect!
    </div>`);
      window.setTimeout(function() {
        window.location.reload();
      }, 2000);
    } else {
      $loginGreen.append(`<div class="alert alert-success" role="alert">
        Login Successful
      </div>`);
      window.setTimeout(function() {
        localStorage.setItem('presentEmail', userLoginEmail);
        location.href = 'index.html';
      }, 2000);
    }
    console.log(e);
  });
});

//User Login Ends

// Navbar button Logic Check Starts

const userCheck = localStorage.getItem('presentEmail');

var $rightNavLoggedIn = $('.rightNav');

if (userCheck) {
  $rightNavLoggedIn.append(` <div class="dropdown">
  <button
    class="btn btn-secondary dropdown-toggle"
    type="button"
    id="dropdownMenuButton"
    data-toggle="dropdown"
    aria-haspopup="true"
    aria-expanded="false"
  >
    Welcome, ${userCheck}
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" id="logOut" href="#">Logout</a>
  </div>
</div>`);
} else {
  $rightNavLoggedIn.append(`  <button
  formaction="userLogin.html"
  class="btn logInButton"
  type="submit"
>
  LogIn
</button>
<button
  formaction="userSignUp.html"
  class="btn signUpButton"
  type="submit"
>
  SignUp
</button>`);
}

// Navbar Button Logic Check Ends

//Logout Logic Starts

$('#logOut').click(function() {
  window.location = 'userLogin.html';
  localStorage.clear();
});

//Logout Logic Ends
