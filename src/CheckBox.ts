import glob from './globals';

export interface OptionElement {
  el: HTMLButtonElement;
  name: string;
  check: HTMLDivElement;
}

export default class CheckBox {
  outer: HTMLDivElement;
  label: HTMLLabelElement;
  checkboxOuter: HTMLElement;
  check: HTMLElement;
  isChecked: boolean;
  parent: HTMLElement;
  selectionFilterName: string;

  constructor(parent: HTMLElement, label: string, selectionFilterName: string) {
    this.parent = parent;
    this.isChecked = false;
    this.selectionFilterName = selectionFilterName;
    // create Dom Elements
    this.createDom(parent, label);
  }

  createDom = (parent: HTMLElement, labelTxt: string) => {
    const outer = document.createElement('div');
    const chkOuter = document.createElement('div');
    const chkInner = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelTxt;
    label.classList.add('checkboxLabel');
    chkOuter.classList.add('checkboxInput');
    chkInner.classList.add('checkboxCheck');
    chkInner.textContent = '¬';
    chkInner.style.display = 'none';
    chkOuter.appendChild(chkInner);
    chkOuter.setAttribute('type', 'checkbox');
    outer.appendChild(chkOuter);
    outer.classList.add('checkboxOuter');
    outer.appendChild(label);
    parent.appendChild(outer);
    this.checkboxOuter = chkOuter;
    this.check = chkInner;
    outer.onclick = () => this.toggle();
  }

  toggle = () => {
    if (!this.isChecked) {
      this.checkboxOuter.style.backgroundColor = '#0E355B';
      this.check.style.display = 'block';
    } else {
      this.checkboxOuter.style.backgroundColor = '#FFF';
      this.check.style.display = 'none';
    }
    this.isChecked = !this.isChecked;
    glob.setFilterSelection({ [this.selectionFilterName]: this.isChecked ? ['checked'] : [] });
  }

}
