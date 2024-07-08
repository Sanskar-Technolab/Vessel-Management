$(document).ready(function(){
    var loggedin_user 

     // Clear existing breadcrumbs
     $('.breadcrumbs').empty();
        
     // Get the path of the current page
     var path = window.location.pathname.split('/').filter(function(item) {
         return item !== '';
     });

     $('.breadcrumbs').append('<a href="/admin">Admin</a>');

     // Generate breadcrumbs for each segment of the path
     var fullPath = '';
     for (var i = 0; i < path.length; i++) {
         fullPath += '/' + path[i];
         if (i === path.length - 1) {
             // Add the last breadcrumb item with a special class
             $('.breadcrumbs').append('<span class="arrow"> > </span><a href="' + fullPath + '" class="last-breadcrumb">' + path[i].replaceAll("%20"," ") + '</a>');
         } else {
             $('.breadcrumbs').append('<span class="arrow"> > </span><a href="' + fullPath + '">' + path[i].replaceAll("%20"," ") + '</a>');
         }
     }

    //  searchbar

    var search_list = [
        {"User List":"/user"},
        {"New User":"/user/new-user"},
        {"Customer List":"/logistic/customer"},
        {"New Customer":"/logistic/customer/new-customer"},
        {"Account List":"/accounts/account"},
        {"New Account":"/accounts/account/new-account"},
        {"Company List":"/accounts/company"},
        {"New Company":"/accounts/company/new-company"},
        {"Payment Entry List":"/accounts/payment-entry"},
        {"New Payment Entry":"/accounts/payment-entry/new-payment-entry"},
        {"Balance Summary Report":"/analytics/balance-summary"}, 
    ]

    
        $('#search').on('input', function() {
            const query = $(this).val().toLowerCase();
            const resultsContainer = $('#search-results');
            resultsContainer.empty().hide();
    
            if (query) {
                const filteredList = search_list.filter(item => {
                    const key = Object.keys(item)[0];
                    return key.toLowerCase().includes(query);
                });
    
                if (filteredList.length > 0) {
                    filteredList.forEach(item => {
                        const key = Object.keys(item)[0];
                        const li = $('<li></li>').text(key);
                        li.on('click', function() {
                            window.location.href = item[key];
                        });
                        resultsContainer.append(li);
                    });
                } else {
                    const noResult = $('<li></li>').text('No result found');
                    resultsContainer.append(noResult);
                }
                resultsContainer.show();
            }
        });
    
        // Hide the results when clicking outside the search bar
        $(document).on('click', function(event) {
            if (!$(event.target).closest('.search-bar').length) {
                $('#search-results').hide();
            }
        });
    
        // Prevent hiding results when clicking inside the search bar
        $('.search-bar').on('click', function(event) {
            event.stopPropagation();
        });
    



        // notification
        $('.notification').click(function(){
            $('#notification-area').toggle();   
        });
        
    



    

    //  logout
    $("#logout").click(function(){
        $.ajax({
            url: "/api/method/logout",
            type: "POST",
            success: function (response) {
             window.location.href = "/login"
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details
                    
                    
           }
        })
        
    })




    // check if user not loggedin then redirect login page
    $.ajax({
        url: "/api/method/vessel.api.login.verify_loggedin",
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log(data)
            loggedin_user = data.message
                // Loggedin user
                $.ajax({
                    url: "/api/resource/User/"+data.message,
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                    var user_info = data.data
                    var user_profile_img = user_info.user_image && user_info.user_image.includes("https") ? user_info.user_image : (user_info.user_image ? window.location.origin + user_info.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg")
                    $("#profile").attr("src",user_profile_img)
                    },
                    error: function (xhr, status, error) {
                        // Handle the error response here
                        console.dir(xhr); // Print the XHR object for more details

                    }
                })


            // click to profile redirect user profile page
            $("#profile-page").click(function(){
                window.location.href = "/user/"+data.message
            })


            $("#logged_in_user").text(loggedin_user)
            if(data.message=="Guest"){
              window.location.href = "/login"
            }
            
        },
        error: function (xhr, status, error) {
            // Handle the error response here
            console.dir(xhr); // Print the XHR object for more details

        }
    })

  

    
    
})