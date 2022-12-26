// var image = new Image();
let canvas = document.getElementById('canvas');
// let btn = document.getElementById('btn')
let context = canvas.getContext('2d');

let canvas_width = canvas.width;
let canvas_height = canvas.height;

let startX, startY
let shapes = [];
let current_bullet_points 
let current_shape_index 
let is_dragging = false
let offset_x, offset_y
shapes.push({type:'ellipse', x:50, y:50 , Rx:35, Ry:50, color:'green'})

shapes.push({type:'rect', x:50, y:50 , width:100, height:100, color:'green'})


// shapes.push({type:'elipse', x:50, y:50 , radiusX:35, radiusY:50, color:'green'})

const select_shape = (shape) => {
    if(shape.type == 'rect'){
    context.strokeRect(shape.x, shape.y, shape.width, shape.height);
    
    }
    else{
        context.strokeRect(shape.x - shape.Rx, shape.y - shape.Ry, 2*shape.Rx, 2*shape.Ry);
    }
    let bullet_points
    context.fillStyle = 'yellow';
    context.globalAlpha = 0.8

        if(shape.type == 'rect'){
            bullet_points = [{side:'left', x:shape.x - 2, y:shape.y + 0.5* shape.height},
                            {side:'right', x:shape.x + shape.width + 2, y:shape.y + 0.5*shape.height},
                            {side:'top', x:shape.x + 0.5*shape.width, y:shape.y - 2},
                            {side:'bottom', x:shape.x + 0.5*shape.width, y:shape.y + shape.height + 2}]
        }
        else{
            bullet_points = [{side:'left', x:shape.x - shape.Rx - 2, y:shape.y},
                            {side:'right', x:shape.x + 2 + shape.Rx, y:shape.y},
                            {side:'top', x:shape.x, y:shape.y - shape.Ry - 2},
                            {side:'bottom', x:shape.x, y:shape.y + shape.Ry + 2}]
        }
        for(let bullet_point of bullet_points){
        context.beginPath();
        context.ellipse(bullet_point.x, bullet_point.y, 5, 5, 0, 0, 2 * Math.PI)
        context.fill();;
        }
        current_bullet_points = bullet_points;
};

let get_offset = ()=> {
    let canvas_offset = canvas.getBoundingClientRect();
    offset_x = canvas_offset.left
    offset_y = canvas_offset.top
}

get_offset()

let draw = (shape)=>{
    context.fillStyle = shape.color;
    if(shape.type == 'rect'){
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
    else if(shape.type == 'ellipse'){
        context.beginPath();
        context.ellipse(shape.x, shape.y, shape.Rx, shape.Ry, 0, 0, 2 * Math.PI);
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
    let shape_left, shape_right, shape_top, shape_bottom
    if(shape.type == 'ellipse'){
    shape_left = shape.x - shape.Rx
    shape_right = shape.x + shape.Rx
    shape_top = shape.y - shape.Ry
    shape_bottom = shape.y + shape.Ry
        }
    else{
        shape_left = shape.x 
        shape_right = shape.x + shape.width
        shape_top = shape.y 
        shape_bottom = shape.y + shape.height
    }
    

    if(startX > shape_left && startX < shape_right &&
        startY > shape_top && startY < shape_bottom){
            return true;
        }
    return false;
}

let mouse_down = (event)=>{
    event.preventDefault();
    startX = parseInt(event.clientX - offset_x);
    startY = parseInt(event.clientY - offset_y);

    let index = 0
    for(let shape of shapes){
        
        if(is_mouse_in_shape(startX, startY, shape)){
            current_shape_index = index;
            is_dragging = true
            draw_shapes()
            select_shape(shapes[current_shape_index])
            
        }
        // else{
        //     draw_shapes()
        // }

        index++;    
    }
    

}


let mouse_up = (event)=> {
    if(!is_dragging){
        return
    }
    event.preventDefault();
    draw_shapes()
    select_shape(shapes[current_shape_index])
    is_dragging = false;
}


let mouse_out = (event)=> {
    if(!is_dragging){
        return
    }
    event.preventDefault();
    is_dragging = false;

}

let mouse_move = (event)=> {
    if(!is_dragging){
        return
    }
    event.preventDefault();
    let mouseX = parseInt(event.clientX - offset_x);
    let mouseY = parseInt(event.clientY - offset_y);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let current_shape = shapes[current_shape_index]
    current_shape.x += dx;
    current_shape.y += dy;

    draw_shapes()
    select_shape(shapes[current_shape_index])
    startX = mouseX
    startY = mouseY
}


canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;


























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