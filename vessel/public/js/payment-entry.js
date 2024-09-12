$(document).ready(function () {

    var customer_list = []
    var account_lst = []
    var file_list = []
    // Create an instance of Notyf
    var notyf = new Notyf();


    //  set default today date in posting date
    var today = new Date();
    var day = String(today.getDate()).padStart(2, '0');
    var month = String(today.getMonth() + 1).padStart(2, '0');
    var year = today.getFullYear();
    var files = []

    
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
        validation()
        if (!validation()) {
            add_row();
        }

    })


    //======== validation =======
       function validation(){
            $('#posting_date_error').remove();
            $('#company_error').remove();
            $('#mode_of_payment_error').remove();

            var iserror = false;

            if ($("#company").val() == "") {
                $('<span id="company_error" class="error-message">Company is mandatory</span>').insertAfter('#company');
                iserror = true;
            } 
            if ($("#posting_date").val() == "") {
                $('<span id="posting_date_error" class="error-message">Posting Date is mandatory.</span>').insertAfter('#posting_date');
                iserror = true;
            }
            if ($("#mode_of_payment").val() == "") {
                $('<span id="mode_of_payment_error" class="error-message">Mode of Payment is mandatory.</span>').insertAfter('#mode_of_payment');
                iserror = true;
            }

            if (!iserror){
                $(".error-message").remove
            }

            return iserror
       }

        



    function add_row() {
        $("#empty_table").remove()
        var party_id = "party_id" + $('#payment_entry_details tr').length
        var account_id = "account_id" + $('#payment_entry_details tr').length
        var debit_id = "debit_id" + $('#payment_entry_details tr').length
        var credit_id = "credit_id" + $('#payment_entry_details tr').length
        var file_id = "file_id" + $('#payment_entry_details tr').length
        var file_label = "file_label" + $('#payment_entry_details tr').length
        var description = "description"+ $('#payment_entry_details tr').length
        var img_attached = "img_attached" + $('#payment_entry_details tr').length

        $("#payment_entry_details").append(`
            <tr class="payment_row">
                <td class="check"><input type="checkbox" class="checkbox" name="checkbox" /></td>
                <td>
                    <select id="${party_id}" class="party form-select custom-select tab-select">
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
                <td><input type="number" id="${debit_id}" class="form-control debit" value="0"></td>
                <td><input type="number" id="${credit_id}" class="form-control credit" value="0"></td>
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
            
            var customer_name = $(this).val()
            
            if (customer_name == "") {
                 
                 $("#" + account_id).val("Bank Account - UM")
              
            }
            else {
                
                $("#" + account_id).val("Debtors - UM")
             
            }

        })


        $("#" + file_id).change(function () {
            var file_data = $(this)[0].files
            
            $("#"+img_attached).html(file_data[0].name.substring(0, 15) + '...')
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

    //get company
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
               
                console.dir(xhr); 

            }
        })
    }




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



    // set default company in company field
    setTimeout(() => {
        $("#company").val($("#default_company").html())
    }, 300);

    $("#save").click(function () {
        var form_data_list = $('form').serializeArray();
        var form_data = {};
        $.each(form_data_list, function (index, field) {

            form_data[field.name] = field.value;
        });

      
        
        if(!validation())
        {


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
                handleUploadSuccess({ message: { file_url: $("#img_attached"+index+" a").text() } }, index);
            }
        }

        function handleUploadSuccess(response, index) {
            // Check if response.message is valid
            if (response.message && typeof response.message.file_url === 'string' && response.message.file_url != "") {
                
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
            account_lst = [];
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
                account_lst.push({
                    'party_type': partytype,
                    'party': partyvalue,
                    'account': accountvalue,
                    'debit_in_account_currency': debit,
                    'credit_in_account_currency': credit,
                    'user_remark': description,
                    'custom_attachments': custom_attachments
                });
            }

            form_data["accounts"] = account_lst;
            console.log(account_lst);
            create_payment_entry(form_data);
        }


    
        }

        
    })

    function create_payment_entry(form_data) {
        $(".overlay").show()
        $(".overlay-content").text("Please Wait....")
        $.ajax({
            url: "/api/resource/Journal Entry",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(form_data),
            success: function (data) {
                
                notyf.success({
                    message: "Payment Entry created successfully",
                    duration: 5000
                })
                setTimeout(() => {
                    $(".overlay").hide()
                    window.location.href = "/accounts/payment-entry/" + data.data.name
                }, 1500);


            },
            error: function (xhr, status, error) {
                $(".overlay").hide()
                console.dir(xhr); // Print the XHR object for more details
                if (xhr.responseJSON.exc_type == "DuplicateEntryError") {
                    notyf.error({
                        message: "customer already added",
                        duration: 5000
                    })
                }
                else {
                    console.dir(xhr);
                    var error_msg = xhr.responseJSON.exception.split(":")[1]
                    
                    if(error_msg == " Accounts table cannot be blank.")
                    {
                        notyf.error({
                            message: "Please fill all mandatory fields in the table.",
                            duration: 5000
                        });
                    }
                    else
                    {
                        notyf.error({
                            message: error_msg,
                            duration: 5000
                        });
                    }
                }
            }
        })
    }


})