
import glob from './globals';

const DEFAULT_ALL = 'All';

export interface OptionElement {
  el: HTMLButtonElement;
  name: string;
  check: HTMLDivElement;
}

export default class MultiSelect {
  outer: HTMLDivElement;
  label: HTMLLabelElement;
  select: HTMLElement;
  selectTxt: HTMLElement;
  optionsOuter: HTMLDivElement;
  options: OptionElement[];
  parent: HTMLElement;
  selected: string[];
  selectionFilterName: string;

  constructor(parent: HTMLElement, label: string, options: string[], selectionFilterName: string) {
    this.parent = parent;
    this.options = [];
    this.selected = [DEFAULT_ALL];
    this.selectionFilterName = selectionFilterName;
    // create Dom Elements
    this.createDom(parent, label);
    this.createOptions(options);
  }

  createDom = (parent: HTMLElement, labelTxt: string) => {
    const outer = document.createElement('div');
    const label = document.createElement('label');
    const select = document.createElement('div');
    const toggle = document.createElement('div');
    const selectTxt = document.createElement('span');
    toggle.classList.add('w-icon-dropdown-toggle');
    toggle.classList.add('w-icon-dropdown-toggle-custom');

    outer.classList.add('multiSelectOuter');
    label.classList.add('multiSelectLabel');
    select.classList.add('multiSelectSelect');

    select.setAttribute('tabindex', '0');
    selectTxt.textContent = 'All';
    selectTxt.classList.add('multiSelectText');
    select.appendChild(selectTxt);
    select.appendChild(toggle);
    label.textContent = labelTxt;

    outer.appendChild(label);
    outer.appendChild(select);
    parent.appendChild(outer);
    this.outer = outer;
    this.label = label;
    this.selectTxt = selectTxt;
    this.select = select;
  }

  createOptions = (options: string[]) => {
    const optionsOuter = document.createElement('div');
    this.optionsOuter = optionsOuter;
    optionsOuter.classList.add('multiSelectOptionsOuter');
    this.createOption(DEFAULT_ALL, true);
    options.forEach(optName => this.createOption(optName))
    if (this.select)
      this.select.appendChild(optionsOuter);
  }

  createOption = (name: string, defaultSelected: boolean = false) => {
    const opt = document.createElement('button');
    opt.textContent = name;
    opt.classList.add('multiSelectOption');
    opt.setAttribute('value', name);

    const check = document.createElement('div');
    check.textContent = '¬';
    check.classList.add('multiSelectOptionCheck');
    if (!defaultSelected)
      check.style.display = 'none';
    opt.appendChild(check);
    opt.onclick = () => this.toggleOption(name);
    if (this.optionsOuter)
      this.optionsOuter.appendChild(opt);
    this.options.push({
      el: opt,
      name,
      check,
    });
  }

  toggleOption = (name: string) => {
    const opt = this.options.find(o => o.name === name);
    if (this.selected.includes(opt.name)) {
      if (name === DEFAULT_ALL) {
        if (this.selected.length <= 1) {
          // don't do anything because deselecting 'All' would mean 0 selections.
          return;
        }
      } else if (this.selected.length === 1) {
        const allOpt = this.options.find(x => x.name === DEFAULT_ALL);
        allOpt.check.style.display = 'block';
        this.selected.push(DEFAULT_ALL);
      }
      opt.check.style.display = 'none';
      if (this.selected.includes(name)) {
        this.selected = this.selected.filter(x => x !== name);
      }
    } else {
      if (name === DEFAULT_ALL) {
        this.unselectAll();
      } else if (this.selected.includes(DEFAULT_ALL)) {
        const allOpt = this.options.find(x => x.name === DEFAULT_ALL);
        allOpt.check.style.display = 'none';
        this.selected = this.selected.filter(x => x !== DEFAULT_ALL);
      }
      opt.check.style.display = 'block';
      if (!this.selected.includes(name)) {
        this.selected.push(name);
      }
    }
    this.displaySelected();
    glob.setFilterSelection({ [this.selectionFilterName]: this.selected });
  }

  displaySelected = () => {
    const text = this.selected.join(', ');
    if (text.length > 24) {
      this.selectTxt.textContent = `${this.selected.length} Selected`;
    } else
      this.selectTxt.textContent = text;
  }
  unselectAll = () => {
    this.options.forEach(o => {
      o.check.style.display = 'none';
    })
    this.selected = [];
  }
}
