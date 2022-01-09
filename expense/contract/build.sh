ID=vbi-near-course-expense.nghilt.testnet

near create-account $ID --masterAccount nghilt.testnet --initialBalance 10

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/expense.wasm

near call $ID add '{"_name": "Mua Window Surface", "_value": 1000000}' --accountId $ID

near view $ID get '' --accountId $ID


