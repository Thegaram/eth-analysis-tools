const solc = require('solc');
const fs = require('fs');

const CONTRACT_FILE = './contracts/cryptokitties-0.5.13.sol';
const content = fs.readFileSync(CONTRACT_FILE).toString();

var input = {
  language: 'Solidity',
  sources: {
    'cryptokitties.sol': {
      content: content
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    },
  }
};

solc.loadRemoteVersion('v0.5.13+commit.5b0b510c', function(err, solcSnapshot) {
    if (err) {
        return console.log(err);
    }

    var output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));
    const layout = output['contracts']['cryptokitties.sol']['KittyCore']['storageLayout'];
    console.log(JSON.stringify(layout, null, 4));
});