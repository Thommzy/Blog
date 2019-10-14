$(function() {
  var $postPreview = $('.post-preview');
  var $alert = $('#alertShit');
  var $success = $('#succesShit');

  //Home Page post View Starts

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/postlists',
    success: function(data) {
      console.log('success:', data);
      for (let i = data.length - 1; i >= data.length - data.length; i--) {
        console.log(data[i].id);
        $postPreview.append(`<div class="">
        <a class="hi" id="${data[i].id}"  href="specific.html">
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
      </p> <hr />
        </div>
         `);
      }
    }
  });

  //Home Page Post View Ends

  //Specific Post Starts

  $(document).on('click', '.hi', function(e) {
    var gs = $(this).attr('id');
    //  alert(`Hello + ${gs}`);
    localStorage.setItem('postId', gs);
    console.log(id);
  });

  var hs = localStorage.getItem('postId');

  var $specMain = $('#specMain');

  $.ajax({
    type: 'GET',
    url: `http://localhost:3000/postlists/${hs}`,
    success: function(data) {
      console.log('success:', data);
      $specMain.append(`<div class="container">
          <h1 class="post_title">${data.post_topic}</h1>
          <p>By Admin</p>
          <p>
            ${data.post_content}
          </p>
        </div>
            `);
    }
  });

  // Specific Post Ends

  //Admin Home Page post View Starts

  var $AdminPostPreview = $('.post-preview-post');

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3000/postlists',
    success: function(data) {
      console.log('success:', data);
      for (let i = data.length - 1; i >= data.length - data.length; i--) {
        console.log(data[i].id);
        $AdminPostPreview.append(`<div class="">
          <a class="hi" id="${data[i].id}"  href="specific.html">
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
        </p> <div class="container">
        <div class="row">
          <div class="col-sm ">
            <button type="button" id="${data[i].id}" class="btn btn-success editbutton">Edit</button>
          </div>
          <div class="col-sm">    
            <button type="button" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div><hr />
          </div>
           `);
      }
      // onClick Edit Action starts
      $('.editbutton').click(function() {
        //alert('Handler for .click() called.');
        var editGs = $(this).attr('id');
        localStorage.setItem('editId', editGs);
        var editHs = localStorage.getItem('editId');
        $.ajax({
          type: 'GET',
          url: `http://localhost:3000/postlists/${editHs}`,
          success: function(data) {
            console.log('success:', data);
            localStorage.setItem('newTitle', data.post_topic);
            localStorage.setItem('newContent', data.post_content);
            location.href = 'edit.html';
          }
        });
      });
      // onClick Edit Action Ends
    }
  });

  //Admin Home Page Post View Ends

  // sending the edited Data back to the server Starts

  $('#adminEdit').submit(e => {
    e.preventDefault();
    let post_topic = $('#updateTitleVal').val();
    let post_content = $('#updateContentVal').val();
    const lul = localStorage.getItem('editId');
    console.log(lul);

    $.ajax({
      url: `http://localhost:3000/postlists/${lul}`,
      type: 'PATCH',
      data: {
        post_topic,
        post_content
      }
    }).done(e => {
      //alert('Yes');
      // console.log(es);
      location.href = 'admin.html';
    });
  });

  // Sending The edited Data Back to the server Ends

  //Admin Create Post Starts
  $('#adminCreate').submit(e => {
    e.preventDefault();
    let post_topic = $('#postTitleVal').val();
    let post_content = $('#postContentVal').val();

    $.ajax({
      url: 'http://localhost:3000/postlists',
      method: 'POST',
      data: {
        post_topic,
        post_content
      }
    }).done(e => {
      window.location = 'admin.html';
    });
  });

  //Admin Create Post Ends

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
var $logoLink = $('#logoLink');

if (userCheck === 'admin@gmail.com') {
  //alert('hi');
  $logoLink.append(`<a href="admin.html" class="navbar-brand logo">Blog</a>`);
} else {
  $logoLink.append(`<a href="index.html" class="navbar-brand logo">Blog</a>`);
}

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
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton"></div>
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

//NavBar Dropdown Configuratin Starts

var logdeets = localStorage.getItem('presentEmail');
var $navRightAdmin = $('.dropdown-menu');
if (logdeets === 'admin@gmail.com') {
  $navRightAdmin.append(
    ` <a class="dropdown-item" id="" href="create.html">Create Post</a>
    <a class="dropdown-item" id="logOut">Logout</a>
    `
  );
} else {
  $navRightAdmin.append(
    ` <a class="dropdown-item" id="logOut">Logout</a>
    `
  );
}

//NavBar Configuration Ends

// Admin Login Ajax Starts
$('#adminLoginMain').submit(e => {
  var $adminLoginMain = $('#loginMain');
  var $adminLoginGreen = $('#loginGreen');
  e.preventDefault();
  let adminLoginEmail = $('#adminEmail').val();
  let adminLoginPassword = $('#adminPassword').val();
  $.ajax({
    url: 'http://localhost:3000/admin',
    method: 'get'
  }).done(e => {
    var loginMailCheck = [];
    var loginPasswordCheck = [];
    for (let i = 0; i < e.length; i++) {
      loginMailCheck.push(e[i].signUpEmail);
      loginPasswordCheck.push(e[i].password);
      console.log(e[i].signUpEmail);
    }

    localStorage.setItem('adminLoginEmail!', JSON.stringify(loginMailCheck));
    localStorage.setItem(
      'adminLoginPassword!',
      JSON.stringify(loginPasswordCheck)
    );

    let adminEmailgottenFromLogin = localStorage.getItem('adminLoginEmail!');
    let adminPasswordgottenFromLogin = localStorage.getItem(
      'adminLoginPassword!'
    );

    if (
      adminEmailgottenFromLogin.indexOf(adminLoginEmail) === -1 ||
      adminPasswordgottenFromLogin.indexOf(adminLoginPassword) === -1
    ) {
      $adminLoginMain.append(`<div class="alert alert-danger" role="alert">
     Login details incorrect
    </div>`);
      window.setTimeout(function() {
        window.location.reload();
      }, 2000);
    } else {
      $adminLoginGreen.append(`<div class="alert alert-success" role="alert">
        Login Successful
      </div>`);
      window.setTimeout(function() {
        localStorage.setItem('presentEmail', adminLoginEmail);
        location.href = 'admin.html';
      }, 2000);
    }
    console.log(e);
  });
});

//Admin Login Ends

//Logout Logic Starts

$('#logOut').click(function() {
  var logdeets = localStorage.getItem('presentEmail');
  if (logdeets === 'admin@gmail.com') {
    window.location = 'adminLogin.html';
    localStorage.clear();
  } else {
    window.location = 'userLogin.html';
    localStorage.clear();
  }
});

//Logout Logic Ends
