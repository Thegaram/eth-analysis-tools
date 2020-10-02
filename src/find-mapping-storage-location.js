const web3 = require('web3');

// mapping (address => uint256) ownershipTokenCount;
// slot: 8
// where is ownershipTokenCount[0xb1690c08e213a35ed9bab7b318de14420fb57d8c] stored?

// console.log(web3.utils.soliditySha3({ type: 'uint256', value: '0xb1690c08e213a35ed9bab7b318de14420fb57d8c' }, { type: 'uint256', value: 8 }));
// 0xc56c286245a85e4048e082d091c57ede29ec05df707b458fe836e199193ff182

// or, equivalently:
// console.log(web3.utils.soliditySha3('0x000000000000000000000000b1690c08e213a35ed9bab7b318de14420fb57d8c0000000000000000000000000000000000000000000000000000000000000008'));
// 0xc56c286245a85e4048e082d091c57ede29ec05df707b458fe836e199193ff182

// importantly, this is not correct!
// seems like addresses are also padded to 32 Bytes for some reason
// console.log(web3.utils.soliditySha3({ type: 'address', value: '0xb1690c08e213a35ed9bab7b318de14420fb57d8c' }, { type: 'uint256', value: 8 }));
// 0x708a35c619c0e21c45f55f71fc8ec6152868f061be0ce6c751b5967e93dd234c

// if you know the set of possible inputs (which can be method arguments, global constants, etc.)
// then you can try to find the corresponding key given a storage location hash

// const inputs = [
//     746370, // kitty id
//     '0xb0d91c5d8e82a63d23b4a225ecd6249b837af891', // sender
//     '0x06012c8cf97bead5deae237070f9587f8e7a266d', // receiver (CryptoKitties: Core)
//     '0xb1690c08e213a35ed9bab7b318de14420fb57d8c', // CryptoKitties: Sales Auction
// ];

// const target = '0xc56c286245a85e4048e082d091c57ede29ec05df707b458fe836e199193ff182';

const inputs = [
    '0x2a0c0dbecc7e4d658f48e01e3fa353f44050c208', // contract address
    '0x034767f3c519f361c5ecf46ebfc08981c629d381', // fee account
    '0x0000000000000000000000000000000000000000', // eth
];

const target = '0x3ccb72d91c5c66cba135a4135963ed23443b8a63817f501517468fcd5097e277';
const numSlots = 20;

// try simple mappings
for (let ii = 0; ii < numSlots; ++ii) {
    for (let jj = 0; jj < inputs.length; ++jj) {
        let hash = web3.utils.soliditySha3({ type: 'uint256', value: inputs[jj] }, { type: 'uint256', value: ii });

        if (hash == target) {
            console.log(`slot_${ii}[${inputs[jj]}] is at location ${target}`);
            return;
        }
    }
}

// try nested mappings
for (let ii = 0; ii < numSlots; ++ii) {
    for (let jj = 0; jj < inputs.length; ++jj) {
        for (let kk = 0; kk < inputs.length; ++kk) {
            let hash = web3.utils.soliditySha3({ type: 'uint256', value: inputs[jj] }, { type: 'uint256', value: ii });
            hash = web3.utils.soliditySha3({ type: 'uint256', value: inputs[kk] }, { type: 'uint256', value: hash });

            if (hash == target) {
                console.log(`slot_${ii}[${inputs[jj]}][${inputs[kk]}] is at location ${target}`);
                return;
            }
        }
    }
}
