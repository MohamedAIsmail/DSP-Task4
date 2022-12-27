let Image1_Magnitude_path = "../static/assets/Image1_Magnitude.jpg"
let Image2_Phase_path = "../static/assets/Image2_Phase.jpg"

let Image1_Magnitude = document.getElementById("magCanvas")
let Image2_Phase = document.getElementById("phaseCanvas")

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

$(function() {
    $('#image_input1').change(function() {
        uploadImage('#upload-image1-form')
        setTimeout(() => {
            update_element(Image1_Magnitude, Image1_Magnitude_path)
        }, 500);
    });
    $('#image_input2').change(function() {
        uploadImage('#upload-image2-form')
        setTimeout(() => {
            update_element(Image2_Phase, Image2_Phase_path)
        }, 500);
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
	 let timestamp = new Date().getTime();  
	 let queryString = "?t=" + timestamp;    
     imgElement.style.backgroundImage = "url(" + imgURL + queryString + ")" ;
}