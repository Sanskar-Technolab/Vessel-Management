$(document).ready(function(){
    console.log(typeof(localStorage.getItem("party_name")));
    if(localStorage.getItem("party_name") && localStorage.getItem("party_name")!= "undefined"){
        $("#party").html(localStorage.getItem("party_name"))
    }
    else{
        $("#party_section").hide()
    }
   
    
    var from_date = localStorage.getItem("min_date").replaceAll("/","-")
    var to_date = localStorage.getItem("max_date").replaceAll("/","-")
    var party_name = localStorage.getItem("party_name")
    // console.log(party_name);
   
    $("#from_date").html(from_date)
    $("#to_date").html(to_date)

   

})




