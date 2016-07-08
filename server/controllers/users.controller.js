/************************************************************ @fileoverview<pre>
	Name:           users.controller.js
	Author:         Leon Liang
	Created:        6/15/2016
	For Version:		1.0x
	Modifications:
	Summary:
          Storage javascript.
          All database work should be here :: storing and retrieving of information

</pre>*************************************************************************/
//******************************* Configuration ********************************
/*                       Define Modules Requirement Here                        */
var mongoose = require("mongoose");
var user_model = require('../models/user.model.js');
var storage = ('../storage.js');
//******************************* Global Variables *****************************
var dest,budget,b_date,r_date;
//******************************************************************************

//******************************* Mongoose Object Creation *****************************

//******************************************************************************
