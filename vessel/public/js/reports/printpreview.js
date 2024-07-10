$(document).ready(function(){
    
 //  get today date in posting date
 var today = new Date();
 var day = String(today.getDate()).padStart(2, '0');
 var month = String(today.getMonth() + 1).padStart(2, '0');
 var year = today.getFullYear();
 var files = []

 
 //format year-month-date
 var today_date = day + '-' + month + '-' + year;
 $('#statement_date').text(today_date); //set today date in statement date
 
    console.log($("#statement_date"));

})