$(document).ready(function () {



    var files = []
    var phone_list = []
    var email_list = []
    var phone_data_list
    var email_data_list
    var contact_id
    var email_data_list
    var phone_data_list
    var company_select_list = []
    var customer_profile_img
    var old_phone_list = []
    var old_email_list = []
    var new_email_list
    var new_phone_list
    var updated_form_data = {};
    var old_form_data = {};
    var customer_name
    var profile_path



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


    // onclick delete row get checked checkbpx
    $("#delete_row").click(function () {
        $('.checkbox').each(function () {
            // remove only checked checkbox
            if ($(this).prop("checked")) {
                $(this).parent().parent().remove()
            }
        });
    })



      // load country select box
      get_country()
      function get_country() {
          $.ajax({
              url: "/api/resource/Country",
              type: "GET",
              dataType: "json",
              data: {
                  fields: JSON.stringify(["name"]),
                  limit_page_length: "None"
              },
              success: function (data) {
                  var country_list = data.data
                  $("#country").empty()
                  $("#country").append(`<option></option>`)
                  country_list.forEach(function (country, i) {
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



    // show data in form
    var url = window.location.href

    var customer_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " ");

    get_customer(customer_id)
    function get_customer(name) {

        $.ajax({
            url: "/api/resource/Customer/" + name,
            type: "GET",
            dataType: "json",

            success: function (data) {
                var customer_info = data.data


             setTimeout(() => {
                customer_id = customer_info.name
                customer_name = customer_info.customer_name
                profile_path = customer_info.image
                customer_profile_img = customer_info.image && customer_info.image.includes("https") ? customer_info.image : (customer_info.image ? window.location.origin + customer_info.image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")
                profile_img = encodeURI(customer_profile_img)
                customer_info.image ? $("#remove_profile").show() : $("#remove_profile").hide() //hide and show remove button
                console.log(profile_img);
                $("#page_title").html(customer_info.customer_name)
                $("#user_id").val(customer_id)
                $('#image-preview').css('background-image', 'url("' + profile_img + '")');
                $("#customer_name").val(customer_info.customer_name)
                $("#country").val(customer_info.custom_country)
                $("#address").val(customer_info.custom_address)
                $("#customer_type").val(customer_info.customer_type)
                $("#person_in_charge").val(customer_info.custom_person_in_charge)
                $("#remarks").val(customer_info.custom_remarks)
                $("#status").val(customer_info.disabled)


                var old_form_data_list = $('form').serializeArray();

                $.each(old_form_data_list, function (index, field) {

                    old_form_data[field.name] = field.value;
                });

             }, 50);



            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    get_contact(customer_id)

    function get_contact(customer_id) {

        $.ajax({
            url: "/api/method/vessel.api.customer.get_contact",
            type: "GET",
            dataType: "json",
            data: {
                doctype: "Customer",
                doc_name: customer_id
            },
            success: function (data) {

                email_data_list = data.message.emails

                phone_data_list = data.message.phones
                contact_id = data.message.contact_id ? data.message.contact_id : ""
                
                $.each(phone_data_list, function (i, data) {
                    $(`<div class="row w-100 justify-content-between phone_row">
                                        <div class="phone">${data}</div>
                                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                                    </div>`).insertBefore("#customer_phone_input")


                    old_phone_list.push({ "phone_nos": data, "parentfield": "phone_nos", "parenttype": "Contact" }); // generate old list of phone no
                })

                $.each(email_data_list, function (i, data) {
                    $(`<div class="row w-100 justify-content-between email_row">
                        <div class="email">${data}</div>
                        <div class="delete"><img src="/assets/vessel/files/images/delete.png" alt="delete"></div>
                    </div>`).insertBefore("#customer_email_input")

                    old_email_list.push({ "email_ids": data, "parentfield": "email_ids", "parenttype": "Contact" }); // generate old list of email
                })


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }


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


  




    $('#save').click(function () {


        // Serialize the current form data
        var form_data_list = $('form').serializeArray();
        var form_data = {};

        $.each(form_data_list, function (index, field) {
            form_data[field.name] = field.value;
        });


        // Compare old form data with current form data and store updated fields
        updated_form_data = {};

        $.each(form_data, function (key, value) {

            if (old_form_data[key] !== value) {
                updated_form_data[key] = value;
            }
        });

        

        // phone section data
        phone_list = []
        new_phone_list = []
        $("#customer_phone .phone_row").each(function (i, data) {
            var phone_no = $(data).find(".phone").text();
            phone_list.push({"phone_nos": phone_no, "parentfield": "phone_nos", "parenttype": "Contact"}); // push unique value in phone_list
            new_phone_list.push(phone_no)
        });


        //email data
        email_list = []
        new_email_list = []
        $("#customer_email .email_row").each(function (i, data) {
            var email_data = $(data).find(".email").text();
            email_list.push({"email_ids": email_data, "parentfield": "email_ids", "parenttype": "Contact",}); // push unique value in email_list
            new_email_list.push(email_data)
        });



        function update_emails() {
            $.ajax({
                url: "/api/method/vessel.api.customer.update_contact_email_ids",
                type: "POST",
                data: {
                    "contact_name": contact_id,
                    "new_email_ids": JSON.stringify(email_list)
                },
                success: function (response) {
                    console.log(response);
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.dir(xhr); // Print the XHR object for more details


                }
            })
        }


        function update_phone(contact_id,customer_name,customer_id, phone_list) {
      
            $.ajax({
                url: "/api/method/vessel.api.customer.update_contact_phone_nos",
                type: "POST",
                data: {
                    "contact_id": JSON.stringify(contact_id),
                    "new_phone_nos": JSON.stringify(phone_list),
                    "customer_name": JSON.stringify(customer_name),
                    "customer_id": JSON.stringify(customer_id)
                    
                },
                success: function(response) {
                    console.log(response);
                },
                error: function(xhr, status, error) {
                    console.error("Error: " + error);
                    console.dir(xhr);
                }
            });
        }

      

        function create_contact(){
            $.ajax({
                url: "/api/method/vessel.api.customer.create_contact",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "customer_id": customer_id,
                    "customer_name": customer_name,
                    "phone": new_phone_list,
                    "email": new_email_list
                }),
                
                success: function(response) {
                    console.log(response);
                },
            
                error: function (xhr, status, error) {
            
                console.log(xhr)
                }
            })
        }
            

        // compare phone no
        function comparephone() {
            let updated = false;
            
            $.each(phone_list, function (i) {
                if (phone_list.length !== old_phone_list.length || JSON.stringify(phone_list[i]) !== JSON.stringify(old_phone_list[i])) {
                    updated = true;
                    return false;
                }
            });
                        
            return updated ? true : false;
        }
        
        //compare email lists
        function compareemail() {
            let updated = false;

            $.each(phone_list, function (i) {
                if (JSON.stringify(email_list[i]) !== JSON.stringify(old_email_list[i])) {
                    updated = true;
                    return false;
                }
            });

            return updated ? true : false;
        }


        // error handler 
        // check customer name and customer type is filled

        if (!form_data['customer_name']) {
            $('#customer_name_error').remove(); // Remove any existing error message
            $('#customer_name').after('<span id="customer_name_error" class="error-message">Please customer name is mandatory.</span>');
        }
        else if (!form_data['customer_type']) {
            $('#customer_type_error').remove(); // Remove any existing error message
            $('#customer_type').after('<span id="customer_type_error" class="error-message">Please email is mandatory.</span>');
        }
        console.log(updated_form_data);

        if (files.length > 0) {
            var file_data = files[0]
            upload_file(file_data); // Pass the first file to the upload_file function
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")
        } else {
          
            if (Object.keys(updated_form_data).length !== 0 || compareemail() || comparephone()) {

                if(!contact_id)
                {
                    create_contact()
                }
                else{
                    update_emails(contact_id,email_list)
                    update_phone(contact_id,customer_name,customer_id, phone_list)
                }
                update_customer(updated_form_data) // save data without image
               
            }
    
            else {
                notyf.success({
                    type: 'alert',
                    message: "Changes are not available",
                    duration: 5000
                })
            }
        }


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
            file_data.append('file_url', "/file/" + files.name);


            $.ajax({
                url: "/api/method/upload_file",
                type: "POST",
                processData: false,
                contentType: false,
                data: file_data, // Assuming form_data contains a file object
                success: function (response) {
                    delete_profile()
                    var profile_image_url = response.message.file_url
                    updated_form_data["image"] = profile_image_url;
                    update_customer(updated_form_data)

                },
                error: function (xhr, status, error) {
                    // Handle the error response here

                    console.dir(xhr); // Print the XHR object for more details


                }
            })
        }

    })



    // click on checkall to check checkboxes
    $(document).on("click", ".checkall", function () {
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })


    // update_customer details
    function update_customer(updated_form_data) {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        $.ajax({
            url: "/api/resource/Customer/" + customer_id,
            type: "PUT",
            dataType: "json",
            data: JSON.stringify(updated_form_data),
            success: function (data) {

                setTimeout(() => {
                    $(".overlay").hide()
                    window.location.reload()
                }, 1500);
                notyf.success({
                    message: "Update customer successfully",
                    duration: 5000
                })

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


    $("#delete").click(function () {

        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")

        // delete file
        $.ajax({
            url: "/api/resource/Customer/" + customer_id,
            type: "DELETE",
            dataType: "json",

            success: function (data) {



                notyf.success({
                    message: "Deleted record  successfully",
                    duration: 5000
                })
                setTimeout(() => {
                    window.location.href = "/logistic/customer"
                    $(".overlay").hide()
                }, 1500);

            },
            error: function (xhr, status, error) {
                $(".overlay").hide()
                console.log(xhr);

                if(xhr.responseJSON.exc_type == "LinkExistsError")
                {
                    notyf.error({
                        message:"Customer is linked with another form,you can inactive them.",
                        duration:5000
                    });
                }
                else{
                    var error_msg = xhr.responseJSON.exception.split(":")[1]       
                        
                    notyf.error({
                        message:error_msg,
                        duration:5000
                    });
                }
                

            }
        })
    })



    // remove image from profile
    // delete image
    $("#remove_profile").click(function () {
        update_customer(updated_form_data)
        delete_profile(remove = 1)
    })


    // delete profile_image
    function delete_profile(remove = 0) {

        // delete old file
        $.ajax({
            type: 'DELETE',
            url: '/api/method/vessel.api.updateuser.delete_old_file',
            data: {
                file_url: profile_path,
                attached_to_name: customer_id,
                attached_to_field: "image",
                attached_to_doctype: "Customer",
                remove: remove
            },
            success: function (deleteResponse) {

            },
            error: function (xhr, status, error) {
                //   window.location.reload()
                console.dir(xhr)

            }
        });
    }

     // email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false || email == "") {
      return false;
    }
  }

})

