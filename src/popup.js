import fitTextarea from 'fit-textarea';
import OptionsSync from 'webext-options-sync';
import indentTextarea from 'indent-textarea';

fitTextarea.watch('textarea');
indentTextarea.watch('textarea');

// Set border color of popup to topcolor of navbar on HN
(async () => {
	const options = await new OptionsSync().getAll();
	document.body.style.borderColor = options.topcolor || '#ff6000';
})();

// Live changing of indentation width on comments
const indentWidthInput = document.querySelector('input[name="commentsIndentWidth"]');
indentWidthInput.addEventListener('input', () => {
	const queryTabs = browser.tabs.query({url: '*://news.ycombinator.com/item?id=*'});

	queryTabs.then(tabs => {
		for (const tab of tabs) {
			browser.tabs.sendMessage(tab.id, {
				indentWidth: indentWidthInput.value
			});
		}
	});
});

new OptionsSync({logging: false}).syncForm('#options-form');
