import fs from 'fs';
const file = 'c:\\WEB DEV PROJECTS\\MY PROJECTS\\expenses tracker\\src\\ui.js';
let content = fs.readFileSync(file, 'utf-8');

// Match the full block including the added budget-projection
const regex = /<p id="budget-warning"[\s\S]*?<\/p>\s*<p id="budget-message"[\s\S]*?<\/p>\s*<p id="budget-projection"[\s\S]*?<\/p>/;
const replacement = '<div id="budget-insights-area" class="budget-insights-list" style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem;"></div>';

let log = '';
if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    log = 'Success';
} else {
    log = 'Failed to match';
}

fs.writeFileSync('fix_ui_log.txt', log);
console.log(log);
