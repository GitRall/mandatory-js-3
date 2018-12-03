let nav = document.querySelector('nav');
let section = document.querySelector('section');
let dropdownUl = document.querySelector('.dropdown-menu ul');
let dropMenu = document.querySelector('.dropdown-menu');
let menuIcon = document.querySelector('.menu-icon');
let menuHome = document.querySelector('.menu-home');
let subDropdown = document.querySelector('.sub-dropdown');
let subDropdownUl = document.querySelector('.sub-dropdown ul');


/*===========================================================================*/
/* --- EventListeners for Home button and dropdown button --- */

menuHome.addEventListener('click', () => {
  window.location.href = '';
});

menuIcon.addEventListener('click', () => {
  if (dropMenu.style.display === 'none'){
    dropMenu.style.display = 'block';
    subDropdown.style.display = 'block';
  }
  else{
    dropMenu.style.display = 'none';
    subDropdown.style.display = 'none';
  }
});

/*===========================================================================*/
/* --- Renders breed list under dropdown menu --- */

function renderBreeds(){
  /* --- GET request for all breeds --- */
  axios.get('https://dog.ceo/api/breeds/list/all')
  .then(function(response){
    let data = response.data.message;

    /* --- render list of breeds too nav --- */
    for (let breed in data){
      let liElement = document.createElement('li');
      liElement.textContent = breed;
      dropdownUl.appendChild(liElement);
    }

    /* --- EventListener when clicking breed in dropdown menu --- */
    let liMenu = document.querySelectorAll('.dropdown-menu ul li');
    for (let btn of liMenu){
      btn.addEventListener('click', function(e){
        getSubBreed(btn.textContent);
        window.location.hash = e.target.textContent;
          randomizeBreed(response.data.message);
      })
    }
  })
}

/*===========================================================================*/
/* --- Randomizing image, either with hash or without --- */

function randomizeBreed(){
  return new Promise(function(resolve, reject){
    if(window.location.hash){
      axios.get('https://dog.ceo/api/breed/' + window.location.hash.substring(1) + '/images/random')
      .then(function(response){
        resolve(response.data.message);
      })
    }
    else{
      axios.get('https://dog.ceo/api/breeds/image/random')
      .then(function(response){
        resolve(response.data.message);
      })
    }
  })
  .then(function(randomImg){
    let regEx = /\/((?!breeds)\w+(\-\w+)?)\//;
    let currentBreed = randomImg.match(regEx);
    renderContent(randomImg, currentBreed[1])
  })
}

/*===========================================================================*/
/* --- Render main content --- */

function renderContent(img, dogBreed){
  section.innerHTML = '';
  let imgContainer = document.createElement('div');
  let h2CurrentBreed = document.createElement('h2');
  h2CurrentBreed.textContent = dogBreed;
  imgContainer.setAttribute('class', 'img-container');
  let sectionImg = document.createElement('img');
  let sectionButton = document.createElement('button');
  sectionButton.textContent = 'Randomize';
  sectionImg.setAttribute('src', img);

  section.appendChild(imgContainer);
  imgContainer.appendChild(h2CurrentBreed);
  imgContainer.appendChild(sectionImg);
  imgContainer.appendChild(sectionButton);

  sectionButton.addEventListener('click', randomizeBreed);
}

/*===========================================================================*/
/* --- Requests sub-breed and renders list under dropdown menu,
sends too renderContent function --- */

function getSubBreed(breed){
  subDropdownUl.innerHTML = '';
  axios.get('https://dog.ceo/api/breed/' + breed + '/list')
  .then(function(response){
    let subBreedArray = response.data.message;
    for (let subBreed of subBreedArray){
      let liSubBreed = document.createElement('li');
      liSubBreed.textContent = subBreed;
      subDropdownUl.appendChild(liSubBreed);
    }
  })
  .then(function(){
    let subBreedItems = document.querySelectorAll('.sub-dropdown ul li');
    for (let btn of subBreedItems){
      btn.addEventListener('click', function(e){
        axios.get('https://dog.ceo/api/breed/' + breed + '/' + e.target.textContent + '/images/random')
        .then(function(response){
          window.location.hash = breed + '-' + e.target.textContent;
          renderContent(response.data.message, window.location.hash.substring(1));
        })
      })
    }
  })
}

/*===========================================================================*/

renderBreeds();
randomizeBreed();
