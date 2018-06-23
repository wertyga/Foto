export default function(req, res, next) {
   if(req.session.isAdmin) {
       next();
   } else {
       res.redirect('/admin/login')
   }
};