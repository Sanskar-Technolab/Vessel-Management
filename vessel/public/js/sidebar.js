$(document).ready(function () {

  


  
   // set sidebar state in localStorage
   function setSidebarState(isCollapsed) {
        localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
    }

    // Function to get sidebar state from localStorage
    function getSidebarState() {
        return localStorage.getItem('sidebarState');
    }

    // Apply the saved state on page load
    if (getSidebarState() === 'collapsed') {
        $('#sidebar, .sidebar-header, .breadcrumbs, li').addClass('active sidebar-icon collapse-header collapse-breadcrumbs');
    }

    // Toggle sidebar on button click
    $('#sidebarcollapse').click(function () {
        $('#sidebar, li, .sidebar-header, .breadcrumbs').toggleClass('active sidebar-icon collapse-header collapse-breadcrumbs');
        setSidebarState($('#sidebar').hasClass('active'));
    });


    // responsive
    if($(window).width() < 1024)
    {
        $('.collapse-icon').hide()
        $('#sidebar').toggleClass('active');

    }

    $('#sidebar ul li').click(function() {
        // remove active-page class
        $('#sidebar ul li').removeClass('active-page');
        
        // add active-page class in clicked menu
        $(this).addClass('active-page');
        
        //set id in localstorage for set active class
        localStorage.setItem('activemenu', $(this).index());
        });

        //on page load to get 
        var activeindex = localStorage.getItem('activemenu');
        if (activeindex!== null) {
                $('#sidebar ul li').eq(activeindex).addClass('active-page');
                }




});
