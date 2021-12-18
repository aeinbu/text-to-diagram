function component() {
	const element = document.createElement('div');
	element.innerHTML = "Testing webpack build";
	return element;
}

document.body.appendChild(component());