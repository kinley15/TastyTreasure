import { showAlert  } from "./alert.js"
var obj 
if (document.cookie) {
    obj = JSON.parse(document.cookie.substring(6))
} else {
  obj = JSON.parse('{}')
}


var el = document.querySelector('.nav.nav--user')
if (obj._id) {
  el.innerHTML = 
    '<a href="/"  class="nav__el"> Home</a><a href="/addrecipe"  class="nav__el">Add Recipes</a> <a href="/me" class="nav__el"><img src="' +
    obj.photo +
    '"alt="Photo of ${user.name}" class="nav__user-img" /><span>' +
    obj.name +
    '</span>'



} else {
    el.innerHTML =
        '<a class="nav__el navel--cta" href="/login">Log in</a> <a class="nav__el navel--cta" href="/signup">Sign up</a>'
}

const allRecipe = async () =>{
    try{
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/recipes',
        })
        displayRecipes(res.data.data)
    } catch(err){
        console.log(err)
    }
}
allRecipe()

const displayRecipes = (recipes) =>{
    var arr = recipes
   
    for (let i =0; i< arr.length; i++){
        var card = document.querySelector('.card').cloneNode(true)
        var el1 = card.querySelector('.card__picture')
        var el2 = card.querySelector('.card__sub-heading')
        var el3 = card.querySelector('.card__text')
        var el4 = card.querySelector('i')
        var el5 = card.querySelector('.publishedBy')
        
  
        
       

        const element = arr[i]
        el1.innerHTML = ' <div class="card picture-overlay">&nbsp;</div><img src="'+
        element.image
        +'" alt="news 1 picture" class="card__picture-img"/>' 
        
        el2.innerHTML = element.recipeName
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