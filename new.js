


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

// pleaseDiseppearUl.style.display = "none"



body.addEventListener('mouseover', function(e){
  e.target.style.cursor = "pointer"
})

function signUpForm(){
  signDiv.append(formDiv)
  formDiv.innerHTML = `<form class="sign-up">
        <input id="name" type="text" name="name" placeholder="Your name" autocomplete="off" />
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
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
        <input type="submit" value="Sign Up" class="sign-up-submit">
      </form>`
}

function reviewForm(userId, locationId){
  main.innerHTML = `<form class="new-review">
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
  signDiv.innerHTML += `<h2> Signed In User </h2><p data-id="${user.id}"> Name : ${user.name}<br> Username : ${user.username} </p>
  <button data-id="${user.id}"id="edit"> Edit Profile </button>
  <button data-id="${user.id}" id="delete"> Delete Profile </button>
  <button data-id="${user.id}" id="my-reviews"> See My Reviews </button>
  <button data-id="${user.id}" id="write-review-button"> Make A Review </button>
  `
  signUpButton.style.display = "none"
  signInButton.style.display ="none"
}

function slapLocation(location){
  locationViewDiv.innerHTML += `<ul><li id="location" data-id="${location.id}"> ${location.name} / ${location.state}</li> </ul>`
}

function slapRecommendation(recommendation){
  recommendationUl.innerHTML += ""
  locationViewDiv.append(recommendationUl) //why?
  recommendationUl.innerHTML +=`
  <ul class="recommendation" data-id="${recommendation.id}">
     <li> Type of: ${recommendation.type_of}</li>
     <li> Place: ${recommendation.place}</li>
     <li> Description: ${recommendation.description}</li>
     <li> Rate: ${recommendation.rate}</li>
     <li> Price Range: ${recommendation.price_range}</li>
  </ul>
  <button data-id="${recommendation.id}" data-likes="${recommendation.like}" class="like-button"> <span class="like">${recommendation.like} </span>Like </button> `}

function showMyRecommendation(recommendation){
    // locationViewDiv.append(recommendationUl) //why?
    showMyReview.innerHTML +=`
       <li> Type of: ${recommendation.type_of}</li>
       <li> Place: ${recommendation.place}</li>
       <li> Description: ${recommendation.description}</li>
       <li> Rate: ${recommendation.rate}</li>
       <li> Price Range: ${recommendation.price_range}</li>
    </ul>  <br>

    <button data-id="${recommendation.id}" id="delete-recommendation"> Delete your recommendation </button>`
    }


function fetchLocations(){
  fetch('http://localhost:3000/locations')
  .then(res=>res.json())
  .then(locationArray => locationArray.forEach(function(location){
      slapLocation(location)
    })
  )
}

fetchLocations()

function logOutButton(){
  let logOutButton = document.createElement("button")
  logOutButton.className = ".log-out-button"
  logOutButton.innerText = "Log Out"
  signDiv.append(logOutButton)
  logOutButton.addEventListener('click', e=>{
    localStorage.clear()
    signDiv.innerHTML = ""
    locationViewDiv.innerHTML = ""
    pleaseDiseppearUl.style.display = "inline-block"
    fetchLocations()
    signUpButton.style.display = "inline-block"
    signInButton.style.display ="inline-block"
  })
}

locationViewDiv.addEventListener('click', e => {
    recommendationUl.innerHTML = ""
  if(e.target.tagName === 'LI'){
    let id = e.target.dataset.id
    fetch(`http://localhost:3000/locations/${id}`)
     .then(res=>res.json())
     .then(object => object.recommendations.forEach(function(recommendation){
       slapRecommendation(recommendation)
     }))

  }
})

signUpButton.addEventListener('click', e => {
  signUpForm()
  let form = signDiv.querySelector('.sign-up')
  let nameInput = document.querySelector("#name")
  let usernameInput = document.querySelector("#username")
  signUpButton.style.display = "none"
  signInButton.style.display = "inline-block"
  form.addEventListener('submit', e =>{
    e.preventDefault()
    postFetchForSignUp()
    // logOutButton()
    locationViewDiv.innerHTML = ""
    writeReview()
    pleaseDiseppearUl.style.display = "none"

  })
})

signInButton.addEventListener('click', e => {
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
        object.recommendations.forEach(function(recommendation){
          showMyRecommendation(recommendation)
        })
      })
  }
})

showMyReview.addEventListener('click', e => {

  if(e.target.id === "delete-recommendation"){
    fetch(`http://localhost:3000/recommendations/${e.target.dataset.id}`, {
      method: 'DELETE'
    })
    
    showMyReview.innerHTML += `<p> Review Deleted! </p>`
  }
})

recommendationUl.addEventListener('click', e => {
  // e.preventDefault()
  if(e.target.className === "like-button"){
    let likeAmount = e.target.dataset.likes
    likeAmount++
    let id = e.target.dataset.id
    let likeSpan =  recommendationUl.querySelector('.like')

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

      slapRecommendation(object)
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
  signDiv.addEventListener('click', e =>{

    if (e.target.id === "write-review-button"){
    locationViewDiv.innerHTML =""
    fetchLocations()
    locationViewDiv.innerHTML += "<h3> Click a location to make a review</h3>"
    main.addEventListener('click', e=> {
      if(e.target.id === 'location'){
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
          showMyRecommendation(recommendation) /// THEN I SLAP RECOMMENDATIONS ON TO THE DOM

          main.innerHTML = ""
          fetchLocations()
         })

         // typeOf.value = ""
         // description.value = ""
         // priceRange.value = ""
         // rate.value =""
         // place.value =""
         // main.innerHTML = ""
         // fetchLocations()
       })  /// This closes => formforReview.addEventListener
      }
    })
  }
  })
}
