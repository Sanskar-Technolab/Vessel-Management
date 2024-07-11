$(document).ready(function(){

    var balance_summary
    var report_print_data = []
    var report_data_len = 0
    // Create an instance of Notyf
    var notyf = new Notyf();

    
     // handle filter customername
     let timer;
     $('#customer_name,#company,#from_date,#to_date').on('input', function() {
        clearTimeout(timer); // Clear previous timer for not every time to load on system ( reduce load on server filter time)
        timer = setTimeout(() => {
            balance_summary_filters() //always set before the get filter from url and set filter in url using this function 
            var field_filter_data = get_filter_from_urls()

            show_filtered_list(field_filter_data)

        },500)

    });

    //get_customer and set in options
    get_customer()
    function get_customer() {
        $.ajax({
            url: "/api/resource/Customer",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name", "customer_name"]),
                filters: JSON.stringify([["disabled", "=", "0"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                customer_list = data.data

                $.each(customer_list, function (i, customer) {
                  $("#customer_name").append(`<option value="${customer.name}">${customer.customer_name} - ${customer.name}</option>`)
              })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }


      //get_company and set in options
      get_company()
      function get_company() {
          $.ajax({
              url: "/api/resource/Company",
              type: "GET",
              dataType: "json",
              data: {
                  limit_page_length: "None"
              },
              success: function (data) {
                  company_list = data.data
  
                  $.each(company_list, function (i, company) {
                    $("#company").append(`<option value="${company.name}">${company.name}</option>`)
                })
              },
              error: function (xhr, status, error) {
                  // Handle the error response here
                  console.dir(xhr); // Print the XHR object for more details
              }
          })
      }

      
        

    function balance_summary_filters(){
        var filters = [];
    
        // Add name filter if not empty
        var customer_name_filter = $('#customer_name').val();
        var company_name_filter = $('#company').val();
        var from_date = $('#from_date').val();
        var to_date = $('#to_date').val();
        console.log("Company Name filter===="+company_name_filter);
    
        if (customer_name_filter !== '') {
            filters.push('party=' + encodeURIComponent('%' + customer_name_filter + '%'));
        }
        if (company_name_filter !== '') {
            filters.push('company=' + encodeURIComponent('%' + company_name_filter + '%'));
        }
        if (from_date !== '') {
            filters.push('from_date=' + encodeURIComponent('%' + from_date + '%'));
        }
        if (to_date !== '') {
            filters.push('to_date=' + encodeURIComponent('%' + to_date + '%'));
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
            existingParamsArray = existingParamsArray.filter(param => !param.startsWith('party=') && !param.startsWith('company=') && !param.startsWith('from_date=') && !param.startsWith('to_date='));
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
                conditions.push({[key]:value.replaceAll("%","")});
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
                key === "party" ? $("#customer_name").val(value.replaceAll("%","")) : null;
                key === "company" ? $("#company").val(value.replaceAll("%","")) : null;
                key === "from_date" ? $("#from_date").val(value.replaceAll("%","")) : null;
                key === "to_date" ? $("#to_date").val(value.replaceAll("%","")) : null;
              }
        });        
      }


   setTimeout(() => {
     //   set onload if fielter is available to set in particulat fields
     get_filter_data()
   }, 200);



 
   setTimeout(() => {
        // Set the value of the input field
        $("#company").val($("#default_company").html());
        balance_summary_filters()   //set filters in url (company filter) 
            
        var filter_data = get_filter_from_urls()    
        console.log(filter_data);
        show_filtered_list(filter_data)
   }, 100);
 
  
     function show_filtered_list(filters){
        $.ajax({
            url: "/api/method/vessel.api.report.calculate_journal_entry_balances",
            type: "GET",
            dataType: "json",
            data:{
                filters: JSON.stringify(filters),
                
            },
            success: function (data) {
               console.log(data);
                balance_summary = data.message
                console.log(balance_summary);
                report_print_data = []
               $("#report_data").empty() 
               $.each(balance_summary,function(index,data){
                
             
                    $("#report_data").append(`<tr>
                            <td class="check-box"><input type="checkbox" class="checkall" name="checkall" /></td>
                            <td>${index+1}</td>
                            <td class="id_data"><a href="/accounts/payment-entry/${data.name}" class="reference_id">${data.name ? data.name : ''}</a></td>
                            <td class="date_data">${data.posting_date ? date_format(data.posting_date) : ''}</td>
                            <td class="account_data">${data.account ? data.account : ''}</td>
                            <td class="description_data">${data.user_remark ? data.user_remark : ''}</td>
                            <td class="debit_data nymbers">${data.debit ? data.symbol+data.debit : data.symbol+'0'}</td>
                           <td class="credit_data numbers">${data.credit ? data.symbol+data.credit : data.symbol+'0'}</td>
                           <td class="balance_data numbers">${data.balance ? data.symbol+data.balance : data.symbol+'0'}</td>
                            <td class="attached_data file_url">${data.custom_attachments ? `<a href='${data.custom_attachments}'>${data.custom_attachments.substring(0, 25) + '...'}</a>` : ''}</td>
                        </tr>`);

                        report_print_data.push({
                            "date": date_format(data.posting_date),
                            "description": data.user_remark,
                            "debits": data.debit,
                            "credits": data.credit,
                            "account_balance": data.balance  ,
                            "symbol":data.symbol
                        });
                        
               })

               report_data_len = report_print_data.length
               
               
       
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
      }


      $('.number').each(function() {
        var number = parseInt($(this).text(), 10);
        var formattedNumber = number.toLocaleString('en-IN'); // Using 'en-IN' for Indian numbering system
        $(this).text(formattedNumber);
    });



    //   filters per column wise
    // Function to handle filtering and removing rows
function column_filters(input, data_column) {
    $(input).on("input", function() {
        var value = $(this).val().toLowerCase().trim();
        $(data_column).each(function() {
            var text = $(this).text().toLowerCase();
            var match = text.indexOf(value) > -1;
            $(this).closest('tr').toggle(match); // Toggle visibility of the row
        });
    });
}

// Usage example for transaction_date and debit filters
column_filters(".transaction_date", ".date_data");
column_filters(".debit", ".debit_data");
column_filters(".credit", ".credit_data");
column_filters(".description", ".description_data");
column_filters(".balance", ".balance_data");
column_filters(".attachments", ".attached_data");
column_filters(".account_input", ".account_data");


    
    


// date format
function date_format(date){

    var date_parts = date.split('-');
    var year = date_parts[0];
    var month = date_parts[1];
    var day = date_parts[2];

    return day + '-' + month + '-' + year;
}





$("#refresh_report").click(function(){

  var filter_data = get_filter_from_urls()    
    console.log(filter_data);
    show_filtered_list(filter_data)

})



// Print report

     // Function to generate dynamic table
     function generateprint(data) {
     
        $("#report_print_data").empty()
        $.each(data,function(index,report_data){
            console.log(report_data.date);
            $("#report_print_data").append(`

                    <tr>
                        <td>${report_data.date}</td>
                        <td>${report_data.description ? report_data.description:'' }</td>
                        <td class="debit_data">${report_data.symbol+report_data.debits}</td>
                        <td class="credit_data">${report_data.symbol+report_data.credits}</td>
                        <td class="balance_data">${report_data.symbol+report_data.account_balance}</td>
                    </tr>
                
                `)
        })
       



        var divContents = document.getElementById("table_container").innerHTML;
        var print = window.open('', '');
        print.document.write('<html><head><title>statement_of_account</title>');
        print.document.write('<link rel="stylesheet" href="/assets/vessel/css/printview.css" type="text/css" />');
        print.document.write('<link rel="preconnect" href="https://fonts.googleapis.com" />');
        print.document.write('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />');
        print.document.write(' <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Rasa:wght@500&display=swap" rel="stylesheet" />');
        print.document.write('<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>');
        print.document.write('<script src="/assets/vessel/js/reports/printpreview.js"></script>');
        print.document.write('</head><body>');
        print.document.write(divContents);
        print.document.write('</body></html>');
        print.document.close();

        print.onload = function() {
            print.print();
            print.onafterprint = function() {
                print.close();
            };
        };
        
    }


    function print_report() {
        generateprint(report_print_data);
    }

    

    $('#print_report').click(function(){
        if(report_data_len != 0)
        {
           print_report();
        }
        else{
                notyf.error({
                    message:"Data is not available in report",
                    duration:5000
                });
            
        }
});

    
    
    






})








