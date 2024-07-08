

$(document).ready(function () {

    // set global variable for show current page
    var current_page = 1
    var filters = [];
    var page_no
    var data_limit_start = 0

    // Create an instance of Notyf
    var notyf = new Notyf();


    // get count of records
    function get_count(filters) {
        $.ajax({
            url: "/api/resource/User",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["count(name) as count"]),
                filters: JSON.stringify(filters),

            },
            success: function (response) {

                var page_count = response.data[0].count;
                // page count per page data length wise
                page_no = Math.ceil(page_count / 10);

                // if only one page then hide pagination
                $('#pagination').toggleClass("hide", page_no === 1 || page_no === 0);


                for (var i = 1; i <= page_no; i++) {
                    var listItem = $(`<li class="page-item"><a class="page-link page-num" href="javascript:void(0)" data-page="${i}">${i}</a></li>`);
                    listItem.insertAfter('.previous-btn');
                }

                $("#nextpage").attr("data-lastpage", page_no);
                localStorage.removeItem("total_pages")
                localStorage.setItem("total_pages", page_no)
                // default page is 0
                updatePagination(0);

            }

        })
    }



    // bulk delete records
    function bulk_delete(delete_list) {
        $.ajax({
            url: "/api/method/vessel.api.delete.bulk_delete",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                doctype: "User",
                delete_list: delete_list,
            }),
            success: function (response) {
                console.log(response);
                
                if (response.message == true) {
                    notyf.success({
                            message:"Data deleted successfully",
                            duration:3000
                    });

                    setTimeout(()=>{
                        window.location.href= "/user"
                    },1500)
                }

            },
            error: function (xhr, status, error) {
                console.dir(xhr);
            }
        });
    }




    // get count and set pagination
    get_count()




    // load data page wise and default first page
    page_no = page_number()
    filters = get_filter_from_urls()
    if (page_no != undefined) {
        data_limit_start = page_no * 10 - 10;
        // show_list(data_limit_start)
        show_filtered_list(data_limit_start, filters);
        get_count(filters)
    }
    else {
        show_filtered_list(0, filters); // start page with 1 page number
    }





    function show_filtered_list(data_limit_start, filters) {
        // clear table data after move next page
        $("#data-list").empty();

        $.ajax({
            url: "/api/resource/User",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name", "full_name", "email", "mobile_no", "location", "enabled", "user_image"]),
                filters: JSON.stringify(filters),
                order_by: "modified desc",
                limit_start: data_limit_start,
                limit_page_length: 10
            },
            success: function (response) {
                $.each(response.data, function (i, data) {
                    var user_profile = data.user_image && data.user_image.includes("https") ? data.user_image : (data.user_image ? window.location.origin + data.user_image : window.location.origin + "/assets/vessel/files/images/default_user.jpg");


                    $('tbody').append(` <tr>
                    <td class="check-box"><input type="checkbox" class="check" name="check" id="${data.name}" data-userid="${data.name}"/></td>
                    <td class="d-flex align-items-center">
                        <div class="profile-image mr-2">
                            <img src="${user_profile}">
                        </div>
                        <div class="user-name"><a href="/user/${data.name}">
                        ${data.full_name ? data.full_name : " "}
                        </a>
                        </div>
                    </td>
                    <td>${data.email ? data.email : " "}</td>
                    <td>${data.mobile_no ? data.mobile_no : " "}</td>
                    <td>${data.location ? data.location : " "}</td>
                    <td class="d-flex ${data.enabled === 1 ? '' : 'inactive'}">
                        <div><div class="radio"></div></div>
                    <div> ${data.enabled === 1 ? "Active" : "Inactive"} </div>
                    </td>
                </tr>`)

                })

            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details
            }
        });
    }


    // get page number from url
    function page_number() {
        const urlParams = new URLSearchParams(window.location.search);

        // Get the value of the 'page' parameter
        const page = urlParams.get('page');
        return page === null ? 1 : parseInt(page);
    }




    //====== pagination start here =====



    // click previous button to move previous page
    $(".previous-btn").click(function () {
        current_page = page_number()
        var prev_page = parseInt(current_page) - 1
        window.history.pushState({}, '', '?page=' + prev_page);
        data_limit_start = prev_page * 10 - 10;

        //   get filtered data from this function and call filtered data dunction
        user_filters() //always set before the get filter from url bexause set filter in url using this function 
        show_filtered_list(data_limit_start, get_filter_from_urls()) //get_filter_from_urls() get filters data from url

        // disable next button
        disable_pagination()
        // set active class on page no
        dynamic_active()


        updatePagination(current_page);
    })

    // click next button to mobe next page
    $(".next-btn").click(function () {
        current_page = page_number()
        var next_page = parseInt(current_page) + 1

        window.history.pushState({}, '', '?page=' + next_page);
        data_limit_start = next_page * 10 - 10;
        //   get filtered data from this function and call filtered data dunction
        user_filters() //always set before the get filter from url bexause set filter in url using this function 
        show_filtered_list(data_limit_start, get_filter_from_urls())  //get_filter_from_urls() get filters data from url

        // disable next button
        disable_pagination()

        // set active class on page no
        dynamic_active()


        updatePagination(current_page);

    })


    // check page is last then next btn is disable
    function disable_pagination() {

        const lastpage = $(".next-btn .page-link").data("lastpage")
        const current_page_num = page_number()
        if (lastpage == current_page_num) {
            $('.next-btn').addClass('diable-btn');
            $('.previous-btn').removeClass('diable-btn');
        }
        else if (current_page_num == 1) {
            $('.previous-btn').addClass('diable-btn');
            $('.next-btn').removeClass('diable-btn');
        }
        else {
            $('.next-btn').removeClass('diable-btn');
            $('.previous-btn').removeClass('diable-btn');
        }

    }
    // check page and disable according disable
    disable_pagination()


    function dynamic_active() {
        const current_page_num = page_number()
        // dynamic active class set in page number
        $(".page-item .page-link").each(function () {

            if ($(this).data("page") == current_page_num) {
                $(this).parent().addClass("active");
            }
            else {
                $(this).parent().removeClass("active");
            }
        });
    }
    // set active class on page no
    dynamic_active()


    // show only 5 pages
    function updatePagination(current_page) {

        let start_page, end_page;
        var total_pages = localStorage.getItem('total_pages')

        // Determine the range of pages to display
        if (total_pages <= 5) {
            // If total pages are 5 or less, show all pages
            start_page = 1;
            end_page = total_pages;
        } else {
            // For more than 5 pages, calculate the start and end pages dynamically
            start_page = Math.max(1, current_page - 2);
            end_page = Math.min(total_pages, current_page + 2);

            // Adjust the range if we are near the beginning
            if (current_page <= 3) {
                end_page = 5;
                start_page = 1;
            }
            // Adjust the range if we are near the end
            else if (current_page > total_pages - 2) {
                start_page = total_pages - 4;
                end_page = total_pages;
            }
        }

        // Adjust end_page dynamically to always show up to 5 pages
        if (end_page - start_page < 4) {
            end_page = Math.min(start_page + 4, total_pages);
        }


        // Clear existing page items except for previous and next buttons
        $(".page-item").not(".previous-btn", ".next-btn").remove();

        // Generate page items based on the calculated range
        for (let i = start_page; i <= end_page; i++) {
            const active_class = (i === current_page) ? 'active' : '';
            $(`<li class="page-item ${active_class}"><a class="page-link page-num" href="javascript:void(0)" data-page="${i}">${i}</a></li>`).insertBefore(".next-btn");
        }

        // Disable next button if on the last page
        $('.next-btn').toggleClass('disabled', current_page >= total_pages);
        // Disable previous button if on the first page
        $('.previous-btn').toggleClass('disabled', current_page <= 1);

        // Set active class on the current page number
        dynamic_active();
    }





    //  clcik page not ot redirect on particular page
    $(document).on('click', '.page-num', function () {
        // get page number from data-page attribute
        var page_num = $(this).data("page");
        window.history.pushState({}, '', '?page=' + page_num);
        var data_limit_start = page_num * 10 - 10;

        //   get filtered data from this function and call filtered data dunction
        user_filters() //always set before the get filter from url bexause set filter in url using this function 

        show_filtered_list(data_limit_start, get_filter_from_urls())  //get_filter_from_urls() get filters data from url

        // disable next button
        disable_pagination();

        updatePagination(page_num);
    });





    // Handle filter username and contact
    let timer;
    $('#user-name, #contact-no').on('input', function () {
        clearTimeout(timer); // Clear previous timer for not every time to load on system ( reduce load on server filter time)
        timer = setTimeout(() => {
            console.log($("#user-name"));
            user_filters(); // Always set before getting filter from URL
            var field_filter_data = get_filter_from_urls();
            show_filtered_list(0, field_filter_data);
            get_count(field_filter_data);
        }, 500); // Set a delay of 500ms
    });




    // Handle filter username and contact
    $('#status').on('change', function () {

        user_filters() //always set before the get filter from url bexause set filter in url using this function 
        var status_filter = get_filter_from_urls()
        show_filtered_list(0, status_filter)
        get_count(status_filter)


    });


    function user_filters() {
        var filters = [];

        // Add name filter if not empty
        var user_name_filter = $('#user-name').val().trim();
        var contact_no_filter = $('#contact-no').val().trim();
        var user_status = $('#status').val()

        if (user_name_filter !== '') {
            filters.push('username=' + encodeURIComponent('%' + user_name_filter + '%'));
        }
        if (contact_no_filter !== '') {
            filters.push('mobile_no=' + encodeURIComponent('%' + contact_no_filter + '%'));
        }
        if (user_status!== '') {
            filters.push('enabled=' + encodeURIComponent('%' + user_status + '%'));
        }

        // Construct the query string
        var queryString = filters.join("&")
        // Get the base URL
        var baseUrl = window.location.pathname;

        // Check if there are existing query parameters
        var existingParams = window.location.search;
        if (existingParams.length > 0) {
            // Remove the leading '?' and split the parameters
            var existingParamsArray = existingParams.substring(1).split('&');
            // Filter out the existing parameters which are not related to filtering
            existingParamsArray = existingParamsArray.filter(param => !param.startsWith('username=') && !param.startsWith('mobile_no=') && !param.startsWith('enabled='));
            // Join the existing parameters with the new ones
            queryString = existingParamsArray.join('&') + (queryString ? (existingParamsArray.length > 0 ? '&' : '') + queryString : '');
        }


        // Construct the new URL
        var newUrl = baseUrl + (queryString ? '?' + queryString : '');

        // Update the URL using pushState
        window.history.pushState({ path: newUrl }, '', newUrl);
    }




    // get filter from url query parameter
    function get_filter_from_urls() {
        var url = window.location.href
        const urlParams = new URLSearchParams(new URL(url).search);
        const conditions = [];

        urlParams.forEach((value, key) => {
            if (key !== "page" && key !== null) {
                conditions.push([key, "LIKE", value]);
            }
        });
        return conditions

    }


    function get_filter_data() {
        var url = window.location.href
        const urlParams = new URLSearchParams(new URL(url).search);
        const conditions = [];

        urlParams.forEach((value, key) => {
            if (key !== "page" && key !== null) {
                key === "username" ? $("#user-name").val(value.replaceAll("%", "")) : null;
                key === "mobile_no" ? $("#contact-no").val(value.replaceAll("%", "")) : null;
                key === "enabled" ? $("#status").val(value.replaceAll("%", "")) : null;
            }
        });
    }


    //   set onload if fielter is available to set in particulat fields
    get_filter_data()


        // on click delete to get checked data list
        $(document).on("click","#delete", function () {
            if(selected_list.length!=0)
            {
                swal({
                    title: "Are you sure?",
                    text: "Are you sure want to delete data?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        var delete_list = []
                        // get checked list from localstorage
                        $.each(selected_list, function (index, delete_item) {
                            delete_list.push(delete_item.id)
                
                        })
                        console.log(delete_list)
                        bulk_delete(delete_list)
                    } 
                });
            }    
        })

    


});

