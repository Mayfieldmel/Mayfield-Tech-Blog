const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
    //   res.redirect('/login');
    console.log("redirect to login")
    } else {
      next();
    }
  };
  
  module.exports = withAuth;