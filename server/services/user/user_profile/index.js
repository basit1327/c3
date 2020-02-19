'use strict';
const _ = require('lodash'),
	md5 = require('md5'),
	{invalidQueryResult,failedToGetDatabaseConnection} = require('../../../../configs/res_codes'),
	DbConnection = require('../../../dataaccesss/dbconnection').DbConnection;

async function updateAccount (req,res){
	let connection;
	try {
		let {firstName,lastName,password} = req.body;
		if ( !password && !firstName && !lastName ) {
			res.send({status:400,detail:'Invalid request, you must provide at least one to update (first name, last name, password)'});
			return;
		}

		connection = await new DbConnection().getConnection();
		if ( connection ) {

			let updateQuerySub = '';
			let updateQueryParam = [];
			if ( firstName ){updateQuerySub+= ' first_name=? , '; updateQueryParam.push(firstName)}
			if ( lastName ){updateQuerySub+= ' last_name=? , '; updateQueryParam.push(lastName)}
			if ( password ){updateQuerySub+= ' password=? , '; updateQueryParam.push(md5(password))}

			// removing comma from last
			updateQuerySub = updateQuerySub.substr(0,updateQuerySub.length-2);


			let dbRes = await connection.query(`UPDATE accounts SET ${updateQuerySub}
			WHERE id = ?`,[...updateQueryParam,req.userId]);
			if ( _.has(dbRes,'affectedRows') ){
				res.send({status:200,detail:'Account details updated'});
			} else {
				throw 'something went wrong while updating user details'
			}
		} else {
			res.send({status: 400, detail: failedToGetDatabaseConnection.description});
		}
	}
	catch (e) {
		res.send({status: 400, detail: 'something went wrong while trying to update user details'});
		console.log('Exception: ', e);
	}
	finally {
		if ( connection ) {
			connection.release();
		}
	}
}

async function deleteOwnAccount (req,res){
	let connection;
	try {
		connection = await new DbConnection().getConnection();
		if ( connection ) {
			let dbRes = await connection.query(`DELETE FROM accounts
			WHERE id = ?`,[req.userId]);
			if ( _.has(dbRes,'affectedRows') ){
				res.send({status:200,detail:'Account deleted'});
			} else {
				throw 'something went wrong while deleting user account'
			}
		} else {
			res.send({status: 400, detail: failedToGetDatabaseConnection.description});
		}
	}
	catch (e) {
		res.send({status: 400, detail: 'something went wrong while deleting user account'});
		console.log('Exception: ', e);
	}
	finally {
		if ( connection ) {
			connection.release();
		}
	}
}


module.exports = {
	updateAccount,
	deleteOwnAccount
};
