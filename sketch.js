
let col_bg = "#F0F0F0"
let col_line_v = "#979797"
let col_line_h = "#DBDBDB7F"
let col_sidebar = "#11C69A"
let col_userIco= "#245CB3"
let col_red = "#D0021B"

let sidebar_size = [50, 375]
let sidebar_pos = [617, 0]

let header_size = [667, 51]

let icon_size = [32, 33]
let icon_pos = [18, 8]

let recipe_size_s = [30, 30]
let recipe_pos_s = [69, 10]
let recipe_size_l = [37, 37]
let recipe_pos_l = [66, 12]
let hook_pos = [636, 182]

let card_pos = [2, 58]
let card_size = [612, 317]
let card_dist_y = 296
let cards = []

let recipeCard_pos = [2, 58]

let leapPointer = []
let draw_leapPointer = true

let icon
let recipe_s
let recipe_l
let card
let card1
let card2
let card3
let card4
let recipeCard
let hook

let fontBold
let fontSemi
let fontRegular

let months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
let times = [0, -1, -2, -3, -4, -5]
let times_pos = [493,233]
let min_pos = [511, 233]
let show_recipe

let swipe_vert = 0
let y_card
let y_recipe
// --col_bg:;
// --col_line_vertical:;
// --col_line_horizontal:#DBDBDB7F;
// --col_date:#4A4A4A99;
// --col_bg:#F0F0F0;
let leapController = new Leap.Controller({
    enableGestures: true
  });
leapController.connect()

leapController.on('deviceAttached', function() {
  console.log('LeapProvider - deviceAttached');
});
leapController.on('deviceStreaming', function() {
  console.log('LeapProvider - deviceStreaming');
});
leapController.on('deviceStopped', function() {
  console.log('LeapProvider - deviceStopped');
});
leapController.on('deviceRemoved', function() {
  console.log('LeapProvider - deviceRemoved');
});
leapController.on('deviceRemoved', function() {
  console.log('LeapProvider - deviceRemoved');
});
leapController.on('frame', updateLeap);

leapController.on('gesture', onGesture)
// console.log("leap setup")

// leapController.use('screenPosition');
// leapController.use('handSwipe');
// leapController.use('handHold')

// leapController.on('handSwipe', handleSwipe)


function preload(){
  icon = loadImage("assets/icon.png")
  recipe_s = loadImage("assets/purchase-order.png")
  recipe_l = loadImage("assets/purchase-order-black.png")
  hook = loadImage("assets/hook.png")
  // clock = loadImage("assets/clock.png")
  card = loadImage("assets/karte.png")
  card1 = {
    img: loadImage("assets/karte1.png"),
    x: card_pos[0],
    y: card_pos[1],
    scale: 1
  }
  card2 = {
    img: loadImage("assets/karte2.png"),
    x: card_pos[0],
    y: card_pos[1] + card_dist_y,
    scale: 1
  }
  card3 = {
    img : loadImage("assets/karte3.png"),
    x: card_pos[0],
    y: card_pos[1] + 2*card_dist_y,
    scale: 1
  }
  card4 = {
    img: loadImage("assets/karte4.png"),
    x: card_pos[0],
    y: card_pos[1] + 3*card_dist_y,
    scale: 1
  }
  cards.push(card1)
  cards.push(card2)
  cards.push(card3)
  cards.push(card4)
  recipeCard = {
    img: loadImage("assets/rezept-komplett.png"),
    x: recipeCard_pos[0],
    y: recipeCard_pos[1],
    scale: 1
  }

  leapPointer = {
    x: -10,
    y: -10,
    size: 10
  }

  fontRegular = loadFont("assets/SourceSansPro-Regular.otf")
  fontSemi = loadFont("assets/SourceSansPro-Semibold.otf")
  fontBold = loadFont("assets/SourceSansPro-Bold.otf")

}


function setup(){
  createCanvas(667, 375)

  // https://forum.processing.org/two/discussion/9489/p5-sketch-running-fullscreen

  image(icon, icon_pos[0], icon_pos[1])
  image(recipe_s, recipe_pos_s[0], recipe_pos_s[1])
  image(hook, hook_pos[0], hook_pos[1])
  image(card1.img, card1.x, card1.y)
  image(card2.img, card2.x, card2.y)
  image(card3.img, card3.x, card3.y)
  image(card4.img, card4.x, card4.y)

  show_recipe = false
}



// functions to set the circle position according to finger tip position detected by leap
function mapVal(val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
function getLeapScreenPosition(leapPosition, spaceSize=100) {
  const INTERACTION_SPACE_WIDTH = 180
  const INTERACTION_SPACE_DEPTH = 120

  const max_width = 2* INTERACTION_SPACE_WIDTH
  const max_depth = 2* INTERACTION_SPACE_DEPTH

  const x = this.mapVal(leapPosition[0], -INTERACTION_SPACE_WIDTH, INTERACTION_SPACE_WIDTH, -spaceSize, width +spaceSize)
  const y = this.mapVal(leapPosition[2], -INTERACTION_SPACE_DEPTH, INTERACTION_SPACE_DEPTH, -spaceSize, height+spaceSize)
  const z = this.mapVal(leapPosition[2], -INTERACTION_SPACE_WIDTH, INTERACTION_SPACE_WIDTH, -spaceSize, width+spaceSize)

  const pos = [x, y, z]
  return pos
}

function onGesture(gesture, frame){
  // console.log(gesture.type + " with ID " + gesture.id + " in frame " + frame.id);

  if (gesture.type == "keyTap" || gesture.type == "screenTap"){
    console.log(gesture.type + " with ID " + gesture.id + " in frame " + frame.id);
    var hand= frame.hand(gesture.handIds);

    // var pos = hand.screenPosition()
    var pos = getLeapScreenPosition(hand.palmPosition)
    console.log("pos: "+ pos)
    console.log("recipe pos: "+ recipe_pos_s)

    var offset = 20
    if (pos[0] > recipe_pos_s[0]-offset && pos[0] < recipe_pos_s[0]+icon_size[0]+offset && pos[1] > recipe_pos_s[1]-offset && pos[1] < recipe_pos_s[1]+icon_size[1]+offset){
      show_recipe = !show_recipe
      console.log("activated recipecard")
    }
  }
  else if (gesture.type == "swipe"){
    console.log("swipe")
    handleSwipe(gesture)
  }
      // leapPointer = getLeapScreenPosition(pos)
      // console.log('hand: '+hand)
      // leapPointer = hand.screenPosition()
      // var el = document.elementFromPoint(leapPointer.x, leapPointer.y)
      // console.log(el)
      // setState({})
}
function handleSwipe(gesture){
  //Classify swipe as either horizontal or vertical
  var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[2]);


  console.log("direction: "+gesture.direction)
  //Classify as right-left or up-down
  if(isHorizontal){
      if(gesture.direction[0] > 0){
          swipeDirection = "right";
          var card_gone = false
          if (!show_recipe){
            pos = getLeapScreenPosition(gesture.startPosition)
            dir = getLeapScreenPosition(gesture.direction)
            for (var i = 0; i < cards.length; i++){
              if (card_gone){
                var target = cards[i].y - card_dist_y
                dynamics.animate(card[i], {
                  y: target
                })
              }

              else if(pos[0] > cards[i].x && pos[0] < cards[i].x + card_size[0] && pos[1] > cards[i].y && pos[1] < cards[i].y + card_size[1]){
                var target = cards[i].x
                if (target> width){
                  dynamics.animate(card[i], {
                    x: target,
                    scale: 0.5
                  })
                  card.gone = true
                  cards.slice(i, 1)
                }
              }

            }
            card_gone = false
          }
      } else {
          swipeDirection = "left";
      }
  }
  else   { //vertical
      var dir  = getLeapScreenPosition(gesture.direction)
      swipe_vert = dir[1]

      if(!show_recipe){
        for (var i = 0; i < cards.length; i++){
          var target = (cards[i].y + swipe_vert )
          dynamics.animate(cards[i], {
            y: target
          }, {
            type: dynamics.easeInOut
          })
        }
      }
      else{
        var target = recipeCard.y + swipe_vert
        dynamics.animate(recipeCard, {
          y: target
        })
      }
      if(gesture.direction[2] > 0){
          swipeDirection = "up";
      } else {
          swipeDirection = "down";
      }
  }
  console.log(swipeDirection)
  console.log(getLeapScreenPosition(gesture.direction))
}

function getDate(){
  d = day().toString()
  if (d.length <2) d = "0"+d
  m = months[month()-1]
  h = hour().toString()
  if (h.length <2) h = "0"+h

  min = minute().toString()
  if (min.length <2) min = "0"+min

  return d+". "+m+" | "+h+":"+min
}

function updateLeap(){
  var frame = leapController.frame()

  if (frame.hands.length == 0){
    draw_leapPointer = false
  }
  else if (frame.hands.length <= 1) {
    console.log("hand")
    var hand = frame.hands[0]
    var pos = hand.palmPosition
    // leapPointer = hand.screenPosition()
    var screenPos = getLeapScreenPosition(pos)
    leapPointer.x = screenPos[0]
    leapPointer.y = screenPos[1]
    // if (hand.pinchStrength > 0.6){
    //   console.log("pinch! ")
    //   leapPointer.size = 20
    //   if (!show_recipe){
    //     for ( var i = 0; i < cards.length; i++){
    //       if(leapPointer.x > cards[i].x && leapPointer.x < cards[i].x + card_size[0] && leapPointer.y > cards[i].y && leapPointer.y < cards[i].y + card_size[1]){
    //         cards[i].img.resize(card_size[0]+30, 0)
    //       }
    //     }
    //   }
    // }
    // else{
    //   leapPointer.size = 10
    //   for (var i = 0; i < cards.length; i++){
    //     cards[i].img.resize(card_size[0], 0)
    //   }
    // }

  }
}

function draw(){
  background(col_bg)
  // updateLeap()




  if(show_recipe){
    image(recipe_l, recipe_pos_l[0], recipe_pos_l[1])
    y_recipe = recipeCard_pos[1] + swipe_vert
    y_recipe = animate("recipeCard", y_recipe)
    image(recipeCard, recipeCard_pos[0], y_recipe)
  }
  else{
    for (var i = 0; i < cards.length; i++){
      // y_card = card_pos[1] + i*card_dist_y +swipe_vert
      // y_card = animate("cardsAnim_"+i, y_card)
      cards[i].img.resize(card_size[0] * cards[i].scale, 0)
      image(cards[i].img, cards[i].x, cards[i].y)

    }
    image(recipe_s, recipe_pos_s[0], recipe_pos_s[1])
  }
  swipe_vert = 0



  //header
  fill(col_bg)
  noStroke()
  rect(0, 0, header_size[0], header_size[1])
  image(icon, icon_pos[0], icon_pos[1])

  fill(0)
  textFont(fontRegular)
  textSize(20)
  // date = getDate()
  text(getDate(), 277, 31)

  //sidebar
  if (!show_recipe){
    fill(col_sidebar)
    noStroke()
    rect(sidebar_pos[0], sidebar_pos[1], sidebar_size[0], sidebar_size[1], 10, 0, 0, 10 )
    image(hook, hook_pos[0], hook_pos[1])
  }


  //leapPointer
  fill(0)
  circle(leapPointer.x, leapPointer.y, leapPointer.size)
} //draw - end
