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
    '<h5 class="admin-nav__heading">User</h5><ul class="side-nav"><a href="/me">Settting</a></li> <li><a href="/yourfav">Your Favourites</a></li></ul>'
}

const allRecipe = async () =>{
  try{
      const res = await axios({
          method: 'GET',
          url: 'https://starfish-app-28zzy.ondigitalocean.app/api/v1/recipes',
      })
      displayRecipes(res.data.data)
  } catch(err){
    showAlert('error',err)
  }
}
allRecipe()

const displayRecipes = (recipes) => {
    var arr = recipes;
  
    for (let i = 0; i < arr.length; i++) {
      const element = arr[i];
  
      // Check if the userId matches
      if (obj._id !== element.userId) {
        continue; // Skip to the next iteration if userId doesn't match
      }
  
      // Clone the card template
      var card = document.querySelector('.card').cloneNode(true);
      var el1 = card.querySelector('.card__picture');
      var el2 = card.querySelector('.card__sub-heading');
      var el3 = card.querySelector('.card__text');
      var el4 = card.querySelector('i');
      var el5 = card.querySelector('.publishedBy');
      var deleteButton = card.querySelector('.deleteButton');

             // Set the data-value attribute of the delete button to the _id of the recipe
             deleteButton.dataset.value = element._id;
      // Populate the card with recipe data
      el1.innerHTML = `
        <div class="card picture-overlay">&nbsp;</div>
        <img src="${element.image}" alt="Recipe picture" class="card__picture-img"/>
      `;
      el2.innerHTML = `Recipe Name: ${element.recipeName}`;
      el3.innerHTML = `Difficulty: ${element.difficulty}`;
      el4.dataset.star = element.averageRating;
      el5.innerHTML = `Published By: ${element.publishedBy}`;
        // Add event listener to the delete button
      deleteButton.addEventListener('click',async (event) => {
        // Retrieve the data-value attribute and log it
        const recipeId = deleteButton.getAttribute('data-value');
        event.preventDefault();
        // Stop the event propagation to prevent it from triggering the card click event
        event.stopPropagation();
        const confirmed = window.confirm("Are you sure you want to delete this recipe?");

        // If user confirms, proceed with deletion
        if (confirmed) {
            try {
                const deletedRecipe = await deleteRecipe(recipeId);
                // Handle any success or error response from the delete operation
                showAlert('success', 'Deleted successfully!')
                //Reload the window after 1.5 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } catch (error) {
                showAlert('error', error);
            }
        } else {
            // If user cancels, do nothing
            console.log('Deletion cancelled by user.');
        }
      });

      // Add event listener to the card for navigation
      card.addEventListener('click', () => {
        window.location.href = '/recipe-detail?id=' + element._id;
      });
  
      // Insert the cloned card into the DOM
      var card2 = document.querySelector('.card');
      card2.insertAdjacentElement('afterend', card);
    }
  
    // Remove the original card template
    document.querySelector('.card').remove();
  };

  const deleteRecipe = async (recipeId) => {
    try {
        const res = await axios.delete(`https://starfish-app-28zzy.ondigitalocean.app/api/v1/recipes/${recipeId}`);
        return res.data.data;
    } catch (err) {
        showAlert('error', err);
    }
};
  


