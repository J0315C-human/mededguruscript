export const customCss = `<style> 

#categoryNav {
  color: #FFF;
  background: #3ea4ce;
  border-radius: 4px;
  padding: 3px 5px;
  width: 240px;
  margin-bottom: -29px;
  position: relative;
  top: 38px;
}

#categoryNav:hover {
  cursor: pointer;
}

.inlineResourceHeader {
  margin-top: 80px;
  margin-bottom: 17px;
}

.hoverLink:hover {
  cursor:pointer;
} 

.resource-catalog-page-category-wrapper {
  position: relative;
}

.multiSelectLabel {
  font-size: 14px;	font-weight: 800;	line-height: 23px;
  padding-top: 17px;
}
.multiSelectSelect {
  height: 45px;	width: 227px;	border: 1px solid #979797;	background-color: #FFFFFF;
  border-radius: 0px;
  width: 240px;
  padding: 10px;
  position: relative;
  overflow: hidden;
  text-align: left;
}

.multiSelectText {
  width: 220px;
  white-space: nowrap;
  overflow: hidden;
}

.multiSelectSelect:focus, .multiSelectSelect:focus-within {
  overflow: visible;
  outline: none;
  z-index: 102;
}

.multiSelectSelect:hover {
  cursor: pointer;
}

.multiSelectOptionsOuter {
  position: absolute;
  top: 43px;
  left: -1px;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  width: 240px;
  border: 1px solid #979797;
}

.multiSelectOptionsOuter:focus, .multiSelectOption:focus {
  outline: none;
}

.multiSelectOption {
  position: relative;
  padding: 10px;
  height: 40px;
  width: 100%;
  text-align: left;
  background-color: #FFF;
}
.multiSelectOption:hover {
  background-color: #CCC;
}
.multiSelectOptionCheck {
  position: absolute;
  right: 3px;
  top: 9px;
  font-size: 39px;
  transform: rotate(134deg);
}
.w-icon-dropdown-toggle-custom {
  margin-right: 7px;
}

</style>`;