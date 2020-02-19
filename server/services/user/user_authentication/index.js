'use strict';
const _ = require('lodash'),
	config = require('../../../../configs/local'),
	md5 = require('md5'),
	jwt = require('jsonwebtoken'),
	deletedSessionStatus = 0,
	{invalidQueryResult,failedToGetDatabaseConnection} = require('../../../../configs/res_codes'),
	DbConnection = require('../../../dataaccesss/dbconnection').DbConnection;

async function userLogin (req,res){
	let connection;
	try {
		let {userName,password} = req.body;
		if ( !userName || !password ) {
			res.send({status:400,detail:'Invalid username or password'});
			return;
		}

		connection = await new DbConnection().getConnection();
		if ( connection ) {
			let dbRes = await connection.query(`SELECT 
				id,
				concat(first_name,' ',last_name) as name,
				status
				from accounts
				where user_name = ? AND password = ?`,[userName,md5(password)]);
			if ( _.has(dbRes, '[0].id') ) {
				if ( dbRes[0].status==0 ){
					res.send({status:400,detail:'Your account has been disabled'});
				}
				else {
					let hash = md5(new Date()+ Math.random());
					var token = jwt.sign({ sessionHash: hash }, config.jwtSecret);
					res.send({
						status:200,
						detail:'logged in successfully',
						token:token,
						name:dbRes[0].name
					});
					saveNewAdminSession(hash,dbRes[0].id);
				}
			}
			else {
				res.send({status:400,detail:'username or password is not correct'})
			}
		} else {
			res.send({status: 400, detail: failedToGetDatabaseConnection.description});
		}
	}
	catch (e) {
		res.send({status: 400, detail: 'something went wrong while trying to login'});
		console.log('Exception: ', e);
	}
	finally {
		if ( connection ) {
			connection.release();
		}
	}
}

async function userLogOut (req,res){
	if ( req.sessionId ){
		res.send({status:200,detail:'logged out successfully'});
		deleteSession(req.sessionId);
	}
	else {
		res.send({status:400,detail:'Failed to logout, Authentication header not present'});
	}
}

async function userRegister (req,res){
	let connection;
	try {
		let {firstName,lastName,userName,password} = req.body;
		if ( !userName || !password || !firstName || !lastName) {
			res.send({status:400,detail:'Invalid request, you must provide (first name, last name, user name, password)'});
			return;
		}

		connection = await new DbConnection().getConnection();
		if ( connection ) {
			let hash = md5(new Date()+Math.random());
			let dbRes = await connection.query(`INSERT INTO accounts 
				(hash,first_name,last_name,user_name,password)
				VALUES (?,?,?,?,?)`,[
					hash,
					firstName,
					lastName,
					userName,
					md5(password)
				]);
			if ( _.has(dbRes,'insertId') ){
				res.send({status:200,detail:'Account created successfully'});
			} else {
				throw 'something went wrong no insert id in user register'
			}
		} else {
			res.send({status: 400, detail: failedToGetDatabaseConnection.description});
		}
	}
	catch (e) {
		let e2 = e.toString();
		if ( e2.includes('Duplicate entry') ){
			res.send({status: 400, detail: 'This user name is already register try another one'});
		} else {
			res.send({status: 400, detail: 'something went wrong while signup'});
			console.log('Exception: ', e);
		}
	}
	finally {
		if ( connection ) {
			connection.release();
		}
	}
}




/* Saving and deleting session */
async function saveNewAdminSession(hash,adminId){
	let connection;
	try {
		connection = await new DbConnection().getConnection();
		if ( connection ) {
			let dbRes = await connection.query(`INSERT
			INTO user_sessions (hash,user_id,created_at)
			VALUES ('${hash}','${adminId}','${new Date().getTime()}')`);
			if ( _.has(dbRes, 'insertId') ) {
				console.log('Session Saved successfully');
			} else {
				throw 'no data in dbRes after add new session';
			}
		}
		else {
			throw 'failed to get db connection while saving new session';
		}
	}
	catch (e) {
		console.log('Exception: ', e);
	} finally {
		if ( connection ) {
			connection.release();
		}
	}
}

async function deleteSession(sessionId){
	let connection;
	try {
		connection = await new DbConnection().getConnection();
		if ( connection ) {
			let dbRes = await connection.query(`UPDATE
			user_sessions SET status = ?
			WHERE hash=?`,[deletedSessionStatus,sessionId]);
			if ( _.has(dbRes, 'affectedRows') ) {
				console.log('Session deleted successfully');
			} else {
				throw 'no rows affected after delete session';
			}
		}
		else {
			throw 'failed to get db connection while deleting session';
		}
	}
	catch (e) {
		console.log('Exception: ', e);
	} finally {
		if ( connection ) {
			connection.release();
		}
	}
}


module.exports = {
	userLogin,
	userLogOut,
	userRegister
};
