import { showAlert } from "./alert.js";

let obj;
if (document.cookie) {
  obj = JSON.parse(document.cookie.substring(6));

} else {
  obj = {};
}

const userId = obj._id;


const el = document.querySelector('.nav.nav--user');
if (obj._id) {
  el.innerHTML = `
    <a href="/" class="nav__el"> Home</a>
    <a href="/addrecipe" class="nav__el">Add Recipes</a>
    <a href="/me" class="nav__el">
      <img src="${obj.photo}" alt="Photo of ${obj.name}" class="nav__user-img" />
      <span>${obj.name}</span>
    </a>
  `;
} else {
  el.innerHTML = `
    <a class="nav__el navel--cta" href="/login">Log in</a>
    <a class="nav__el navel--cta" href="/signup">Sign up</a>
  `;
}

// Get the recipeId from the URL query parameters
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipeId = urlParams.get('id');

const getDetailRecipes = async (recipeId) => {
  try {
    const res = await axios.get(`http://localhost:4001/api/v1/recipes/${recipeId}`);
    if (obj._id) {
        const feedbackBack = document.querySelector('.feedback-box');
        const timeline = document.querySelector('.timeline');
        if (feedbackBack) feedbackBack.style.display = 'inline-block';
        if (timeline) timeline.style.display = 'inline-block';
        fetchRecipeDetails(res.data.data);

      } else {
        const feedbackBack = document.querySelector('.feedback-box');
        const timeline = document.querySelector('.timeline');
        if (feedbackBack) feedbackBack.style.display = 'none';
        if (timeline) timeline.style.display = 'none';

        fetchRecipeDetails(res.data.data);

      }
  } catch (err) {
    showAlert('error','Error fetching recipe details. Please try again later.');
  }
};

const fetchRecipeDetails = (recipe) => {
  document.querySelector('.header1').innerHTML = `
    <h1>
      <p>How to make <em>${recipe.recipeName}</em></p>
      <hr>
    </h1>
    <img src="${recipe.image}" title="${recipe.recipeName}" height="500" width="800">
  `;
  document.querySelector('.row').innerHTML =`<div class="col">Level of difficulty : ${recipe.difficulty}</div>
  <div class="col ">Posted By : ${recipe.publishedBy}</div>`

  document.querySelector('.Ingredients').innerHTML =` <h2>Ingredients<i id="ingredients" class="fa fa-coffee" aria-hidden="true"></i></h2>
  <div class ="content">${recipe.ingredients}</div>`
  document.querySelector('.Preparation').innerHTML = `<h2>Preparation<i id="preparation" class="fa fa-check" aria-hidden="true"></i></h2>
  <div class = "content">${recipe.directions}</div>`

};

document.querySelector('.feedback-box').innerHTML =`<h1>Rate This Recipe</h1>
<div class="rating-box">
    <img src="https://cdn-icons-png.flaticon.com/128/2307/2307692.png" alt="very bad" class="smiley" data-rating="1">
    <img src="https://cdn-icons-png.flaticon.com/128/132/132244.png" alt="bad" class="smiley" data-rating="2">
    <img src="https://cdn-icons-png.flaticon.com/128/2307/2307702.png" alt="average" class="smiley" data-rating="3">
    <img src="https://cdn-icons-png.flaticon.com/128/6637/6637207.png" alt="good" class="smiley" data-rating="4">
    <img src="https://cdn-icons-png.flaticon.com/128/520/520433.png" alt="very good" class="smiley" data-rating="5">
</div>
<div class="descriptive-texts">
    <h4>very bad</h4>
    <h4>very good</h4>
</div>`

document.querySelector('.timeline-item').innerHTML = `<span class="timeline-item-icon | avatar-icon">
<i class="avatar">
    <img src="${obj.photo}" /></i></span>
    <form class="form">
<div class="new-comment">
    <input id="addComment" type="text" placeholder="Add a comment..." />
</div>
<div class="submit">
    <button type="submit">Comment</button>
</div>

</form>`



getDetailRecipes(recipeId);


const addComments = async (userId, recipeID, comments) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:4001/api/v1/comments/post',
           data:{
            userId,
            recipeID,
            comments
           }
         
        });
       

        if (res.data.status === 'success') {
            showAlert('success', 'commented  successfully');
            location.reload(true)
        }
    } catch (err) {
        showAlert('error', 'Failed to add comment');
    }
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const recipeID= recipeId;
    const comments = document.getElementById('addComment').value;

    
 
    addComments(userId,recipeID,comments);

});


const getAllComments = async () =>{
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4001/api/v1/comments'
        })
        const usercomments = []
        const comments = res.data.data
        comments.forEach(comment => {
            if(comment.recipeID===recipeId){
                usercomments.push(comment)

            }
            
        });
        fetchComments(usercomments)
        
    } catch (error) {
        console.log(error);
        
    }
}
getAllComments()

const fetchComments = async (comments)=>{
    const timelineWrapper = document.querySelector('.timeline-item-wrapper');
    timelineWrapper.innerHTML =''
    for (const comment of comments) {
        const userDetails = await getUserDetails(comment.userId); // Fetch user details
    
        const commentCard0 = document.createElement('div');
        commentCard0.classList.add('timeline');
        // Create a new div element for the comment
        const commentCard = document.createElement('div');
        commentCard.classList.add('timeline-item-description');

        const commentCard1 = document.createElement('div');
        commentCard1.classList.add('comment');
    
        // Create HTML structure for the comment
        commentCard.innerHTML = `
            <i class="avatar | small">
                <img src="${userDetails.photo}" />
            </i>
            <span>${userDetails.name}</span>
        `;
        commentCard1.innerHTML = `<p>${comment.comments}</p>`

        commentCard0.appendChild(commentCard);
        commentCard0.appendChild(commentCard1);
    
        // Append the comment card to the timeline wrapper
        timelineWrapper.appendChild(commentCard0);
    }

    
}
const getUserDetails = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:4001/api/v1/users/${userId}`);
      return res.data.data;
    } catch (err) {
      showAlert('error', 'Failed to fetch user details');
    }
};

const addRating = async (rating)=>{
    try {
        const res = await axios.post('http://localhost:4001/api/v1/recipes/rate', {
            recipeId,
            rating,
            userId
        });

        if (res.data.status === 'success') {
            showAlert('success', 'Rated successfully');
            // fetchAverageRating(recipeId);
        }
    } catch (err) {
        showAlert('error', 'Failed to submit rating');
    }
}
document.querySelectorAll('.smiley').forEach(smiley => {
    smiley.addEventListener('click', (e) => {
        const rating = e.target.getAttribute('data-rating');
        addRating(rating);
    });
});
var isFavorite = obj.fav.some(fav => fav.recipeId === recipeId);

// If the recipe is a favorite, add the active class to the favorite element
if (isFavorite) {
    $('.click').addClass('active');
    $('.click').addClass('active-2');
    setTimeout(function() {
        $('span').addClass('fa-heart');
        $('span').removeClass('fa-heart-o');
    }, 150);
    setTimeout(function() {
        $('.click').addClass('active-3');
    }, 150);
    $('.info').addClass('info-tog');
    setTimeout(function() {
        $('.info').removeClass('info-tog');
    }, 1000);
}
$('.click').click(function() {
	if ($('span').hasClass("fa-heart")) {
    addfav();
			$('.click').removeClass('active')

		setTimeout(function() {
			$('.click').removeClass('active-2')
		}, 30)
			$('.click').removeClass('active-3')
		setTimeout(function() {
			$('span').removeClass('fa-heart')
			$('span').addClass('fa-heart-o')
		}, 15)
	} else {
    addfav();

		$('.click').addClass('active')
		$('.click').addClass('active-2')
		setTimeout(function() {
			$('span').addClass('fa-heart')
			$('span').removeClass('fa-heart-o')
		}, 150)
		setTimeout(function() {
			$('.click').addClass('active-3')
		}, 150)
		$('.info').addClass('info-tog')
		setTimeout(function(){
			$('.info').removeClass('info-tog')
		},1000)
	}
})

const addfav = async()=>{
  try {
    const res = await axios.post('http://localhost:4001/api/v1/users/addfav',{
      recipeId,
      userId
    });
    if (res.data.status === 'success') {
      showAlert('success', 'add to favourite successfully');
      // fetchAverageRating(recipeId);
      var obj = res.data.data.user
      document.cookie =' token = '+JSON.stringify(obj) 
      location.reload(true)
  }
    
  } catch (error) {
    showAlert('error', 'Failed to add');
    
  }
}
