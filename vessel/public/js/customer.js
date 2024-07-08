$(document).ready(function(){


     // Create an instance of Notyf
     var notyf = new Notyf();
     var files = []
     var customer_name 
     var phone_list=[]
     var email_list=[] 
     var account_lst = []
     var customer_contact = []

    //  country select field 
  
 
    //  upload customer image
     $('#upload-image').change(function () {
         files = $(this)[0].files;        
     });



    // on click add email to add new row
    $("#add_email").click(function(){
        var email_value = $("#email_address_value").val()
        if(email_value=="")
            {
                $('#email_address_error').remove();
                $('#customer_email_input').append('<span id="email_address_error" class="error-message">Please enter email address.</span>');
                $('#customer_email_input').css({"padding-bottom":"0"})
                
            }
            else if(validateEmail(email_value)){    
                $('#email_address_error').remove();
                $('#customer_email_input').append('<span id="email_address_error" class="error-message">Please enter valid email address.</span>');
            }
            else{
                $('#email_address_error').remove();
                $('#customer_phone_input').css({"padding-bottom":"15px"})
                var customer_email = $("#email_address_value").val()
                console.log(customer_email)
                $(`<div class="row w-100 justify-content-between email_row">
                        <div class="email">${customer_email}</div>
                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                    </div>`).insertBefore("#customer_email_input")
                $("#email_address_value").val("")

            }
       
    })

    // on click add phone to add new row
    $("#add_phone").click(function(){
        var phone_value = $("#phone_no_value").val()
        if(phone_value=="")
        {
            $('#phone_no_error').remove();
            $('#customer_phone_input').append('<span id="phone_no_error" class="error-message">Please enter phone no.</span>');
            $('#customer_phone_input').css({"padding-bottom":"0"})
            
        }
        else if(phone_value.length!=10)
            {
                $('#phone_no_error').remove();
                $('#customer_phone_input').append('<span id="phone_no_error" class="error-message">Please allow only 10 digits.</span>');
                
                
            }
        else
        {
            $('#phone_no_error').remove();
            $('#customer_phone_input').css({"padding-bottom":"15px"})
            var phone_no_value = $("#phone_no_value").val()
            $(`<div class="row w-100 justify-content-between phone_row">
                    <div class="phone">${phone_no_value}</div>
                    <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                </div>`).insertBefore("#customer_phone_input")
            $("#phone_no_value").val("")
        }

       
    })

        // on click delete icon to delete particular clicked row
        $(document).on('click', '.delete', function () {
            $(this).parent().remove()
        })


        // onclick add row to new row add in table
        $("#add_new_row").click(function () {
            add_row()

        })


        // add row button to add new row in account table
        function add_row(){
            $("#empty_table").remove() //remove blank and default row

                var company_id = "company_id" + $('#customer-accounts tbody tr').length
                var account_id = "account_id" + $('#customer-accounts tbody tr').length

                $("#account_table").append(`<tr class="select-accounts">
                    <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                    <td>
                       
                    <select id="${company_id}" class="company form-select form-control tab-select">
                        <option></option>
                     </select>
                    </td>
                    <td>
                        
                        <select class="account form-select form-control tab-select ${account_id}" id="${account_id}" data-searchable="true">
                               <option></option> 
                     </select>
                    </td>
                </tr>`)


            
                get_company(function(data) {
                    data.forEach(function(company) {
                        $("#" + company_id).append(`<option value="${company.name}">${company.name}</option>`);
                    });
                });
            
                var companyval = $("#" + company_id).val();
            
                set_account(companyval);
            
                function set_account(company_name) {
                    $("#" + account_id).empty()
                    setTimeout(() => {
                        get_account(function (data) {
                            console.log(data);
                                console.log($("#"+account_id));
                            data.forEach(function (account) {
                                $("#"+account_id).append(`<option value="${account.name}">${account.name}</option>`)
                            })
                        }, company_name)
                       
                        
                    }, 200)
                }
            
                document.getElementById(company_id).addEventListener('change', function() {
                    $("#" + account_id).empty();
                    var change_companyval = $("#" + company_id).val();
                    console.log(change_companyval);
                    set_account(change_companyval);
                });
        }
    

        


   // onclick delete row get checked checkbpx
   $("#delete_row").click(function () {
    $('.checkbox').each(function () {
        // remove only checked checkbox
        if ($(this).prop("checked")) {
            $(this).parent().parent().remove()
        }
    });
    $(".checkall").prop("checked", false);
    if($("#account_table tr").length==0)
        {
            $("#account_table").append(`<tr id="empty_table"></tr>`)
            account_lst = []
        }
    
})

   


    $('#save').click(function () {
        

        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        // set country in object
        form_data["custom_country"] = $("#country").val()


        
        // account table grouping data
        account_lst = [];
        var iserror = false
        $('.select-accounts').each(function(index) {
            var companyvalue = $("#company_id" + index).val();
            var accountvalue = $("#account_id" + index).val();
            
            if (!companyvalue || !accountvalue) {
                notyf.error({
                    message: "Selecting a company and an account is mandatory.",
                    duration: 5000
                });
                iserror = true
            } else {
                account_lst.push({'company': companyvalue, 'account': accountvalue});
            }
            
            
        });


        if(account_lst)
        {
            form_data["accounts"] = account_lst
        }
        console.log(account_lst);




        // phone section data
        $("#customer_phone .phone_row").each(function(i, data) {
            var phone_no = $(data).find(".phone").text();
            phone_list.push(phone_no); // Store each phone number with a key like "phone0", "phone1", etc.
        });


         // phone section data         
         $("#customer_email .email_row").each(function(i, data) {
             var email_data = $(data).find(".email").text();
             email_list.push(email_data); // Store each phone number with a key like "phone0", "phone1", etc.
         });
 
        //  form_data["email"] = email_list
         console.log(form_data); 


        // error handler 
        // check customer name and customer type is filled

        if (!form_data['customer_name']) {
            $('#customer_name_error').remove(); // Remove any existing error message
            $('#customer_name').after('<span id="customer_name_error" class="error-message">Please first name is mandatory.</span>');
        }
        else if (!form_data['customer_type']) {
            $('#customer_type_error').remove(); // Remove any existing error message
            $('#customer_type').after('<span id="customer_type_error" class="error-message">Please email is mandatory.</span>');
        }
        else if(iserror)
        {
    
            return false
        }
        else {
            if (files.length > 0 ) {
                var file_data = files[0]
                 upload_file(file_data); // Pass the first file to the upload_file function
                 $(".overlay").show()
                 $(".overlay-content").text("Please Wait....")
             } else {
                
                 create_customer(form_data) // save data without image
             }
        }
        console.log(form_data);

        $("#customer_name").on("input", function () {
            $('#customer_name_error').remove(); // Remove customer name error message
        })
        $("#customer_type").on("input", function () {
            $('#customer_type_error').remove(); // Remove customer_type error message
        })


        function upload_file(files) {
            
            var file_data = new FormData();
            file_data.append('file', files);
            file_data.append('file_name', files.name);
            file_data.append('file_url', "/file/"+files.name);
    
            
            $.ajax({
                url: "/api/method/upload_file",
                type: "POST",
                processData: false,
                contentType: false,
                data:file_data, // Assuming form_data contains a file object
                success: function (response) {
                    var profile_image_url = response.message.file_url
                    form_data["image"] = profile_image_url;
                    create_customer(form_data)
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.error('Error: ' + error); // Print the error to the console
                    console.error('Status: ' + status); // Print the status to the console
                    console.dir(xhr); // Print the XHR object for more details
            
                    
                }
            })
        }


        function create_customer(form_data) {
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")

            $.ajax({
                url: "/api/resource/Customer",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(form_data),
                success: function (data) {

                    var customer_id = data.data.name
                    customer_name = data.data.customer_name
                    
                    customer_contact = {
                        "customer_id": customer_id, 
                        "customer_name": customer_name,  
                        "phone": phone_list,             
                        "email": email_list              
                    }
                    create_contact(customer_contact)
                    setTimeout(() => {
                        $(".overlay").hide()
                        window.location.href = "/logistic/customer/"+customer_id
                    }, 1500);
                    notyf.success({
                        message: "New customer created",
                        duration: 5000
                    })

                },
                error: function (xhr, status, error) {
                    $(".overlay").hide()
                    var error_msg = xhr.responseJSON.exception.split(":")[1]       
                            
                    notyf.error({
                        message:error_msg,
                        duration:5000
                    });
                }
            })
        }

    })



    function create_contact(customer_contact){
        $.ajax({
            url: "/api/method/vessel.api.customer.create_contact",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(customer_contact),
            success: function(response) {
               
            },
        
            error: function (xhr, status, error) {
          
               console.log(xhr)
            }
        })
    }

     // load country select box
     get_country()
     function get_country() {
        $.ajax({
            url: "/api/resource/Country",
            type: "GET",
            dataType: "json",
            data:{
                fields:JSON.stringify(["name"]),
                limit_page_length:"None"
            },
            success: function (data) {
                var country_list = data.data
                
                country_list.forEach(function(country,i){
                    // countryoptions
                    $("#country").append(`<option value="${country.name}">${country.name}</option>`)
                })

               
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    //get company
    function get_company(callback) {

        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                callback(data.data)
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


    //get account list company wise
    function get_account(callback, companyval) {

        $.ajax({
            url: "/api/resource/Account",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["company", "=", companyval],["account_type", "in", ["Payable","Receivable","Bank"]],["is_group", "=", "0"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                callback(data.data)

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


      // click on checkall to check checkboxes
      $(document).on("click",".checkall",function(){
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })


    // email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false || email == "") {
      return "please entre valid address";
    }
  }

    

})