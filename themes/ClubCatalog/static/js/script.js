const clubs = document.querySelectorAll('.club');
const clubsContainer = document.getElementById('clubs');
const hiddenClubs = document.getElementById('hidden-clubs');

function getCategory(club){
  let cur = club.querySelector('.club-category').textContent;
  cur = cur.replace(/[\n\r]/g, '');
  cur = cur.trim();
  return cur;
}
function getAllCategories(){
  let categories = [];
  clubs.forEach(club => {
    const cur = getCategory(club)
    if (!categories.includes(cur)){
      categories.push(cur);
    }
  })
  console.log(categories);
  return categories;
}


// filter categories
function updateClubsDisplayed(){
  let selectedCategories = [];
  document.querySelectorAll('.filter-category[data-selected="true"]').forEach(category => selectedCategories.push(category.dataset.category));
  
  clubs.forEach(club => {
    const cur = getCategory(club);
    if ( selectedCategories.includes(cur) ){
      club.classList.remove('hidden-none');
    } else {
      club.classList.add('hidden-none');
    }
    
  });
}

const categories = document.querySelectorAll('.filter-category');
categories.forEach(tag => {
  // set num clubs in tag
  console.log(document.querySelectorAll(`.club[data-category='${tag.dataset.category}']`).length)
  tag.dataset.numClubs = document.querySelectorAll(`.club[data-category='${tag.dataset.category}']`).length;

  // add click listener
  tag.addEventListener("click", () => {
    tag.dataset.selected = (tag.dataset.selected === "true") ? 'false' : 'true';
    updateClubsDisplayed();
  });
});





// EXPANDS TAGS
function expandTagsContainer(force=null){
  const container = document.getElementById("categories-container");
  if (force === true || force === false){
    container.classList.toggle('hidden-none', force);
    expandTags.classList.toggle('unexpanded', force);
  } else {
    container.classList.toggle('hidden-none');
    expandTags.classList.toggle('unexpanded');
  }
}
const expandTags = document.getElementById("expand-tags");
expandTags.addEventListener("click", () => {
  expandTagsContainer();
});
window.addEventListener('click', (e) => {
  const clicked = e.target;
  if (!clicked.closest('.site-header')){
    expandTagsContainer(true);
  }
});

// CLEAR TAGS & SELECT ALL TAGS
const clearTags = document.getElementById("clear-tags");
clearTags.addEventListener("click", () => {
  categories.forEach(tag => {
    tag.dataset.selected = "false";
    expandTagsContainer(false)
    updateClubsDisplayed();
  });
});
const selectAllTags = document.getElementById("select-all-tags");
selectAllTags.addEventListener("click", () => {
  categories.forEach(tag => {
    tag.dataset.selected = "true";
    expandTagsContainer(false)
    updateClubsDisplayed();
  });
});




// search bar

async function getClubData() {
  const response = await fetch('/clubsdata.json');
  const data = await response.json();
  return data
}

async function fuseSearch(input){
  const options = {
    keys: [
      {
        name: 'Club Name (Full Name please)',
        weight: 0.7
      },
      {
        name: 'Club Description',
        weight: 0.5
      },
      {
        name: 'New Club',
        weight: 0.3
      },
      {
        name: 'Main Contact Name',
        weight: 0.1
      },
    ]
  }

  const clubsData = await getClubData();
  const fuse = new Fuse(clubsData.Clubs, options);
  const result = fuse.search(input);

  // return result filtered
  let clubs = [];
  result.forEach(club => {
    clubs.push(club.item["Club Name (Full Name please)"]); // pushes title
  });

  return clubs;
}


const search = document.getElementById('search');
search.addEventListener('input', () => {
  // search
  const input = search.value;
  fuseSearch(input).then( result => {
    // if no match found, display all clubs
    if (result.length == 0){
      clubs.forEach(club => {
        clubsContainer.appendChild(club);
      })
      return;
    }

    // move all clubs to hidden container / hide all clubs
    clubs.forEach(club => {
      hiddenClubs.appendChild(club);
    })

    // from container, querySelect each with title
    result.forEach(item => {
      const club = document.querySelector(`[data-club="${item}"]`);
      clubsContainer.appendChild(club);
    });
  });
  
});