// var image = new Image();
let canvas1 = document.getElementById('magCanvas');
let canvas2 = document.getElementById('phaseCanvas');
// let btn = document.getElementById('btn')
let context1 = canvas1.getContext('2d');
let context2 = canvas2.getContext('2d');
let rect1  = document.getElementById('rect1')
let rect2  = document.getElementById('rect2')
let ellipse1  = document.getElementById('ellipse1')
let ellipse2  = document.getElementById('ellipse2')
let del1  = document.getElementById('del1')
let del2  = document.getElementById('del2')

// let canvas_width = canvas.width;
// let canvas_height = canvas.height;

let startX, startY
let shapes1 = [];
let shapes2 = [];
let current_bullet_points = []
let current_shape_index 
let is_dragging = false
let scaling_point_drag = false
let current_dragged_point
let offset1_x, offset1_y
let img1_type = 'magnitude'
let img2_type = 'phase'

// shapes.push({type:'ellipse', x:50, y:50 , Rx:35, Ry:50, color:'green'})

// shapes.push({type:'rect', x:50, y:50 , width:100, height:100, color:'green'})



// shapes.push({type:'elipse', x:50, y:50 , radiusX:35, radiusY:50, color:'green'})

const select_shape = (shape, context) => {
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
            bullet_points = [{type:'ellipse', side:'left', x:shape.x - 2, y:shape.y + 0.5* shape.height, Rx:5, Ry:5},
                            {type:'ellipse', side:'right', x:shape.x + shape.width + 2, y:shape.y + 0.5*shape.height, Rx:5, Ry:5},
                            {type:'ellipse', side:'top', x:shape.x + 0.5*shape.width, y:shape.y - 2, Rx:5, Ry:5},
                            {type:'ellipse', side:'bottom', x:shape.x + 0.5*shape.width, y:shape.y + shape.height + 2, Rx:5, Ry:5}]
        }
        else{
            bullet_points = [{type:'ellipse', side:'left', x:shape.x - shape.Rx - 2, y:shape.y, Rx:5, Ry:5},
                            {type:'ellipse', side:'right', x:shape.x + 2 + shape.Rx, y:shape.y, Rx:5, Ry:5},
                            {type:'ellipse', side:'top', x:shape.x, y:shape.y - shape.Ry - 2, Rx:5, Ry:5},
                            {type:'ellipse', side:'bottom', x:shape.x, y:shape.y + shape.Ry + 2, Rx:5, Ry:5}]
        }
        for(let bullet_point of bullet_points){
        context.beginPath();
        context.ellipse(bullet_point.x, bullet_point.y, 5, 5, 0, 0, 2 * Math.PI)
        context.fill();;
        }
        current_bullet_points = bullet_points;
};

let get_offset = (canvas)=> {

    let canvas_offset = canvas.getBoundingClientRect();

    let offset_x = canvas_offset.left
    let offset_y = canvas_offset.top
    return [offset_x, offset_y]
}
[offset1_x, offset1_y] = get_offset(canvas1)
let [offset2_x, offset2_y] = get_offset(canvas2)
console.log(offset2_x)

let draw = (shape, context)=>{
    context.fillStyle = shape.color;
    if(shape.type == 'rect'){
        context.fillRect(shape.x, shape.y, shape.width, shape.height)
    }
    else if(shape.type == 'ellipse'){
        context.beginPath();
        context.ellipse(shape.x, shape.y, shape.Rx, shape.Ry, 0, 0, 2 * Math.PI);
        context.fill();
    }
}

let draw_shapes = (context, canvas, shapes)=>{
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.globalAlpha = 0.5
    for(let shape of shapes){
        draw(shape, context)
    }
}

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

let mouse_down = (event, offset_x, offset_y, shapes, canvas, context)=>{
    event.preventDefault();
    startX = parseInt(event.clientX - offset_x);
    startY = parseInt(event.clientY - offset_y);
    console.log(offset_x)

    let index = 0
    for(let shape of shapes){
        if(is_mouse_in_shape(startX, startY, shape)){
            current_shape_index = index;
            is_dragging = true
            draw_shapes(context, canvas, shapes)
            select_shape(shapes[current_shape_index], context)
        }
        index++;    

    }
        for(let point of current_bullet_points){
            if(is_mouse_in_shape(startX, startY, point)){
                console.log('zz')

                current_dragged_point = point.side
                scaling_point_drag = true
            }
            
    }
}


let mouse_up = (event, shapes, context, canvas, imgType)=> {
    if(is_dragging){
        event.preventDefault();
        draw_shapes(context, canvas, shapes)
        select_shape(shapes[current_shape_index], context)
        is_dragging = false;
        send_shapes(shapes, imgType)
        update_element(OutputImage, OutputImage_path)

        return
    }
    else if(scaling_point_drag){
        event.preventDefault();
        draw_shapes(context, canvas, shapes)
        select_shape(shapes[current_shape_index], context)
        scaling_point_drag = false
        send_shapes(shapes, imgType)
        update_element(OutputImage, OutputImage_path)
    }
    else{
        return
    }
}


let mouse_out = (event, shapes, imgType)=> {
    if(!is_dragging){
        return
    }
    event.preventDefault();
    is_dragging = false;
    scaling_point_drag = false
    send_shapes(shapes, imgType)
    update_element(OutputImage, OutputImage_path)


}

let mouse_move = (event, shapes, offset_x, offset_y, context, canvas)=> {
    let mouseX = parseInt(event.clientX - offset_x);
    let mouseY = parseInt(event.clientY - offset_y);
    if(is_dragging){
        event.preventDefault();
        

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        let current_shape = shapes[current_shape_index]
        current_shape.x += dx;
        current_shape.y += dy;

        draw_shapes(context, canvas, shapes)
        select_shape(shapes[current_shape_index], context)
        startX = mouseX
        startY = mouseY
        return
    }
    else if (scaling_point_drag){
        event.preventDefault();
        let current_shape = shapes[current_shape_index]
        let dx = mouseX - startX;
        let dy = mouseY - startY;
        if(current_dragged_point == 'left'){
            if(current_shape.type == 'ellipse'){
                current_shape.x +=  0.5*dx
                current_shape.Rx -= 0.5*dx
            }
            else{
                current_shape.x +=  dx
                current_shape.width -= dx
            }
        }
        if(current_dragged_point == 'right'){
            if(current_shape.type == 'ellipse'){
                current_shape.x +=  0.5*dx
                current_shape.Rx += 0.5*dx
            }
            else{
                current_shape.width += dx
            }
        }
        if(current_dragged_point == 'top'){
            if(current_shape.type == 'ellipse'){
                current_shape.y +=  0.5*dy
                current_shape.Ry -= 0.5*dy
            }
            else{
                current_shape.y +=  dy
                current_shape.height -= dy
            }
        }
        if(current_dragged_point == 'bottom'){
            if(current_shape.type == 'ellipse'){
                current_shape.y +=  0.5*dy
                current_shape.Ry += 0.5*dy
            }
            else{
                current_shape.height += dy
            }
        }
        startX = mouseX
        startY = mouseY
        draw_shapes(context, canvas, shapes)
        select_shape(shapes[current_shape_index], context)
    }
    else{
        return
    }
}

// canvas1
canvas1.addEventListener('mousedown', (e)=>{
    mouse_down(e, offset1_x, offset1_y, shapes1, canvas1, context1)
}) 
canvas1.addEventListener('mouseout', (e)=>{
    mouse_out(e, shapes1, img1_type)
})
canvas1.addEventListener('mouseup', (e)=>{
    mouse_up(e, shapes1, context1, canvas1, img1_type)
})
canvas1.addEventListener('mousemove', (e)=>{
    mouse_move(e, shapes1, offset1_x, offset1_y, context1, canvas1)
})

// canvas2
canvas2.addEventListener('mousedown', (e)=>{
    mouse_down(e, offset2_x, offset2_y, shapes2, canvas2, context2)
}) 
canvas2.addEventListener('mouseup', (e)=>{
    mouse_up(e, shapes2, context2, canvas2, img2_type)
})
canvas2.addEventListener('mouseout', (e)=>{
    mouse_out(e, shapes2, img2_type)
})
canvas2.addEventListener('mousemove', (e)=>{
    mouse_move(e, shapes2, offset2_x, offset2_y, context2, canvas2)
})



rect1.onclick = ()=>{
    shapes1.push({type:'rect', x:100, y:100, width:100, height:100, color:'green'})
    draw_shapes(context1, canvas1, shapes1)
    send_shapes(shapes1, img1_type)
    update_element(OutputImage, OutputImage_path)

}
rect2.onclick = ()=>{
    shapes2.push({type:'rect', x:100, y:100 , width:100, height:100, color:'green'})
    console.log(shapes2)
    draw_shapes(context2, canvas2, shapes2)
    send_shapes(shapes2, img2_type)
    update_element(OutputImage, OutputImage_path)
}

ellipse1.onclick = ()=> {
    shapes1.push({type:'ellipse', x:150, y:150 , Rx:25, Ry:50, color:'green'})
    draw_shapes(context1, canvas1, shapes1)
    send_shapes(shapes1, img1_type)
    update_element(OutputImage, OutputImage_path)
}

ellipse2.onclick = ()=> {
    shapes2.push({type:'ellipse', x:150, y:150 , Rx:25, Ry:50, color:'green'})
    draw_shapes(context2, canvas2, shapes2)
    send_shapes(shapes2, img2_type)
    update_element(OutputImage, OutputImage_path)
}

del1.onclick = ()=>{
    if(!shapes1){
        return
    }
    shapes1.splice(current_shape_index, 1)
    draw_shapes(context1, canvas1, shapes1)
    send_shapes(shapes1, img1_type)
    update_element(OutputImage, OutputImage_path)
}

del2.onclick = ()=>{
    if(!shapes2){
        return
    }
    shapes2.splice(current_shape_index, 1)
    draw_shapes(context2, canvas2, shapes2)
    send_shapes(shapes2, img2_type)
    update_element(OutputImage, OutputImage_path)
}

let send_shapes = ()=> {

    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:5000//updateOutput',
        data: JSON.stringify({shapes1, shapes2}),
        cache: false,
        dataType: 'json',
        contentType: 'application/json',
        processData: false,
        success: function(data) {

        },
    });
}
















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