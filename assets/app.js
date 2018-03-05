App = {
  web3Provider: null,
  contracts: {},
  metamaskInstalled: true,

  init: function(finalCallBack) {
    return App.initWeb3(finalCallBack);
  },


  initWeb3: function(finalCallBack) {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      $('#noMetaMaskAlert').hide();
      App.web3Provider = web3.currentProvider;
    } else {
      App.metamaskInstalled = false;
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initGameContract(finalCallBack);
  },

  initGameContract: function(finalCallBack) {
    $.getJSON('./assets/CryptoVideoGames.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var videoGameTokenArtifact = data;
      App.contracts.VideoGame = TruffleContract(videoGameTokenArtifact);

      // Set the provider for our contract
      App.contracts.VideoGame.setProvider(App.web3Provider);

      return App.initGameItemContract(finalCallBack);
      
    });
  },

  initGameItemContract: function(finalCallBack) {
    $.getJSON('./assets/CryptoVideoGameItem.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var videoGameItemTokenArtifact = data;
      App.contracts.VideoGameItem = TruffleContract(videoGameItemTokenArtifact);

      // Set the provider for our contract
      App.contracts.VideoGameItem.setProvider(App.web3Provider);
      
      return App.initPowZoneContract(finalCallBack);
      
    });
  },

  initPowZoneContract: function(finalCallBack) {
    $.getJSON('./assets/PowZoneToken.json?id=no-cache', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var powZoneTokenArtifact = data;
      App.contracts.PowZone = TruffleContract(powZoneTokenArtifact);

      // Set the provider for our contract
      App.contracts.PowZone.setProvider(App.web3Provider);
      
      return App.initPokemonPowContract(finalCallBack);
      
    });
  },

  initPokemonPowContract: function(finalCallBack) {
    $.getJSON('./assets/PokemonPow.json?id=no-cache', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var pokemonPowTokenArtifact = data;
      App.contracts.PokemonPow = TruffleContract(pokemonPowTokenArtifact);

      // Set the provider for our contract
      App.contracts.PokemonPow.setProvider(App.web3Provider);
      
      if(typeof finalCallBack !== 'undefined'){
        return finalCallBack();
      }
      
    });
  }
};

