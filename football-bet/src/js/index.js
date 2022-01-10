import 'regenerator-runtime/runtime'

import { initContract, login, logout } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')
const { KeyPair, utils, transactions } = require('near-api-js');
export const nearUtils = utils;
const DEFAULT_GAS = 300000000000000;

// global variable used throughout
let currentGreeting;

$('.do-bet').click(function(){
  var thisTr = $(this).parent().parent();
  var betId = $('input', thisTr).attr('bet-id');
  var betValue = $('input', thisTr).val();

  console.log('betid = ' + betId);
  console.log('betvalue = ' + betValue);
  // Call smart contract to save data
  console.log('start write transaction to blockchain');
  bet(betId, betValue);
});

const game = 'MU-Arsenal';
/**
 *
 * @param {string} id
 * @param {int} value MA_0-1
 */
async function bet(id, value) {

  var tmpArr = id.split('_');
  var position = tmpArr[1];
  position = position.replace('-', ':');

  try {
    // make an update call to the smart contract
    window.deposit = value;
    await window.contract.bet({
      // pass the value that the user entered in the greeting field
      _game: game,
      _bet: position
    }, DEFAULT_GAS, nearUtils.format.parseNearAmount(value));
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  } finally {
    console.log('finish write transaction to blockchain');
  // re-enable the form, whether the call succeeded or failed
    // fieldset.disabled = false
  }
}

document.querySelector('#sign-in-button').onclick = login
var signoutBtn = document.querySelector('#sign-out-button');
if(signoutBtn !== undefined && signoutBtn !== null) {
  signoutBtn.onclick = logout;
}

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('#signed-out-flow').style.display = 'block'
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector('#signed-in-flow').style.display = 'block'

  document.querySelectorAll('[data-behavior=account-id]').forEach(el => {
    el.innerText = window.accountId
  });

  $('#nearAccountId').html(window.accountId);

  getBets();
}

// update global currentGreeting variable; update DOM with it
async function getBets() {
  var result = await contract.get_bets();
  console.log(result);
  console.log(result[game]);
  var gameResult = result[game];
  var bets = gameResult.bets;
  for(var i = 0; i < bets.length; i++) {
    var bet = bets[i];
    $('.table-content').append('<div class="table-row">' +
      '<div class="table-data">' + bet.account_id + '</div>' +
      '<div class="table-data">' + bet.bet + '</div>' +
      '<div class="table-data">' + bet.bet_value + '</div>' +
      '<div class="table-data">' + (gameResult.online ? '-': (bet.winner ? 'Won' : 'Lost')) + '</div>' +
      '</div>');
  }
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
