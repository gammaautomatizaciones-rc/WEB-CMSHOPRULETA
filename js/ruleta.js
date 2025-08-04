const canvas = document.getElementById('ruleta');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('btn-girar');
const mensaje = document.getElementById('mensaje-ruleta');

const sectores = [
  { texto: '50% OFF', color: '#ede6f5', textColor: '#8246ab', icon: '🎉' },
  { texto: '10% OFF', color: '#c7a8ff', textColor: '#31829b', icon: '🥳' },
  { texto: 'Nada', color: '#f6e8fc', textColor: '#8246ab', icon: '🙃' },
  { texto: 'Nada', color: '#ede6f5', textColor: '#31829b', icon: '🙃' },
  { texto: 'Nada', color: '#c7a8ff', textColor: '#8246ab', icon: '🙃' },
  { texto: 'Nada', color: '#f6e8fc', textColor: '#31829b', icon: '🙃' },
];
const totalSectores = sectores.length;
const anguloSector = 2 * Math.PI / totalSectores;

const probabilidades = [
  0.01,   // 1% para 50%
  0.07,   // 7% para 10%
  0.23,   // 23% para Nada 1
  0.23,   // 23% para Nada 2
  0.23,   // 23% para Nada 3
  0.23    // 23% para Nada 4
];

function sortearSector() {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < probabilidades.length; i++) {
    acc += probabilidades[i];
    if (r < acc) return i;
  }
  return probabilidades.length - 1;
}

function dibujarRuleta(rotacion = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const radio = canvas.width / 2 - 12;

  // Sectores
  for (let i = 0; i < totalSectores; i++) {
    const angIni = i * anguloSector + rotacion;
    const angFin = angIni + anguloSector;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, radio, angIni, angFin, false);
    ctx.closePath();
    ctx.fillStyle = sectores[i].color;
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angIni + anguloSector / 2);
    ctx.textAlign = "center";
    ctx.font = "bold 21px Arial";
    ctx.fillStyle = sectores[i].textColor;
    ctx.fillText(sectores[i].texto, radio * 0.68, 8);
    ctx.restore();
  }

  // Círculo central MÁS PEQUEÑO
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 35, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#8246ab";
  ctx.lineWidth = 4;
  ctx.fill();
  ctx.stroke();

  // Flechita arriba (puntero)
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 14, 18);
  ctx.lineTo(canvas.width / 2 + 14, 18);
  ctx.lineTo(canvas.width / 2, 44);
  ctx.closePath();
  ctx.fillStyle = "#8246ab";
  ctx.shadowColor = "#8246ab44";
  ctx.shadowBlur = 5;
  ctx.fill();
  ctx.shadowBlur = 0;
}

dibujarRuleta();

let animando = false;

btn.onclick = () => {
  if (animando) return;
  animando = true;
  btn.disabled = true;
  mensaje.textContent = '';

  // Sorteo sector y calculo el ángulo donde tiene que quedar
  const sectorGanador = sortearSector();
  const vueltas = Math.floor(Math.random() * 2) + 6; // entre 6 y 7 vueltas

  // El ángulo objetivo es justo el centro del sector ganador, así el puntero apunta bien
  const anguloDestino = (3 * Math.PI / 2) - (sectorGanador * anguloSector + anguloSector / 2);
  const rotacionFinal = vueltas * 2 * Math.PI + anguloDestino;

  let rot = 0;
  let frame = 0;
  const totalFrames = 90;

  function animar() {
    const t = frame / totalFrames;
    const ease = 1 - Math.pow(1 - t, 3);
    rot = rotacionFinal * ease;
    dibujarRuleta(rot);
    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(animar);
    } else {
      mostrarMensaje(sectorGanador);
      animando = false;
      btn.disabled = false;
    }
  }
  animar();
};

function mostrarMensaje(sector) {
  const premio = sectores[sector];
  if (sector === 0) {
    mensaje.innerHTML = `¡Felicitaciones! Ganaste un <b>50% OFF</b> en tu compra ${premio.icon}`;
  } else if (sector === 1) {
    mensaje.innerHTML = `¡Genial! Ganaste un <b>10% OFF</b> en tu compra ${premio.icon}`;
  } else {
    mensaje.innerHTML = `¡Uy! Seguí participando ${premio.icon}`;
  }
}

