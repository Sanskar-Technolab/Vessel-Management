$(document).ready(function () {
    // Create an instance of Notyf
    var notyf = new Notyf();
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

    //   set after today date is disabled
    //   get yesterday date
        
    let yesterday = new Date();
    
    yesterday.setDate(yesterday.getDate() - 1);

    // Format yesterday's date to YYYY-MM-DD
    let formattedYesterday = yesterday.toISOString().split('T')[0];
        console.log(formattedYesterday);
    // disabled dates after today
    $("#birth_date").attr('max', formattedYesterday);
    
   


    $('#save').click(function () {

        
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });
        console.log(form_data);


    
        // ====== Validations ======

        let email = form_data['email'];
        let isvalid = true; // Flag to track if all validations pass
        //get today date
        var today = new Date();
        var today_date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        
        

        // first name validation
        if (!form_data['first_name']) {
            remove_vvalidation_error() //remove errors
            $('#first_name_error').remove(); // remove existing error message
            $('#first_name').after('<span id="first_name_error" class="error-message">Please first name is mandatory.</span>');
            isvalid = false;

        }
     

        // email validation
        if (!email) {
            remove_vvalidation_error()//remove errors
            $('#email_error').remove(); // remove existing error message
            $('#email').after('<span id="email_error" class="error-message">Please email is mandatory.</span>');
            isvalid = false;
        } else if (validateEmail(email)==false) {
            remove_vvalidation_error() // remove errors
            $('#email_error').remove(); // remove existing error message
            $('#email').after('<span id="email_error" class="error-message">Please enter valid email address.</span>');
            isvalid = false;
        }
       
       //validate phone no
        if (form_data['phone'] != "") {
            remove_vvalidation_error() //remove errors
            if (form_data['phone'].length != 10) {
                $('#phone_error').remove(); // remove existing error message
                $('#phone').after('<span id="phone_error" class="error-message">Valid only 10 digits in mobile.</span>');
                isvalid = false;
                console.log(isvalid);
                return false
            }
        }

        //validate mobile no
        if (form_data['mobile_no'] != "") {
            remove_vvalidation_error() //remove errors
            if (form_data['mobile_no'].length != 10) {
                console.log("under 10 digit");
                $('#mobile_no_error').remove(); // remove existing error message
                $('#mobile').after('<span id="mobile_no_error" class="error-message">Valid only 10 digits in mobile.</span>');
                isvalid = false;
                return false
            }
        }
        if(form_data['birth_date'] >today_date){
            remove_vvalidation_error()//remove errors
                $('#date_error').remove(); // Remove existing error message
                $('#birth_date').after('<span id="date_error" class="error-message">Please add date before today</span>');
                isvalid = false;
        }
    
        // if validate all mandatory things than process creating user
        if (isvalid === true) {
            //remove errors
            remove_vvalidation_error()


            if (files.length > 0) {
                var file_data = files[0];
                $(".overlay").show()
            $(".overlay-content").html("Please Wait....")
        
                upload_file(file_data); // if file is available for upload than call
                
            } else {
                create_user(form_data); // save data without image
            }
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

        function remove_vvalidation_error(){
            $('#first_name_error').remove(); 
            $('#email_error').remove(); 
            $('#mobile_no_error').remove();
            $('#phone_error').remove();
            $('#date_error').remove(); 
        }


     

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
                    form_data["user_image"] = profile_image_url;
                    create_user(form_data)
                },
                error: function (xhr, status, error) {
                    // Handle the error response here
                    console.error('Error: ' + error); // Print the error to the console
                    console.error('Status: ' + status); // Print the status to the console
                    console.dir(xhr); // Print the XHR object for more details
            
                    
                }
            })
        }


        function create_user(form_data) {
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....")
            $.ajax({
                url: "/api/resource/User",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(form_data),
                success: function (data) {

                    console.log(data.data.name);
                    var user_id = data.data.name
                   
                    setTimeout(() => {
                        $(".overlay").hide()
                        window.location.href = "/user/"+user_id
                    }, 1500);
                    
        
                    notyf.success({
                        message: "User created successfully",
                        duration: 5000
                    })

                },
                error: function (xhr, status, error) {
                    // Handle the error response here
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



    // email validation
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email) == false || email == "") {
      return false;
    }
  }

})
