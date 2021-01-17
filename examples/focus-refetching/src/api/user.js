// an endpoint for getting user info
export default () => {
  if (window['swr-test-token'] === 'swr') {
    // authorized
    return {
      loggedIn: true,
      name: 'liaoliao666',
      avatar: 'https://avatars3.githubusercontent.com/u/6128107?s=200&v=4',
    }
  }

  return {
    loggedIn: false,
  }
}
