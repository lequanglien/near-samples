<<<<<<< HEAD
ID=vbi-near-cource.quanglien.testnet

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/mynote.wasm

near call $ID new '{}' --accountId $ID

near call $ID insert_note '{"name": "title2", "_content": "content2"}' --accountId $ID
near call $ID insert_note '{"name": "title2", "_content": "content2"}' --accountId vbi-near-cource-football-bet.quanglien.testnet
near call $ID insert_note '{"name": "title3", "_content": "content2"}' --accountId vbi-near-cource-football-bet.quanglien.testnet
near call $ID insert_note '{"name": "title4", "_content": "content2"}' --accountId vbi-near-cource-football-bet.quanglien.testnet
near call $ID edit_note '{"name": "title4", "_content": "content4"}' --accountId vbi-near-cource-football-bet.quanglien.testnet
near call $ID get_notes '' --accountId $ID
near call $ID get_notes '' --accountId vbi-near-cource-football-bet.quanglien.testnet
=======
ID=vbi-near-course-mynote.nghilt.testnet

near create-account $ID --masterAccount nghilt.testnet --initialBalance 10
near delete $ID nghilt.testnet

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/mynote.wasm

near call $ID new '{}' --accountId $ID

near call $ID insert_note '{"name": "title", "_content": "content"}' --accountId $ID
near call $ID edit_note '{"name": "title", "_content": "content22222"}' --accountId $ID
near call $ID get_notes '' --accountId $ID
>>>>>>> 1911e0938f8f3b6cfe474c51ff90210d27942022
