$(document).ready(function () {

    var old_form_data = {};
    var user_image //store old image url for user
    var user_id //store old userid for file delete
    var updated_form_data = {};
    

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




    var files = []

    $('#upload-image').change(function () {
        files = $(this)[0].files;

    });


            // get languages
    get_language()
    function get_language() {

       $.ajax({
           url: "/api/resource/Language",
           type: "GET",
           dataType: "json",
           data: {
               fields: JSON.stringify(["name","language_name"]),
               limit_page_length: "None"
           },
           success: function (data) {
               var language = data.data
               
               $.each(language,function(i,language){
                   
                   $("#language").append(`<option value=${language.name}>${language.language_name}-${language.name}</option>`)
               })

           },
           error: function (xhr, status, error) {
               // Handle the error response here
               console.dir(xhr); // Print the XHR object for more details

           }
       })
   }

    // get user data 
    var url = window.location.href
    var user_id = url.substring(url.lastIndexOf('/') + 1);

    get_user(user_id)
    function get_user(name) {
        
        $.ajax({
            url: "/api/resource/User",
            type: "GET",
            dataType: "json",
            data: {
                filters: JSON.stringify([["name", "=", name]]),
                fields: JSON.stringify(["name", "user_image", "email", "first_name", "full_name", "middle_name", "last_name", "username", "language", "enabled", "location", "phone", "mobile_no", "birth_date","interest"])
            },
            success: function (data) {
                var user_info = data.data[0]
                console.log(user_info);
                user_image = user_info.user_image
                user_id = user_info.name
                var user_profile_img = user_info.user_image && user_info.user_image.includes("https") ? user_info.user_image : (user_info.user_image ? window.location.origin + user_info.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")
                
                user_info.user_image ? $("#remove_profile").show():$("#remove_profile").hide() //hide and show remove button

                $("#page_title").html(user_info.full_name)
                $("#user_id").val(user_info.name)
                $('#image-preview').css('background-image', 'url(' + encodeURI(user_profile_img) + ')')
                $("#first_name").val(user_info.first_name)
                $("#middle_name").val(user_info.middle_name)
                $("#last_name").val(user_info.last_name)
                $("#email").val(user_info.email)
                $("#user_name").val(user_info.username)
                $("#language").val(user_info.language)
                $("#status").val(user_info.enabled)
                $("#phone").val(user_info.phone)
                $("#mobile").val(user_info.mobile_no)
                $("#location").val(user_info.location)
                $("#date_of_birth").val(user_info.birth_date)
                $("#state").val(user_info.interest)



                var old_form_data_list = $('form').serializeArray();

                $.each(old_form_data_list, function (index, field) {

                    old_form_data[field.name] = field.value;
                });


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }





   $("#delete").click(function(){
    $(".overlay").show()
    $(".overlay-content").text("Please Wait....")

    if($("#logged_in_user").text() != $("#email").val())
    {
        // delete file
        $.ajax({
        url: "/api/resource/User/" + user_id,
        type: "DELETE",
        dataType: "json",
        
        success: function (data) {
            
            notyf.success({
                message: "Deleted record  successfully",
                duration: 5000
            })
            setTimeout(() => {
                $(".overlay").hide()
                    window.location.href = "/user"
            }, 1500);

        },
        error: function (xhr, status, error) {
            // Handle the error response here
            console.dir(xhr); // Print the XHR object for more details
            
        }
    })
    }
    else{
        notyf.error({
            message: "Logged In User can not be deleted",
            duration: 5000
        })
    }
   
  })


    //   set after today date is disabled
    //   get yesterday date
        
    let yesterday = new Date();
    
    yesterday.setDate(yesterday.getDate() - 1);

    // Format yesterday's date to YYYY-MM-DD
    let formattedYesterday = yesterday.toISOString().split('T')[0];
        console.log(formattedYesterday);
    // disabled dates after today
    $("#birth_date").attr('max', formattedYesterday);
    




    // click on save to update data
    $('#save').click(function (e) {

        e.preventDefault();

        // Serialize the current form data
        var form_data_list = $('form').serializeArray();
        var form_data = {};

        $.each(form_data_list, function (index, field) {
            form_data[field.name] = field.value;
        });

        updated_form_data = {};
        // Compare old form data with current form data and store updated fields
        $.each(form_data, function (key, value) {

            if (old_form_data[key] !== value) {
                updated_form_data[key] = value;
            }
        });

        
      // ====== Validations ======

      let email = form_data['email'];
      let isvalid = true; // Flag to track if all validations pass
      //get today date
      var today = new Date();
      var today_date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
      
    

      // first name validation
      if (!form_data['first_name']) {
          $('#first_name_error').remove(); // remove existing error message
          $('#first_name').after('<span id="first_name_error" class="error-message">Please first name is mandatory.</span>');
          isvalid = false;
      }
      

      // email validation
      if (!email) {
          $('#email_error').remove(); // remove existing error message
          $('#email').after('<span id="email_error" class="error-message">Please email is mandatory.</span>');
          isvalid = false;
      } else if (validateEmail(email)==false) {
          $('#email_error').remove(); // remove existing error message
          $('#email').after('<span id="email_error" class="error-message">Please enter valid email address.</span>');
          isvalid = false;
      }
      

     //validate phone no
      if (form_data['phone'] != "") {
          if (form_data['phone'].length != 10) {
              $('#phone_error').remove(); // remove existing error message
              $('#phone').after('<span id="phone_error" class="error-message">Valid only 10 digits in mobile.</span>');
              isvalid = false;
          } 
      }

      //validate mobile no
      if (form_data['mobile_no'] != "") {
          if (form_data['mobile_no'].length != 10) {
              console.log("under 10 digit");
              $('#mobile_no_error').remove(); // remove existing error message
              $('#mobile').after('<span id="mobile_no_error" class="error-message">Valid only 10 digits in mobile.</span>');
              isvalid = false;
          } 
      }
      if(form_data['birth_date'] >today_date){
              $('#date_error').remove(); // Remove existing error message
              $('#birth_date').after('<span id="date_error" class="error-message">Please add date before today</span>');
              isvalid = false;
      }
    
        

        $("#first_name").on("input", function () {
            $('#first_name_error').remove(); 
        })
        $("#email").on("input", function () {
            $('#email_error').remove(); 
        })
        $("#mobile").on("input", function () {
            $('#mobile_no_error').remove();
        })
        $("#phone").on("input", function () {
            $('#phone_error').remove(); 
        })
        $("#birth_date").on("input", function () {
            $('#date_error').remove(); 
        })


       if(isvalid){
        console.log(isvalid);
        console.log("IS VALID");
        if (files.length > 0) {
            var file_data = files[0]
            upload_file(file_data); // Pass the first file to the upload_file function
        } else {
            if(Object.keys(updated_form_data).length !== 0 && isvalid)
            {
                update_user(updated_form_data) // save data without image
            }
            else{
                notyf.success({
                    type:'alert',
                    message: "Changes are not available",
                    duration: 5000
                })
            }
        }
       }

        function upload_file(files) {
            $(".overlay").show()
            $(".overlay-content").html("Please Wait....")
            
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
                    delete_profile() //delete old file
                   
                        var profile_image_url = response.message.file_url
                        updated_form_data["user_image"] = profile_image_url;
                        update_user(updated_form_data)                  
                   
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    $(".overlay").hide()
                    console.dir(xhr); // Print the XHR object for more details


                }
            })
        }
 

})

function update_user(updated_form_data) {
    $(".overlay").show()
    $(".overlay-content").text("Please Wait....")

    var user_id = $('#user_id').val()

    $.ajax({
        url: "/api/resource/User/" + user_id,
        type: "PUT",
        dataType: "json",
        data: JSON.stringify(updated_form_data),
        success: function (data) {

            notyf.success({
                message: "User updated successfully",
                duration: 5000
            })
            setTimeout(() => {
                window.location.reload()
                $(".overlay").hide()
            }, 1500);

        },
        error: function (xhr, status, error) {
            $(".overlay").hide()
            // Handle the error response here
            console.error('Error: ' + error); // Print the error to the console
            console.error('Status: ' + status); // Print the status to the console
            console.dir(xhr); // Print the XHR object for more details
            if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                notyf.error({
                    message: "User already added",
                    duration: 5000
                })
            }
        }
    })
}



    // remove image from profile
    // delete image
    $("#remove_profile").click(function(){
        update_user(updated_form_data)
        delete_profile(remove=1)
    })

   

    // delete profile_image
    function delete_profile(remove=0){
        
         // delete old file
         $.ajax({
            type: 'DELETE',
            url: '/api/method/vessel.api.updateuser.delete_old_file',
            data: {
                file_url: user_image,
                attached_to_name: user_id,
                attached_to_field: "user_image",
                attached_to_doctype:"User",
                remove:remove
            },
            success: function(deleteResponse) {
                
            },
            error: function(xhr, status, error) {
            //   window.location.reload()
                console.dir(xhr)
                
            }
        });
    }




       // update email address in user

       $("#update_email").click(function(){
        // set value in updateted email id field
        $('#update_email_address').val($("#email").val())
    })
    
    $("#update_email_id").click(function(){
        var old_email_address = $("#email").val()
        var updated_email_address = $("#update_email_address").val()
        if(!updated_email_address)
        {
            $('#update_email_error').remove();
            $('#update_email_address').after('<span id="update_email_error" class="error-message">Please email is mandatory.</span>');
        }
        else if(old_email_address == updated_email_address){
            $('#old_email_error').remove();
            $('#update_email_address').after('<span id="old_email_error" class="error-message">Email is not changed.</span>');
        }
        else{
            $('#update_email_error').remove();
            $('#old_email_error').remove();
            
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")
            $("#update_email_form .close").click()
            $.ajax({
                url: "/api/method/vessel.api.updateuser.update_email",
                type: "POST",
                dataType: "json",
                data: {
                    'doctype': 'User',
                    'old_email': JSON.stringify(old_email_address), // 'name' instead of 'old_name' for the old document
                    'new_email': JSON.stringify(updated_email_address)
                },
                success: function (data) {
                    if(data.message)
                    {
                        setTimeout(() => {
                            window.location.href = "/user/"+updated_email_address
                       }, 5000);
                        notyf.success({
                            message: "Update email successfully",
                            duration: 5000
                        })

                    }
     
                },
                error: function (xhr, status, error) {
                    $(".overlay").hide()
                    // Handle the error response here
                    console.dir(xhr); // Print the XHR object for more details
     
                }
            })


        }
    })

    
     // email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email) == false || email == "") {
        return false;
        }
    }
        

})