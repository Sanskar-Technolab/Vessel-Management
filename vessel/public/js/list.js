

$(document).ready(function () {

    
    
    window.selected_list = []; //for store selected id for bulk delete

    


    $(".pagination .page-item:nth-child(2)").addClass("active")

    // pagination active class change
    $('.pagination .page-item').click(function () {
        $('.pagination .page-item').toggleClass('active');
        // $(this).addClass('active');

    })

    // next button click
    $(".next-btn,.previous-btn").click(function(){
           uncheck()  //uncheck check box move next page
           get_checked_data()  // get checked checkbox details
    })

    // page number click event
    $(document).on('click', '.page-num', function() {
         uncheck()  //uncheck check box move next page
        get_checked_data()  // get checked checkbox details
    })



    // uncheck checkall checkbox for move next and previous and another page
    function uncheck() {
        $('.checkall').prop("checked", false)
    }


    // check all checkbox on click one checkboc
    $(".checkall").click(function () {
        var isChecked = $(this).prop("checked");
        console.log(isChecked);
        $(".check").each(function () {
            $(this).prop("checked", isChecked);
        });
        updatecheck()

    });


    

    $(document).on("click", ".check", function () {
       // Get the checkboxes id
       var checkboxId = $(this).attr("id");

       // Toggle the checked the checkbox
       var isChecked = $(this).prop("checked");

       if (isChecked) {
           // If the checkbox is checked and id is not in list 
           if (!selected_list.includes(checkboxId)) {
            selected_list.push({ id: checkboxId, checked: isChecked });
           }
       }
        else
        {
            
           $.each(selected_list,function (index,id) {
                if(id.id === checkboxId)
                {
                    selected_list.splice(index, 1);
                    return false //for breaking a loop
                }
            });
        }

        allcheck_remove()
    
      
    });




    // update the checked or unchecked item in selected list
    function updatecheck() {
        
        // For each checkbox with class "check"
        $(".check").each(function (index) {
            var checkboxId = $(this).attr("id");
            var isChecked = $(this).prop("checked");
            if(isChecked == true)
            {
                if (!selected_list.some(item => item.id === checkboxId)) {
                    // if not in list than push checkbox id in list
                    selected_list.push({ id: checkboxId, checked: isChecked });
                }
            }
            else{
               // If the checkall checkbox is unchecked
                for (let i = 0; i < selected_list.length; i++) {
                    if (selected_list[i].id === checkboxId) {
                        selected_list.splice(i, 1); // Remove the object with matching id
                        break; // breaking the loop
                    }
                }
            }
            console.log(selected_list)
        });
    }


    // get checkbox id from list and if true then checked checkbox
    function get_checked_data() {
        setTimeout(() => {
            

            // Check if storedList is not null or undefined
            if (selected_list) {
                // For each item in the stored list
                selected_list.forEach(function (item) {
                    // Escape the id for use id with special character
                    var escapedId = $.escapeSelector(item.id);

                    // Get the checkbox by escaped id
                    var checkbox = $("#" + escapedId);

                    // If checkbox found, update its state
                    if (checkbox.length > 0) {
                        checkbox.prop("checked", item.checked);
                    }
                });
                allcheck_remove()

                console.log(selected_list)
            }
        }, 200)
    }

   
    function allcheck_remove(){
        var allChecked = true;
        $(".check").each(function () {
            if (!$(this).prop("checked")) {
                allChecked = false;
                return false; // Break out of the loop early
            }
        });

        // Update the 'Check All' checkbox state
        $(".checkall").prop("checked", allChecked);
    }

    
    


})


