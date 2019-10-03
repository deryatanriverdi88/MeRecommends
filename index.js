let main = document.getElementById("main")
let writeReviewLi = document.getElementById("write-review")
let signUpLi = document.getElementById("sign-up")
let signInLi = document.getElementById("sign-in")
let body = document.querySelector("body")

body.addEventListener('mouseover', function(e){
  e.target.style.cursor = "pointer"
})

/// THIS IS FOR SLAPING LOCATION NAME / LOCATION STATE ON TO THE DOM ///
function slapLocation(location){
  main.innerHTML += `<p id="location" data-id="${location.id}"> ${location.name} / ${location.state} </p>`
}

/// THIS IS FOR SLAPING A SINGLE USER ON TO THE DOM ///
function slapUser(user){
  main.innerHTML += `<p data-id="${user.id}"> Name : ${user.name}<br> Username : ${user.username} </p>`
}

/// THIS IS FOR SLAPING RECOMMENDATIONS ON TO THE DOM ///
function slapRecommendation(recommendation){

  let ulDiv = document.createElement("div")

  main.append(ulDiv)
  ulDiv.innerHTML += `<ul id="recommendation" data-id="${recommendation.id}">
     <li> Type of: ${recommendation.type_of}</li>
     <li> Place: ${recommendation.place}</li>
     <li> Description: ${recommendation.description}</li>
     <li> Rate: ${recommendation.rate}</li>
     <li> Pricee Range: ${recommendation.price_range}</li>
  </ul>
  `
}

/// THIS IS A FORM FOR CREATING A USER
function signUpForm(){
  main.innerHTML = `<form class="sign-up">
        <input id="name" type="text" name="name" placeholder="Your name" autocomplete="off" />
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
        <input type="submit" value="Sign Up" class="sign-up-submit">
      </form>`
}

/// THIS IS FOR CREATING A USER ///
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
    slapUser(user)
  })
}

/// THIS IS A FORM FOR SIGN IN ///
function signInForm(){
  main.innerHTML = `<form class="sign-in">
        <input id="username" type="text" name="username" placeholder="Your username" autocomplete="off" />
        <input type="submit" value="Sign In" class="sign-in-submit">
      </form>`
}

///THIS IS A FORM FOR CREATING A REVIEW ///
function reviewForm(user, locationId){
  main.innerHTML = `<form class="new-review">
        <input data-id= "${user.id}"id="user" type="hidden" name="user" />
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

/// THIS IS FOR FETCHING FOR ALL LOCATIONS ///
function fetchLocations(){
fetch('http://localhost:3000/locations')
.then(res=>res.json())
.then(locationArray =>{
  locationArray.forEach((location => {
      slapLocation(location)
  }))
 })
}

/// THIS INVOKES THE fetchLocations FUNCTION
fetchLocations()

/// EVENT LISTENER FOR SIGN UP ///
signUpLi.addEventListener("click", function(e){
  main.innerHTML = ""
  signUpForm()
  let form = document.querySelector(".sign-up")
  let usernameInput = document.querySelector('#username')
  form.addEventListener("submit", function(e){
    e.preventDefault()
       postFetchForSignUp()
       fetch('http://localhost:3000/users') /// THEN I MAKE A FETCH REQUEST TO USERS
       .then(res=>res.json()) /// THIS WILL CONVERT PROMISE INTO JSON FILE
       .then(usersArray => {  /// IN THIS CASE, JSON FILE RETURNS AN ARRAY OF USERS
       let user = usersArray.find(function(user){ /// THIS IS FOR TO FIND USERNAME PASSED IN WITH THE FORM AND SAVE IT TO THE VARIABLE
           return user.username === usernameInput.value
         })
         fetchLocations() /// THEN I FETCH ALL THE LOCATIONS
         main.addEventListener('click', function(e){ /// THEN I ADD A EVENT LISTENER TO MAIN OBJECT
           if(e.target.id === "location"){ /// I CHECK IF THE TARGET AREA IS LOCATION
             let locationId = parseInt(e.target.dataset.id) /// IF SO, I GET THE ID OF THE LOCATION AND CONVERT INTO AN INTEGER
             // debugger
             reviewForm(user, location) /// THEN I INVOKE THE REVIEWFORM, USER AND LOCATION IS HIDDEN, AND I PASSED THE USER AND LOCATION  I COLLECTED
             let formforReview = document.querySelector(".new-review") /// THEN I FOUND THE FORM DOCUMENT

             formforReview.addEventListener('submit', function(e){  /// THEN I ADD A EVENT LISTENER TO THE FORM
               console.log("")
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
                  user_id: user.id,
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
          } /// This closes => if(e.target.id === "location")
        }) /// This closes => main.addEventListener
      }) /// This closes => .then(usersArray => {})
    })
}) /// Done

/// EVENT LISTENER FOR SIGN IN ///
signInLi.addEventListener("click", function(e){
      main.innerHTML = ""   /// FIRST I CLEARED <main> AREA WHERE I WANTED TO LOCATE TH ITEMS
      signInForm() /// WHEN SIGN IN CLICKED, I CALL THE signInForm
      let form = document.querySelector(".sign-in") /// THEN I FIND THE FORM DOCUMENT
      form.addEventListener("submit", function(e){ /// THEN I ADD EVENT LISTENER TO FORM
        e.preventDefault() /// THIS WILL PREVENT PAGE THE RELOAD
        let usernameInput = document.querySelector("#username") /// THIS IS FOR TO FIND USERNAME INPUT

        fetch('http://localhost:3000/users') /// THEN I MAKE A FETCH REQUEST TO USERS
        .then(res=>res.json()) /// THIS WILL CONVERT PROMISE INTO JSON FILE
        .then(usersArray => {  /// IN THIS CASE, JSON FILE RETURNS AN ARRAY OF USERS
        let user = usersArray.find(function(user){ /// THIS IS FOR TO FIND USERNAME PASSED IN WITH THE FORM AND SAVE IT TO THE VARIABLE
            return user.username === usernameInput.value
          })
          slapUser(user) /// THEN I SLAP THE USER I GET FROM FIND CONDITION WHICH I SAVED IN USER VARIABLE
          fetchLocations() /// THEN I FETCH ALL THE LOCATIONS
          main.addEventListener('click', function(e){ /// THEN I ADD A EVENT LISTENER TO MAIN OBJECT
            if(e.target.id === "location"){ /// I CHECK IF THE TARGET AREA IS LOCATION
              let locationId = parseInt(e.target.dataset.id) /// IF SO, I GET THE ID OF THE LOCATION AND CONVERT INTO AN INTEGER
              // debugger
              reviewForm(user, location) /// THEN I INVOKE THE REVIEWFORM, USER AND LOCATION IS HIDDEN, AND I PASSED THE USER AND LOCATION  I COLLECTED
              let formforReview = document.querySelector(".new-review") /// THEN I FOUND THE FORM DOCUMENT

              formforReview.addEventListener('submit', function(e){  /// THEN I ADD A EVENT LISTENER TO THE FORM
                console.log("")
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
                   user_id: user.id,
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
           } /// This closes => if(e.target.id === "location")
         }) /// This closes => main.addEventListener
       }) /// This closes => .then(usersArray => {})
      }) /// This closes => form.addEventListener
    })  /// This closes => signInLi.addEventListener


writeReviewLi.addEventListener('click', function(e){
  createReviewFromWriteAReview()
})

function createReviewFromWriteAReview(){
  main.innerHTML = ""   /// FIRST I CLEARED <main> AREA WHERE I WANTED TO LOCATE TH ITEMS
      signInForm() /// WHEN SIGN IN CLICKED, I CALL THE signInForm
      let form = document.querySelector(".sign-in") /// THEN I FIND THE FORM DOCUMENT
      form.addEventListener("submit", function(e){ /// THEN I ADD EVENT LISTENER TO FORM
        e.preventDefault() /// THIS WILL PREVENT PAGE THE RELOAD
        let usernameInput = document.querySelector("#username") /// THIS IS FOR TO FIND USERNAME INPUT

        fetch('http://localhost:3000/users') /// THEN I MAKE A FETCH REQUEST TO USERS
        .then(res=>res.json()) /// THIS WILL CONVERT PROMISE INTO JSON FILE
        .then(usersArray => {  /// IN THIS CASE, JSON FILE RETURNS AN ARRAY OF USERS
        let user = usersArray.find(function(user){ /// THIS IS FOR TO FIND USERNAME PASSED IN WITH THE FORM AND SAVE IT TO THE VARIABLE
            return user.username === usernameInput.value
          })
          slapUser(user) /// THEN I SLAP THE USER I GET FROM FIND CONDITION WHICH I SAVED IN USER VARIABLE
          fetchLocations() /// THEN I FETCH ALL THE LOCATIONS
          main.addEventListener('click', function(e){ /// THEN I ADD A EVENT LISTENER TO MAIN OBJECT
            if(e.target.id === "location"){ /// I CHECK IF THE TARGET AREA IS LOCATION
              let locationId = parseInt(e.target.dataset.id) /// IF SO, I GET THE ID OF THE LOCATION AND CONVERT INTO AN INTEGER
              // debugger
              reviewForm(user, location) /// THEN I INVOKE THE REVIEWFORM, USER AND LOCATION IS HIDDEN, AND I PASSED THE USER AND LOCATION  I COLLECTED
              let formforReview = document.querySelector(".new-review") /// THEN I FOUND THE FORM DOCUMENT

              formforReview.addEventListener('submit', function(e){  /// THEN I ADD A EVENT LISTENER TO THE FORM
                console.log("")
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
                   user_id: user.id,
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
           } /// This closes => if(e.target.id === "location")
         }) /// This closes => main.addEventListener
       }) /// This closes => .then(usersArray => {})
      }) /// This closes => form.addEventListener
}


//
// main.addEventListener('click', function(e){
//   if(e.target.id === "location"){
//
//     let id = e.target.dataset.id
//     fetch(`http://localhost:3000/locations/${id}`)
//       .then(res=>res.json())
//       .then(object  => {
//         object.recommendations.map(function(recommendation){
//           slapRecommendation(recommendation)
//         object.users.map(function(user){
//           main.innerHTML += `<p> Author : ${user.name}</p>`
//         }) /// This closes => object.users.map
//        }) /// This closes => object.recommendations.map
//       }) /// This closes => .then(object  => {})
//    } /// This closes => if(e.target.id === "location")
// }) /// This closes => main.addEventListener
