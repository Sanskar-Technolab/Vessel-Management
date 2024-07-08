$(document).ready(function(){

    var notyf = new Notyf();

    
    // // if is group parent account field is disable
    // $("#is_group").on("change",function(){
    //     if($("#is_group").is(':checked')){
    //         $("#currency_input").hide()
    //         $("#parent_account").val("")
    //     }
    //     else{
    //         $("#currency_input").show()
    //     }
    // })


    // get accounts grouped for parent accoount
    get_account(company="")
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
                console.log(data);
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
                console.log(data);
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
                console.log(data);
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



  $("#save").click(function(){
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        form_data["is_group"] = $("#is_group").is(':checked') ? '1' : '0';

        //============= validation ==========
        $('.error-message').remove();
    
        var iserror = false;
    
        // check field validation and showcase error
        if (!form_data["company"]) {
            $('#company').after('<span id="company_error" class="error-message">Company name is mandatory.</span>');
            iserror = true;
        }
    
        if (!form_data["account_name"]) {
            $('#account_name').after('<span id="account_name_error" class="error-message">Account name is mandatory.</span>');
            iserror = true;
        }
    
        if (!form_data["parent_account"]) {
            $('#parent_account').after('<span id="parent_account_error" class="error-message">Parent account is mandatory.</span>');
            iserror = true;
        }
    
        if (!form_data["account_type"]) {
            $('#account_type').after('<span id="account_type_error" class="error-message">Account type is mandatory.</span>');
            iserror = true;
        }
    
        if (!form_data["account_currency"]) {
            $('#currency').after('<span id="currency_error" class="error-message">Currency is mandatory.</span>');
            iserror = true;
        }

        // remove error message input or change value
        $('#company').on('input change', function() {
            $('#company_error').remove();
        });
    
        $('#account_name').on('input change', function() {
            $('#account_name_error').remove();
        });
    
        $('#parent_account').on('input change', function() {
            $('#parent_account_error').remove();
        });
    
        $('#account_type').on('input change', function() {
            $('#account_type_error').remove();
        });
    
        $('#currency').on('input change', function() {
            $('#currency_error').remove();
        });
        
    
        // if error is not fount than create new account
        if (!iserror) {
            $('.error-message').remove();
            create_account();
        }

        console.log(form_data);

        function create_account(){
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")

            $.ajax({
                url: "/api/resource/Account",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(form_data),
                success: function (data) {  
                    console.log(data);
                    notyf.success({
                        message: "Account added successfully",
                        duration: 5000
                    })
                    setTimeout(() => {
                        window.location.href = "/accounts/account/"+data.data.name
                        $(".overlay").hide()
                    }, 1500);
                    
                    
                },
                error: function (xhr, status, error) {
                    $(".overlay").hide()
                    // Handle the error response here
                    console.dir(xhr); // Print the XHR object for more details
                    var error_msg = xhr.responseJSON.exception.split(":")[1]       
                            
                    notyf.error({
                        message:error_msg,
                        duration:5000
                    });
    
                }
            })
        }


  })    







})