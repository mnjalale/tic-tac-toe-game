$(document).ready(function(){
  var userMark = 'O';
  var systemMark = 'X';
  var gameOver=false;
  var systemStartedWithCenterSlot = false;
  var userStartedWithCenterSlot = false;
  var userStartedWithCornerSlot= false
  var cornerSlots = ['tl','tr','bl','br'];
  var edgeSlots = ['tm','mr','bm','ml'];
  var winningCombinations = [
    ['tl','ml','bl'],['tm','m','bm'],['tr','mr','br'],
    ['tl','tm','tr'],['ml','m','mr'],['bl','bm','br'],
    ['tl','m','br'],['bl','m','tr']];
  var systemUsedSlots = [];
  var userUsedSlots = [];
  var availableSlots = cornerSlots.concat(edgeSlots);
  availableSlots.push('m');


  $('#dialog').dialog({
    modal:true,
    buttons:{
      'X':function(){
        userMark = 'X';
        systemMark = 'O'
        placeFirstMove();
        $(this).dialog('close');
      },
      'O': function () {
        userMark = 'O';
        systemMark ='X';
        placeFirstMove();
        $(this).dialog('close');
      }
    },
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 1000
    },
    closeOnEscape: false,
    open: function(event, ui) {
      $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
    }
  });

  function placeFirstMove(){

    var position = Math.floor(Math.random()*5+1);
    switch(position){
      case 1:
        systemStartedWithCenterSlot=true;
        executeSystemMove('m')
        break;
      case 2:
        executeSystemMove('tl');
        break;
      case 3:
        executeSystemMove('tr');
        break;
      case 4:
        executeSystemMove('bl');
        break;
      case 5:
        executeSystemMove('br');
        break;
    }
  }

  function systemMove(){

    if(systemStartedWithCenterSlot===true){
      switch(systemUsedSlots.length){
        case 1:
          var userFirstMove=userUsedSlots[0];
          userStartedWithCornerSlot = cornerSlots.indexOf(userFirstMove)!==-1?true:false;
          if(userStartedWithCornerSlot===true){
            placeMarkInOppositeSlot(userFirstMove);
          }else{
            switch(userFirstMove){
              case 'tm':
                executeSystemMove('bl');
                break;
              case 'mr':
                executeSystemMove('tl');
                break;
              case 'bm':
                executeSystemMove('tr');
                break;
              case 'ml':
                executeSystemMove('br');
                break;
            }
          }
          break;
        case 2:
          if(userStartedWithCornerSlot===true){
            if(blockWinningMove()===false){
              var userSecondMove = userUsedSlots[1];
              switch(userSecondMove){
                case 'tm':
                  var nextMove = availableSlots.indexOf('bl')!==-1?'bl':'br';
                  executeSystemMove(nextMove);
                  break;
                case 'mr':
                  var nextMove = availableSlots.indexOf('tl')!==-1?'tl':'bl';
                  executeSystemMove(nextMove);
                  break;
                case 'bm':
                  var nextMove = availableSlots.indexOf('tl')!==-1?'tl':'tr';
                  executeSystemMove(nextMove);
                  break;
                case 'ml':
                  var nextMove = availableSlots.indexOf('tr')!==-1?'tr':'br';
                  executeSystemMove(nextMove);
                  break;
              }

            }
          }else{
            if(attemptWinningMove()===false){
              blockWinningMove();
            }else{
              setTimeout(resetBoard,3000);
            }
          }
          break;
        case 3:
          if(userStartedWithCornerSlot===true){
            if(attemptWinningMove()===true){
              setTimeout(resetBoard,3000);
            }else{
              placeMarkInAnyOpenSlot();
            }
          }else{
            attemptWinningMove();
            setTimeout(resetBoard,3000);
          }
          break;
        case 4:
          if(userStartedWithCornerSlot===true){
            if(attemptWinningMove()===true){
              setTimeout(resetBoard,3000);
            }else{
              placeMarkInAnyOpenSlot();
              setTimeout(resetBoard,3000);
            }
          }
          break;
      }
    }else{
      switch(systemUsedSlots.length){
        case 1:
          var userFirstMove = userUsedSlots[0];
          userStartedWithCenterSlot = userFirstMove === 'm'?true:false;
          if(userStartedWithCenterSlot===true){
            var systemFirstMove = systemUsedSlots[0];
            placeMarkInOppositeSlot(systemFirstMove);
          }else{
            placeMarkInStrategicOpenCorner();
          }
          break;
        case 2:
          if(userStartedWithCenterSlot===true){
            var userSecondMove = userUsedSlots[1];
            placeMarkInOppositeSlot(userSecondMove);
          }else{
            if(attemptWinningMove()===true) {
              setTimeout(resetBoard,3000);
            }else{
              if(attemptWinningMove()===false){
                if(blockWinningMove()===false){
                  placeMarkInStrategicOpenCorner();
                }
              }else{
                setTimeout(resetBoard,3000);
              }
            }
          }

          break;
        case 3:
          if(userStartedWithCenterSlot===true){
            var userSecondMove = userUsedSlots[1];
            if(attemptWinningMove()===true){
              setTimeout(resetBoard,3000);
            }else{
              placeMarkInOppositeSlot(userUsedSlots[userUsedSlots.length-1])
            }
          }else{
            if(attemptWinningMove()===false) {
              if(blockWinningMove()===false){
                placeMarkInAnyOpenSlot();
              }
            }else{
              setTimeout(resetBoard,3000);
            }
          }
          break;
        case 4:
          if(userStartedWithCenterSlot===true){
            if(attemptWinningMove()===true){
              setTimeout(resetBoard,3000);
            }else{
              placeMarkInOppositeSlot(userUsedSlots[userUsedSlots.length-1]);
              setTimeout(resetBoard,3000);
            }

          }else{
            if(attemptWinningMove()===false){
              if(blockWinningMove()===false){
                placeMarkInAnyOpenSlot();
              }
              setTimeout(resetBoard,3000);
            }else{
              setTimeout(resetBoard,3000);

            }
          }
          break;

      }
    }

  }

  function executeSystemMove(id){
    $('#' + id).html(systemMark);
    availableSlots = availableSlots.filter(function(val){
      return val!==id;
    });
    systemUsedSlots.push(id);
  }

  function executeUserMove(id){
    $('#' + id).html(userMark);
    availableSlots = availableSlots.filter(function(val){
      return val!==id;
    });
    userUsedSlots.push(id);
    systemMove();
  }

  function placeMarkInOppositeSlot(slot){
    switch(slot){
      case 'tl':
        executeSystemMove('br');
        break;
      case 'tr':
        executeSystemMove('bl');
        break;
      case 'bl':
        executeSystemMove('tr');
        break;
      case 'br':
        executeSystemMove('tl');
        break;
      case 'tm':
        executeSystemMove('bm');
        break;
      case 'mr':
        executeSystemMove('ml');
        break;
      case 'bm':
        executeSystemMove('tm');
        break;
      case 'ml':
        executeSystemMove('mr');
        break;
    }
  }

  function placeMarkInAnyOpenSlot(){
    if(availableSlots.length>0){
      executeSystemMove(availableSlots[0]);
    }
  }

  function placeMarkInStrategicOpenCorner(){
    if(systemUsedSlots.length===1){
      var systemFirstMove = systemUsedSlots[0];
      var userFirstMove = userUsedSlots[0];

      switch(systemFirstMove){
        case 'bl':
          switch(userFirstMove){
            case 'ml':
            case 'tl':
            case 'tm':
            case 'tr':
            case 'mr':
              executeSystemMove('br');
              break;
            case 'br':
            case 'bm':
              executeSystemMove('tl');
              break;

          }
          break;
        case 'tl':
          switch(userFirstMove){
            case 'tm':
            case 'tr':
            case 'mr':
            case 'br':
            case 'bm':
              executeSystemMove('bl');
              break;
            case 'bl':
            case 'ml':
              executeSystemMove('tr');
              break;

          }
          break;
        case 'tr':
          switch(userFirstMove){
            case 'mr':
            case 'br':
            case 'bm':
            case 'bl':
            case 'ml':
              executeSystemMove('tl');
              break;
            case 'tl':
            case 'tm':
              executeSystemMove('br');
              break;

          }
          break;
        case 'br':
          switch(userFirstMove){
            case 'bm':
            case 'bl':
            case 'ml':
            case 'tl':
            case 'tm':
              executeSystemMove('tr');
              break;
            case 'tr':
            case 'mr':
              executeSystemMove('bl');
              break;

          }
          break;
      }
    }else{
      for(i=0;i<cornerSlots.length;i++){
        if($('#' + cornerSlots[i]).html().length===0){
          executeSystemMove(cornerSlots[i]);
          break;
        }
      }
    }

  }

  function attemptWinningMove(){
    var gameIsWon = false;
    for(i=0;i<winningCombinations.length;i++){
      var winningCombination = winningCombinations[i];

      var usedWinningCombination = [];
      for(j=0;j<winningCombination.length;j++){

        for(k=0;k<systemUsedSlots.length;k++){
          if(winningCombination[j]===systemUsedSlots[k]){
            usedWinningCombination.push(systemUsedSlots[k]);
          }
        }
      }

      if(usedWinningCombination.length===2){
        var missingValue = winningCombination.filter(function(value){
          return usedWinningCombination.indexOf(value)===-1;
        });

        if($('#' + missingValue[0]).html().length===0){
          $('#' + missingValue[0]).html(systemMark);

          //Color the winning combination red
          winningCombination.forEach(function(val){
            $('#' + val).addClass("red-text");
            $('#' + val).addClass("blink");
          });

          gameIsWon = true;
          gameOver=true;
          break;
        }
      }
    }

    return gameIsWon;
  }

  function blockWinningMove(){
    var blockedWinningMove = false;
    for(i=0;i<winningCombinations.length;i++){
      var winningCombination = winningCombinations[i];

      var usedWinningCombination = [];
      for(j=0;j<winningCombination.length;j++){

        for(k=0;k<userUsedSlots.length;k++){
          if(winningCombination[j]===userUsedSlots[k]){
            usedWinningCombination.push(userUsedSlots[k]);
          }
        }
      }

      if(usedWinningCombination.length===2){
        var missingValue = winningCombination.filter(function(value){
          return usedWinningCombination.indexOf(value)===-1;
        });

        if($('#' + missingValue[0]).html().length===0){
          executeSystemMove(missingValue[0]);
          blockedWinningMove = true;
          break;
        }
      }
    }

    return blockedWinningMove;
  }

  function resetBoard(){
    systemStartedWithCenterSlot = false;
    userStartedWithCenterSlot = false;
    gameOver = false;
    availableSlots = cornerSlots.concat(edgeSlots);
    availableSlots.push('m');
    systemUsedSlots = [];
    userUsedSlots =[];
    availableSlots.forEach(function(val){
      $('#' + val).html('');
      $('#' + val).removeClass('red-text');
      $('#' + val).removeClass('blink');
    });

    placeFirstMove();
  }

  $('#topLeft').on('click',function(){
    if($('#tl').html().length==0 && gameOver===false){
      executeUserMove('tl');
    }
  });
  $('#topMid').on('click',function(){
    if($('#tm').html().length==0 && gameOver===false){
      executeUserMove('tm');
    }
  });
  $('#topRight').on('click',function(){
    if($('#tr').html().length==0 && gameOver===false){
      executeUserMove('tr');
    }
  });
  $('#midLeft').on('click',function(){
    if($('#ml').html().length==0 && gameOver===false){
      executeUserMove('ml');
    }
  });
  $('#mid').on('click',function(){
    if($('#m').html().length==0 && gameOver===false){
      executeUserMove('m');
    }
  });
  $('#midRight').on('click',function(){
    if($('#mr').html().length==0 && gameOver===false){
      executeUserMove('mr');
    }
  });
  $('#bottomLeft').on('click',function(){
    if($('#bl').html().length==0 && gameOver===false){
      executeUserMove('bl');
    }
  });
  $('#bottomMid').on('click',function(){
    if($('#bm').html().length==0 && gameOver===false){
      executeUserMove('bm');
    }
  });
  $('#bottomRight').on('click',function(){
    if($('#br').html().length==0 && gameOver===false){
      executeUserMove('br');
    }
  });
});