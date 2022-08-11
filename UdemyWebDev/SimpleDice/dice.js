let but = document.querySelector('button');

function roll(cap=6){
	let val = Math.floor(Math.random() * cap) +1;
	return val;
}

function whoWon(x, y){
	let p1 = document.querySelector("#p1");
	let p2 = document.querySelector("#p2");
	let draw = document.querySelector("#drawHeader");

	p1.innerHTML = "";
	draw.innerHTML = "";
	p2.innerHTML = "";

	if(x > y) {
		return p1.innerHTML = "Player 1 Wins!";
	} else if (x == y) {
		return draw.innerHTML = "DRAW!!!";
	} else {
		return p2.innerHTML = "Player 2 Wins!";
	}
}

but.addEventListener('click', () => {
	let x = roll();
	let y = roll();
	let d1 = document.querySelector('#d1');
	let d2 = document.querySelector('#d2');
	let total = document.querySelector('#total');

	d1.innerHTML = x;
	d2.innerHTML = y;
	total.innerHTML = `Total: ${x+y}`;
	let winner = whoWon(x, y);

} )