const collapseButton = document.querySelector('#btn-collapse-orders');
const collapseWrap = document.querySelector('#orderWrap')
const BREAK_POINT = 991;

function toggleCollapseView() {
  if (window.innerWidth > BREAK_POINT) {
    collapseButton.classList.add('hide');
    collapseWrap.classList.remove('collapse');
    return
  }

  collapseButton.classList.remove('hide');
    collapseWrap.classList.add('collapse');
}

window.addEventListener('resize', toggleCollapseView)
window.addEventListener('load', toggleCollapseView)