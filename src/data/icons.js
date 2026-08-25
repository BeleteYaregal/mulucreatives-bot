module.exports = [
  {
    name: 'Diamond',
    draw: function(ctx, x, y, size, color) {
      const r = size / 2;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.lineTo(x - r, y);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Hexagon',
    draw: function(ctx, x, y, size, color) {
      const r = size / 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Shield',
    draw: function(ctx, x, y, size, color) {
      const w = size / 2;
      const h = size / 2;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.quadraticCurveTo(x - w, y, x - w, y - h / 2);
      ctx.lineTo(x - w, y - h);
      ctx.lineTo(x, y - h * 1.2);
      ctx.lineTo(x + w, y - h);
      ctx.lineTo(x + w, y - h / 2);
      ctx.quadraticCurveTo(x + w, y, x, y + h);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Star',
    draw: function(ctx, x, y, size, color) {
      const outerRadius = size / 2;
      const innerRadius = size / 4;
      const spikes = 5;
      let rot = Math.PI / 2 * 3;
      let step = Math.PI / spikes;
      ctx.beginPath();
      ctx.moveTo(x, y - outerRadius);
      for (let i = 0; i < spikes; i++) {
        let px = x + Math.cos(rot) * outerRadius;
        let py = y + Math.sin(rot) * outerRadius;
        ctx.lineTo(px, py);
        rot += step;
        px = x + Math.cos(rot) * innerRadius;
        py = y + Math.sin(rot) * innerRadius;
        ctx.lineTo(px, py);
        rot += step;
      }
      ctx.lineTo(x, y - outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Mountain',
    draw: function(ctx, x, y, size, color) {
      const w = size / 2;
      const h = size / 2;
      ctx.beginPath();
      ctx.moveTo(x - w, y + h);
      ctx.lineTo(x - w/2, y - h/4);
      ctx.lineTo(x, y + h/2);
      ctx.lineTo(x + w/4, y - h);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Leaf',
    draw: function(ctx, x, y, size, color) {
      const r = size / 2;
      ctx.beginPath();
      ctx.moveTo(x, y - r);
      ctx.quadraticCurveTo(x + r, y - r, x + r, y);
      ctx.quadraticCurveTo(x + r, y + r, x, y + r);
      ctx.quadraticCurveTo(x - r, y + r, x - r, y);
      ctx.quadraticCurveTo(x - r, y - r, x, y - r);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Lightning Bolt',
    draw: function(ctx, x, y, size, color) {
      const w = size / 3;
      const h = size / 2;
      ctx.beginPath();
      ctx.moveTo(x + w, y - h);
      ctx.lineTo(x - w, y + h/4);
      ctx.lineTo(x + w/4, y + h/4);
      ctx.lineTo(x - w, y + h);
      ctx.lineTo(x + w, y - h/4);
      ctx.lineTo(x - w/4, y - h/4);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Crown',
    draw: function(ctx, x, y, size, color) {
      const w = size / 2;
      const h = size / 3;
      ctx.beginPath();
      ctx.moveTo(x - w, y - h);
      ctx.lineTo(x - w/2, y + h/2);
      ctx.lineTo(x, y - h/2);
      ctx.lineTo(x + w/2, y + h/2);
      ctx.lineTo(x + w, y - h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x - w, y + h);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Wave',
    draw: function(ctx, x, y, size, color) {
      const w = size / 2;
      const h = size / 4;
      ctx.beginPath();
      ctx.moveTo(x - w, y);
      ctx.quadraticCurveTo(x - w/2, y - h, x, y);
      ctx.quadraticCurveTo(x + w/2, y + h, x + w, y);
      ctx.lineTo(x + w, y + h*2);
      ctx.lineTo(x - w, y + h*2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Circle Ring',
    draw: function(ctx, x, y, size, color) {
      const r = size / 2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = size / 8;
      ctx.stroke();
    }
  },
  {
    name: 'Arrow Up',
    draw: function(ctx, x, y, size, color) {
      const w = size / 4;
      const h = size / 2;
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x + w*1.5, y - h/4);
      ctx.lineTo(x + w, y - h/4);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x - w, y + h);
      ctx.lineTo(x - w, y - h/4);
      ctx.lineTo(x - w*1.5, y - h/4);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
  },
  {
    name: 'Cube',
    draw: function(ctx, x, y, size, color) {
      const w = size / 2.5;
      const h = size / 2.5;
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x + w, y - h/2);
      ctx.lineTo(x + w, y + h/2);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x - w, y + h/2);
      ctx.lineTo(x - w, y - h/2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      
      // Lines inside
      ctx.beginPath();
      ctx.moveTo(x, y - h);
      ctx.lineTo(x, y);
      ctx.lineTo(x + w, y + h/2);
      ctx.moveTo(x, y);
      ctx.lineTo(x - w, y + h/2);
      ctx.strokeStyle = '#ffffff'; 
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
];
