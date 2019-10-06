


let body = document.querySelector("body")
let main = document.getElementById("main")
let signUpButton = document.getElementById('sign-up-button')
let signInButton = document.getElementById('sign-in-button')
let signDiv = document.getElementById("sign-div")
let h1 = document.querySelector("h1")
let userShowDiv = document.querySelector("#user-show-div")
let locationViewDiv = main.querySelector("#location-view")
let recommendationUl = locationViewDiv.querySelector(".recommendation-ul")
let showMyReview = document.getElementById("show-my-review")
let pleaseDiseppearUl = document.querySelector(".please-diseppear")
let formDiv = document.getElementById("form-div")
let closeWindow = document.getElementsByClassName("close-window")

// pleaseDiseppearUl.style.display = "none"


body.addEventListener('mouseover', function(e){
  e.target.style.cursor = "pointer"
})

function signUpForm(){
  signDiv.append(formDiv)
  formDiv.innerHTML = `<form class="sign-up">
        <input id="name" type="text" name="name" placeholder="Your name" autocomplete="off" /><br>
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" /><br>
        <input type="submit" value="Sign Up" class="sign-up-submit">
      </form>`
}

function signInForm(){
  signDiv.append(formDiv)
  formDiv.innerHTML = `<form class="sign-in">
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
        <input type="submit" value="Sign In" class="sign-in-submit">
      </form>`
}

function editForm(){
  signDiv.innerHTML = `<form class="edit-form">
        <input id="name" type="text" name="name" placeholder="Your name" autocomplete="off" />
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
        <input type="submit" value="Edit" class="sign-up-submit">
      </form>`
}

function reviewForm(userId, locationId){
  locationViewDiv.innerHTML = `<form class="new-review">
        <input data-id= "${userId}"id="user" type="hidden" name="user" />
        <input data-id= "${locationId}"id="location" type="hidden" name="location" p/>
        <label for="type_of"> Type </label>
        <input id="type-of" name="type-of" type="text" />
        <label for="price-range"> Price Range </label>
        <input id="price-range" name="price-range" type="text"/>
        <label for="rate"> Rate </label>
        <input id="rate" type="number" name="rate" />
        <label for="place"> Place </label>
        <input id="place" name="place" type="text"/>
        <label for="description"> Description </label>
        <!-- <textarea id="description" name="description" rows="8" cols="80"></textarea> -->
        <input id="description" name="description" type="text" />
        <input type="submit" value="Create a Review" class="sign-up-submit">
      </form>`
}

function postFetchForSignUp() {
  let nameInput = document.querySelector("#name")
  let usernameInput = document.querySelector("#username")
  fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body: JSON.stringify({
      name: nameInput.value,
      username: usernameInput.value
    })
  })
  .then(res=>res.json())
  .then(user => {
    localStorage.clear()
    localStorage.id = user.id
    slapUser(user)
    logOutButton()
  })
}

function patchFetchForEdit() {
  let nameInput = document.querySelector("#name")
  let usernameInput = document.querySelector("#username")
  fetch(`http://localhost:3000/users/${localStorage.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json',
      'Accept':'application/json'
    },
    body: JSON.stringify({
      name: nameInput.value,
      username: usernameInput.value
    })
  })
  .then(res=>res.json())
  .then(user => {
    slapUser(user)

  })
}

function slapUser(user){
  signDiv.innerHTML += `<h2 id="signed-in-user"> Signed In User </h2><p class="user" data-id="${user.id}"> <span id="name-span"> Name : </span> ${user.name}</p> <p class="user"><span id="username-span"> Username :</span> ${user.username} </p>
  <button data-id="${user.id}"id="edit"> Edit Profile </button>
  <button data-id="${user.id}" id="delete"> Delete Profile </button>
  <button data-id="${user.id}" id="my-reviews"> See My Reviews </button>
  <button data-id="${user.id}" id="write-review-button"> Make A Review </button>
  `
  signUpButton.style.display = "none"
  signInButton.style.display ="none"
}

function slapLocation(location){
locationViewDiv.innerHTML +=`
<div>
 <ul>
<li class="location" data-id="${location.id}"> ${location.name} / ${location.state}</li>
 </ul>
 </div>`}

function slapRecommendation(recommendation){
  // recommendationUl.innerHTML += ""
  locationViewDiv.append(recommendationUl) //why?
  recommendationUl.innerHTML +=`
  <ul class="recommendation" data-id="${recommendation.id}">
      <button class="close-window"> X </button>
     <li> <span class="bold">Type of:</span> ${recommendation.type_of}</li>
     <li> <span class="bold"> Place:</span>  ${recommendation.place}</li>
     <li> <span class="bold"> Description:</span> ${recommendation.description}</li>
      <li> <span class="bold"> Prige Range:</span> ${recommendation.price_range}</li>
      <button data-id="${recommendation.id}" data-likes="${recommendation.like}" class="like-button"> <span class="like">${recommendation.like} </span>Like </button>
  </ul>
  `}

function showMyRecommendation(recommendation){
    // locationViewDiv.append(recommendationUl) //why?
    showMyReview.innerHTML +=`
    <ul data-id="${recommendation.id}">
       <li> <span class="bold">Type of:</span> ${recommendation.type_of}</li>
       <li> <span class="bold"> Place:</span>  ${recommendation.place}</li>
       <li> <span class="bold"> Rate:</span> ${recommendation.rate}</li>
       <li> <span class="bold"> Description:</span> ${recommendation.description}</li>
       <li> <span class="bold"> Prige Range:</span> ${recommendation.price_range}</li>
       <button data-id="${recommendation.id}" class="delete-recommendation"> Delete your recommendation </button>

    </ul>  <br>  `  }

function fetchLocations(){
  fetch('http://localhost:3000/locations')
  .then(res=>res.json())
  .then(locationArray => locationArray.forEach(function(location){
      slapLocation(location)
    })
  )
}

fetchLocations()
showMyReview.innerHTML = ""

function logOutButton(){
 let logOutButton = document.createElement("button")
 logOutButton.className = "log-out-button"
 logOutButton.innerText = "Log Out"
 signDiv.append(logOutButton)
 logOutButton.addEventListener('click', e=>{
   localStorage.clear()
   signDiv.innerHTML = ""
   locationViewDiv.innerHTML = ""
   pleaseDiseppearUl.style.display = "inline-block"
   signUpButton.style.display = "inline-block"
   signInButton.style.display ="inline-block"
   fetchLocations()
 })
}


locationViewDiv.addEventListener('click', e => {
  let reviewActive = locationViewDiv.querySelector(".review-active")
  if(e.target.tagName === 'LI' && !reviewActive){
    recommendationUl.innerHTML = ""
    let id = e.target.dataset.id
    fetch(`http://localhost:3000/locations/${id}`)
     .then(res=>res.json())
     .then(object => object.recommendations.forEach(function(recommendation){
       slapRecommendation(recommendation)
     }))
  }
})


/// Sign up ///
signUpButton.addEventListener('click', e => {
  signDiv.innerHTML = ""
  // locationViewDiv.innerHTML = ""
  signUpForm()
  let form = signDiv.querySelector('.sign-up')
  let nameInput = document.querySelector("#name")
  let usernameInput = document.querySelector("#username")
  signUpButton.style.display = "none"
  signInButton.style.display = "inline-block"
  form.addEventListener('submit', e =>{
    e.preventDefault()
    postFetchForSignUp()
    logOutButton()
    signDiv.innerHTML = ""
locationViewDiv.innerHTML = ""
    writeReview()
    pleaseDiseppearUl.style.display = "none"
    fetchLocations()

  })
})

signInButton.addEventListener('click', e => {
  signDiv.innerHTML = ""
  signInForm()
  let form = signDiv.querySelector('.sign-in')
  let usernameInput = document.querySelector("#username")
  signInButton.style.display = "none"
  signUpButton.style.display = "inline-block"
  form.addEventListener('submit', e=>{
    e.preventDefault()
    fetch('http://localhost:3000/users') /// THEN I MAKE A FETCH REQUEST TO USERS
    .then(res=>res.json()) /// THIS WILL CONVERT PROMISE INTO JSON FILE
    .then(usersArray => { /// IN THIS CASE, JSON FILE RETURNS AN ARRAY OF USERS
      let user = usersArray.find(function(user){ /// THIS IS FOR TO FIND USERNAME PASSED IN WITH THE FORM AND SAVE IT TO THE VARIABLE
          return user.username === usernameInput.value
        })
      if (user){
        signDiv.innerHTML = ""
        slapUser(user)
        localStorage.id = user.id
        logOutButton()
        writeReview()
        // pleaseDiseppearUl.style.display = "none"

      } else {
        signDiv.innerHTML = `<p>This username does not exist</p>`
      }
      // localStorage.id = user.id
      // logOutButton()
      // writeReview()

   })
  })
})


/// edit, delete, mey-reviews buttons happen here ///
signDiv.addEventListener('click', e=>{
  if(e.target.id === "edit"){
    editForm()

    let form = signDiv.querySelector('.edit-form')
    let usernameInput = document.querySelector("#username")
    let name = document.querySelector("#name")
    form.addEventListener('submit', e=> {
      e.preventDefault()
      patchFetchForEdit()
    })
  } else if (e.target.id === "delete"){
    fetch(`http://localhost:3000/users/${localStorage.id}`, {
      method: 'DELETE'
    })
    signDiv.innerHTML = `<p> Account Deleted! </p>`
    localStorage.clear()


  } else if (e.target.id === "my-reviews"){
    fetch(`http://localhost:3000/users/${localStorage.id}`)
      .then(res => res.json())
      .then(object => {
        showMyReview.innerHTML = ""
        object.recommendations.forEach(function(recommendation){
        showMyRecommendation(recommendation)
      })
    })
  }
})

/// delete actions ///
showMyReview.addEventListener('click', e => {

  if(e.target.className === "delete-recommendation"){
    fetch(`http://localhost:3000/recommendations/${e.target.dataset.id}`, {
      method: 'DELETE'
    })
    e.target.parentElement.remove()
  }
})
/// like action happens here ///
recommendationUl.addEventListener('click', e => {
  // e.preventDefault()
  if(e.target.className === "like-button"){
    // let likeAmount = e.target.dataset.likes
    let likeCounter = e.target.querySelector(".like")
    likeAmount = parseInt(likeCounter.innerText)
    likeAmount++
    // let likeCounter = e.target.querySelector(".like")
    likeCounter.innerText = likeAmount
    let id = e.target.dataset.id
    let likeButton =  recommendationUl.querySelector('.like-button')

    fetch(`http://localhost:3000/recommendations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify({
        like: likeAmount
      })
    })
    .then(res => res.json())
    .then(object =>{

    })
  }
})



if (localStorage.id){
  fetch(`http://localhost:3000/users/${localStorage.id}`)
    .then(res=>res.json())
    .then(user => {
      slapUser(user)
      logOutButton()
      writeReview()
    })
}


function writeReview(){
  let writeReviewButton = signDiv.querySelector('#write-review-button')
  document.body.addEventListener('click', e =>{

    if (e.target.id === "write-review-button"){
    fetchLocations()
    locationViewDiv.innerHTML = ""
    locationViewDiv.innerHTML += "<h3 class='review-active'> Click a location to make a review</h3>"
  // debugger
    let reviewActive = locationViewDiv.querySelector(".review-active")
    main.addEventListener('click', e=> {
      if (localStorage.length !== 0 && e.target.classList.contains('location')){
        let locationId = parseInt(e.target.dataset.id)
        let userId = localStorage.id
        reviewForm(userId, locationId)
        let formforReview = document.querySelector(".new-review")
        formforReview.addEventListener('submit', function(e){  /// THEN I ADD A EVENT LISTENER TO THE FORM
          e.preventDefault()
         let typeOf = document.querySelector("#type-of") /// THEN I FIND THE INPUTS
         let description = document.querySelector("#description")
         let priceRange = document.querySelector("#price-range")
         let rate = document.querySelector("#rate")
         let place = document.querySelector("#place")

         fetch("http://localhost:3000/recommendations", { /// THEN I MAKE A POST FETCH TO RECOMMENDATIONS WITH DATA I COLLECTED
           method: 'POST',
           headers: {
             'Content-Type':"application/json",
             'Accept':'application/json'
           },
           body: JSON.stringify({
             user_id: userId,
             location_id: locationId,
             type_of: typeOf.value,
             description: description.value,
             price_range: priceRange.value,
             rate: rate.value,
             place: place.value
           }) /// This closes => body: JSON.stringify

         }) /// This closes => fetch("http://localhost:3000/recommendations"

         .then(res=>res.json())
         .then(recommendation => {
          showMyRecommendation(recommendation)
          /// THEN I SLAP RECOMMENDATIONS ON TO THE DOM
         })
             typeOf.value = ""
             description.value = ""
             priceRange.value = ""
             rate.value =""
             place.value =""

       })  /// This closes => formforReview.addEventListener
     }
    })
   }
  })
}



let textWrapper = document.querySelector('.ml1 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: (el, i) => 70 * (i+1),
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i)
  }).add({
    targets: '.ml1',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });


  // showMyReview.addEventListener('click', e => {

  //   if (e.target.className === 'change-rate'){
  //     let rateSpan = showMyReview.querySelectorAll('.rate-span')
  //     let id = e.target.dataset.id
  //     rateValue = rateSpan.innerText
  //     rateValue = parseInt(rateValue)
  //     rateNegative = `-${rateValue}`
  //     rateSpan.innerText = rateNegative
  //     fetch(`http://localhost:3000/recommendations/${id}`, {
  //       method: 'PATCH',
  //       headers:{
  //         'Content-Type':'application/json',
  //         'Accept':'application/json'
  //       },
  //       body: JSON.stringify({
  //         rate: rateNegative
  //       })
  //     })
  //     // debugger
  //   }
  //
  // })
