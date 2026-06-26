const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900; canvas.height = 450;

let nodes = JSON.parse(localStorage.getItem('axisNodes')) || [
    { id: 1, text: "Expansión Giga-México", x: 150, y: 50 },
    { id: 2, text: "Adquisición Terreno", x: 150, y: 130 },
    { id: 3, text: "Logística de Suministros", x: 150, y: 210 },
    { id: 4, text: "Integración Energías", x: 150, y: 290 },
    { id: 5, text: "Cumplimiento Regulatorio", x: 150, y: 370 }
];
let selected = null;

function save() { localStorage.setItem('axisNodes', JSON.stringify(nodes)); render(); }

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar conexiones de flujo
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y + 12);
        ctx.lineTo(nodes[i+1].x, nodes[i+1].y - 12);
        ctx.stroke();
    }

    // Dibujar nodos numerados
    nodes.forEach((n, index) => {
        ctx.fillStyle = (selected === n) ? '#fff' : '#333';
        ctx.beginPath();
        ctx.arc(n.x, n.y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = (selected === n) ? '#000' : '#fff';
        ctx.font = 'bold 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(index + 1, n.x, n.y + 5);
        
        ctx.fillStyle = (selected === n) ? '#fff' : '#888';
        ctx.font = '14px Inter';
        ctx.textAlign = 'start';
        ctx.fillText(n.text, n.x + 30, n.y + 5);
    });
}

document.getElementById('addNodeBtn').addEventListener('click', () => {
    const input = document.getElementById('nodeInput');
    if(input.value) {
        const lastY = nodes.length > 0 ? nodes[nodes.length - 1].y : 50;
        nodes.push({ id: Date.now(), text: input.value, x: 150, y: lastY + 80 });
        input.value = ''; save();
    }
});

document.getElementById('editNodeBtn').addEventListener('click', () => {
    const input = document.getElementById('nodeInput');
    if(selected) {
        if(input.value) { selected.text = input.value; input.value = ''; save(); }
        else { input.value = selected.text; }
    }
});

document.getElementById('deleteNodeBtn').addEventListener('click', () => {
    if(selected) { nodes = nodes.filter(n => n !== selected); selected = null; save(); }
});

canvas.addEventListener('click', (e) => {
    selected = nodes.find(n => Math.hypot(n.x - e.offsetX, n.y - e.offsetY) < 20);
    render();
});

render();