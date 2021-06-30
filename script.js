const APIKey = "AIzaSyDNnyMuEmF7dEVnerS9Pvj_8iJk0Kq3iJo";
const clientID =
  "973116312191-3knis26cqd79us6gpjpc1uiotuueedh3.apps.googleusercontent.com";
const apiscope = "https://www.googleapis.com/auth/youtube.readonly";

let loginState = 0;

var container = create("div", "container");

var row2 = create("div", "row justify-content-center");

var button1 = create("button", "btn btn-dark mx-2");
button1.setAttribute("onclick", "authenticate().then(loadClient)");
button1.innerHTML = "Login with Gmail";

row2.append(button1);

var row3 = create("div", "row justify-content-start");

var content = create("div", "col-12 text-center");
content.innerHTML = "You are logged in now. Close the window to logout.";
row3.append(content);

var vmenu = create("div", "col-4 mt-5");
var ul = create("ul", "list-group");
var li1 = create("li", "list-group-item btn text-left");
li1.innerHTML = "Channel Information";
li1.addEventListener("click", channelIDInput);
var li2 = create("li", "list-group-item btn text-left");
li2.innerHTML = "Uploaded Videos in a Playlist";
li2.addEventListener("click", PlaylistIDInput);
var li4 = create("li", "list-group-item btn text-left");
li4.innerHTML = "User Subscription";
li4.addEventListener("click", SubscriberIDInput);
var li5 = create("li", "list-group-item btn text-left");
li5.innerHTML = "Channel Activity";
li5.addEventListener("click", channelActivityInput);
var li6 = create("li", "list-group-item btn text-left");
li6.innerHTML = "Search";
li6.addEventListener("click", SearchIDInput);
var li7 = create("li", "list-group-item btn text-left");
li7.innerHTML = "Update Playlist";
li7.addEventListener("click", UpdatePlaylistIDInput);

ul.append(li1, li2, li4, li5, li6, li7);
vmenu.append(ul);

var row3col = create("div", "col-8");

var disprow = create("div", "row");

row3.append(vmenu, row3col);

container.append(row2, row3);
document.body.append(container);

channelIDInput();

function create(ele, eleClass, eleid) {
  let item = document.createElement(ele);
  item.setAttribute("class", eleClass);
  item.setAttribute("id", eleid);
  return item;
}

function authenticate() {
  return gapi.auth2
    .getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
    .then(
      function () {
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
}

function authenticateOut() {
  return gapi.auth2
    .getAuthInstance()
    .signOut({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
    .then(
      function () {
        console.log("Signout Successful");
      },
      function (err) {
        console.error("Error signing out", err);
      }
    );
}

function loadClient() {
  gapi.client.setApiKey(APIKey);
  return gapi.client
    .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function () {
        console.log("GAPI client loaded for API");
        loginState = 1;
        displayItem();
      },
      function (err) {
        console.error("Error loading GAPI client for API", err);
        displayItem();
      }
    );
}

//these will fetch the data - function 2

function executeChannelDetails(channelID) {
  return gapi.client.youtube.channels
    .list({
      part: ["snippet,contentDetails,statistics"],
      id: [
        channelID,
        //   "UC_x5XG1OV2P6uZZ5FSM9Ttw"
      ],
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        channelInfoDisplay(response);
      },
      function (err) {
        console.error("Execute error");
      }
    );
}

function executePlaylistDetails(playlistID) {
  return gapi.client.youtube.playlistItems
    .list({
      part: ["snippet,contentDetails"],
      maxResults: 25,
      playlistId: playlistID,
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        playlistInfoDisplay(response);
      },
      function (err) {
        console.error("Execute error");
      }
    );
}

function executeSubscriberDetails() {
  return gapi.client.youtube.subscriptions
    .list({
      part: ["snippet,contentDetails"],
      mine: true,
      maxResults: 25,
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        SubsriberInfoDisplay(response);
      },
      function (err) {
        console.error("Execute error");
      }
    );
}

function executeChannelActivityDetails(channelActivityID) {
  return gapi.client.youtube.activities
    .list({
      part: ["snippet,contentDetails"],
      channelId: channelActivityID,
      maxResults: 25,
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        channelActivityDisplay(response);
      },
      function (err) {
        console.error("Execute error");
      }
    );
}

function executeSearchDetails(SearchID, SearchTypeID) {
  return gapi.client.youtube.search
    .list({
      part: ["snippet"],
      maxResults: 25,
      q: SearchID,
      type: [SearchTypeID],
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        SearchInfoDisplay(response);
      },
      function (err) {
        console.error("Execute error");
      }
    );
}

function executeUpdatePlaylistDetails(
  inputTargetPlaylistID,
  inputNewVideoID,
  inputVideoPosition
) {
  return gapi.client.youtube.playlistItems
    .insert({
      part: ["snippet"],
      resource: {
        snippet: {
          playlistId: "PLaLV63SSv9cg8qif5lYK2PQ3pRG4Q9_pS",
          position: 0,
          resourceId: {
            kind: "youtube#video",
            videoId: "M7FIvfx5J10",
          },
        },
      },
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response);
        //   SearchInfoDisplay(response);
      },
      function (err) {
        console.error("Execute error");
      }
    );
}

gapi.load("client:auth2", function () {
  gapi.auth2.init({
    client_id: clientID,
  });
});

//these will give us the final results - Function 3

function channelInfoDisplay(response) {
  disprow.innerHTML = "";

  var table = create("table", "table table-bordered mt-3");
  var tablebody = create("tbody");

  var tr1 = create("tr");
  var tr1d1 = create("td", "align-middle");
  var img1 = create("img");
  let temp;
  temp = response.result.items[0].snippet.thumbnails.default.url;
  img1.setAttribute("src", temp);
  tr1d1.append(img1);
  var tr1d2 = create("td", "align-middle");
  tr1d2.innerHTML = response.result.items[0].snippet.title;
  tr1.append(tr1d1, tr1d2);

  var tr2 = create("tr");
  var tr2d1 = create("td", "align-middle");
  tr2d1.innerHTML = "Description";
  var tr2d2 = create("td", "align-middle");
  tr2d2.innerHTML = response.result.items[0].snippet.description;
  tr2.append(tr2d1, tr2d2);

  var tr3 = create("tr");
  var tr3d1 = create("td", "align-middle");
  tr3d1.innerHTML = "Number of Videos";
  var tr3d2 = create("td", "align-middle");
  tr3d2.innerHTML = response.result.items[0].statistics.videoCount;
  tr3.append(tr3d1, tr3d2);

  var tr4 = create("tr");
  var tr4d1 = create("td", "align-middle");
  tr4d1.innerHTML = "Number of Subscriber";
  var tr4d2 = create("td", "align-middle");
  tr4d2.innerHTML = response.result.items[0].statistics.subscriberCount;
  tr4.append(tr4d1, tr4d2);

  var tr5 = create("tr");
  var tr5d2 = create("td", "align-middle text-center");
  var a1 = create("a");
  let t;
  t = "https://youtube.com/" + response.result.items[0].snippet.customUrl;
  a1.setAttribute("href", t);
  a1.setAttribute("target", "_blank");
  a1.innerHTML = "Visit Channel";
  tr5d2.append(a1);
  tr5d2.setAttribute("colspan", 2);
  tr5.append(tr5d2);

  tablebody.append(tr1, tr2, tr3, tr4, tr5);
  table.append(tablebody);

  disprow.append(table);
  row3col.append(disprow);
}

function playlistInfoDisplay(response) {
  // console.log('hello there')

  disprow.innerHTML = "";

  var table = create("table", "table table-bordered mt-3");
  var tablebody = create("tbody");

  // console.log(response.result.items);

  response.result.items.forEach((element) => {
    if (element.snippet.title != "Private video") {
      var tr1 = create("tr");
      var tr1d1 = create("td", "align-middle");
      var img = create("img");
      var t;
      t = element.snippet.thumbnails.default.url;
      img.setAttribute("src", t);
      tr1d1.append(img);

      var tr1d2 = create("td", "align-middle");
      tr1d2.innerHTML = element.snippet.title;
      tr1.append(tr1d1, tr1d2);

      tablebody.append(tr1);
    }
  });

  table.append(tablebody);
  disprow.append(table);
  row3col.append(disprow);
}

function SubsriberInfoDisplay(response) {
  // console.log('hello there')

  disprow.innerHTML = "";

  var table = create("table", "table table-bordered");
  var tablebody = create("tbody");

  // console.log(response.result.items);

  response.result.items.forEach((element) => {
    if (element.snippet.title != "Private video") {
      var tr1 = create("tr");
      var tr1d1 = create("td", "align-middle");
      var img = create("img");
      var t;
      t = element.snippet.thumbnails.default.url;
      img.setAttribute("src", t);
      tr1d1.append(img);

      var tr1d2 = create("td", "align-middle");
      var p1 = create("p", "font-weight-bold");
      p1.innerHTML = element.snippet.title;
      var p2 = create("p");
      p2.innerHTML = element.snippet.description;
      tr1d2.append(p1, p2);

      tr1.append(tr1d1, tr1d2);

      tablebody.append(tr1);
    }
  });

  table.append(tablebody);
  disprow.append(table);
  row3col.append(disprow);
}

function channelActivityDisplay(response) {
  // console.log('hello there')

  disprow.innerHTML = "";

  var table = create("table", "table table-bordered mt-3");
  var tablebody = create("tbody");

  // console.log(response.result.items);

  response.result.items.forEach((element) => {
    if (element.snippet.title != "Private video") {
      var tr1 = create("tr");
      var tr1d1 = create("td", "align-middle");
      var img = create("img");
      var t;
      t = element.snippet.thumbnails.default.url;
      img.setAttribute("src", t);
      tr1d1.append(img);

      var tr1d2 = create("td", "align-middle");
      var p1 = create("p");
      p1.innerHTML = "Channel Activity: Video " + element.snippet.type;
      var p2 = create("p", "font-weight-bold");
      p2.innerHTML = element.snippet.title;
      tr1d2.append(p1, p2);
      tr1.append(tr1d1, tr1d2);

      tablebody.append(tr1);
    }
  });

  table.append(tablebody);
  disprow.append(table);
  row3col.append(disprow);
}

function SearchInfoDisplay(response) {
  // console.log('hello there')

  disprow.innerHTML = "";

  var table = create("table", "table table-bordered mt-3");
  var tablebody = create("tbody");

  // console.log(response.result.items);

  response.result.items.forEach((element) => {
    if (element.snippet.title != "Private video") {
      var tr1 = create("tr");
      var tr1d1 = create("td", "align-middle");
      var img = create("img");
      var t;
      t = element.snippet.thumbnails.default.url;
      img.setAttribute("src", t);
      tr1d1.append(img);

      var tr1d2 = create("td", "align-middle");
      var p1 = create("p", "font-weight-bold");
      p1.innerHTML = element.snippet.title;
      var p2 = create("p");
      p2.innerHTML = element.snippet.description;
      tr1d2.append(p1, p2);

      tr1.append(tr1d1, tr1d2);

      tablebody.append(tr1);
    }
  });

  table.append(tablebody);
  disprow.append(table);
  row3col.append(disprow);
}
// These are the vmenu inputs - function 1

function channelIDInput() {
  row3col.innerHTML = "";
  bordercolor();
  var header = create("h3", "mt-5 mb-5");
  header.innerHTML = "Get Information about Channels";
  li1.style.border = "solid black";
  var formdiv = create("div", "row mt-5");
  var form = create("form", "form-group");
  var label = create("label");
  label.setAttribute("for", "inputChannelID");
  label.innerHTML = "Enter Channel ID";
  var channelInput = create("input", "form-control", "inputChannelID");
  channelInput.setAttribute("type", "text");
  channelInput.setAttribute("placeholder", "Channel ID");
  var submit = create("button", "btn btn-dark mt-2");
  submit.setAttribute("type", "submit");
  submit.innerHTML = "Submit";
  // submit.setAttribute("onclick", "ChannelInput()");

  formdiv.append(form, label, channelInput, submit);
  row3col.append(header, formdiv);

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    const channelID = channelInput.value;
    executeChannelDetails(channelID);
  });
}

function PlaylistIDInput() {
  row3col.innerHTML = "";
  bordercolor();
  var header = create("h3", "mt-5 mb-5");
  header.innerHTML = "Check the uploaded videos in a playlist";
  li2.style.border = "solid black";
  var formdiv = create("div", "row mt-5");
  var form = create("form", "form-group");
  var label = create("label");
  label.setAttribute("for", "inputPlaylistID");
  label.innerHTML = "Enter Playlist ID";
  var playlistInput = create("input", "form-control", "inputPlaylistID");
  playlistInput.setAttribute("type", "text");
  playlistInput.setAttribute("placeholder", "Playlist ID");
  var submit = create("button", "btn btn-dark mt-2");
  submit.setAttribute("type", "submit");
  submit.innerHTML = "Submit";
  //   submit.setAttribute("onclick", "PlaylistInput()");
  formdiv.append(form, label, playlistInput, submit);
  row3col.append(header, formdiv);

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    const playlistID = playlistInput.value;
    executePlaylistDetails(playlistID);
  });
}

function SubscriberIDInput() {
  row3col.innerHTML = "";
  bordercolor();
  var header = create("h3", "mt-5 mb-5");
  header.innerHTML = "Check your recent subscriptions";
  li4.style.border = "solid black";
  row3col.append(header);
  executeSubscriberDetails();
}

function channelActivityInput() {
  row3col.innerHTML = "";
  bordercolor();
  var header = create("h3", "mt-5 mb-5");
  header.innerHTML = "Get latest actvity by Channels";
  li5.style.border = "solid black";
  var formdiv = create("div", "row mt-5");
  var form = create("form", "form-group");
  var label = create("label");
  label.setAttribute("for", "inputChannelID");
  label.innerHTML = "Enter Channel ID";
  var channelActivityInput = create("input", "form-control", "inputChannelID");
  channelActivityInput.setAttribute("type", "text");
  channelActivityInput.setAttribute("placeholder", "Channel ID");
  var submit = create("button", "btn btn-dark mt-2");
  submit.setAttribute("type", "submit");
  submit.innerHTML = "Submit";
  // submit.setAttribute("onclick", "ChannelInput()");

  formdiv.append(form, label, channelActivityInput, submit);
  row3col.append(header, formdiv);

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    const channelActivityID = channelActivityInput.value;
    executeChannelActivityDetails(channelActivityID);
  });
}

function SearchIDInput() {
  row3col.innerHTML = "";
  bordercolor();
  var header = create("h3", "mt-5 mb-5");
  header.innerHTML = "Search here for all your needs";
  li6.style.border = "solid black";

  var formdiv = create("div", "row mt-5");
  var form = create("form", "form-group");

  var label = create("label");
  label.setAttribute("for", "inputSearchID");
  label.innerHTML = "Enter Search ID";
  var SearchInput = create("input", "form-control", "inputSearchID");
  SearchInput.setAttribute("type", "text");
  SearchInput.setAttribute("placeholder", "What do you want to search for?");

  var label2 = create("label", "mt-3");
  label2.setAttribute("for", "inputSearchTypeID");
  label2.innerHTML = "Search Channels or Playlists";
  var SearchTypeInput = create("select", "form-control", "inputSearchTypeID");

  var optiondummy = create("option");
  optiondummy.setAttribute = ("value", "");
  optiondummy.innerHTML = "Select";

  var option1 = create("option");
  option1.setAttribute("value", "Channel");
  option1.innerHTML = "Channel";

  var option2 = create("option");
  option2.setAttribute("value", "Playlist");
  option2.innerHTML = "Playlist";

  SearchTypeInput.append(optiondummy, option1, option2);

  //   SearchTypeInput.setAttribute("type", "text");
  //   SearchTypeInput.setAttribute("placeholder", "Channel or Playlist?");

  var submit = create("button", "btn btn-dark mt-2");
  submit.setAttribute("type", "submit");
  submit.innerHTML = "Submit";
  //   submit.setAttribute("onclick", "SearchInput()");
  formdiv.append(form, label, SearchInput, label2, SearchTypeInput, submit);
  row3col.append(header, formdiv);

  submit.addEventListener("click", (e) => {
    e.preventDefault();
    const SearchID = SearchInput.value;
    const SearchTypeID = SearchTypeInput.value;
    executeSearchDetails(SearchID, SearchTypeID);
  });
}

function UpdatePlaylistIDInput() {
  row3col.innerHTML = "";
  bordercolor();
  var header = create("h3", "mt-5 mb-5");
  header.innerHTML = "This is under construction";
  li7.style.border = "solid black";
  //   var formdiv = create("div", "row mt-5");
  //   var form = create("form", "form-group");

  //   var label = create("label");
  //   label.setAttribute("for", "inputSearchID");
  //   label.innerHTML = "Enter Search ID";

  //   var TargetPlaylistID = create("input", "form-control", "TargetPlaylistID");
  //   TargetPlaylistID.setAttribute("type", "text");
  //   TargetPlaylistID.setAttribute("placeholder", "Enter Target Playlist ID");

  //   var NewVideoID = create("input", "form-control mt-3", "VideoID");
  //   NewVideoID.setAttribute("type", "text");
  //   NewVideoID.setAttribute("placeholder", "Enter Video ID");

  //   var VideoPosition = create("input", "form-control mt-3", "Position");
  //   VideoPosition.setAttribute("type", "text");
  //   VideoPosition.setAttribute("placeholder", "Enter Position of new video");

  //   var submit = create("button", "btn btn-dark mt-2");
  //   submit.setAttribute("type", "submit");
  //   submit.innerHTML = "Submit";
  //   //   submit.setAttribute("onclick", "TargetPlaylistID()");
  //   formdiv.append(
  //     form,
  //     label,
  //     TargetPlaylistID,
  //     NewVideoID,
  //     VideoPosition,
  //     submit
  //   );
  row3col.append(header);
  //   row3col.append(formdiv);

  //   submit.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     const inputTargetPlaylistID = TargetPlaylistID.value;
  //     const inputNewVideoID = NewVideoID.value;
  //     const inputVideoPosition = VideoPosition.value;
  //     executeUpdatePlaylistDetails(
  //         inputTargetPlaylistID,
  //         inputNewVideoID,
  //         inputVideoPosition
  //       );
  //   });
}

//other functions

function bordercolor() {
  li1.style.border = "solid white";
  li2.style.border = "solid white";
  li4.style.border = "solid white";
  li5.style.border = "solid white";
  li6.style.border = "solid white";
  li7.style.border = "solid white";
}

function incorrectData() {
  disprow.innerHTML = "";

  var table = create("table", "table table-bordered mt-3");
  var tablebody = create("tbody");

  var tr1 = create("tr");
  var tr1d1 = create("td");
  tr1d1.innerHTML = "Incorrect Data entered";
  // var tr1d2 = create('td');
  // tr1d2.innerHTML = 'Channel Does not exist'
  tr1.append(tr1d1);

  tablebody.append(tr1);
  table.append(tablebody);

  disprow.append(table);
  row3col.append(disprow);
}

displayItem();
function displayItem(){
  if(loginState==1){
    button1.style.display='none';
    row3.style.display=null;
  }
  else{
    button1.style.display=null;
    row3.style.display='none';
  }
}
