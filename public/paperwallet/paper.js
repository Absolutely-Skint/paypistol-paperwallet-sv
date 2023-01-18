
function create_paper_wallet()
{
	const { nimble } = window;
	const { bsv } = window;
	let words = bsv.Mnemonic.fromRandom();
	let hdKey = bsv.HDPrivateKey.fromSeed(words.toSeed());
	let bsvKey = hdKey.deriveChild("m/44'/236'/0'/0/0");
	let runKey = hdKey.deriveChild("m/44'/236'/0'/2/0");

	let account = {};
	account.words 		=	 words.toString();
	account.public_key  =  hdKey.publicKey.toString();
	account.private_key =  hdKey.privateKey.toString();
	account.address_raw =  hdKey.privateKey.toAddress().toString();
	account.address_bsv =  bsv.Address.fromPublicKey(bsvKey.publicKey).toString()
	account.address_run =  bsv.Address.fromPublicKey(runKey.publicKey).toString()
	return account;
}


function generateWallets()
{
	console.log("Generate Wallet");
	let container = document.getElementById('wallet-drop');
	for(var i = 0; i < 3; i++)
	{
		var account = create_paper_wallet();
		let output = '<p><b>BSV Address:</b> <span class="">' + account.address_bsv + '</span></p>';
		output += '<p><b>Private Words:</b> <span class="">' + account.words + '</span></p>';
		output += '<p><b>Private Key:</b> <span class="">' + account.private_key + '</span></p>';
		output += '<p><b>Public Key:</b> <span class="">' + account.public_key + '</span></p>';
		output += '<p><b>Run Developer Address (Do not send BSV here!):</b> <span class="">' + account.address_run + '</span></p>';
		//output += '<p><button>Copy to clipboard</button></p>';

		var newItem = document.createElement('div');
		newItem.className = ('col-md-12 col-lg-12 mt-3 mb-3 rcorners2');
		newItem.innerHTML = (output);
		container.appendChild(newItem);
	}
}