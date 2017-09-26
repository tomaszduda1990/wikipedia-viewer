const form = document.querySelector('.search-form');
const randomBtn = form.querySelector('.rand-btn');
const searchBtn = form.querySelector('.search-btn');
const formInput = form.querySelector('div');
const search = document.querySelector('.search');
const list = document.querySelector('.suggestions');
const resultsSection = document.querySelector('.results');
const results = document.querySelector('.results-items');
const searchSection = document.querySelector('.search-section');
const label = document.querySelector('label');
const length = 10;
const url = 'https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&utf8=&format=json&list=search&srsearch=';
const random = 'https://en.wikipedia.org/wiki/Special:Random';
const href = 'https://en.wikipedia.org/?curid=';
let suggestions = [];
let isMinified = false;

function setValue(el){
    const text = el.textContent;
    search.value = text;
    list.innerHTML = "";

    
}
function displaySuggestions(){
	suggestions = [];
	if(!isMinified){
		list.style.top = `${search.getBoundingClientRect().height}px`;
		list.style.width = `${search.offsetWidth-label.offsetWidth-17}px`;
		list.style.left = `${label.offsetWidth}px`;
	}else {
		list.style.top = `${search.getBoundingClientRect().height}px`;
		list.style.width = `${search.offsetWidth-label.offsetWidth-13}px`;
		search.style.paddingLeft = `${label.offsetWidth}px`;
		list.style.left = `${formInput.offsetLeft+label.offsetWidth}px`;

	}
	if(search.value==""){
		list.innerHTML="";

	}else{
		const phrase = this.value;
		const urlSugg = url+phrase;
		ajax(phrase, url);
	}
		
}

function ajax (keyword, url) {
	$.ajax({ 
		url: url + keyword,
		dataType: "jsonp",
		headers: { 'Api-User-Agent': 'Example/1.0' },
		success: function(response) {
			list.innerHTML = "";
			if(response.query){
					response.query.search.forEach((suggestion, i) => {
				 	suggestions.push(suggestion);
				 	suggestions.splice(0, suggestions.length - length);
				 	if(i<5){
				 		list.innerHTML += `<li onclick = 'setValue(this)'>${suggestion.title}</li>`;
				 	}
				 	
				  })	
				}	
		},	 
		error: function () {
			alert("Error retrieving search results, please refresh the page");
		}
	});
}
function setResults(arr, item){

	suggestions.forEach(suggestion => {
		results.innerHTML += `
		<li>
			<a href="${href}+${suggestion.pageid}" target = "_blank">
				<div>
				  <h3>${suggestion.title}</h3>
				  <div>
					<p>${suggestion.snippet}</p>
				  </div>
				</div>
			</a>
		</li>`;
	})
}
function sortSuggestions(arr, item){
	if(item){
		for(let i = 0; i<10; i++){
			if(arr[i].title == item){
				const arrItem = arr[i];
				arr.splice(i,1);
				arr.splice(0,0,arrItem);
			}
		}
	}
	return arr;
}
function displayResults(e) {
	e.preventDefault();
		if(search.value){
			let item = search.value;
			suggestions = sortSuggestions(suggestions, item);
			form.reset();
			if(!isMinified){
				resultMenuView();
					resultsSection.style.marginTop = `${searchSection.offsetHeight-1}px`
			}
			list.innerHTML = "";
			results.innerHTML = "";
			setResults(suggestions);
		}	
}
function resultMenuView(){
	isMinified = true;
	document.body.classList.remove('add-background');
	searchSection.classList.add('add-background');
	document.body.classList.add('submitted');
}
function deleteSugg(event){
	let h = event.offsetY;
	let w = event.offsetX;
	let listProps = list.getBoundingClientRect();
	let winW = window.innerWidth;
	if(event.keyCode === 8 
		|| w<listProps.left
		|| w>listProps.left+listProps.width
		|| h<listProps.top
		|| h>listProps.height+listProps.top
	  ){
			list.innerHTML = "";
	   }
}
function enlarge(){
	formInput.classList.add('enlarge');
}
formInput.addEventListener('click', enlarge);
randomBtn.addEventListener('click', function(){
	window.location.href = random;
})
document.addEventListener('click', deleteSugg);
search.addEventListener('input', displaySuggestions);
search.addEventListener('keydown', deleteSugg);
form.addEventListener('submit', displayResults);
		