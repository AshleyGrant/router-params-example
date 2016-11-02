define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Aurelia';
      config.map([{ route: '', redirect: 'search' }, {
        route: 'search/:selectedDistricts/:selectedLevels/:searchTerm',
        name: 'search',
        moduleId: 'search',
        nav: true,
        title: 'Search',
        href: '#/search'
      }]);

      this.router = router;
    };

    return App;
  }();
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('search',['exports', 'aurelia-framework', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Search = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

  var Search = exports.Search = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _aureliaFramework.BindingEngine), _dec2 = (0, _aureliaFramework.observable)({
    changeHandler: 'criteriaUpdated'
  }), _dec(_class = (_class2 = function () {
    function Search(router, bindingEngine) {
      _classCallCheck(this, Search);

      this.initialized = false;
      this.schools = schools.map(function (s) {
        var district = districts.find(function (d) {
          return d.id === s.district;
        });
        var level = levels.find(function (l) {
          return l.id === s.level;
        });
        return {
          id: s.id,
          name: s.name,
          district: district,
          level: level
        };
      });
      this.districts = JSON.parse(JSON.stringify(districts));
      this.levels = JSON.parse(JSON.stringify(levels));
      this.selectedDistricts = [];
      this.selectedLevels = [];
      this.searchResults = [];

      _initDefineProp(this, 'searchTerm', _descriptor, this);

      this.router = router;
      this.bindingEngine = bindingEngine;
    }

    Search.prototype.activate = function activate(params, routeConfig, navigationInstruction) {
      var _this = this;

      if (params.searchTerm && params.searchTerm !== 'null') {
        this.searchTerm = params.searchTerm;
      }

      if (params.selectedDistricts && params.selectedDistricts !== 'null') {
        var _selectedDistricts;

        (_selectedDistricts = this.selectedDistricts).push.apply(_selectedDistricts, params.selectedDistricts.split(',').map(function (x) {
          return Number(x);
        }));
      }

      if (params.selectedLevels && params.selectedLevels !== 'null') {
        var _selectedLevels;

        (_selectedLevels = this.selectedLevels).push.apply(_selectedLevels, params.selectedLevels.split(',').map(function (x) {
          return Number(x);
        }));
      }

      this.criteriaUpdated();

      this.bindingEngine.collectionObserver(this.selectedDistricts).subscribe(function () {
        return _this.criteriaUpdated();
      });
      this.bindingEngine.collectionObserver(this.selectedLevels).subscribe(function () {
        return _this.criteriaUpdated();
      });
      this.initialized = true;
    };

    Search.prototype.criteriaUpdated = function criteriaUpdated() {
      var _this2 = this;

      if (this.initialized) {
        this.router.navigateToRoute('search', {
          searchTerm: this.searchTerm || 'null',
          selectedDistricts: this.selectedDistricts.length > 0 ? this.selectedDistricts.join(',') : 'null',
          selectedLevels: this.selectedLevels.length > 0 ? this.selectedLevels.join(',') : 'null'
        }, {
          replace: false,
          trigger: false
        });
      }
      this.searchResults = this.schools;

      if (!(this.searchTerm.length === 0 && this.selectedDistricts.length === 0 && this.selectedLevels.length === 0)) {
        if (this.searchTerm.length > 0) {
          (function () {
            var query = _this2.searchTerm.toLocaleLowerCase();
            _this2.searchResults = _this2.searchResults.filter(function (s) {
              return s.name.toLocaleLowerCase().includes(query);
            });
          })();
        }

        if (this.selectedDistricts.length > 0) {
          this.searchResults = this.searchResults.filter(function (s) {
            return _this2.selectedDistricts.includes(s.district.id);
          });
        }

        if (this.selectedLevels.length > 0) {
          this.searchResults = this.searchResults.filter(function (s) {
            return _this2.selectedLevels.includes(s.level.id);
          });
        }
      }
    };

    return Search;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'searchTerm', [_dec2], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class);


  var schools = [{
    id: 1,
    name: 'Leon',
    district: 1,
    level: 3
  }, {
    id: 2,
    name: 'Raa',
    district: 1,
    level: 2
  }, {
    id: 3,
    name: 'Chiles',
    district: 2,
    level: 3
  }, {
    id: 4,
    name: 'Gilchrist',
    district: 1,
    level: 1
  }];

  var districts = [{
    id: 1,
    name: 'District One'
  }, {
    id: 2,
    name: 'District Two'
  }];

  var levels = [{
    id: 1,
    name: 'Elementary'
  }, {
    id: 2,
    name: 'Middle'
  }, {
    id: 3,
    name: 'High'
  }];
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"styles.css\"></require>\n  <require from=\"nav-bar.html\"></require>\n\n  <nav-bar router.bind=\"router\"></nav-bar>\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "body {\n  margin: 0;\n}\n\n.splash {\n  text-align: center;\n  margin: 10% 0 0 0;\n  box-sizing: border-box;\n}\n\n.splash .message {\n  font-size: 72px;\n  line-height: 72px;\n  text-shadow: rgba(0, 0, 0, 0.5) 0 0 15px;\n  text-transform: uppercase;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n}\n\n.splash .fa-spinner {\n  text-align: center;\n  display: inline-block;\n  font-size: 72px;\n  margin-top: 50px;\n}\n\n.page-host {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 50px;\n  bottom: 0;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n@media print {\n  .page-host {\n    position: absolute;\n    left: 10px;\n    right: 0;\n    top: 50px;\n    bottom: 0;\n    overflow-y: inherit;\n    overflow-x: inherit;\n  }\n}\n\nsection {\n  margin: 0 20px;\n}\n\n.navbar-nav li.loader {\n  margin: 12px 24px 0 6px;\n}\n\n.pictureDetail {\n  max-width: 425px;\n}\n\n/* animate page transitions */\nsection.au-enter-active {\n  -webkit-animation: fadeInRight 1s;\n  animation: fadeInRight 1s;\n}\n\ndiv.au-stagger {\n  /* 50ms will be applied between each successive enter operation */\n  -webkit-animation-delay: 50ms;\n  animation-delay: 50ms;\n}\n\n.card-container.au-enter {\n  opacity: 0;\n}\n\n.card-container.au-enter-active {\n  -webkit-animation: fadeIn 2s;\n  animation: fadeIn 2s;\n}\n\n.card {\n  overflow: hidden;\n  position: relative;\n  border: 1px solid #CCC;\n  border-radius: 8px;\n  text-align: center;\n  padding: 0;\n  background-color: #337ab7;\n  color: rgb(136, 172, 217);\n  margin-bottom: 32px;\n  box-shadow: 0 0 5px rgba(0, 0, 0, .5);\n}\n\n.card .content {\n  margin-top: 10px;\n}\n\n.card .content .name {\n  color: white;\n  text-shadow: 0 0 6px rgba(0, 0, 0, .5);\n  font-size: 18px;\n}\n\n.card .header-bg {\n  /* This stretches the canvas across the entire hero unit */\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 70px;\n  border-bottom: 1px #FFF solid;\n  border-radius: 6px 6px 0 0;\n}\n\n.card .avatar {\n  position: relative;\n  margin-top: 15px;\n  z-index: 100;\n}\n\n.card .avatar img {\n  width: 100px;\n  height: 100px;\n  -webkit-border-radius: 50%;\n  -moz-border-radius: 50%;\n  border-radius: 50%;\n  border: 2px #FFF solid;\n}\n\n/* animation definitions */\n@-webkit-keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0)\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    transform: none\n  }\n}\n\n@keyframes fadeInRight {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate3d(100%, 0, 0);\n    -ms-transform: translate3d(100%, 0, 0);\n    transform: translate3d(100%, 0, 0)\n  }\n  100% {\n    opacity: 1;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none\n  }\n}\n\n@-webkit-keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n\n@keyframes fadeIn {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse\">\n        <span class=\"sr-only\">Toggle Navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">\n        <i class=\"fa fa-home\"></i>\n        <span>${router.title}</span>\n      </a>\n    </div>\n\n    <div class=\"collapse navbar-collapse\" id=\"skeleton-navigation-navbar-collapse\">\n      <ul class=\"nav navbar-nav\">\n        <li repeat.for=\"row of router.navigation\" class=\"${row.isActive ? 'active' : ''}\">\n          <a data-toggle=\"collapse\" data-target=\"#skeleton-navigation-navbar-collapse.in\" href.bind=\"row.href\">${row.title}</a>\n        </li>\n      </ul>\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"loader\" if.bind=\"router.isNavigating\">\n          <i class=\"fa fa-spinner fa-spin fa-2x\"></i>\n        </li>\n      </ul>\n    </div>\n  </nav>\n</template>\n"; });
define('text!search.html', ['module'], function(module) { module.exports = "<template>\n\t<section class=\"au-animate\">\n\t\t<h2>Search</h2>\n\t\t<form role=\"form\" submit.delegate=\"submit()\">\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<test></test>\n\t\t\t\t<label for=\"sn\">School Name</label>\n\t\t\t\t<input type=\"text\" value.bind=\"searchTerm\" class=\"form-control\" id=\"sn\" placeholder=\"school name\">\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"ln\">District</label>\n\t\t\t\t<label repeat.for=\"district of districts\">\n          <input type=\"checkbox\" model.bind=\"district.id\" checked.bind=\"selectedDistricts\" />\n          ${district.name}\n        </label>\n\t\t\t</div>\n\t\t\t<div class=\"form-group\">\n\t\t\t\t<label for=\"ln\">Level</label>\n\t\t\t\t<label repeat.for=\"level of levels\">\n          <input type=\"checkbox\" model.bind=\"level.id\" checked.bind=\"selectedLevels\" />\n          ${level.name}\n        </label>\n\t\t\t</div>\n\t\t</form>\n\t</section>\n\n\t<div if.bind=\"searchResults.length > 0 \" repeat.for=\"school of searchResults\" class=\"col-sm-3\" style=\"margin-left: 20px\">\n\t\t<div class=\"panel panel-default\">\n\t\t\t<div class=\"panel-heading\">\n\t\t\t\t<h3 class=\"panel-title\">${school.name}</h3>\n\t\t\t</div>\n\t\t\t<div class=\"panel-body\">\n\t\t\t\t<p><strong>Level:&nbsp;</strong>${school.level.name}</p>\n\t\t\t\t<p><strong>District:&nbsp;</strong>${school.district.name}</p>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\n\t<div if.bind=\"searchResults.length === 0\" class=\"col-sm-3\" style=\"margin-left: 20px\">\n\t\t<div class=\"panel panel-default\">\n\t\t\t<div class=\"panel-heading\">\n\t\t\t\t<h3 class=\"panel-title\">&nbsp;</h3>\n\t\t\t</div>\n\t\t\t<div class=\"panel-body\">\n\t\t\t\tNo results\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map