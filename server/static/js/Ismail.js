const image_input1 = document.querySelector("#image_input1")
const image_input2 = document.querySelector("#image_input2")
var uploaded_image1 = "";
var uploaded_image2 = "";


image_input1.addEventListener("change", function() {
  const reader = new FileReader()

    reader.addEventListener("load", () => {
        uploaded_image1 = reader.result;
        document.querySelector("#display_image1").style.backgroundImage = `url(${uploaded_image1})`
  })

    reader.readAsDataURL(this.files[0])
})

image_input2.addEventListener("change", function() {
  const reader = new FileReader()

    reader.addEventListener("load", () => {
        uploaded_image2 = reader.result;
        document.querySelector("#display_image2").style.backgroundImage = `url(${uploaded_image2})`
  })

    reader.readAsDataURL(this.files[0])
})

$(function() {
    $('#image_input1').click(function() {
        uploadImage('#upload-image1-form')
    });
    $('#image_input2').click(function() {
        uploadImage('#upload-image2-form')
    });
});

let uploadImage = (formElement) => {
    let form_data = new FormData($(formElement)[0]);
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:5000//uploadImage',
            data: form_data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                console.log('Success!');
            },
        });
}