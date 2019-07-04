<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::middleware(['cors', 'exploit'])->group(function () {
    Route::post('/contactform', 'DataController@contactForm');
});

Route::middleware(['cors'])->group(function () {

    Route::get('/convertpoints', 'SuperuserController@convertPoints');

    Route::post('/gst', 'SuperuserController@doGstStuff');

    Route::post('/user/signup', 'UserController@signUp');
    Route::post('/user/forgotpassword', 'UserController@forgotPasswordRequest');
    Route::post('/user/changepassword', 'UserController@changePassword');
    Route::get('/geoserver/getlayers/{workspace}', 'GeoserverController@getLayers');
    Route::post('/geoserver/locationquery', 'GeoserverController@locationQuery');
    Route::post('/geoserver/report', 'GeoserverController@reportQuery');
    Route::post('/geoserver/boreholes', 'GeoserverController@boreholesRadius');
    Route::post('/standardreport/pdf', 'PDFController@standardReport');
    Route::get('/user/confirm/{confirmation_code}/{email}', 'UserController@confirmSignup');
    Route::post('/user/signin', 'AuthenticateController@signIn');
    Route::get('/user/confirmpasswordreset/{confirmation_code}/{email}', 'UserController@passwordResetRequest');
    Route::get('/user/checkauthenticate', 'AuthenticateController@checkIfLoggedIn');
    Route::get('/data', 'DataController@getAllData');
    Route::get('/userprofiles', 'UserprofileController@getUserprofiles');
    Route::get('/pilotareas', 'PilotareaController@getPilotareas');
    Route::get('/professionalgroups', 'ProfessionalgroupController@getProfessionalgroups');
    Route::get('/topics', 'ThematicCoveragesController@getThematicCoverages');
    Route::get('/content', 'ContentController@getContent');
    Route::get('/events', 'EventController@getEvents');
    Route::get('/measurements/{area}', 'MeasurementController@getMeasurements');
    Route::get('/tags', 'TagController@getTags');
    Route::get('/glossary', 'GlossaryController@getGlossary');
    Route::get('/sitecontent', 'SiteContentController@getSiteContent');
    Route::get('/pages', 'PageController@getPages');
    Route::get('/contacts', 'ContactController@getContacts');
    Route::get('/units', 'UnitController@getUnits');
    Route::get('/links', 'InternationalLinkController@getLinks');
    Route::get('/examples', 'ExampleController@getExamples');

});

Route::middleware(['cors', 'jwt.auth'])->group(function () {

    Route::post('/userprofiles', 'UserprofileController@saveUserprofile');
    Route::post('/userprofiles/toggle', 'UserprofileController@toggleActivation');
    Route::post('/topics', 'ContentController@saveContent');
    Route::post('/topics/delete', 'ContentController@removeContent');
    Route::post('/events', 'EventController@saveEvent');
    Route::post('/events/delete', 'EventController@removeEvent');
    Route::post('/user/remove', 'UserController@removeUser');

});

Route::middleware(['cors', 'superuser'])->group(function () {

    Route::post('/geoserver/readmetadata', 'GeoserverController@readExcelFile');
    Route::post('/geoserver/copylayer', 'GeoserverController@addNewLayer');
    Route::post('/geoserver/uploadareas', 'GeoserverController@uploadAreas');
    Route::get('/superuser/loadsuperuserdata', 'SuperuserController@loadSuperuserData');
    Route::post('/superuser/changeuserdetails', 'SuperuserController@changeUserDetails');
    Route::post('/superuser/removecontent', 'SuperuserController@removeContent');
    Route::post('/superuser/removeevent', 'SuperuserController@removeEvent');
    Route::post('/superuser/glossary', 'GlossaryController@saveGlossaryEntry');
    Route::post('/superuser/glossary/delete', 'GlossaryController@removeGlossaryEntry');
    Route::post('/superuser/page/edit', 'PageController@savePage');
    Route::post('/superuser/page/delete', 'PageController@removePage');
    Route::post('/superuser/content/edit', 'SiteContentController@saveContent');
    Route::post('/superuser/content/delete', 'SiteContentController@removeContent');
    Route::post('/superuser/upload', 'SiteContentController@uploadImage');
    Route::post('/superuser/uploadcontent', 'ContentController@uploadContent');
    Route::post('/superuser/updatearea', 'SuperuserController@updateArea');
    Route::post('/superuser/localcontact', 'LocalContactcontroller@saveContact');
    Route::post('/superuser/note', 'ExplanatorynoteController@saveExplanatoryNote');
    Route::post('/superuser/contact/edit', 'ContactController@saveContact');
    Route::post('/superuser/contact/delete', 'ContactController@deleteContact');
    Route::post('/superuser/measurements', 'SuperuserController@uploadFieldmeasurements');
    Route::post('/units', 'UnitController@saveUnit');
    Route::post('/units/delete', 'UnitController@removeUnit');
    Route::post('/links', 'InternationalLinkController@updateLinks');
    Route::post('/examples', 'ExampleController@saveExample');

});

Route::middleware(['cors', 'projectpartner'])->group(function () {
    Route::post('/superuser/uploadcontent', 'ContentController@uploadContent');
});
