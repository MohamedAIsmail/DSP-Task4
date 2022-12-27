let Image1_Magnitude_path = "../static/assets/Image1_Magnitude.jpg"
let Image2_Phase_path = "../static/assets/Image2_Phase.jpg"
let OutputImage_path = "../static/assets/Output.jpg"

let Image1_Magnitude = document.getElementById("magCanvas")
let Image2_Phase = document.getElementById("phaseCanvas")
let OutputImage = document.getElementById("outputCanvas")


const image_input1 = document.querySelector("#image_input1")
const image_input2 = document.querySelector("#image_input2")
var uploaded_image1 = "";
var uploaded_image2 = "";


image_input1.addEventListener("change", function(e) {
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
let is_uploaded1 = false
let is_uploaded2 = false
$(function() {
    $('#image_input1').change(function () {
        is_uploaded1 = true
        uploadImage('#upload-image1-form')
        update_element(Image1_Magnitude, Image1_Magnitude_path)
        if (is_uploaded1 && is_uploaded2) {
            update_element(OutputImage, OutputImage_path)
        }
    });
    $('#image_input2').change(function() {
        uploadImage('#upload-image2-form')
        is_uploaded2 = true
        update_element(Image2_Phase, Image2_Phase_path)
    
        if (is_uploaded1 && is_uploaded2) {
            update_element(OutputImage, OutputImage_path)
        }
    
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


//function that takes the element and a url, and updates it 
let update_element = (imgElement, imgURL) => {
    // create a new timestamp 
    setTimeout(() => {

        let timestamp = new Date().getTime();
        let queryString = "?t=" + timestamp;
        imgElement.style.backgroundImage = "url(" + imgURL + queryString + ")";
    }, 800)
}