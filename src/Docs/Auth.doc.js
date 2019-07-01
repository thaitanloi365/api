/**
 * @api {post} /auth/login
 * @apiName Login
 * @apiGroup Login
 *
 * @apiParam {String} username The username of User.
 * @apiParam {String} password The password of User.
 *
 * @apiSuccess {String} token Access token.
 * @apiSuccess {Number} code Status code.
 * @apiSuccess {Number} message Status code.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Login successfully",
 *       "data": {
 *          "token": ""
 *       }
 *     }
 *
 * @apiError (Error) {Number} EMAIL_NOT_REGISTERD The email is not registered.
 * @apiError (Error) {Number} PASSWORD_NOT_CORRECT The id of the User was not found.
 * @apiError (Error) {Number} MISSING_CREDENTIALS Missing credentials email or password.
 * @apiError 

/**
 * @api {post} /auth/logout
 * @apiName Logout
 * @apiGroup Logout
 *
 * @apiHeader {String} access-key Users unique access-key.
 *
 * @apiSuccess {String} message.
 * @apiSuccess {Number} code.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Logout successfully",
 *       "data": null
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */
