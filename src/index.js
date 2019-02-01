$(document).ready(function() {

  //global ajax setting to redirect to login when session timeout (but user stay in old page) or user logout
  //don't worry about user bypassing it,the back-end has set permission to pass if user logout or session timeout.
  //here just improve user experience.

  // $.ajaxSetup({
  //   cache:false,//prevent browser cache result to redirect  failed.
  //   headers:{"X-Session-Token":window.sessionStorage.getItem("X_Session_Token")},
  //   statusCode: {
  //     302: function() {
  //       window.location.href='/login.html?ran='+Math.random(); //prevent browser cache result to redirect  failed.
  //     }
  //   }
  // });
});


