function chelovechek() {
    const canvas = document.getElementById('canvas');
    if (!canvas) {
        console.log('canvas connection error');
        return false;
    }

    const head_coord_x = 300;
    const head_coord_y = 100;
    const head_size = 50;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000'; 

    // head
    ctx.fillRect(head_coord_x, head_coord_y, head_size, head_size);

    // neck
    ctx.fillRect(head_coord_x + 20, head_coord_y + head_size, 10, 20);

    // arms
    ctx.fillRect(head_coord_x - 40, head_coord_y + head_size + 20, 130, 10);

    // body
    ctx.fillRect(head_coord_x - 10, head_coord_y + head_size + 30, 70, 60);

    // left_leg
    ctx.fillRect(head_coord_x - 10, head_coord_y + head_size + 90, 10, 60);

    // right_leg
    ctx.fillRect(head_coord_x + head_size, head_coord_y + head_size + 90, 10, 60);
}
