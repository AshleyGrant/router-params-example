export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: '', redirect: 'search' },
      {
        route: 'search/:selectedDistricts/:selectedLevels/:searchTerm',
        name: 'search',
        moduleId: 'search',
        nav: true,
        title: 'Search',
        href: '#/search'
      }
    ]);

    this.router = router;
  }
}
