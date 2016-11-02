import { inject, observable, BindingEngine } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router, BindingEngine)
export class Search {
  initialized = false;
  schools = schools.map(s => {
    const district = districts.find(d => d.id === s.district);
    const level = levels.find(l => l.id === s.level);
    return {
      id: s.id,
      name: s.name,
      district: district,
      level: level
    };
  })
  districts = JSON.parse(JSON.stringify(districts));
  levels = JSON.parse(JSON.stringify(levels));
  selectedDistricts = [];
  selectedLevels = [];
  searchResults = [];
  
  @observable({
    changeHandler: 'criteriaUpdated'
  }) searchTerm = '';

  constructor(router, bindingEngine) {
    this.router = router;
    this.bindingEngine = bindingEngine;
  }

  activate(params, routeConfig, navigationInstruction) {
    if (params.searchTerm && params.searchTerm !== 'null') {
      this.searchTerm = params.searchTerm;
    }

    if (params.selectedDistricts && params.selectedDistricts !== 'null') {
      // this goofiness is because all router parameters are given as strings,
      // so we split the string on commas, then convert each item in this array
      // to a Number. Finally, we use the spread operator to convert this array
      // into a bunch of parameters passed to push
      this.selectedDistricts.push(...params.selectedDistricts.split(',').map(x => Number(x)));
    }

    if (params.selectedLevels && params.selectedLevels !== 'null') {
      // this goofiness is because all router parameters are given as strings,
      // so we split the string on commas, then convert each item in this array
      // to a Number. Finally, we use the spread operator to convert this array
      // into a bunch of parameters passed to push
      this.selectedLevels.push(...params.selectedLevels.split(',').map(x => Number(x)));
    }

    this.criteriaUpdated();

    this.bindingEngine.collectionObserver(this.selectedDistricts).subscribe(() => this.criteriaUpdated());
    this.bindingEngine.collectionObserver(this.selectedLevels).subscribe(() => this.criteriaUpdated());
    this.initialized = true;
  }

  criteriaUpdated() {
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
        const query = this.searchTerm.toLocaleLowerCase();
        this.searchResults = this.searchResults.filter(s => s.name.toLocaleLowerCase().includes(query));
      }

      if (this.selectedDistricts.length > 0) {
        this.searchResults = this.searchResults.filter(s => this.selectedDistricts.includes(s.district.id));
      }

      if (this.selectedLevels.length > 0) {
        this.searchResults = this.searchResults.filter(s => this.selectedLevels.includes(s.level.id));
      }
    }
  }
}

const schools = [{
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

const districts = [{
  id: 1,
  name: 'District One'
}, {
  id: 2,
  name: 'District Two'
}
];

const levels = [{
  id: 1,
  name: 'Elementary'
}, {
  id: 2,
  name: 'Middle'
}, {
  id: 3,
  name: 'High'
}];
