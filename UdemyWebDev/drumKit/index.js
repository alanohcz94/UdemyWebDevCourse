function sounds(x) {
	let audio;
	switch(x) {
		case 'w': //bass
			audio = new Audio('./sounds/kick-bass.mp3');
			audio.play();
		break;
		case 'a': //t1
			audio = new Audio('./sounds/tom-1.mp3');
			audio.play();
		break;
		case 's': //t2
			audio = new Audio('./sounds/tom-2.mp3');
			audio.play();
		break;
		case 'd': //t3
			audio = new Audio('./sounds/tom-3.mp3');
			audio.play();
		break;
		case 'j': //t4
			audio = new Audio('./sounds/tom-4.mp3');
			audio.play();
		break;
		case 'k': //snare 
			audio = new Audio('./sounds/snare.mp3');
			audio.play();
		break;
		case 'l': //crash
			audio = new Audio('./sounds/crash.mp3');
			audio.play();
		break;
	}
	
}

let but = document.querySelectorAll('.drum')

for(let i=0; i<but.length; i++){
	but[i].addEventListener('click', () => {
		buttonAnimation(but[i].value);
		sounds(but[i].value);
	})
}

document.addEventListener('keydown', (event) => {
	buttonAnimation(event.key);
	sounds(event.key);
})

function buttonAnimation(key){
	let current = document.querySelector("."+key);
	if(current != null){
		current.classList.add('pressed');
		setTimeout(function(){
			current.classList.remove('pressed');
		}, 100);
	}
}




