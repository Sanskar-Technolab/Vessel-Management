$(document).ready(function(){
 
    

    $("#upload-image").change(function() {
        previewimage(this);
    });

    // preview image 
    function previewimage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview').css('background-image', 'url('+e.target.result +')');
                $('#image-preview').hide();
                $('#image-preview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }


   //show and hide password in password field
  $(".show-hide-password").click(function () {
    const passwordfield = $(".password");
    const passwordfield_type =
      passwordfield.attr("type") === "password" ? "text" : "password";
    passwordfield.attr("type", passwordfield_type);

    $(this).text(passwordfield_type === "password" ? "show" : "hide");
  });
    
})