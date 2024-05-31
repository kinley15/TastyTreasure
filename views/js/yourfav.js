import {showAlert} from './alert.js'

const logout = async () => {
  try {
      const res = await axios({
          method: 'GET',
          url: 'https://starfish-app-28zzy.ondigitalocean.app/api/v1/users/logout',
      })
      if (res.data.status === 'success') {
          location.href="/";
          
          
      }
  } catch (err) {
      showAlert('error', 'Error logging out! Try Again.')
  }
}

var obj = JSON.parse(document.cookie.substring((6)))

var el = document.querySelector('.nav.nav--user')
if (obj._id) {
  el.innerHTML = 
    '<a id = "logout" class="nav__el">Log out</a>'
  var doc = document.querySelector('#logout')

  doc.addEventListener('click', (e) => logout())
} else {
    el.innerHTML =
        '<a class="nav__el navel--cta" href="/login">Log in</a> <a class="nav__el navel--cta" href="/signup">Sign up</a>'
}

var el = document.querySelector('.admin-nav')
if(obj.role == "admin"){
    el.innerHTML =
    '<h5 class="admin-nav__heading">Admin</h5><ul class="side-nav"><a href="#"><svg><use xlink:href="img/icons.svg#icon-users"></use> </svg>Manage users</a></li> <li><a href="#"><svg><use xlink:href="img/icons.svg#icon-star"></use></svg>Manage News</a></li><li><a href="#"><svg><use xlink:href="img/icons.svg#icon-briefcase"></use></svg>Manage E-Services</a></li></ul>'
}else if(obj.role =='sme'){
    el.innerHTML =
    '<h5 class="admin-nav__heading">Subject Matter Expert</h5><ul class="side-nav"><li><a href="#"><svg><use xlink:href="img/icons.svg#icon-star"></use></svg>Manage News</a></li></ul>'
}else if(obj.role=='pharmacist'){
    el.innerHTML =
    '<h5 class="admin-nav__heading">Pharmacist</h5><ul class="side-nav"><li><a href="#"><svg><use xlink:href="img/icons.svg#icon-star"></use></svg>Manage E-Services</a></li></ul>'
}else{
    el.innerHTML =
    '<h5 class="admin-nav__heading">User</h5><ul class="side-nav"><a href="/me">Settting</a></li> <li><a href="/yourpost">Your Recipe</a></li></ul>'
}

const currentUserId = obj._id; // Assuming you have the current user ID stored in obj

// Function to get user details
const getUserDetails = async (currentUserId) => {
  try {
      const res = await axios.get(`https://starfish-app-28zzy.ondigitalocean.app/api/v1/users/${currentUserId}`);
      return res.data.data;
  } catch (err) {
    showAlert('error', err);
  }
};

const currentuser = await getUserDetails(currentUserId)

const fav = currentuser.fav;


const getFavoriteRecipes = async (favoriteRecipes) => {
  try {
      const promises = favoriteRecipes.map(async (favorite) => {
          // Send a GET request for each recipe ID
          const res = await axios.get(`https://starfish-app-28zzy.ondigitalocean.app/api/v1/recipes/${favorite.recipeId}`);
          return res.data; // Return the response data for each recipe
      });
      
      // Wait for all the promises to resolve
      const recipeDetails = await Promise.all(promises);
      displayRecipes(recipeDetails)
  } catch (error) {
    showAlert('error', error);
  }
};
getFavoriteRecipes(fav);

const displayRecipes = (recipes) =>{
  var arr = recipes
 
  for (let i =0; i< arr.length; i++){
      var card = document.querySelector('.card').cloneNode(true)
      var el1 = card.querySelector('.card__picture')
      var el2 = card.querySelector('.card__sub-heading')
      var el3 = card.querySelector('.card__text')
      var el4 = card.querySelector('i')
      var el5 = card.querySelector('.publishedBy')
      

      
     

      const element = arr[i].data
      el1.innerHTML = ' <div class="card picture-overlay">&nbsp;</div><img src="'+
      element.image
      +'" alt="news 1 picture" class="card__picture-img"/>' 
      
      el2.innerHTML = 'Recipe Name : ' + element.recipeName
      el3.innerHTML = 'Difficulty : ' + element.difficulty
      el4.dataset.star = element.averageRating;

      el5.innerHTML = 'Published By : ' + element.publishedBy

      // Add event listener to the card for navigation
      card.addEventListener('click', () => {
          // Navigate to detail page passing recipe ID or any other identifier
          window.location.href = '/recipe-detail?id=' + element._id;
      });
      
      var card2 = document.querySelector('.card')
      card2.insertAdjacentElement('afterend', card)
  }
  document.querySelector('.card').remove()
}


