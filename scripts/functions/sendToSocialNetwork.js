const { shell, clipboard } = require('electron')


module.exports = function sendToSocialNetwork(type) {

  switch (type) {
    case 'facebook':
      shell.openExternal('http://www.facebook.com/sharer.php?u=' + clipboard.readText())
      break;
    case 'twitter':
      shell.openExternal('https://twitter.com/share?url=' + clipboard.readText() + ';text=Create screenshot with --shots;hashtags=shots,opensource,awesome')
      break;
    case 'vkontakte':
      shell.openExternal('http://vkontakte.ru/share.php?url=' + clipboard.readText())
      break;
    default:
      break;
  }
}
