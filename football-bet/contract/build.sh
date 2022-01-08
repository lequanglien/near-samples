ID=vbi-near-cource-football-bet.quanglien.testnet

near create-account $ID --masterAccount quanglien.testnet --initialBalance 10
near delete $ID quanglien.testnet

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/football_bet.wasm

near call $ID bet '{"_game": "MU-Arsenal", "_bet": "1:1"}' --accountId quanglien.testnet --deposit 1
near call $ID end_game '{"_game": "MU-Arsenal", "_result": "1:2"}' --accountId $ID

cargo build --target wasm32-unknown-unknown --release && near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/football_bet.wasm

near view $ID get_bets '{}' --accountId $ID
near view $ID get '' --accountId $ID


#demo
gamer 1 :
GAME1=vbi-near-cource-football-bet1.quanglien.testnet
near create-account $GAME1 --masterAccount quanglien.testnet --initialBalance 10


gamer 2 :
GAME2=vbi-near-cource-football-bet2.quanglien.testnet
near create-account $GAME2 --masterAccount quanglien.testnet --initialBalance 10


HOLDER: là thằng smartcontract
ID=vbi-near-cource-football-bet.quanglien.testnet

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
near delete $GAME1 quanglien.testnet
near delete $GAME2 quanglien.testnet
near delete $ID quanglien.testnet