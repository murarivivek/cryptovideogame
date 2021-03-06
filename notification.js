'use strict';


var isPushEnabled = false;

function endpointWorkaround(pushSubscription) {
  // Make sure we only mess with GCM
  if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
    return pushSubscription.endpoint;
  }

  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = pushSubscription.endpoint + '/' +
      pushSubscription.subscriptionId;
  }
  return mergedEndpoint;
}


function sendSubscriptionToServer(subscription) {
  // TODO: Send the subscription.endpoint
  // to your server and save it to send a
  // push message at a later date
  //
  // For compatibly of Chrome 43, get the endpoint via
  // endpointWorkaround(subscription)

  var mergedEndpoint = endpointWorkaround(subscription);
  var endpointSections = mergedEndpoint.split('/');
  var subscriptionId = endpointSections[endpointSections.length - 1];
  var endPoint = mergedEndpoint.substring(0, mergedEndpoint.lastIndexOf("/"));
  web3.version.getNetwork(function(err, netId) {
    var networkId = null;
    if(netId){
      networkId = netId;
    }
    web3.eth.getAccounts(function(error, accounts) {
      var account = null;
      if(accounts && accounts.length > 0){
        account = accounts[0];
      }
      var http = new XMLHttpRequest();
      var url = "/api/subscribe";
      var params = {
        'id' : subscriptionId,
        'walletAddress' : account,
        'networkId' : networkId,
        'endPoint' : endPoint
      };

      http.open("POST", url, true);

      //Send the proper header information along with the request
      http.setRequestHeader("Content-type", "application/json");

      http.onreadystatechange = function() {//Call a function when the state changes.
          if(http.readyState == 4 && http.status == 200) {
              console.log(http.responseText);
          }
      }
      http.send(JSON.stringify(params));
    });

  });
  
  console.log(JSON.stringify(subscription));
}

function removeSubscriptionFromServer(subscription) {

  var mergedEndpoint = endpointWorkaround(subscription);
  var endpointSections = mergedEndpoint.split('/');
  var subscriptionId = endpointSections[endpointSections.length - 1];
  
  var http = new XMLHttpRequest();
  var url = "/api/unsubscribe";
  var params = {
    'id' : subscriptionId
  };
  
  http.open("POST", url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");

  http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          console.log(http.responseText);
      }
  }
  http.send(JSON.stringify(params));
  console.log(JSON.stringify(subscription));
}


function unsubscribe() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // To unsubscribe from push messaging, you need get the
    // subcription object, which you can call unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have a subscription to unsubscribe
        if (!pushSubscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          isPushEnabled = false;
          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
          return;
        }

        // TODO: Make a request to your server to remove
        // the users data from your data store so you
        // don't attempt to send them push messages anymore

        // We have a subcription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function() {
          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
          isPushEnabled = false;
          removeSubscriptionFromServer(pushSubscription);
        }).catch(function(e) {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove
          // the subscription id from your data store and
          // inform the user that you disabled push

          alert('Unsubscription error: ', e);
          pushButton.disabled = false;
        });
      }).catch(function(e) {
        alert('Error thrown while unsubscribing from ' +
          'push messaging.', e);
      });
  });
}

function subscribe() {
  // Disable the button so it can't be changed while
  // we process the permission request
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;
  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        // The subscription was successful
        isPushEnabled = true;
        pushButton.textContent = 'Disable Push Messages';
        pushButton.disabled = false;

        // TODO: Send the subscription subscription.endpoint
        // to your server and save it to send a push message
        // at a later date
        return sendSubscriptionToServer(subscription);
      })
      .catch(function(e) {
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually change the notification permission to
          // subscribe to push messages
          alert('Permission for Notifications was denied');
          pushButton.disabled = true;
        } else {
          // A problem occurred with the subscription, this can
          // often be down to an issue or lack of the gcm_sender_id
          // and / or gcm_user_visible_only
          alert('Unable to subscribe to push.', e);
          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
        }
      });
  });
}

// Once the service worker is registered set the initial state
function initialiseState() {
  // Are Notifications supported in the service worker?
  if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
    alert('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    alert('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    alert('Push messaging isn\'t supported.');
    return;
  }

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      serviceWorkerRegistration.pushManager.getSubscription()
        .then(function(subscription) {
          // Enable any UI which subscribes / unsubscribes from
          // push messages.
          var pushButton = document.querySelector('.js-push-button');
          pushButton.disabled = false;

          if (!subscription) {
            // We aren’t subscribed to push, so set UI
            // to allow the user to enable push
            return;
          }

          // Keep your server in sync with the latest subscription
          sendSubscriptionToServer(subscription);

          // Set your UI to show they have subscribed for
          // push messages
          pushButton.textContent = 'Disable Push Messages';
          isPushEnabled = true;
        })
        .catch(function(err) {
          alert('Error during getSubscription()', err);
        });
    });
}

window.addEventListener('load', function() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.addEventListener('click', function() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });

  // Check that service workers are supported, if so, progressively
  // enhance and add push messaging support, otherwise continue without it.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
            .then(initialiseState);
  } else {
    alert('Service workers aren\'t supported in this browser.');
  }
});

