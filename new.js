let body = document.querySelector("body")
let main = document.getElementById("main")
let writeReviewButton = document.getElementById('write-review-button')
let signUpButton = document.getElementById('sign-up-button')
let signInButton = document.getElementById('sign-in-button')
let signUpDiv = document.getElementById("sign-div")
let h1 = document.querySelector("h1")
let userShowDiv = document.querySelector("#user-show-div")




body.addEventListener('mouseover', function(e){
  e.target.style.cursor = "pointer"
})

function signUpForm(){
  signUpDiv.innerHTML = `<form class="sign-up">
        <input id="name" type="text" name="name" placeholder="Your name" autocomplete="off" />
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
        <input type="submit" value="Sign Up" class="sign-up-submit">
      </form>`
}

function signInForm(){
  signUpDiv.innerHTML = `<form class="sign-in">
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
        <input type="submit" value="Sign In" class="sign-in-submit">
      </form>`
}

function editForm(){
  signUpDiv.innerHTML = `<form class="edit-form">
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
        <label for="description"> Description </label>
        <input id="description" name="description" type="text" />
        <label for="price-range"> Price Range </label>
        <input id="price-range" name="price-range" type="text"/>
        <label for="rate"> Rate </label>
        <input id="rate" type="number" name="rate" />
        <label for="place"> Place </label>
        <input id="place" name="place" type="text"/>
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
  signUpDiv.innerHTML += `<h2> Signed In User </h2><p data-id="${user.id}"> Name : ${user.name}<br> Username : ${user.username} </p>
  <button data-id="${user.id}"id="edit"> Edit Profile </button>
  <button data-id="${user.id}" id="delete"> Delete Profile </button>
  <button data-id="${user.id}" id="my-reviews"> See My Reviews </button>
  `
}

function slapLocation(location){
  main.innerHTML += `<ul><li id="location" data-id="${location.id}"> ${location.name} / ${location.state}</li> </ul>`
}

function slapRecommendation(recommendation){
  main.innerHTML +=`<ul id="recommendation" data-id="${recommendation.id}">
     <li> Type of: ${recommendation.type_of}</li>
     <li> Place: ${recommendation.place}</li>
     <li> Description: ${recommendation.description}</li>
     <li> Rate: ${recommendation.rate}</li>
     <li> Pricee Range: ${recommendation.price_range}</li>
  </ul>  `}

function fetchLocations(){
  fetch('http://localhost:3000/locations')
  .then(res=>res.json())
  .then(locationArray => locationArray.forEach(function(location){
      slapLocation(location)

    })
  )
}

function logOutButton(){
  let logOutButton = document.createElement("button")
  logOutButton.className = ".log-out-button"
  logOutButton.innerText = "Log Out"
  signUpDiv.append(logOutButton)
  logOutButton.addEventListener('click', e=>{
    localStorage.clear()
    signUpDiv.innerHTML = ""
  })
}

// fetchLocations()

signUpButton.addEventListener('click', e => {
  signUpForm()
  let form = signUpDiv.querySelector('.sign-up')
  let nameInput = document.querySelector("#name")
  let usernameInput = document.querySelector("#username")
  form.addEventListener('submit', e =>{
    e.preventDefault()
    postFetchForSignUp()
    logOutButton()
  })
})

signInButton.addEventListener('click', e => {
  signInForm()
  let form = signUpDiv.querySelector('.sign-in')
  let usernameInput = document.querySelector("#username")
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
      } else {
        signUpDiv.innerHTML = `<p>This username does not exist</p>`
      }
      localStorage.id = user.id
      logOutButton()

   })
  })
})

signUpDiv.addEventListener('click', e=>{
  if(e.target.id === "edit"){
    editForm()
    let form = signUpDiv.querySelector('.edit-form')
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
    signUpDiv.innerHTML = `<p> Account Deleted! </p>`

  } else if (e.target.id === "my-reviews"){
    fetch(`http://localhost:3000/users/${localStorage.id}`)
      .then(res => res.json())
      .then(object => console.log(object))
  }
})


writeReviewButton.addEventListener('click', e =>{
  main.innerHTML = ""
  fetchLocations()
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
        slapRecommendation(recommendation) /// THEN I SLAP RECOMMENDATIONS ON TO THE DOM
       })

       typeOf.value = ""
       description.value = ""
       priceRange.value = ""
       rate.value =""
       place.value =""

     })  /// This closes => formforReview.addEventListener
    }
  })
})

if (localStorage.id){
  fetch(`http://localhost:3000/users/${localStorage.id}`)
    .then(res=>res.json())
    .then(user => {
      slapUser(user)
      logOutButton()
    })

}


// debugger
