ID=vbi-near-cource-expense.quanglien.testnet

near create-account $ID --masterAccount quanglien.testnet --initialBalance 10
near delete $ID quanglien.testnet

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/expense.wasm

near call $ID add '{"_name": "Mua MacBookPro", "_value": 1000000, "time": "21/1/2022"}' --accountId $ID
near call $ID add '{"_name": "Mua Iphone11", "_value": 2000000, "time": "22/1/2022"}' --accountId $ID

near view $ID get '' --accountId $ID