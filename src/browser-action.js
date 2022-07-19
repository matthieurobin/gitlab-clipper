/**
 * @param {Function} fn
 * @param {Function} callback results
 */
function executeScript (fn, callback) {
  chrome.tabs.executeScript({
    code : '(' + fn.toString() + ')();'
  }, res => {
    callback(res[0]);
  });
}

/**
 * @returns {Set}
 */
function getIssueLabels () {
  const labels = new Set();
  document.querySelectorAll('[data-testid="sidebar-labels"] [data-qa-label-name]').forEach(node => {
    labels.add(node.dataset.qaLabelName);
  });

  return labels;
}

/**
 * @returns {String}
 */
function getIssueTitle () {
  let title = null;
  const node = document.querySelector('[data-qa-selector="title_content"]') || document.querySelector('.qa-title');

  if (node) {
    title = node.innerText;
  }

  return title;
}

/**
 * @returns {String}
 */
function getIssueMilestone () {
  let milestone = null;
  const node = document.querySelector('[data-testid="select-milestone"]');

  if (node) {
    milestone = node.innerText;
  }

  return milestone;
}

/**
 * Format YYYY-MM-DD
 * @returns {String}
 */
function getCurrentDate () {
  return new Date().toJSON().slice(0,10);
}

/**
 * @param {{ title : {String}, url : {String}, labels : {Set}, milestone : {String} }} variables
 * @returns {String}
 */
function getTemplateWithFilledValues (variables) {
  return `
      Date : ${ getCurrentDate() }
      Projet :
      Milestone : ${ variables.milestone ? '[[' + variables.milestone + ']]' : '' }
      Source : ${ variables.url }
      Labels : ${ [...variables.labels].map(label => '[[' + label + ']]').join(' ') }
      #git

    ---

    # ${ variables.title }
  `;
}

executeScript(getIssueLabels, labels => {
  executeScript(getIssueTitle, title => {
    executeScript(() => document.URL, url => {
      executeScript(getIssueMilestone, milestone => {
        const filledTemplate = getTemplateWithFilledValues({
          title,
          url,
          milestone,
          labels
        });

        document.getElementById('main').innerText = filledTemplate;
      });
    });
  });
});
