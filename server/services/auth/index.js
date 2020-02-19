'use strict';
const _ = require('lodash'),
	activeSessionStatus = 1,
	config = require('../../../configs/local'),
	jwt = require('jsonwebtoken'),
	dBConnection = require('../../dataaccesss/dbconnection').DbConnection;

async function authenticateSession(req,res,next){
	let authToken = req.headers.authorization;
	let sessionHash = null;
	if ( !authToken ){
		res.send({status:440,detail:'No authorization token with api request'});
		res.end();
		return;
	}

	let connection;
	try {
		var decodedToken = jwt.verify(authToken, config.jwtSecret);
		sessionHash = decodedToken.sessionHash;
		if ( !sessionHash ){
			res.send({status:440,detail:'Could not authenticate, Invalid auth token'});
			res.end();
			return;
		}

		connection = await new dBConnection().getConnection();
		if ( connection ) {
			let dbRes = await connection.query(`SELECT
			id,hash,user_id,created_at,status
			FROM user_sessions where hash= ? and status= ?`,[sessionHash,activeSessionStatus]);
			if ( _.has(dbRes, '[0].id') ) {
				if ( _.has(dbRes,'[0].id') ) {
					if ( dbRes[0].hash==sessionHash){
						req.userId = dbRes[0].user_id;
						req.sessionId = sessionHash;
						next();
					}
					else throw 'Session record found not matching with provided session hash';
				}else{
					res.send({status:440,detail:'No session saved'});
					res.end();
				}
			} else {
				res.send({status:440,detail:'Your session has been expired'});
				res.end();
			}
		}
		else {
			res.send({status:440,detail:'Could not authenticate at the moment'});
			res.end();
		}
	}
	catch (e) {
		console.log('Exception: ', e);
		res.send({status:440,detail:'Something went wrong while authenticating session'});
		res.end();
	} finally {
		if ( connection ) {
			connection.release();
		}
	}
}

module.exports = {
	authenticateSession
};
