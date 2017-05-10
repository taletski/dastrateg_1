//Player object constructor (Prototype Inheritance)
function GameEntity(name) {
  // alert('A new GameEntity is created! \nName: ' + name);
  this.name = name;
  this._isPlaying = true;  //State
  this._points = Math.floor(Math.random() * 17) + 4; //First two cards
}
//GameEntity methods
//Points getter
GameEntity.prototype.getPoints = function() {
  return this._points;
}
//State setter: player stops taking cards
GameEntity.prototype.stopPlaying = function() {
  alert(this.name + ' stops!');
  this._isPlaying = false;
}
//State getter
GameEntity.prototype.getState = function() {
  return this._isPlaying;
}
//Take one more card method
GameEntity.prototype.getCard = function() {
  if(this._isPlaying) {
    this._newCard = Math.floor(Math.random() * 9) + 2;
    this._points += this._newCard;
    alert (this.name +  ' get: ' + this._newCard + ' points' +
            '\nNow ' + this.name + ' have: ' + this._points + ' points');
  }
  else {alert("Error: " + this.name + " can't take more cards!");}
}

//Player object constructor (Prototype Inheritance)
function Player(name) {
  GameEntity.apply(this, arguments);                      //Passing properties of the GameEntity class (Inheritance)
}
//Inherit the GameEntity class
Player.prototype.__proto__ = GameEntity.prototype;        //Passing methods of the GameEntity class (Inheritance)
Player.prototype.decide = function(question) {            //Deciding whether to take one more card or stop
  if (this._isPlaying) {
    var go = confirm(question);
    if (go) {this.getCard();}
    if (!go) {this.stopPlaying();}
  }
};

//Bot object constructor (Prototype Inheritance)
function Bot(name) {
  GameEntity.apply(this, arguments);                      //Passing properties of the GameEntity class (Inheritance)
}
//Inherit the GameEntity class
Bot.prototype.__proto__ = GameEntity.prototype;           //Passing methods of the GameEntity class (Inheritance)
Bot.prototype.decide = function(obj) {                    //Deciding whether to take one more card or stop
  if (this._isPlaying) {
    if (21 - this._points >= 11 || obj._points > this._points) {this.getCard();}
    else if (Math.random() * ((21 - this._points) / 11) > 0.5) {this.getCard();}
    else {this.stopPlaying();}
  }
};

//Game manager object constructor (Functional style - incapsulation)
function Manager() {
  var winner = ' ';
  var message = ' ';
  //Create a new player
  this.newPlayer = function(name) {
    return new Player(name);
  }
  //Create a new bot
  this.newBot = function(name) {
    return new Bot(name);
  }
  //Ask player if he want to continue or stop
  this.askContinue = function(obj) {
    var question = 'Dealer points: ' + dealer.getPoints() +
                    '\nYour points: ' + player1.getPoints() +     /*Сдесь довольно неуклюже получилось: приходится вручную прописывать каждый объект.
                                                                  Этот метод реализован с расчетом на то, что Менеджер будет уметь отслеживать каждого
                                                                  игрока и обращаться к его состоянию или количеству очков*/
                    '\n\nWould you like to take one more card?';
    obj.decide(question);
  }
  //Stop game method
  this.gameStop = function(obj1, obj2){
    obj1.stopPlaying();
    obj2.stopPlaying();
  }
  //Winner and message setters
  //Check for blackjack or score > 21
  this.checkScore = function(obj){
    if (obj.getPoints() == 21) {winner = obj.name; message = winner + ' hits BlackJack and wins!'; return true;}
    if (obj.getPoints() > 21) {obj.stopPlaying(); return false;}
  }
  //Check state of players and select a winner
  this.checkState = function(obj1, obj2) {        //obj1 should always be a dealer!!!
    var isBlackjack = this.checkScore(obj1) || this.checkScore(obj2);
    if (isBlackjack) {return false;}
    else if (this.checkScore(obj1) == false) {message = obj2.name + ' wins!'; return false;}
    else if (this.checkScore(obj2) == false) {message = obj1.name + ' wins!'; return false;}
    else if (!obj1.getState() && !obj2.getState()) {
      if (obj1.getPoints() >= obj2.getPoints()) {winner = obj1.name; message = obj1.name + ' wins!'; return false;}
      else {winner = obj2.name; message = obj2.name + ' wins!'; return false;}
    }
    else {return true;}
  }
  //Show result of the game (message getter)
  this.gameResult = function(){
    alert(message);
  }
}


//Starting a New Game
var manager = new Manager();
var player1 = manager.newPlayer('Player1');
var dealer = manager.newBot('Dealer');
alert('Get ready!');

//Main loop
while (manager.checkState(dealer, player1)) {
//Ask player to decide and check his decision
manager.askContinue(player1);
//Check
if (!manager.checkState(dealer, player1)) {break;}
//Dealer decides
dealer.decide(player1);
//Check (while condition)
//End of the loop
}

manager.gameResult();
