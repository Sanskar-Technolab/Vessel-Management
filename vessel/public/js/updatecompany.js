$(document).ready(function () {

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

    var old_form_data = []
    var url = window.location.href
    var company_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " ");
    


     // load country select box
  
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
                $("#country").empty()
                $("#country").append(`<option></option>`)
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

    // get currency
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

    // get company data
      get_company()
      function get_company(){
          $.ajax({
              url: "/api/resource/Company/"+company_id,
              type: "GET",
              dataType: "json",
              success: function (data) {  
                  get_country() // get country
                  get_currency() //get currency

                 setTimeout(() => {
                    var company_info = data.data
                    $("#page_title").html(company_info.name)
                    $("#company").val(company_info.name)
                    $("#country").val(company_info.country)
                    $("#currency").val(company_info.default_currency)


                     // get old form data
                     var old_form_data_list = $('form').serializeArray();

                     $.each(old_form_data_list, function (index, field) {
     
                         old_form_data[field.name] = field.value;
                     });
                 }, 100);
  
              },
              error: function (xhr, status, error) {
                  // Handle the error response here
                  console.dir(xhr); // Print the XHR object for more details
  
              }
          })
      }



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

     //=========== Validation ===========
    let iserror = false;

    $('.error-message').remove();


    // Check the country field
    if(!form_data["country"]){
        $('#country').after('<span id="country_error" class="error-message">Country is mandatory.</span>');
        iserror = true;
    }

    // Check the currency field
    if(!form_data["default_currency"]){
        $('#currency').after('<span id="currency_error" class="error-message">Currency is mandatory.</span>');
        iserror = true;
    }
   

   if(!iserror){
             // if not any change in form
            if(Object.keys(updated_form_data).length != 0)
                {
                    update_company()
                }
                else
                {
                notyf.success({
                    type:'alert',
                    message: "Changes are not available",
                    duration: 5000
                })
                }
        }



        function update_company(){
            // var abbr = $('#company').text().split(' ').map(function(word) {
            //     return word.charAt(0);
            // }).join('');
            // form_data["abbr"] = abbr
            // form_data["default_currency"] = "INR"

            //loading_page
            $(".overlay").show()
            $(".overlay-content").text("Please Wait....") 

            $.ajax({
                url: "/api/resource/Company/"+company_id,
                type: "PUT",
                dataType: "json",
                data:JSON.stringify(form_data),
                success: function (data) {
                   console.log(data);
                    notyf.success({
                        message: "Company update successfully",
                        duration: 5000
                    })
                    setTimeout(() => {
                        $(".overlay").hide()
                       window.location.reload()
                    }, 1500);
    
                   
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
})