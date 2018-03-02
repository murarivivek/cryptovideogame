'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
  event.waitUntil(  
    fetch('/api/notification').then(function(response) {  
      if (response.status !== 200) {  
        console.log('Looks like there was a problem. Status Code: ' + response.status);  
        throw new Error();  
      }
      return response.json().then(function(data) { 
        var title = data.title;
        var body = data.body;
        var icon = data.icon;
        var tag = data.tag;
        var action_url = data.action_url;
        return self.registration.showNotification(title, {  
          body: body,  
          icon: icon,  
          tag: tag,
          data: {
            url: action_url
          }
        });  
      });  
    })
  );
  
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(event.notification.data.url);
    }
  }));
});
