ID=vbi-near-course-football-bet.nghilt.testnet

near create-account $ID --masterAccount nghilt.testnet --initialBalance 10
near delete $ID nghilt.testnet

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/football_bet.wasm

near call $ID new '{"owner_id": "'$ID'"}' --accountId $ID
near call $ID bet '{"_game": "MU-Arsenal", "_bet": "1:1"}' --accountId quanglien.testnet --deposit 1
near call $ID bet '{"_game": "Chelsea-ManCity", "_bet": "1:1"}' --accountId quanglien.testnet --deposit 1
near call $ID end_game '{"_game": "MU-Arsenal", "_result": "1:2"}' --accountId $ID

cargo build --target wasm32-unknown-unknown --release && near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/football_bet.wasm

near view $ID get_bets '{}' --accountId $ID
near view $ID get '' --accountId $ID
near view $ID get_bets '' --accountId $ID


#demo
gamer 1 :
GAME1=vbi-near-cource-football-bet1.nghilt.testnet
near create-account $GAME1 --masterAccount nghilt.testnet --initialBalance 10


gamer 2 :
GAME2=vbi-near-cource-football-bet2.nghilt.testnet
near create-account $GAME2 --masterAccount nghilt.testnet --initialBalance 10


HOLDER: là thằng smartcontract
ID=vbi-near-cource-football-bet.nghilt.testnet

step 1:
#xem số near hiện tại của 3 vai trò
near state $GAME1
near state $GAME2
near state $ID

Step2 : đặt cược
near call $ID bet '{"_game": "MU-Arsenal", "_bet": "1:1"}' --accountId $GAME1 --deposit 1
near call $ID bet '{"_game": "MU-Arsenal", "_bet": "1:2"}' --accountId $GAME2 --deposit 1

Step3 : End _game
near call $ID end_game '{"_game": "MU-Arsenal", "_result": "1:2"}' --accountId $ID

Step4: Check lại số tiền của những ng chơi
near state $GAME1
near state $GAME2
near state $ID


# reset
near delete $GAME1 nghilt.testnet
near delete $GAME2 nghilt.testnet
near delete $ID nghilt.testnet