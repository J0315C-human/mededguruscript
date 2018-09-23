export const customCss = `<style> 

#categoryNav {
  color: #FFF;
  background: #3ea4ce;
  border-radius: 4px;
  padding: 3px 5px;
  width: 100%;
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
  box-sizing: border-box;
  width: 100%;
  padding: 10px;
  position: relative;
  overflow: hidden;
  text-align: left;
}

.multiSelectText {
  width: 100%;
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
  width: calc(100% + 2px);
  border: 1px solid #979797;
  box-sizing: border-box;
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

.checkboxOuter {
  position: relative;
  margin-top: 22px;
  height: 30px;
  width: 200px;
}

.checkboxOuter:hover {
  cursor: pointer;
}

.checkboxLabel {
  position: absolute;
  top: 0;
  left: 20px;
  height: 23px;	color: #0E355B;	font-size: 18px; font-weight: 600;
  white-space: nowrap;
  padding-left: 10px;
  pointer-events: none;
}
.checkboxInput {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 17px;
  height: 17px;
  border: 1px solid #0E355B;
  background-color: '#FFF;
  pointer-events: none;
}
.checkboxCheck {
  position: absolute;
  right: -2px;
  top: -4px;
  font-size: 25px;
  transform: rotate(134deg);
  pointer-events: none;
  color: #Fff;
}

.loadingOuter {
  display: flex;
  height: 400px;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.loadingSpinner {
  height: 60px;
  width: 60px;
  border: 5px solid #0E355B;
  border-top-color: #FFF;
  border-radius: 100%;
  animation: rotation 0.6s infinite linear 0.25s;
  opacity: 0;
}

@keyframes rotation {
  from {
    opacity: 1;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(359deg);
  }
}

</style>`;