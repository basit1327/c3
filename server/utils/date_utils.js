function getTodayDateTimeForDB(){
	let today = new Date();
	let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	let time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
	return date+' '+ time;
}

function getTodayDateForDB(){
	let today = new Date();
	return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

function getDateForDB(previousDay){
	previousDay = previousDay || 0;
	let dt = new Date();
	dt.setDate(dt.getDate()-previousDay);
	return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
}


module.exports ={
	getTodayDateTimeForDB,
	getTodayDateForDB,
	getDateForDB
};
