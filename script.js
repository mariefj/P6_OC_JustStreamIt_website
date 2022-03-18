const BEST = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=1&page=1"
const BEST_ALL_CATEGORIES = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&page=1"
const BEST_2000 = "http://localhost:8000/api/v1/titles/?year=2000&sort_by=-imdb_score&page_size=7&page=1"
const BEST_HORROR = "http://localhost:8000/api/v1/titles/?genre=Horror&sort_by=-imdb_score&page_size=7&page=1"
const BEST_COMEDY = "http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score&page_size=7&page=1"

const get = async (url) => {
	try {
		const response = await fetch(url)
		const json = await response.json()
		
		return json.results
	} catch (e) {
		console.log(e)
	}
}

/******************NAV MENU*****************/

const createMenuNav = (titles) => {
	let menu = document.getElementById("dropdown-content")
	titles.map(k => menu.innerHTML += `<a href="#carousel-${k}">${k}</a>`)
}

/******************MODAL*****************/

const createModal = (data) => {
	let modal = document.getElementById("modal")
	modal.style.display = "block"
	
	let modalContent = document.getElementById("modal-content")
	modalContent.innerHTML = `
		<img src="${data.image_url}">
		<h2>${data.title}</h2>
		<p>Genre: ${data.genres}</p>
		<p>Date de sortie: ${data.year}</p>
		<p>Référencement: ${data.rating}</p>
		<p>Score imdb: ${data.imdb_score}</p>
		<p>Réalisateur(s): ${data.directors}</p>
		<p>Acteurs: ${data.actors}</p>
		<p>Durée: ${data.duration}</p>
		<p>Pays: ${data.countries}</p>
		<p>Box office: ${data.votes}</p>
		<p>Synopsis: ${data.synopsis}</p>
	`
	let btn = document.getElementById("cross")
	btn.addEventListener("click", () => modal.style.display = "none")
}
	
/******************BEST MOVIE*****************/

const fillHeader = async () => get(BEST)
	.then(res => createBestMovie(res[0]))
	.catch(e => console.log(e))
	
const createBestMovie = (data) => {
	let section = document.getElementById("best-movie")
	section.innerHTML = `
		<div>
		<div>
		<h1>${data.title}</h1>
		<button id="more">En savoir plus</button>
			</div>
			<img src="${data.image_url}" alt="${data.title}"
		</div>
	`
	document.getElementById("more").onclick = () => createModal(data)
}
	
/******************CAROUSELS*****************/

const getDataAndCreateCarousel = async (url, title) =>
	get(url)
	.then(res => createCarousel(res, title))
	.catch(e => console.log(e))
	
const createHTMLCarousel = (title) => {
	let carousel = document.createElement("div")
	carousel.innerHTML = `
		<div id="carousel-${title}" class="carousel">
			<h2>${title}</h2>
			<div class="carousel-wrap-all">
				<span><img class="arrow" src="img/arrow-left.svg" alt="flèche gauche"></span>
				<div class="carousel-wrapper">
					<div id="${title}" class="carousel-content" data-position="0"></div>
				</div>
				<span><img class="arrow" src="img/arrow-right.svg" alt="flèche droite"></span>
			</div> 
		</div> 
	`
	return carousel
}

const createCarousel = (data, title) => {
	let carouselStruct = createHTMLCarousel(title)
	let section = document.getElementById("carousels")
	section.appendChild(carouselStruct)
	data.map(k => createItemCarousel(k, title))
	showCarousel(carouselStruct)
}

const createItemCarousel = (data, title) => {
	let carousel = document.getElementById(title)
	let item = document.createElement("img")
	item.src = `${data.image_url}`;
	item.alt = `${data.title}`
	item.onclick = () => createModal(data)
	carousel.appendChild(item)
}

const arrowClick = (btn, values, content) =>
	btn.onclick = () => {
		let newPosition
		let currentPosition = parseInt(content.getAttribute('data-position'))
		if (currentPosition == values[0]) {
			newPosition = values[0] === 0 ? currentPosition : values[1]
		} else {
			newPosition = currentPosition + values[2]
		}
		content.setAttribute('data-position', newPosition);
		content.style.left = `${newPosition}%`;
	}

const showCarousel = (carousel) => {
	const content = carousel.querySelector('.carousel-content');
	const btnArrow = carousel.querySelectorAll(".arrow");

	const btnArrowLeft = btnArrow[0]
	const btnArrowRight = btnArrow[1]

	arrowClick(btnArrowLeft, [0, -75, 25], content)
	arrowClick(btnArrowRight, [-75, 0, -25], content)
}

/***********************MAIN*******************/

const main = async () => {
	const urls = [BEST_ALL_CATEGORIES, BEST_2000, BEST_HORROR, BEST_COMEDY]
	const titles = [
		"Films les mieux notés",
		"Meilleurs films des années 2000",
		"Meilleurs films d'horreur",
		"Meilleures comédies",
	]

	createMenuNav(titles)
	await fillHeader()
	// await createCarousels(urls,titles)

	await getDataAndCreateCarousel(urls[0],titles[0])
	await getDataAndCreateCarousel(urls[1],titles[1])
	await getDataAndCreateCarousel(urls[2],titles[2])
	await getDataAndCreateCarousel(urls[3],titles[3])
}

main()