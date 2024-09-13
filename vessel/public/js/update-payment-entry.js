$(document).ready(function () {

    var customer_list = []
    var new_account_lst = []
    var old_account_lst = []
    var diff_account_lst = []
    var old_form_data = []
    var file_list = []
    var currency
    var party_name
    var files = []
    var printentry_data = []
    var printentry_single_data = []
    var currency_symbol
    var updated_form_data = {}; //updated data form
    // Create an instance of Notyf
    var notyf = new Notyf();
    var url = window.location.href
    var payment_entry_id = url.substring(url.lastIndexOf('/') + 1).replaceAll("%20", " "); //payment entry id


    //  set default today date in posting date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();

    //format year-month-date
    var today_date = year + '-' + month + '-' + day;
    $('#posting_date').val(today_date); //set today date


    // click on checkall to check checkboxes
    $(document).on("click", ".checkall", function () {
        var isChecked = $(this).prop("checked");
        $(".checkbox").each(function () {
            $(this).prop("checked", isChecked);
        });
    })

    // onclick delete row get checked checkbpx
    $("#delete_row").click(function () {
        $('.checkbox').each(function () {
            // remove only checked checkbox
            if ($(this).prop("checked")) {
                $(this).parent().parent().remove()
            }
        });
        $(".checkall").prop("checked", false); //uncheck main checkbox

        if ($("#payment_entry_details tr").length == 0) {
            $("#payment_entry_details").append(`<tr id="empty_table"></tr>`)
        }

    })

    $("#add_new_row").click(function () {
        $('#posting_date_error').remove();
        $('#company_error').remove();
        
        if ($("#company").val() == "") {
            $('<span id="company_error" class="error-message">Please enter company name.</span>').insertAfter('#company');
        }
        else if ($("#posting_date").val() == "") {
            $('<span id="posting_date_error" class="error-message">Please enter company name.</span>').insertAfter('#posting_date');
        }
        else {
            $('#company_error').remove();
            $('#posting_date_error').remove();
            add_row()
        }

    })

    function add_row() {
        $("#empty_table").remove()
        var party_id = "party_id" + $('#payment_entry_details tr').length
        var account_id = "account_id" + $('#payment_entry_details tr').length
        var debit_id = "debit_id" + $('#payment_entry_details tr').length
        var credit_id = "credit_id" + $('#payment_entry_details tr').length
        var file_id = "file_id" + $('#payment_entry_details tr').length
        var file_id = "file_id" + $('#payment_entry_details tr').length
        var file_label = "file_label" + $('#payment_entry_details tr').length
        var description = "description" + $('#payment_entry_details tr').length
        var img_attached = "img_attached" + $('#payment_entry_details tr').length

        $("#payment_entry_details").append(`
            <tr>
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select id="${party_id}" class="party form-select custom-select form-control tab-select">
                        <option></option>
                     </select>
                </td>
                <td>
                     <select id=${account_id} class="account_type form-select custom-select tab-select" disabled="true">
                        <option></option>
                        <option value="Debtors - UM">Debtors - UM</option>
                        <option value="Bank Account - UM" selected>Bank Account - UM</option>
                       
                     </select>
                </td>
                <td><input type="number" id="${debit_id}" class="form-control debit numbers" value="0"></td>
                <td><input type="number" id="${credit_id}" class="form-control credit numbers" value="0"></td>
                <td><input type="text" id="${description}" class="form-control description"></td>
                <td>
                 <div class="d-flex align-items-center">
                    <label class="d-flex align-items-center w-100">
                            <div class="" id=${file_label}><img src="/assets/vessel/files/images/attach-image.png" class="mr-2"></div>
                        </lable>
                        <input type="file" class="form-control choose-file" id="${file_id}">
                        
                    
                    <div id="${img_attached}">
                    </div>
                    </div>
                </td>
                
            </tr>
            `)


        $.each(customer_list, function (i, customer) {
            $("#" + party_id).append(`<option value="${customer.name}"> ${customer.customer_name} - ${customer.name}</option>`)
        })

        $("#" + party_id).change(function () {
            // $("#" + account_id).empty()
            var customer_name = $(this).val()

            if (customer_name == "") {
                 
                $("#" + account_id).val("Bank Account - UM")
               
           }
           else {
               
               $("#" + account_id).val("Debtors - UM")
            
           }

        })


        $("#" + file_id).change(function () {
            document.getElementById(file_id).innerText=""
            var file_data = $(this)[0].files
            
            $("#" + img_attached).text(file_data[0].name.substring(0, 15) + '...')
            
            
            if (files.length === 0) {
                files.push({ [file_id]: file_data });
            } else {
                var fileexists = false;
                $.each(files, function (i, data) {
                    if (data[file_id]) {

                        files[i][file_id] = file_data;
                        fileexists = true;
                        return false;
                    }
                });

                if (!fileexists) {
                    files.push({ [file_id]: file_data });
                    
                }
            }


        })



    }



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


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    
    function get_customer_details(customer) {
        $.ajax({
            url: "/api/resource/Customer/"+customer,
            type: "GET",
            dataType: "json",
            success: function (data) {
               console.log(data);
               party_name = data.data.customer_name


            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details
            }
        })
    }

    //get company
    get_company()
    function get_company() {

        $.ajax({
            url: "/api/resource/Company",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                limit_page_length: "None"
            },
            success: function (data) {
                var company = data.data
                $.each(company, function (i, company) {
                    $("#company").append(`<option value="${company.name}">${company.name}</option>`)
                })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

    //get mode of payment
    get_mode_of_payment()
    function get_mode_of_payment() {

        $.ajax({
            url: "/api/resource/Mode of Payment",
            type: "GET",
            dataType: "json",
            data: {
                fields: JSON.stringify(["name"]),
                filters: JSON.stringify([["enabled", "=", "1"]]),
                limit_page_length: "None"
            },
            success: function (data) {
                var company = data.data
                $.each(company, function (i, payment_mode) {
                    $("#mode_of_payment").append(`<option value="${payment_mode.name}">${payment_mode.name}</option>`)
                })
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })
    }

     //get currency icon
     
     function get_currency(currency) {
 
         $.ajax({
             url: "/api/resource/Currency/"+currency,
             type: "GET",
             dataType: "json",
             success: function (data) {
                
                  currency_symbol = data.data.symbol
                  
             },
             error: function (xhr, status, error) {
                 // Handle the error response here
                 console.dir(xhr); // Print the XHR object for more details
 
             }
         })
     }

     setTimeout(() => {
        $(document).on('input change', 'input, change', function () {
          
            $("#submit").remove();
            $("#save").remove();
            $(".action-btn-group").append('<button class="btn save-btn" id="save">Save</button>');
            
        });   
     }, 2000);
     



    // get payment entry details fromjournal entry
    $.ajax({
        url: "/api/resource/Journal Entry/" + payment_entry_id,
        type: "GET",
        dataType: "json",

        success: function (data) {
            
            var payment_entry = data.data
            console.log(payment_entry);
            currency = payment_entry.total_amount_currency
            
            get_currency(currency)
            

            $("#page_title").html(payment_entry.title)
            $("#company").val(payment_entry.company)
            $("#mode_of_payment").val(payment_entry.mode_of_payment)
            $("#posting_date").val(payment_entry.posting_date)
            $("#total_debit").val(payment_entry.total_debit)
            $("#total_credit").val(payment_entry.total_credit)

            if (payment_entry.docstatus == 1) {
                $("#save").remove()
                $("#delete").hide()
                $(".action-btn-group").append(`<button class="btn btn-cancel" id="cancel">Cancel</button>`)
                // for not woring on child table to set settimeout
                setTimeout(() => {
                    $('form').find('input, textarea, select').prop('disabled', true);
                }, 50);
                $("#add_new_row").css({ "pointer-events": "none", "opacity": "0.5" })
                $("#delete_row").css({ "pointer-events": "none", "opacity": "0.5" })
            }

            if (payment_entry.docstatus == 2) {
                // for not woring on child table to set settimeout
                setTimeout(() => {
                    $('form').find('input, textarea, select').prop('disabled', true);
                }, 50);
                $("#save").remove()
                $("#delete").hide()
                $("#add_new_row").css({ "pointer-events": "none", "opacity": "0.5" })
                $("#delete_row").css({ "pointer-events": "none", "opacity": "0.5" })
            }

            if (payment_entry.docstatus == 0) {
                $("#save").remove()
                $(".action-btn-group").append(`<button class="btn btn-submit" id="submit">Submit</button>`)

            }

            old_account_lst = []
            printentry_data = []
            $.each(payment_entry.accounts, function (index, account) {
               
          

                add_row()
                setTimeout(() => {
                   

                    var debit_amount = currency_symbol+account.debit
                    var credit_amount = currency_symbol+account.credit
                

                    if (account.party != "") {
                        $("#party_id" + index).val(account.party).change()
                    }
                    $("#account_id" + index).val(account.account)
                    $("#debit_id" + index).val(account.debit)
                    $("#credit_id" + index).val(account.credit)
                    $("#description" + index).val(account.user_remark)
                    if (account.custom_attachments) {
                        $("#img_attached" + index).html(`<a href='${account.custom_attachments}' data-fileurl="${account.custom_attachments}">${account.custom_attachments.substring(0, 10) + '...'}</a> `)
                    }

                    // get currency symbol
                    get_currency(account.account_currency)
                                       

                    printentry_data.push({
                        'account': account.account,
                        'debit_in_account_currency': account.debit,
                        'credit_in_account_currency': account.credit,
                        'user_remark': account.user_remark,
                        'currency_icon':currency_symbol
                    });

                    if(account.party){
                        get_customer_details(account.party)
                        setTimeout(() => {
                            console.log(party_name);
                            $("#party_name").text(party_name)
                        }, 50);
                    }

                }, 200);


                // old account list
                old_account_lst.push({
                    'party_type': payment_entry.party_type,
                    'party': payment_entry.party,
                    'account': payment_entry.account,
                    'debit_in_account_currency': payment_entry.debit,
                    'credit_in_account_currency': payment_entry.credit,
                    'user_remark': payment_entry.user_remark,
                    'custom_attachments': payment_entry.custom_attachments
                });

               


            })

            
            



            var old_form_data_list = $('form').serializeArray();

            $.each(old_form_data_list, function (index, field) {

                old_form_data[field.name] = field.value;
            });



        },
        error: function (xhr, status, error) {
            // Handle the error response here
            console.dir(xhr); // Print the XHR object for more details

        }
    })


    // click to clier remove attachments
    $(document).on("click", ".clear", function () {

        
        var file_url = $(this).data("clear")

        $("#"+$(this).parent().attr("id")).html("")

        $.ajax({
            url: "/api/method/vessel.api.account.delete_file",
            type: "DELETE",
            dataType: "json",
            data: {
               "file_url":JSON.stringify(file_url),
               "payment_entry_id":JSON.stringify(payment_entry_id),
            },
            success: function (data) {
                console.log(data);
               
            },
            error: function (xhr, status, error) {
                // Handle the error response here
                console.dir(xhr); // Print the XHR object for more details

            }
        })

    })


    $(document).on("input", ".debit", function () {
        let total_debit = 0
        $(".debit").each(function (index, data) {
            let value = parseFloat(data.value);
            total_debit += isNaN(value) ? 0 : value;
        });
        $("#total_debit").val(total_debit)
    });

    $(document).on("input", ".credit", function () {
        let total_credit = 0;
        $(".credit").each(function (index, data) {
            let value = parseFloat(data.value);
            total_credit += isNaN(value) ? 0 : value;
        });
        $("#total_credit").val(total_credit);
    });



    $(document).on("click", "#save", function () {

       
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });

        // Compare old form data with current form data and store updated fields
        $.each(form_data, function (key, value) {

            if (old_form_data[key] !== value) {
                updated_form_data[key] = value;
            }
        });

        


        // counter to track upload image or not
        var uploadcompleted = 0;

        // init uploadfile and file_list
        var uploadedFileUrls = [];
        var file_list = []; 


                
        $('#payment_entry_details tr').each(function (index) {
            let file_id = 'file_id' + index; // Generate file_id like 'file_id0', 'file_id1', etc.

            // Check if there's a file associated with the current row
            let foundFile = files.find(file => file[file_id]);

            if (foundFile) {
                uploadFile(foundFile[file_id][0], index);
            } else {
                // Call uploadFile with null or undefined to handle the case where no file is found
                uploadFile(null, index);
            }
        });

        // Upload file function
        function uploadFile(file, index) {
            $(".overlay").show();
            $(".overlay-content").html("Please Wait....");

            // Check if a file is provided
            if (file) {
                var file_data = new FormData();
                file_data.append("file", file);
                file_data.append("file_name", file.name);
                file_data.append("file_url", "/files/" + file.name);

                $.ajax({
                    url: "/api/method/upload_file",
                    type: "POST",
                    processData: false,
                    contentType: false,
                    data: file_data,
                    success: function (response) {
                        handleUploadSuccess(response, index);
                    },
                    error: function (xhr, status, error) {
                        console.dir(xhr);
                        handleUploadError(index);
                    }
                });
            } else {
                // Handle the case where no file is provided
                handleUploadSuccess({ message: { file_url: $("#img_attached"+index+" a").data("fileurl") } }, index);
            }
        }

        function handleUploadSuccess(response, index) {
            // Check if response.message is valid
            if (response.message && typeof response.message.file_url === 'string') {
                $("#img_attached" + index).html(`<a href="${response.message.file_url}" data-fileurl="${response.message.file_url}">${response.message.file_url.substring(0, 10) + '...'}</a>`);
                file_list.push(response.message);
                uploadedFileUrls.push(response.message.file_url);
            } else {
                console.error("Invalid response:", response);
            }

            // Increment uploadcompleted
            uploadcompleted++;

            // Check if all uploads are complete
            if (uploadcompleted === $('#payment_entry_details tr').length) {
                updateAccountsData();
            }
        }

        function handleUploadError(index) {
            // Handle error appropriately, increment uploadcompleted
            uploadcompleted++;

            // Check if all uploads are complete
            if (uploadcompleted === $('#payment_entry_details tr').length) {
                updateAccountsData();
            }
        }

        function updateAccountsData() {
            // Prepare updated account details object
            new_account_lst = [];
            $('#payment_entry_details tr').each(function (index) {
                var partyvalue = $("#party_id" + index).val();
                var accountvalue = $("#account_id" + index).val();
                var debit = $("#debit_id" + index).val();
                var credit = $("#credit_id" + index).val();
                var description = $("#description" + index).val();
                var img_attached = $('#img_attached' + index + ' a').data('fileurl');

                console.log(description);

                if (img_attached !== "") {
                    create_account_lst("Customer", partyvalue, accountvalue, debit, credit, description, img_attached);
                } else {
                    create_account_lst("", partyvalue, accountvalue, debit, credit, description, img_attached);
                }
            });

            function create_account_lst(partytype, partyvalue, accountvalue, debit, credit,description, custom_attachments) {
                new_account_lst.push({
                    'party_type': partytype,
                    'party': partyvalue,
                    'account': accountvalue,
                    'debit_in_account_currency': debit,
                    'credit_in_account_currency': credit,
                    'user_remark': description,
                    'custom_attachments': custom_attachments
                });
            }

            updated_form_data["accounts"] = new_account_lst;
            console.log(new_account_lst);
            update_payment_entry(updated_form_data);
        }

    })

   

    $(document).on("click", "#submit", function () {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        updated_form_data = { "docstatus": 1 }
        update_payment_entry(updated_form_data)
    })

    $(document).on("click", "#cancel", function () {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        updated_form_data = { "docstatus": 2 }
        update_payment_entry(updated_form_data)
    })





    function update_payment_entry(updated_form_data) {
        $('#overlay').show();
        $.ajax({
            url: "/api/resource/Journal Entry/" + payment_entry_id,
            type: "PUT",
            dataType: "json",
            data: JSON.stringify(updated_form_data),
            success: function (data) {
                
                notyf.success({
                    message: "Payment Entry update successfully",
                    duration: 5000
                })
                setTimeout(() => {
                    window.location.reload()
                    $(".overlay").hide()
                }, 1500);

            },
            error: function (xhr, status, error) {
                console.dir(xhr)
                $('.overlay').hide();
                var error_msg = xhr.responseJSON.exception.split(":")[1]
                    console.log(error_msg);

                    notyf.error({
                        message: error_msg,
                        duration: 5000
                    });
            }
        })
    }


    $("#delete").click(function(){
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")   
    
        // delete file
        $.ajax({
        url: "/api/resource/Journal Entry/"+payment_entry_id,
        type: "DELETE",
        dataType: "json",
        
        success: function (data) {
            console.log(data);
            notyf.success({
                message: "Deleted record  successfully",
                duration: 5000
            })
            setTimeout(() => {
                    window.location.href = "/accounts/payment-entry"
                    $(".overlay").hide()
            }, 1500);
    
        },
        error: function (xhr, status, error) {
            $(".overlay").hide()
            
            // Handle the error response here
            console.dir(xhr); // Print the XHR object for more details
            var error_msg = xhr.responseJSON.exception.split(":")[1]
            console.log(error_msg);         
                    
            notyf.error({
                message:error_msg,
                duration:5000
            });
            
        }
    })
    })


    // date format
    function date_format(date){

        var date_parts = date.split('-');
        var year = date_parts[0];
        var month = date_parts[1];
        var day = date_parts[2];

        return day + '-' + month + '-' + year;
    }






// Print report

     // function to generate dynamic table
     function generateprint(data) {
        
        $("#printentry_data").empty()
        
        $.each(data,function(index,report_data){
           
            $("#printentry_data").append(`
                    <tr>${printentry_single_data}</tr>
                    <tr>
                        
                        
                        <td>${report_data.account ? report_data.account:'' }</td>
                        <td>${report_data.debit_in_account_currency ? report_data.currency_icon + report_data.debit_in_account_currency:report_data.currency_icon+'0' }</td>
                        <td>${report_data.credit_in_account_currency ? report_data.currency_icon + report_data.credit_in_account_currency:report_data.currency_icon+'0' }</td>
                        <td>${report_data.user_remark ? report_data.user_remark:'' }</td>
                        
                    </tr>
                
                `)

           
        })
      
       


        var divContents = document.getElementById("table_container").innerHTML;
        var print = window.open('', '');
        print.document.write('<html><head><title>'+payment_entry_id+'</title>');
        print.document.write('<link rel="stylesheet" href="/assets/vessel/css/printview.css" type="text/css" />');
        print.document.write('<link rel="preconnect" href="https://fonts.googleapis.com" />');
        print.document.write('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />');
        print.document.write(' <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Rasa:wght@500&display=swap" rel="stylesheet" />');
        print.document.write('<script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>');
        print.document.write('<script src="/assets/vessel/js/paymententryprint.js"></script>');
        print.document.write('</head><body>');
        print.document.write(divContents);
        print.document.write('</body></html>');
        print.document.close();

        print.onload = function() {
            setTimeout(() => {
                print.print();
            }, 10);
            print.onafterprint = function() {
                print.close();
            };
        };
        
    }


    function print_entry() {
        generateprint(printentry_data);
    }

    

    $('#print_entry').click(function(){
             // get currency symbol
             get_currency(currency)
             console.log(currency_symbol);
             
             $("#entry_date").html(date_format($("#posting_date").val()))
             $("#modeofpayment").html($("#mode_of_payment").val())
             $("#totaldebit").html(currency_symbol+$("#total_debit").val())
             $("#totalcredit").html(currency_symbol+$("#total_credit").val())

            setTimeout(() => {
                print_entry();
            }, 100);

    });





   


})