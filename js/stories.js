"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      <!-- <i class="far fa-star favorite"></i> -->
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <div class="remove-button">X</div>
      </li>
    `);
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story)
  const starType = isFavorite ? "fas" : "far"
  return `<span class="star">
            <i class="${starType} fa-star"></i>
          <span>`
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

async function instantiateRemover() {
  $(".remove-button").on('click', function (event) {
    console.log(event)
    const $target = $(event.target)
    const $item = $target.closest("li")
    const storyId = $item.attr("id")

    removeStory(currentUser, storyId)
  })
}

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  instantiateRemover()
  $allStoriesList.show();
}

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage")

  $favoriteStoriesList.empty()

  for (let story of currentUser.favorites) {
    // console.log(story)
    const $story = generateStoryMarkup(story)
    console.log($story)
    $favoriteStoriesList.show();
    $favoriteStoriesList.append($story);
  }
  console.log(currentUser.favorites[0])
}

function submitNewStory(event) {
  event.preventDefault()
  // console.log(event.target[0].value)
  let title = event.target[1].value
  let author = event.target[0].value
  let url = event.target[2].value

  const newStory = {title: title, author: author, url: url}
  storyList.addStory(currentUser, newStory)
  $submissionForm.hide()
}

$submitPost.on("submit", submitNewStory)

async function toggleStoryFavorite(event) {
  const $target = $(event.target)
  const $item = $target.closest("li")
  const storyId = $item.attr("id")
  const story = storyList.stories.find(s => s.storyId === storyId)

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story)
    $target.closest("i").toggleClass("fas far")
  } else {
    await currentUser.addFavorite(story)
    $target.closest("i").toggleClass("fas far")
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);


// async function removeStory(event) {
//   preventDefault()
//   console.log("Hello")

// }
