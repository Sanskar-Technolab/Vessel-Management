$(document).ready(function(){

    // set global variable for show current page
    var current_page = 1
    var filters = [];
    // Create an instance of Notyf
    var notyf = new Notyf();

        // get count of records
        function get_count(filters){
            $.ajax({
                url: "/api/resource/Journal Entry", 
                type: "GET", 
                dataType: "json",
                data: {
                    fields: JSON.stringify(["count(name) as count"]),
                    filters:JSON.stringify(filters),
    
                },
                success: function(response) {
                    
                    var page_count = response.data[0].count;
                    // page count per page data length wise
                    var page_number = Math.ceil(page_count / 10);

                    // if only one page then hide pagination
                   $('#pagination').toggleClass("hide", page_number === 1 || page_number === 0);

                    
                    for (var i = 1; i <= page_number; i++) {
                        var listItem = $(`<li class="page-item"><a class="page-link page-num" href="javascript:void(0)" data-page="${i}">${i}</a></li>`);
                        listItem.insertAfter('.previous-btn');
                    }
                    
                    $("#nextpage").attr("data-lastpage", page_number);
                    localStorage.removeItem("total_pages")
                    localStorage.setItem("total_pages",page_number)
                    // default page is 0
                    updatePagination(page_number);
                
                   
                }
                
            })
        }



        // get count and set pagination
        get_count()
    



        // load data page wise and default first page
        page_no = page_number()
        filters = get_filter_from_urls()
       if(page_no != undefined)
       {
            data_limit_start = page_no * 10 - 10;
            show_filtered_list(data_limit_start, filters);
            get_count(filters)
       }
       else{
            show_filtered_list(0, filters);
       }
    
   
       
       
// bulk delete records
function bulk_delete(delete_list) {
    $.ajax({
        url: "/api/method/vessel.api.delete.bulk_delete",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            doctype: "Account",
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
                    window.location.href= "/accounts/payment-entry"
                },1500)
            }

        },
        error: function (xhr, status, error) {
            console.dir(xhr);
            console.log(JSON.parse(JSON.parse(xhr.responseJSON._server_messages)[0]).message);
            var error_msg = JSON.parse(JSON.parse(xhr.responseJSON._server_messages)[0]).message.replace(/<a([^>]*)>/g, '<div style="font-weight: bold; color: white;">')
            .replace(/<\/a>/g, '</div>');
            
            notyf.error({
                message:error_msg,
                duration:10000
        });
        }
    });
}



    function show_filtered_list(data_limit_start,filters){
         // clear table data after move next page
         $("#data-list").empty();

        $.ajax({
            url: "/api/resource/Journal Entry", 
            type: "GET", 
            dataType: "json",
            data: {
                fields: JSON.stringify(["name","mode_of_payment","posting_date","company","docstatus"]),
                filters: JSON.stringify(filters),
                order_by: "modified desc",
                limit_start:data_limit_start,
                limit_page_length: 10
            },
            success: function(response) {
                console.log(response);
                $.each(response.data,function(i,data){
                                      
                    $('tbody').append(` <tr>
                    <td class="check-box"><input type="checkbox" class="check" name="check" id="${data.name}" data-userid="${data.name}"/></td>

                    <td><a href="/accounts/payment-entry/${data.name}">${data.name}</a></td>
                    <td>${data.company}</td>
                    <td>${data.posting_date}</td>
                    <td>${data.mode_of_payment}</td>
                    <td>${data.docstatus === 1 ? '<span class="submit">Submitted</span>' : data.docstatus === 0 ? '<span class="draft">Draft</span>' : data.docstatus === 2 ? '<span class="cancel">Cancelled</span>' : ''}</td>                   
                </tr>`)
                    
                })

            },
            error: function(xhr, status, error) {
                // Handle the error response here
                console.error('Error: ' + error); // Print the error to the console
                console.error('Status: ' + status); // Print the status to the console
                console.dir(xhr); // Print the XHR object for more details
            }
        });
    }


    // get page number from url
    function page_number(){
        const urlParams = new URLSearchParams(window.location.search);

        // Get the value of the 'page' parameter
        const page = urlParams.get('page');
        return page === null ? 1 : parseInt(page);
    }




    //====== pagination start here =====

    

      // click previous button to move previous pahe
     $(".previous-btn").click(function(){
              current_page = page_number()
              var prev_page = parseInt(current_page) - 1
              window.history.pushState({}, '', '?page='+prev_page);
              data_limit_start = prev_page * 10 - 10;
              
           //   get filtered data from this function and call filtered data dunction
            payment_entry_filters() //always set before the get filter from url bexause set filter in url using this function 
            show_filtered_list(data_limit_start,get_filter_from_urls()) //get_filter_from_urls() get filters data from url

            

              // disable next button
              disable_pagination()
            // set active class on page no
              dynamic_active()

              updatePagination(current_page);
     })

      // click next button to mobe next page
     $(".next-btn").click(function(){
          current_page = page_number()
          var next_page = parseInt(current_page) + 1
          
          window.history.pushState({}, '', '?page='+next_page);
          data_limit_start = next_page * 10 - 10;
        //   get filtered data from this function and call filtered data dunction
          payment_entry_filters() //always set before the get filter from url bexause set filter in url using this function 
          show_filtered_list(data_limit_start,get_filter_from_urls())  //get_filter_from_urls() get filters data from url
          
         // disable next button
         disable_pagination()

         // set active class on page no
         dynamic_active()
         
         updatePagination(current_page);
          
      })


    // check page is last then next btn is disable
    function disable_pagination(){
        
        const lastpage = $(".next-btn .page-link").data("lastpage")
        const current_page_num =  page_number()

        console.log("lastpage====="+ lastpage);
        console.log("current_page_num====="+ current_page_num);

        if(lastpage == current_page_num)
        {
            $('.next-btn').addClass('diable-btn');
            $('.previous-btn').removeClass('diable-btn');
        }  
        else if(current_page_num == 1){
            $('.previous-btn').addClass('diable-btn');
            $('.next-btn').removeClass('diable-btn');
        }   
        else{
            $('.next-btn').removeClass('diable-btn');
            $('.previous-btn').removeClass('diable-btn');
        }

    }
    // check page and disable according disable
    disable_pagination()
  

    function dynamic_active(){
        const current_page_num =  page_number()
          // dynamic active class set in page number
          $(".page-item .page-link").each(function() {
           
            if ($(this).data("page") == current_page_num) {
                $(this).parent().addClass("active");
            }
            else
            {
                $(this).parent().removeClass("active");
            }
        });
    }
    // set active class on page no
    dynamic_active()


    // show only 5 pages
    function updatePagination(current_page) {
        current_page = page_number()
        let start_page, end_page;
        var total_pages = parseInt(localStorage.getItem('total_pages'));
    
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
    
        // Adjust end_page dynamically to always show up to 5 pages if possible
        if (end_page - start_page < 4) {
            end_page = Math.min(start_page + 4, total_pages);
        }
    
        // Clear existing page items except for previous and next buttons
        $(".page-item").not(".previous-btn, .next-btn").remove();
    
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
     $(document).on('click', '.page-num', function() {
        // get page number from data-page attribute
        var page_num = $(this).data("page");
        window.history.pushState({}, '', '?page=' + page_num);
        var data_limit_start = page_num * 10 - 10;
        
        //   get filtered data from this function and call filtered data dunction
        payment_entry_filters() //always set before the get filter from url bexause set filter in url using this function 
        
        show_filtered_list(data_limit_start,get_filter_from_urls())  //get_filter_from_urls() get filters data from url
    
        // disable next button
        disable_pagination();

        updatePagination(page_num);
    });

// ============= Pagination END ==============

   
    
     // Handle filter accounts
     let timer;
     $('#mode_of_payment,#posting_date').on('input', function() {
        clearTimeout(timer); // Clear previous timer for not every time to load on system ( reduce load on server filter time)
        timer = setTimeout(() => {
            payment_entry_filters() //always set before the get filter from url bexause set filter in url using this function 
            var field_filter_data = get_filter_from_urls()
            show_filtered_list(0,field_filter_data)
            get_count(field_filter_data)
        },500)
        

    });



    function payment_entry_filters() {
        var filters = [];
    
        // Add name filter if not empty
        var mode_of_payment = $('#mode_of_payment').val().trim();
        var posting_date = $('#posting_date').val();
    
        if (mode_of_payment !== '') {
            filters.push('mode_of_payment=' + encodeURIComponent(mode_of_payment));
        }
        if (posting_date !== '') {
            filters.push('posting_date=' + encodeURIComponent(posting_date));
        }
    
        // Construct the query string
        var queryString = filters.join('&');
    
        // Get the base URL
        var baseUrl = window.location.pathname;
    
        // Check if there are existing query parameters
        var existingParams = window.location.search;
        if (existingParams.length > 0) {
            // Remove the leading '?' and split the parameters
            var existingParamsArray = existingParams.substring(1).split('&');
            // Filter out the existing parameters which are related to filtering
            existingParamsArray = existingParamsArray.filter(param => !param.startsWith('mode_of_payment=') && !param.startsWith('posting_date='));
            // Join the existing parameters with the new ones
            queryString = existingParamsArray.join('&') + (queryString ? '&' + queryString : '');
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
                key === "mode_of_payment" ? $("#mode_of_payment").val(value.replaceAll("%","")) : null;
                key === "posting_date" ? $("#posting_date").val(value.replaceAll("%","")) : null;
                
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
                console.log(selected_list);
                $.each(selected_list, function (index, delete_item) {
                    console.log(delete_item);
                    delete_list.push(delete_item.id)
        
                })
                console.log(delete_list)
                bulk_delete(delete_list)
            } 
        });
    }    
})



      
// bulk delete records
function bulk_delete(delete_list) {
    $.ajax({
        url: "/api/method/vessel.api.delete.bulk_delete",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            doctype: "Journal Entry",
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
                    window.location.href= "/accounts/payment-entry"
                },1500)
            }

        },
        error: function (xhr, status, error) {
            console.dir(xhr);
            console.log(JSON.parse(JSON.parse(xhr.responseJSON._server_messages)[0]).message);
            var error_msg = JSON.parse(JSON.parse(xhr.responseJSON._server_messages)[0]).message.replace(/<a([^>]*)>/g, '<div style="font-weight: bold; color: white;">')
            .replace(/<\/a>/g, '</div>');
            
            notyf.error({
                message:error_msg,
                duration:10000
        });
        }
    });
}



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
                    console.log(selected_list);
                    $.each(selected_list, function (index, delete_item) {
                        console.log(delete_item);
                        delete_list.push(delete_item.id)
            
                    })
                    console.log(delete_list)
                    bulk_delete(delete_list)
                } 
            });
        }    
    })



})