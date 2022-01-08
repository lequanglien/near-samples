ID=vbi-near-cource.quanglien.testnet

cargo build --target wasm32-unknown-unknown --release

near deploy --accountId $ID --wasmFile target/wasm32-unknown-unknown/release/mynote.wasm

near call $ID new '{}' --accountId $ID

near call $ID insert_note '{"name": "title", "_content": "content"}' --accountId $ID
near call $ID edit_note '{"name": "title", "_content": "content22222"}' --accountId $ID
near call $ID get_notes '' --accountId $ID