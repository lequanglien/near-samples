import 'regenerator-runtime/runtime'

import { initContract, login, logout } from './utils'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

// global variable used throughout
let currentGreeting;

$('#btn-save').click(function(){
  let transDate = $('#trans_date').val();
  let transAmount = $('#trans_amount').val();
  let transContent = $('#trans_content').val();

  if (transDate === '' || transAmount === '' || transContent === '') {
    alert ('Please input all.');
    return;
  }

  $('.table-content').append('<div class="table-row">' +
    '<div class="table-data">' + transDate + '</div>' +
    '<div class="table-data">' + transAmount + '</div>' +
    '<div class="table-data">' + transContent + '</div>' +
    '</div>');

  // Call smart contract to save data
  console.log('start write transaction to blockchain');
  addExpense(transContent, transAmount);
});


async function addExpense(name, value) {
  try {
    // make an update call to the smart contract
    await window.contract.add({
      // pass the value that the user entered in the greeting field
      _name: name,
      _value: value
    })
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

async function getExpense() {
  var expenses = await window.contract.get();
  console.log(expenses);
}

// const submitButton = document.querySelector('form button')

// document.querySelector('form').onsubmit = async (event) => {
//   event.preventDefault()

//   // get elements from the form using their id attribute
//   const { fieldset, greeting } = event.target.elements

//   // disable the form while the value gets updated on-chain
//   fieldset.disabled = true

//   try {
//     // make an update call to the smart contract
//     await window.contract.set_greeting({
//       // pass the value that the user entered in the greeting field
//       message: greeting.value
//     })
//   } catch (e) {
//     alert(
//       'Something went wrong! ' +
//       'Maybe you need to sign out and back in? ' +
//       'Check your browser console for more info.'
//     )
//     throw e
//   } finally {
//     // re-enable the form, whether the call succeeded or failed
//     fieldset.disabled = false
//   }

//   // disable the save button, since it now matches the persisted value
//   submitButton.disabled = true

//   // update the greeting in the UI
//   await fetchGreeting()

//   // show notification
//   document.querySelector('[data-behavior=notification]').style.display = 'block'

//   // remove notification again after css animation completes
//   // this allows it to be shown again next time the form is submitted
//   setTimeout(() => {
//     document.querySelector('[data-behavior=notification]').style.display = 'none'
//   }, 11000)
// }

// document.querySelector('input#greeting').oninput = (event) => {
//   if (event.target.value !== currentGreeting) {
//     submitButton.disabled = false
//   } else {
//     submitButton.disabled = true
//   }
// }

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

  $('#account').html(window.accountId);

  // populate links in the notification box
  // const accountLink = document.querySelector('[data-behavior=notification] a:nth-of-type(1)')
  // accountLink.href = accountLink.href + window.accountId
  // accountLink.innerText = '@' + window.accountId
  // const contractLink = document.querySelector('[data-behavior=notification] a:nth-of-type(2)')
  // contractLink.href = contractLink.href + window.contract.contractId
  // contractLink.innerText = '@' + window.contract.contractId

  // update with selected networkId
  // accountLink.href = accountLink.href.replace('testnet', networkId)
  // contractLink.href = contractLink.href.replace('testnet', networkId)

  // fetchGreeting()
  getExpense();
}

// update global currentGreeting variable; update DOM with it
async function fetchGreeting() {
  currentGreeting = await contract.get_greeting({ account_id: window.accountId })
  document.querySelectorAll('[data-behavior=greeting]').forEach(el => {
    // set divs, spans, etc
    el.innerText = currentGreeting

    // set input elements
    el.value = currentGreeting
  })
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow()
    else signedOutFlow()
  })
  .catch(console.error)
