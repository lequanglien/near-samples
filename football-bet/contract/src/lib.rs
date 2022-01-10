/*
 * This is an example of a Rust smart contract with two simple, symmetric functions:
 *
 * 1. set_greeting: accepts a greeting, such as "howdy", and records it for the user (account_id)
 *    who sent the request
 * 2. get_greeting: accepts an account_id and returns the greeting saved for it, defaulting to
 *    "Hello"
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://github.com/near/near-sdk-rs
 *
 */

use std::collections::HashMap;
// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{AccountId, Balance, env, near_bindgen, Promise, setup_alloc};
use near_sdk::collections::{LookupMap};
use near_sdk::serde::{Serialize,Deserialize};

setup_alloc!();
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct BetItem {
    account_id: AccountId,
    bet: String,
    bet_value : Balance,
    winner: bool
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Bet {
    bets : Vec<BetItem>,
    total_bet_amount : Balance,
    online: bool
}



// Structs in Rust are similar to other languages, and may include impl keyword as shown below
// Note: the names of the structs are not important when calling the smart contract, but the function names are
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct FootballBet {
    owner_id : AccountId,
    games: HashMap<String, Bet>,
}

impl Default for FootballBet {
  fn default() -> Self {
    Self {
        owner_id: "".clone().parse().unwrap(),
        games: HashMap::new(),
    }
  }
}

#[near_bindgen]
impl FootballBet {

    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        Self {
            owner_id,
            games : HashMap::<String, Bet>::new()
        }
    }


    pub fn get_bets(&self) -> &HashMap<String, Bet> {
        let games = &self.games;

        let result = HashMap::<String, Bet>::new();

        // for (game_id, bet) in games.
        games.clone()
    }


    #[payable]
    pub fn bet(&mut self, _game: &String, _bet: &String) -> Balance {

        let account_id = env::signer_account_id();
        let deposit_amount = env::attached_deposit();

        let  game = self.games.get_mut(_game);

        match game {
            Some(bet)=> {
                bet.total_bet_amount += deposit_amount;
                bet.bets.push(BetItem {
                    account_id: account_id.clone(),
                    bet: _bet.clone(),
                    bet_value: deposit_amount,
                    winner: false
                });
            }
            _ => {
                // game is not exists
                let mut _bets = Vec::new();
                _bets.push(BetItem {
                    account_id: account_id.clone(),
                    bet: _bet.clone(),
                    bet_value: deposit_amount,
                    winner: false
                });
                let bet = Bet {
                    total_bet_amount: deposit_amount,
                    bets: _bets,
                    online : true
                };
                self.games.insert(_game.clone(), bet);
            }
        }

        env::log(format!("smart contract balance: {}", env::account_balance()).as_bytes());

        env::account_balance()
    }



    #[payable]
    pub fn end_game(&mut self, _game: &String, _result: &String) {
        // tạm thời bỏ qua việc kiểm tra caller chỉ là người chủ kèo.
        let account_id = env::signer_account_id();

        assert_ne!(account_id, self.owner_id, "Chỉ được người sở hữu smartcontract mới có quyền thực hiện");

        let mut game = self.games.get_mut(_game);

        match game {
            Some(bet)=> {
                let mut pay_amount_for_winner = 0;
                // find winner
                for b in &mut bet.bets{
                    if b.bet == _result.clone() {
                        pay_amount_for_winner += b.bet_value;
                        Promise::new(b.account_id.clone()).transfer(b.bet_value*2);
                        b.winner = true
                    }
                }

                // cập nhật trạng thái offline game này
                bet.online = false;
            }
            _ => {}
        }



    }


}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 *
 * To run from contract directory:
 * cargo test -- --nocapture
 *
 * From project root, to run in combination with frontend tests:
 * yarn test
 *
 */
// #[cfg(test)]
// mod tests {
//     use super::*;
//     use near_sdk::MockedBlockchain;
//     use near_sdk::{testing_env, VMContext};
//
//     // mock the context for testing, notice "signer_account_id" that was accessed above from env::
//     fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
//         VMContext {
//             current_account_id: "alice_near".to_string(),
//             signer_account_id: "bob_near".to_string(),
//             signer_account_pk: vec![0, 1, 2],
//             predecessor_account_id: "carol_near".to_string(),
//             input,
//             block_index: 0,
//             block_timestamp: 0,
//             account_balance: 0,
//             account_locked_balance: 0,
//             storage_usage: 0,
//             attached_deposit: 0,
//             prepaid_gas: 10u64.pow(18),
//             random_seed: vec![0, 1, 2],
//             is_view,
//             output_data_receivers: vec![],
//             epoch_height: 19,
//         }
//     }
//
//     #[test]
//     fn set_then_get_greeting() {
//         let context = get_context(vec![], false);
//         testing_env!(context);
//         let mut contract = Welcome::default();
//         contract.set_greeting("howdy".to_string());
//         assert_eq!(
//             "howdy".to_string(),
//             contract.get_greeting("bob_near".to_string())
//         );
//     }
//
//     #[test]
//     fn get_default_greeting() {
//         let context = get_context(vec![], true);
//         testing_env!(context);
//         let contract = Welcome::default();
//         // this test did not call set_greeting so should return the default "Hello" greeting
//         assert_eq!(
//             "Hello".to_string(),
//             contract.get_greeting("francis.near".to_string())
//         );
//     }
// }
