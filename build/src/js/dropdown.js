//
// dropdowns.js
// Dashkit module
//

const selectors = '.dropup, .dropright, .dropdown, .dropleft';
const dropdowns = document.querySelectorAll(selectors);

let target = undefined;

// Enable nested dropdowns
dropdowns.forEach(dropdown => {
  dropdown.addEventListener('mousedown', (e) => {
    const dataset = e.target.dataset;

    if (dataset.bsToggle && dataset.bsToggle === 'dropdown') {
      target = e.target;
    }
  });

  dropdown.addEventListener('hide.bs.dropdown', (e) => {
    const parent = target ? target.parentElement.closest(selectors) : undefined;

    if (parent && parent === dropdown && target !== e.target) {
      e.preventDefault();
    }

    target = undefined;
  });
});