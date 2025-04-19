//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.

/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
const playerList = document.querySelector("#puppybowl-container");
const playerForm = document.querySelector("#new-pup-form");

let players = [];
////////////////////////////



/**
 * Fetches all players from the API.
 * This function should not be doing any rendering
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  //TODO
  try {
    const response = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2501-ftb-et-web-am/players")
    const json = await response.json()
    return json.data.players;
  } catch (error) {
    console.error(error)
  }

};

/**
 * Fetches a single player from the API.
 * This function should not be doing any rendering
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  //TODO
  try {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2501-ftb-et-web-am/players/${playerId}`)
    const json = await response.json()
    return json.data.player;

  } catch (error) {
    console.error(error)
  }
};




/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * Do we have a way to do that currently...? 
*/
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */
/**
 * FOR TESTING PURPOSES ONLY PLEASE OBSERVE THIS SECTION
 * @returns {Object} the new player object added to database
 */

const addNewPlayer = async (newPlayer) => {
  //TODO
  try {
    const response = await fetch("https://fsa-puppy-bowl.herokuapp.com/api/2501-ftb-et-web-am/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPlayer)
    });
    const data = await response.json();
    console.log("Player added:", data);

  } catch (error) {
    console.error(error);
  }
};

playerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newPlayer = {
    name: event.target.name.value,
    imageUrl: event.target.imageUrl.value,
    id: event.target.id.value,
    breed: event.target.breed.value,
    team: event.target.team.value,
  };

  await addNewPlayer(newPlayer);

  players = await fetchAllPlayers();

  render();

  event.target.reset();
});

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() some information is required.
 * Unless we get that information, we cannot call removePlayer()....
 */
/**
 * Note#2: Don't be afraid to add parameters to this function if you need to!
 */

const removePlayer = async (playerId) => {
  //TODO
  try {
    const response = await fetch(`https://fsa-puppy-bowl.herokuapp.com/api/2501-ftb-et-web-am/players/${playerId}`, {
      method: "DELETE"
    });

    const data = await response.json();
    console.log("Player removed:", data);

    players = await fetchAllPlayers();
    render();
  } catch (error) {
    console.error(error);
  }
};

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. When clicked, should be redirected
 *    to a page with the appropriate hashroute. The page should show
 *    specific details about the player clicked 
 * - Remove from roster. when clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
const render = () => {
  // TODO

  if (!players || players.length === 0) {
    container.innerHTML = "<p>There are currently no players</p>";
    return;
  }

  const html = players.map(player => {
    return `
      <div class="playerCard" data-id="${player.id}">
      <img src="${player.imageUrl}" alt="${player.name}" />
      <h2>${player.name}</h2>
      <h3>Id: ${player.id}</h3>
      <button class="delete-btn" data-id="${player.id}">Delete</button>
      </div>
    `
  }).join("");

  playerList.innerHTML = html;

  const playerCard = document.querySelectorAll(".playerCard");
  console.log("Cards found:", playerCard.length);

  playerCard.forEach(card => {
    card.addEventListener("click", async () => {
      console.log("Card clicked!");
      const playerId = card.dataset.id;
      const player = await fetchSinglePlayer(playerId);
      renderSinglePlayer(player);

    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const playerId = button.dataset.id;
      await removePlayer(playerId);
    });
  });

};

/**
 * Updates html to display a single player.
 * A detailed page about the player is displayed with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The page also contains a "Back to all players" that, when clicked,
 * will redirect to the approriate hashroute to show all players.
 * The detailed page of the single player should no longer be shown.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  console.log("Rendering player:", player);
  playerList.innerHTML = `
  <div class="playerDetails"> 
  <h2>${player.name}</h2>
  <img src="${player.imageUrl}" alt="${player.name}" />
    <ul>
      <li>ID: ${player.id}</li>
      <li>Breed: ${player.breed}</li>
     <li>Team: ${player.team?.name || "No team"}</li>
    </ul>
    <button id="back">Back to all players</button>
  </div>
  `
  const backBtn = document.querySelector("#back")
  backBtn.addEventListener("click", () => {
    render();
  });
};


/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  //Before we render, what do we always need...?
  players = await fetchAllPlayers();
  render();

};

/**THERE IS NO NEED TO EDIT THE CODE BELOW =) **/

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
  };
} else {
  init();
}
