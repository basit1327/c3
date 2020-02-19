const clc = require('cli-color');

var mysql = require('promise-mysql');

var pool = mysql.createPool({
	connectionLimit :  100,
	host            : '127.0.0.1',
	user            : 'root',
	port			:  3306,
	password        : 'root',
	database        : 'c3',
	charset			: 'utf8mb4',
	timezone		: 'PKT',
	timeout			: 4000
});


pool.on('connection',(connection)=>{
	console.log("Connection Acquired from Pool with ID: ",connection.threadId);
	connection.isReleased = false;
	connection.releaseTimeout = setTimeout(()=>{
		try{
			if ( !connection.isReleased ){
				connection.release();
				console.log(clc.red("Connection Forcefully Released --",connection.threadId));

			}
		}
		catch (e) {
			console.log(clc.red("DATA-ACCESS Exception --",e));
		}
		/* Timeout of 10 sec, if connection not release till 10 sec, it will force terminate the connection */
	},10000);
});

pool.on('release',(connection)=>{
	connection.commit();
	connection.isReleased = true;
	console.log(clc.blackBright("Connection Released Normally ",connection.threadId));
});

module.exports = pool;
