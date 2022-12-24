// var image = new Image();
let canvas = document.getElementById('canvas');
// let btn = document.getElementById('btn')
let context = canvas.getContext('2d');

let canvas_width = canvas.width;
let canvas_height = canvas.height;

let startX, startY
let shapes = [];
let current_shape_index 
shapes.push({type:'rect', x:50, y:50 , width:100, height:100, color:'yellow'})
// shapes.push({type:'elipse', x:50, y:50 , radiusX:35, radiusY:50, color:'green'})
shapes.push({type:'elipse', x:50, y:50 , radiusX:35, radiusY:50, color:'green'})

let draw = (shape)=>{
    context.fillStyle = shape.color;
    if(shape.type == 'rect'){
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
    else if(shape.type == 'elipse'){
        context.beginPath();
        context.ellipse(shape.x, shape.y, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
        context.fill();}
}

let draw_shapes = ()=>{
    context.clearRect(0, 0, canvas_width, canvas_height)
    context.globalAlpha = 0.5
    for(let shape of shapes){
        draw(shape)
    }
}

draw_shapes()

let is_mouse_in_shape = (startX, startY, shape)=> {
    let shape_left = shape.x
    let shape_right = shape.x + shape.width
    let shape_top = shape.y
    let shape_bottom = shape.y + shape.height
    if(startX > shape_left && startX < shape_right &&
        startY > shape_top && startY < shape_bottom){
            return true;
        }
    return false;
}

let mouse_down = (event)=>{
    event.preventDefault();
    startX = parseInt(event.clientX);
    startY = parseInt(event.clientY);

    let index = 0
    for(let shape of shapes){
        
        if(is_mouse_in_shape(startX, startY, shape)){
            current_shape_index = index;
            console.log(current_shape_index)
        }
        // console.log('yes')

        index++;    
    }

}

canvas.onmousedown = mouse_down;
































// // image.src = "https://image3.mouthshut.com/images/ImagesR/imageuser_m/2017/11/925747536-4559193-1.png?rnd=38062" ; 
// // canvas.width = image.width
// // canvas.height = image.height;
// image.style.width = canvas.width
// image.style.hieght = canvas.height
// // ctx.drawImage(image,0,0);
// let startPoint, endPoint, currentPosition
// function cropImg(startPoint, endPoint){
    
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     let width = endPoint.x - startPoint.x
//     let hieght = endPoint.y - startPoint.y
//     // image.onload = function(){
//         ctx.drawImage(image, startPoint.x, startPoint.y, width, hieght, startPoint.x, startPoint.y, width, hieght);
//         // canvas.width = 500
//         // canvas.height = 300
//     // }
// }

// // btn.addEventListener('click', cropImg)


// function getMousePos(canvas, evt) {
//     var rect = canvas.getBoundingClientRect();
//     return {
//         x: evt.clientX - rect.left,
//         y: evt.clientY - rect.top
//     };
// }

// canvas.addEventListener('mousedown', function(evt) {
//     ctx.drawImage(image,0,0);
//     startPoint = getMousePos(canvas, evt);
//     console.log('Mouse position: ' + startPoint.x + ',' + startPoint.y);
//     }, false);

//     canvas.addEventListener('mouseup', function(evt) {
//     endPoint = getMousePos(canvas, evt);
//     console.log('Mouse position: ' + endPoint.x + ',' + endPoint.y);
//     cropImg(startPoint, endPoint)
//     }, false);