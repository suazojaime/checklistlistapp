const CompanyController = require('../controllers/01company.controller')
const ServerchecklistController = require('../controllers/04serverchecklist.controller')
const ServersController = require('../controllers/03servers.controller')
const SiteController = require('../controllers/02site.controller')
const ImageController= require('../controllers/imageupload.controller')
const upload = require('../config/multer');
const express = require("express");
const { authenticate } = require("../config/jwt.config");
/* const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
 */
/* module.exports = (app)=>{ */

const app = express.Router(); 


    app.post('/v2/company/',authenticate, CompanyController.create)
    app.get('/v2/company/',authenticate, CompanyController.listAll)
    app.get('/v2/company/:id',authenticate, CompanyController.listOne)
    app.post('/v2/company/:id', authenticate,CompanyController.updateOne)
    app.delete('/v2/company/:id',authenticate, CompanyController.deleteOne)


    app.post('/v2/site/',authenticate, SiteController.create)
    app.get('/v2/site/',authenticate, SiteController.listAll)
    app.get('/v2/site/:id',authenticate, SiteController.listOne)
    app.get('/v2/site/owner/:id',authenticate, SiteController.listbyOwner)
    app.post('/v2/site/:id',authenticate, SiteController.updateOne)
    app.delete('/v2/site/:id',authenticate, SiteController.deleteOne)

    app.post('/v2/server/',authenticate, ServersController.create)
    app.get('/v2/server/',authenticate, ServersController.listAll)
    app.get('/v2/server/:id',authenticate, ServersController.listOne)
    app.get('/v2/server/owner/:id',authenticate, ServersController.listbyOwner)
    app.post('/v2/server/:id',authenticate, ServersController.updateOne)
    app.delete('/v2/server/:id',authenticate, ServersController.deleteOne)

    app.post('/v2/servercheck/',authenticate, ServerchecklistController.create)
    app.get('/v2/servercheck/',authenticate, ServerchecklistController.listAll)
    app.get('/v2/servercheck/:id',authenticate, ServerchecklistController.listOne)
    app.get('/v2/servercheck/owner/:id',authenticate, ServerchecklistController.listbyOwner)
    app.post('/v2/servercheck/:id',authenticate, ServerchecklistController.updateOne)
    app.delete('/v2/servercheck/:id',authenticate, ServerchecklistController.deleteOne)
    
    app.post('/image/v3/upload', upload.single('image'),ImageController.create)

/* } */

module.exports = app;