/* SNOW */
function snow() {
	let canvas, ctx;
	let points = [];
	let maxDist = 100;

	const init = () => {
		//Add on load scripts
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		resizeCanvas();
		generatePoints(700);
		pointFun();
		setInterval(pointFun, 25);
		window.addEventListener('resize', resizeCanvas, false);
	};
	//Particle constructor
	function point() {
		this.x = Math.random() * (canvas.width + maxDist) - maxDist / 2;
		this.y = Math.random() * (canvas.height + maxDist) - maxDist / 2;
		this.z = Math.random() * 0.5 + 0.5;
		this.vx = (Math.random() * 2 - 0.5) * this.z;
		this.vy = (Math.random() * 1.5 + 1.5) * this.z;
		this.fill = 'rgba(255,255,255,' + (0.5 * Math.random() + 0.5) + ')';
		this.dia = (Math.random() * 2.5 + 1.5) * this.z;
		points.push(this);
	}
	//Point generator
	const generatePoints = (amount) => {
		let temp;
		for (let i = 0; i < amount; i++) {
			temp = new point();
		}
	};
	//Point drawer
	const draw = (obj) => {
		ctx.beginPath();
		ctx.strokeStyle = 'transparent';
		ctx.fillStyle = obj.fill;
		ctx.arc(obj.x, obj.y, obj.dia, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};
	//Updates point position values
	const update = (obj) => {
		obj.x += obj.vx;
		obj.y += obj.vy;
		if (obj.x > canvas.width + maxDist / 2) {
			obj.x = -(maxDist / 2);
		} else if (obj.xpos < -(maxDist / 2)) {
			obj.x = canvas.width + maxDist / 2;
		}
		if (obj.y > canvas.height + maxDist / 2) {
			obj.y = -(maxDist / 2);
		} else if (obj.y < -(maxDist / 2)) {
			obj.y = canvas.height + maxDist / 2;
		}
	};
	//
	const pointFun = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < points.length; i++) {
			draw(points[i]);
			update(points[i]);
		}
	};

	const resizeCanvas = () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		pointFun();
	};

	//Execute when DOM has loaded
	document.addEventListener('DOMContentLoaded', init, false);
}

snow();

/* WHEEL */
const prizes = [
	{
		text: '10% Off ',
		color: '#006989',
		probability: 0.5,
	},
	{
		text: 'Free Website',
		color: '#A3BAC3',
		probability: 0.05,
	},
	{
		text: 'Free hosting 6 months',
		color: '#EAEBED',
		probability: 0.15,
	},
	{
		text: 'Free hosting for 1 month',
		color: '#8380B6',
		probability: 0.3,
	},
	{
		text: 'Free hosting 2 months',
		color: '#45F0DF',
		probability: 0.05,
	},
	{
		text: 'Free hosting 3 months',
		color: '#F2A65A',
		probability: 0.05,
	},
];

const wheel = document.querySelector('.content__deal-wheel');
const modalWin = document.querySelector('.modal-win');

const spinner = wheel.querySelector('.content__spinner');
const trigger = wheel.querySelector('.cap');
const ticker = wheel.querySelector('.ticker');

const prizeSlice = 360 / prizes.length;
const prizeOffset = Math.floor(180 / prizes.length);
const spinClass = 'is-spinning';
const selectedClass = 'selected';
const spinnerStyles = window.getComputedStyle(spinner);

let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;

const createPrizeNodes = () => {
	prizes.forEach(({ text, color }, i) => {
		const rotation = prizeSlice * i * -1 - prizeOffset;
		spinner.insertAdjacentHTML(
			'beforeend',
			`<li class="prize" style="--rotate: ${rotation}deg">
				<span class="text">${text}</span>
	  		</li>`,
		);
	});
};

const createConicGradient = () => {
	spinner.setAttribute(
		'style',
		`background: conic-gradient(
	  		from -90deg,
	  		${prizes.map(({ color }, i) => `${color} 0 ${(100 / prizes.length) * (prizes.length - i)}%`).reverse()}
		);`,
	);
};

const rotate = () => {
	let result = prizes[0];

	let weightedList = [];
	for (let i = 0; i < prizes.length; i++) {
		for (let j = 0; j < prizes[i].probability * 100; j++) {
			weightedList.push(i);
		}
	}

	let winningPriceIndex = weightedList[Math.floor(Math.random() * weightedList.length)];
	result = prizes[winningPriceIndex];

	let fullSpins = Math.floor(Math.random() * 4) + 3;
	let offsetToPrice = winningPriceIndex * prizeSlice;
	let additionalOffset = Math.floor(Math.random() * prizeSlice);
	console.log('You won: ' + result.text);

	console.log(
		'The wheel turns ' +
			(fullSpins * 360 + offsetToPrice + additionalOffset) +
			'° (' +
			fullSpins +
			' full spin + ' +
			offsetToPrice +
			'° + ' +
			additionalOffset +
			'°)',
	);
	return fullSpins * 360 + offsetToPrice + additionalOffset + 90;
};
const setupWheel = () => {
	createConicGradient();
	createPrizeNodes();
	prizeNodes = wheel.querySelectorAll('.prize');
};

const runTickerAnimation = () => {
	const values = spinnerStyles.transform.split('(')[1].split(')')[0].split(',');
	const a = values[0];
	const b = values[1];
	let rad = Math.atan2(b, a);

	if (rad < 0) rad += 2 * Math.PI;

	const angle = Math.round(rad * (180 / Math.PI));
	const slice = Math.floor((angle - 90) / prizeSlice);

	if (currentSlice !== slice) {
		ticker.style.animation = 'none';
		setTimeout(() => (ticker.style.animation = null), 10);
		currentSlice = slice;
	}

	tickerAnim = requestAnimationFrame(runTickerAnimation);
};

const winNotification = (text) => {
	let modal = document.createElement('div');
	modal.setAttribute('class', 'modal-win');
	modal.innerHTML += `You win ${text}`;
	document.body.append(modal);
};

const selectPrize = () => {
	const selected = Math.floor((rotation - 90) / prizeSlice);
	prizeNodes[selected].classList.add(selectedClass);
	winNotification(prizeNodes[selected].innerText);
};

trigger.addEventListener('click', () => {
	trigger.disabled = true;
	rotation = Math.floor(rotate());
	prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
	wheel.classList.add(spinClass);
	spinner.style.setProperty('--rotate', rotation);
	ticker.style.animation = 'none';

	runTickerAnimation();
});

spinner.addEventListener('transitionend', () => {
	cancelAnimationFrame(tickerAnim);
	// trigger.disabled = false;
	trigger.focus();
	rotation %= 360;
	selectPrize();
	wheel.classList.remove(spinClass);
	spinner.style.setProperty('--rotate', rotation);
	confettiAnimation();
});

setupWheel();

/* CONFETTI */
let duration = 10000;
let end = Date.now() + duration;
let colors = ['#fff', '#000', '#fa2020'];
function confettiAnimation() {
	confetti({
		particleCount: 2,
		angle: 60,
		spread: 55,
		origin: { x: 0 },
		colors: colors,
	});
	confetti({
		particleCount: 2,
		angle: 120,
		spread: 55,
		origin: { x: 1 },
		colors: colors,
	});

	// keep going until we are out of time
	if (Date.now() < end) {
		requestAnimationFrame(confettiAnimation);
	}
}
