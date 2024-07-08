$(document).ready(function(){
    
    var old_form_data = []
    var url = window.location.href
    var account_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " ");

     // Create an instance of Notyf
     var notyf = new Notyf({
        types: [
          {
            type: 'alert',
            background: '#ff9800',
            icon: "<i class='fas fa-exclamation-triangle' style='font-size:22px;color:#ffffff;'></i>"
          }
        ]
    });


    
    // if is group currency field is hidden
    $("#is_group").on("change",function(){
        is_group()
    })

    // if is group is checked than currency is hide and blank
    function is_group(){
        if($("#is_group").is(':checked')){
            $("#currency_input").hide()
            $("#parent_account").val("")
            $("#account_name").prop('disabled', true);
            $("#company").prop('disabled', true);
            $("#currency").prop('disabled', true);
        }
        else{
            $("#currency_input").show()
        }
    }

    // get accounts grouped for parent accoount
    
    function get_account(company,callback) {

        $.ajax({
            url: "/api/resource/Account",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["is_group", "=", "1"],["company","LIKE","%"+company+"%"]]),
                limit_page_length: "None"
            },
            success: function (data) {  
                
                var account_list = data.data
                $.each(account_list,(i,account)=>{
                    $("#parent_account").append(`<option value="${account.name}">${account.name}</option>`)
                })

                if(typeof(callback)=="function"){
                    callback(data.data)
                }

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    // get company for company field
    get_company()
    function get_company(){
        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name","abbr"]),
                limit_page_length: "None"
            },
            success: function (data) {  
                
                var company_list = data.data
                $.each(company_list,(i,company)=>{
                    $("#company").append(`<option data-abbr="${company.abbr}" value="${company.name}">${company.name}</option>`)
                })

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

       setTimeout(() => { //set delay for 100ms because getting other apis data is load to take a time
             // get account data
        $.ajax({
            url: "/api/resource/Account/"+account_id,
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name","is_group","company","parent_account","account","account_currency"]),
            },
            success: function (data) {  
                console.log(data.data);
                
                var account_info = data.data
                console.log(account_info.is_group);
                $("#page_title").text(account_info.name)
                $("#is_group").prop("checked",account_info.is_group)
                $("#parent_account").val(account_info.parent_account)
                $("#account_name").val(account_info.account_name)
                $("#company").val(account_info.company)
                $("#account_type").val(account_info.account_type)
                $("#currency").val(account_info.account_currency)
                is_group() //if account is checked than currency is hide
                $("#account_name").prop('disabled', true); //disabled nput
                $("#company").prop('disabled', true); //disabled nput

               

                setTimeout(() => {
                    $("#parent_account").val(account_info.parent_account)


                    // get old form data
                    var old_form_data_list = $('form').serializeArray();

                    $.each(old_form_data_list, function (index, field) {
    
                        old_form_data[field.name] = field.value;
                    });
                    
                }, 170);


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
       }, 50);
    


    get_currency()
    function get_currency(){
        $.ajax({
            url: "/api/resource/Currency",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["enabled","=","1"]]),
                limit_page_length: "None"
            },
            success: function (data) {  
                
                var currency_list = data.data
                $.each(currency_list,(i,currency)=>{
                    $("#currency").append(`<option value="${currency.name}">${currency.name}</option>`)
                })

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }



    // on change company to set account
    $("#company").change(function(){
        var company = $("#company").val()
        get_account(company,function(data){
            $("#parent_account").empty()
            $("#parent_account").append(`<option></option>`)
            $.each(data,function(i,account){
                $("#parent_account").append(`<option value="${account.name}">${account.name}</option>`)
            })
        })
    })

    // after selecting company set company wise account
    setTimeout(() => {
        var company = $("#company").val()
        get_account(company)
    }, 150);



  $("#save").click(function(){
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });

          // Compare old form data with current form data and store updated fields
          var updated_form_data = {};

          $.each(form_data, function (key, value) {
  
              if (old_form_data[key] !== value) {
                  updated_form_data[key] = value;
              }
          });

          console.log(updated_form_data);

          if(Object.keys(updated_form_data).length != 0)
          {
              update_account()
          }
          else
          {
            notyf.success({
                type:'alert',
                message: "Changes are not available",
                duration: 5000
            })
          }
        function update_account(){
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")
            $.ajax({
                url: "/api/resource/Account/" + account_id,
                type: "PUT",
                dataType: "json",
                data: JSON.stringify(updated_form_data),
                success: function (data) {  
                    console.log(data);
                    notyf.success({
                        message: "Account update successfully",
                        duration: 5000
                    })
                    setTimeout(()=>{
                        $(".overlay").hide()
                        window.location.reload()
                    },1500)
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    $(".overlay").hide()
                    var error_msg = xhr.responseJSON.exception.split(":")[1]

                    notyf.error({
                        message: error_msg,
                        duration: 5000
                    });
                }
            })
        }


  })    

  
  $("#delete").click(function(){
    $(".overlay").show()
    $(".overlay-content").text("Please Wait....")   

    // delete file
    $.ajax({
    url: "/api/resource/Account/" + account_id,
    type: "DELETE",
    dataType: "json",
    
    success: function (data) {
        console.log(data);
        notyf.success({
            message: "Deleted record  successfully",
            duration: 5000
        })
        setTimeout(() => {
                window.location.href = "/accounts/account"
                $(".overlay").hide()
        }, 1500);

    },
    error: function (xhr, status, error) {
        $(".overlay").hide()
        
        // Handle the error response here
        console.dir(xhr); // Print the XHR object for more details
        var error_msg = xhr.responseJSON.exception.split(":")[1]
        console.log(error_msg);         
                
        notyf.error({
            message:error_msg,
            duration:5000
        });
        
    }
})
})



})