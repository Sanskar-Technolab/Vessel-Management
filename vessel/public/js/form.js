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


   
    
})